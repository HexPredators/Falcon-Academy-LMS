const { query, execute } = require('../config/database');
const emailService = require('../utils/emailService');
const { USER_ROLES, QUIZ_TYPES, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const createQuiz = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { 
            title, 
            description, 
            grade, 
            section, 
            subject, 
            duration_minutes, 
            start_time, 
            end_time,
            questions,
            passing_score,
            max_attempts,
            shuffle_questions,
            show_results
        } = req.body;

        const [teacher] = await query(
            'SELECT 1 FROM teacher_assignments WHERE teacher_id = ? AND grade = ? AND section = ?',
            [teacherId, grade, section]
        );

        if (!teacher && req.user.role !== USER_ROLES.SUPER_ADMIN) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'You are not assigned to teach this grade and section'
            });
        }

        const result = await execute(
            `INSERT INTO quizzes 
            (title, description, grade, section, subject, duration_minutes, 
             start_time, end_time, passing_score, max_attempts, shuffle_questions, 
             show_results, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, grade, section, subject, duration_minutes, 
             start_time, end_time, passing_score || 60, max_attempts || 1, 
             shuffle_questions || false, show_results || true, teacherId]
        );

        const quizId = result.insertId;

        if (questions && Array.isArray(questions)) {
            for (const question of questions) {
                await execute(
                    `INSERT INTO quiz_questions 
                    (quiz_id, question_type, question_text, options, correct_answer, 
                     points, explanation, order_index) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [quizId, question.question_type, question.question_text, 
                     JSON.stringify(question.options), question.correct_answer, 
                     question.points || 1, question.explanation, question.order_index || 0]
                );
            }
        }

        const [students] = await query(
            'SELECT s.user_id, u.full_name, u.email FROM students s JOIN users u ON s.user_id = u.id WHERE s.grade = ? AND s.section = ? AND u.is_active = 1',
            [grade, section]
        );

        for (const student of students) {
            await emailService.sendQuizNotification(
                student.email,
                student.full_name,
                title,
                subject,
                start_time,
                end_time,
                req.user.language || 'en'
            );
        }

        const [newQuiz] = await query(`
            SELECT q.*, u.full_name as teacher_name, t.teacher_id 
            FROM quizzes q 
            JOIN users u ON q.created_by = u.id 
            LEFT JOIN teachers t ON u.id = t.user_id 
            WHERE q.id = ?
        `, [quizId]);

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Quiz created successfully',
            data: newQuiz
        });

    } catch (error) {
        console.error('Create quiz error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to create quiz'
        });
    }
};

const getQuizzes = async (req, res) => {
    try {
        const user = req.user;
        const { grade, section, subject, status, created_by, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT q.*, 
                   u.full_name as teacher_name, 
                   t.teacher_id,
                   COUNT(DISTINCT qa.id) as attempt_count,
                   AVG(qa.score) as avg_score,
                   CASE 
                       WHEN q.end_time < NOW() THEN 'completed'
                       WHEN q.start_time <= NOW() AND q.end_time >= NOW() THEN 'active'
                       ELSE 'upcoming'
                   END as overall_status
            FROM quizzes q
            JOIN users u ON q.created_by = u.id
            LEFT JOIN teachers t ON u.id = t.user_id
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            WHERE 1=1
        `;
        const queryParams = [];

        if (grade) {
            baseQuery += ' AND q.grade = ?';
            queryParams.push(grade);
        }

        if (section) {
            baseQuery += ' AND q.section = ?';
            queryParams.push(section);
        }

        if (subject) {
            baseQuery += ' AND q.subject = ?';
            queryParams.push(subject);
        }

        if (created_by) {
            baseQuery += ' AND q.created_by = ?';
            queryParams.push(created_by);
        }

        if (status === 'upcoming') {
            baseQuery += ' AND q.start_time > NOW()';
        } else if (status === 'active') {
            baseQuery += ' AND q.start_time <= NOW() AND q.end_time >= NOW()';
        } else if (status === 'completed') {
            baseQuery += ' AND q.end_time < NOW()';
        }

        if (user.role === USER_ROLES.TEACHER) {
            baseQuery += ' AND q.created_by = ?';
            queryParams.push(user.id);
        } else if (user.role === USER_ROLES.STUDENT) {
            baseQuery += ' AND q.grade = ? AND q.section = ?';
            queryParams.push(user.grade, user.section);
        } else if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            baseQuery += ' AND q.grade BETWEEN ? AND ?';
            queryParams.push(gradeRange.min, gradeRange.max);
        }

        baseQuery += ' GROUP BY q.id ORDER BY q.start_time DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const quizzes = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM quizzes q
            WHERE 1=1
        `;
        const countParams = queryParams.slice(0, -2);

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: quizzes,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get quizzes error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch quizzes'
        });
    }
};

const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const [quiz] = await query(`
            SELECT q.*, 
                   u.full_name as teacher_name, 
                   t.teacher_id,
                   COUNT(DISTINCT qa.id) as attempt_count,
                   AVG(qa.score) as avg_score,
                   COUNT(DISTINCT CASE WHEN qa.score >= q.passing_score THEN qa.id END) as passed_count
            FROM quizzes q
            JOIN users u ON q.created_by = u.id
            LEFT JOIN teachers t ON u.id = t.user_id
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            WHERE q.id = ?
            GROUP BY q.id
        `, [id]);

        if (!quiz) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        if (user.role === USER_ROLES.STUDENT && (user.grade !== quiz.grade || user.section !== quiz.section)) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to this quiz'
            });
        }

        if (user.role === USER_ROLES.TEACHER && user.id !== quiz.created_by) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to other teachers\' quizzes'
            });
        }

        if ([USER_ROLES.DIRECTOR_KIDANE, USER_ROLES.DIRECTOR_ANDARGACHEW, USER_ROLES.DIRECTOR_ZERIHUN].includes(user.role)) {
            const gradeRange = DIRECTOR_GRADE_ACCESS[user.role];
            if (quiz.grade < gradeRange.min || quiz.grade > gradeRange.max) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to this quiz'
                });
            }
        }

        const [questions] = await query(`
            SELECT * FROM quiz_questions 
            WHERE quiz_id = ? 
            ORDER BY order_index
        `, [id]);

        questions.forEach(question => {
            if (question.options) {
                question.options = JSON.parse(question.options);
            }
        });

        quiz.questions = questions;

        if (user.role === USER_ROLES.TEACHER || user.role === USER_ROLES.SUPER_ADMIN) {
            const [attempts] = await query(`
                SELECT qa.*, 
                       u.full_name as student_name, 
                       s.fav_id,
                       s.grade,
                       s.section
                FROM quiz_attempts qa
                JOIN users u ON qa.student_id = u.id
                JOIN students s ON u.id = s.user_id
                WHERE qa.quiz_id = ?
                ORDER BY qa.submitted_at DESC
            `, [id]);

            quiz.attempts = attempts;
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: quiz
        });

    } catch (error) {
        console.error('Get quiz by ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch quiz details'
        });
    }
};

const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;
        const updates = req.body;

        const [quiz] = await query('SELECT * FROM quizzes WHERE id = ?', [id]);
        if (!quiz) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        if (req.user.role === USER_ROLES.TEACHER && quiz.created_by !== teacherId) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot update other teachers\' quizzes'
            });
        }

        const allowedFields = [
            'title', 'description', 'subject', 'duration_minutes', 
            'start_time', 'end_time', 'passing_score', 'max_attempts', 
            'shuffle_questions', 'show_results'
        ];
        const filteredUpdates = {};

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        });

        if (Object.keys(filteredUpdates).length > 0) {
            const setClause = Object.keys(filteredUpdates).map(field => `${field} = ?`).join(', ');
            const values = Object.values(filteredUpdates);
            values.push(id);

            await execute(
                `UPDATE quizzes SET ${setClause}, updated_at = NOW() WHERE id = ?`,
                values
            );
        }

        if (updates.questions && Array.isArray(updates.questions)) {
            await execute('DELETE FROM quiz_questions WHERE quiz_id = ?', [id]);
            
            for (const question of updates.questions) {
                await execute(
                    `INSERT INTO quiz_questions 
                    (quiz_id, question_type, question_text, options, correct_answer, 
                     points, explanation, order_index) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id, question.question_type, question.question_text, 
                     JSON.stringify(question.options), question.correct_answer, 
                     question.points || 1, question.explanation, question.order_index || 0]
                );
            }
        }

        const [updatedQuiz] = await query(`
            SELECT q.*, u.full_name as teacher_name, t.teacher_id 
            FROM quizzes q 
            JOIN users u ON q.created_by = u.id 
            LEFT JOIN teachers t ON u.id = t.user_id 
            WHERE q.id = ?
        `, [id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Quiz updated successfully',
            data: updatedQuiz
        });

    } catch (error) {
        console.error('Update quiz error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update quiz'
        });
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;

        const [quiz] = await query('SELECT * FROM quizzes WHERE id = ?', [id]);
        if (!quiz) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        if (req.user.role === USER_ROLES.TEACHER && quiz.created_by !== teacherId) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot delete other teachers\' quizzes'
            });
        }

        await execute('DELETE FROM quizzes WHERE id = ?', [id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Quiz deleted successfully'
        });

    } catch (error) {
        console.error('Delete quiz error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete quiz'
        });
    }
};

const startQuizAttempt = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { quiz_id } = req.params;

        const [quiz] = await query('SELECT * FROM quizzes WHERE id = ?', [quiz_id]);
        if (!quiz) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        const [student] = await query('SELECT grade, section FROM students WHERE user_id = ?', [studentId]);
        if (!student || student.grade !== quiz.grade || student.section !== quiz.section) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'You are not enrolled in this quiz\'s class'
            });
        }

        const now = new Date();
        const startTime = new Date(quiz.start_time);
        const endTime = new Date(quiz.end_time);

        if (now < startTime) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Quiz has not started yet'
            });
        }

        if (now > endTime) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Quiz has ended'
            });
        }

        const [existingAttempts] = await query(
            'SELECT COUNT(*) as attempt_count FROM quiz_attempts WHERE quiz_id = ? AND student_id = ?',
            [quiz_id, studentId]
        );

        if (existingAttempts.attempt_count >= quiz.max_attempts) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Maximum attempts reached for this quiz'
            });
        }

        const [activeAttempt] = await query(
            'SELECT * FROM quiz_attempts WHERE quiz_id = ? AND student_id = ? AND status = "in_progress"',
            [quiz_id, studentId]
        );

        if (activeAttempt) {
            const [questions] = await query(`
                SELECT qq.*, 
                       COALESCE(qa.selected_answer, '') as selected_answer,
                       qa.is_correct
                FROM quiz_questions qq
                LEFT JOIN quiz_answers qa ON qq.id = qa.question_id AND qa.attempt_id = ?
                WHERE qq.quiz_id = ?
                ORDER BY qq.order_index
            `, [activeAttempt.id, quiz_id]);

            questions.forEach(question => {
                if (question.options) {
                    question.options = JSON.parse(question.options);
                }
            });

            return res.status(API_RESPONSE_CODES.SUCCESS).json({
                success: true,
                message: 'Resuming existing quiz attempt',
                data: {
                    attempt: activeAttempt,
                    questions: questions,
                    quiz: quiz
                }
            });
        }

        const result = await execute(
            `INSERT INTO quiz_attempts 
            (quiz_id, student_id, started_at, status) 
            VALUES (?, ?, NOW(), ?)`,
            [quiz_id, studentId, 'in_progress']
        );

        const attemptId = result.insertId;

        let questions;
        if (quiz.shuffle_questions) {
            questions = await query(`
                SELECT * FROM quiz_questions 
                WHERE quiz_id = ? 
                ORDER BY RAND()
            `, [quiz_id]);
        } else {
            questions = await query(`
                SELECT * FROM quiz_questions 
                WHERE quiz_id = ? 
                ORDER BY order_index
            `, [quiz_id]);
        }

        questions.forEach(question => {
            if (question.options) {
                question.options = JSON.parse(question.options);
                
                if (quiz.shuffle_questions && question.question_type === QUIZ_TYPES.MULTIPLE_CHOICE) {
                    question.options = shuffleArray(question.options);
                }
            }
        });

        const [attempt] = await query('SELECT * FROM quiz_attempts WHERE id = ?', [attemptId]);

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Quiz attempt started',
            data: {
                attempt: attempt,
                questions: questions,
                quiz: quiz
            }
        });

    } catch (error) {
        console.error('Start quiz attempt error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to start quiz attempt'
        });
    }
};

const submitQuizAnswer = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { attempt_id } = req.params;
        const { question_id, selected_answer } = req.body;

        const [attempt] = await query('SELECT * FROM quiz_attempts WHERE id = ? AND student_id = ?', [attempt_id, studentId]);
        if (!attempt) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Quiz attempt not found'
            });
        }

        if (attempt.status !== 'in_progress') {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Quiz attempt is not in progress'
            });
        }

        const [quiz] = await query('SELECT * FROM quizzes WHERE id = ?', [attempt.quiz_id]);
        if (!quiz) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        const [question] = await query('SELECT * FROM quiz_questions WHERE id = ?', [question_id]);
        if (!question) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Question not found'
            });
        }

        let isCorrect = false;
        let pointsEarned = 0;

        switch (question.question_type) {
            case QUIZ_TYPES.MULTIPLE_CHOICE:
            case QUIZ_TYPES.TRUE_FALSE:
                isCorrect = selected_answer === question.correct_answer;
                break;
            case QUIZ_TYPES.SHORT_ANSWER:
            case QUIZ_TYPES.ESSAY:
                isCorrect = selected_answer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
                break;
        }

        if (isCorrect) {
            pointsEarned = question.points;
        }

        const [existingAnswer] = await query(
            'SELECT * FROM quiz_answers WHERE attempt_id = ? AND question_id = ?',
            [attempt_id, question_id]
        );

        if (existingAnswer) {
            await execute(
                'UPDATE quiz_answers SET selected_answer = ?, is_correct = ?, points_earned = ? WHERE id = ?',
                [selected_answer, isCorrect, pointsEarned, existingAnswer.id]
            );
        } else {
            await execute(
                `INSERT INTO quiz_answers 
                (attempt_id, question_id, selected_answer, is_correct, points_earned) 
                VALUES (?, ?, ?, ?, ?)`,
                [attempt_id, question_id, selected_answer, isCorrect, pointsEarned]
            );
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Answer submitted successfully',
            data: {
                question_id: question_id,
                is_correct: isCorrect,
                points_earned: pointsEarned,
                correct_answer: quiz.show_results ? question.correct_answer : null
            }
        });

    } catch (error) {
        console.error('Submit quiz answer error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to submit answer'
        });
    }
};

const submitQuizAttempt = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { attempt_id } = req.params;

        const [attempt] = await query('SELECT * FROM quiz_attempts WHERE id = ? AND student_id = ?', [attempt_id, studentId]);
        if (!attempt) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Quiz attempt not found'
            });
        }

        if (attempt.status !== 'in_progress') {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Quiz attempt is already submitted'
            });
        }

        const [quiz] = await query('SELECT * FROM quizzes WHERE id = ?', [attempt.quiz_id]);
        const now = new Date();
        const endTime = new Date(quiz.end_time);

        if (now > endTime) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Quiz time has expired'
            });
        }

        const [answers] = await query(`
            SELECT qa.*, qq.points
            FROM quiz_answers qa
            JOIN quiz_questions qq ON qa.question_id = qq.id
            WHERE qa.attempt_id = ?
        `, [attempt_id]);

        const totalQuestions = await query('SELECT COUNT(*) as count FROM quiz_questions WHERE quiz_id = ?', [quiz.id]);
        const totalPoints = await query('SELECT SUM(points) as total FROM quiz_questions WHERE quiz_id = ?', [quiz.id]);

        const correctAnswers = answers.filter(answer => answer.is_correct);
        const score = answers.reduce((sum, answer) => sum + (answer.points_earned || 0), 0);
        const percentage = (score / totalPoints.total * 100).toFixed(2);
        const passed = percentage >= quiz.passing_score;

        await execute(
            `UPDATE quiz_attempts 
            SET submitted_at = NOW(), 
                score = ?, 
                percentage = ?, 
                correct_answers = ?, 
                total_questions = ?, 
                status = ?, 
                passed = ? 
            WHERE id = ?`,
            [score, percentage, correctAnswers.length, totalQuestions.count, 'submitted', passed, attempt_id]
        );

        await execute(
            `INSERT INTO grades (student_id, quiz_id, subject, score, max_score, semester, teacher_id)
             VALUES (?, ?, ?, ?, ?, 'first_semester', ?)
             ON DUPLICATE KEY UPDATE score = ?, max_score = ?, updated_at = NOW()`,
            [studentId, quiz.id, quiz.subject, score, totalPoints.total, quiz.created_by, score, totalPoints.total]
        );

        const [student] = await query('SELECT u.email, u.full_name FROM users u WHERE u.id = ?', [studentId]);
        const [parents] = await query(`
            SELECT u.email, u.full_name 
            FROM parent_child_links pcl
            JOIN parents p ON pcl.parent_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE pcl.student_id = ? AND pcl.status = 'approved'
        `, [studentId]);

        await emailService.sendQuizResult(
            student.email,
            student.full_name,
            quiz.title,
            score,
            totalPoints.total,
            percentage,
            passed,
            req.user.language || 'en'
        );

        for (const parent of parents) {
            await emailService.sendParentQuizResult(
                parent.email,
                parent.full_name,
                student.full_name,
                quiz.title,
                score,
                totalPoints.total,
                percentage,
                passed,
                req.user.language || 'en'
            );
        }

        const [submittedAttempt] = await query(`
            SELECT qa.*, q.title as quiz_title, q.subject
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.id
            WHERE qa.id = ?
        `, [attempt_id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Quiz submitted successfully',
            data: submittedAttempt
        });

    } catch (error) {
        console.error('Submit quiz attempt error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to submit quiz'
        });
    }
};

const getQuizResults = async (req, res) => {
    try {
        const { quiz_id } = req.params;
        const user = req.user;

        const [quiz] = await query('SELECT * FROM quizzes WHERE id = ?', [quiz_id]);
        if (!quiz) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        if (user.role === USER_ROLES.TEACHER && quiz.created_by !== user.id) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to other teachers\' quiz results'
            });
        }

        if (user.role === USER_ROLES.STUDENT && (user.grade !== quiz.grade || user.section !== quiz.section)) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to other classes\' quiz results'
            });
        }

        const [results] = await query(`
            SELECT qa.*, 
                   u.full_name as student_name, 
                   s.fav_id,
                   s.grade,
                   s.section,
                   RANK() OVER (ORDER BY qa.percentage DESC) as rank
            FROM quiz_attempts qa
            JOIN users u ON qa.student_id = u.id
            JOIN students s ON u.id = s.user_id
            WHERE qa.quiz_id = ? AND qa.status = 'submitted'
            ORDER BY qa.percentage DESC, qa.submitted_at ASC
        `, [quiz_id]);

        const [statistics] = await query(`
            SELECT 
                COUNT(*) as total_attempts,
                AVG(percentage) as avg_percentage,
                MAX(percentage) as highest_percentage,
                MIN(percentage) as lowest_percentage,
                STDDEV(percentage) as stddev_percentage,
                SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as passed_count,
                SUM(CASE WHEN passed = 0 THEN 1 ELSE 0 END) as failed_count
            FROM quiz_attempts
            WHERE quiz_id = ? AND status = 'submitted'
        `, [quiz_id]);

        const [questionStats] = await query(`
            SELECT 
                qq.id as question_id,
                qq.question_text,
                qq.question_type,
                COUNT(qa.id) as total_answers,
                SUM(CASE WHEN qa.is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
                (SUM(CASE WHEN qa.is_correct = 1 THEN 1 ELSE 0 END) / COUNT(qa.id) * 100) as correctness_rate
            FROM quiz_questions qq
            LEFT JOIN quiz_answers qa ON qq.id = qa.question_id
            LEFT JOIN quiz_attempts qatt ON qa.attempt_id = qatt.id
            WHERE qq.quiz_id = ? AND qatt.status = 'submitted'
            GROUP BY qq.id, qq.question_text, qq.question_type
            ORDER BY qq.order_index
        `, [quiz_id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                quiz_info: quiz,
                results: results,
                statistics: statistics,
                question_statistics: questionStats
            }
        });

    } catch (error) {
        console.error('Get quiz results error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch quiz results'
        });
    }
};

const getStudentQuizResults = async (req, res) => {
    try {
        const studentId = req.user.role === USER_ROLES.STUDENT ? req.user.id : req.params.student_id;
        const { quiz_id } = req.params;

        const [quiz] = await query('SELECT * FROM quizzes WHERE id = ?', [quiz_id]);
        if (!quiz) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        const [attempts] = await query(`
            SELECT qa.*, q.title, q.subject
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.id
            WHERE qa.quiz_id = ? AND qa.student_id = ?
            ORDER BY qa.started_at DESC
        `, [quiz_id, studentId]);

        if (attempts.length === 0) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'No quiz attempts found'
            });
        }

        const latestAttempt = attempts[0];

        if (!quiz.show_results && req.user.role === USER_ROLES.STUDENT) {
            latestAttempt.correct_answers = null;
            latestAttempt.total_questions = null;
        }

        let detailedResults = null;
        if (quiz.show_results || req.user.role !== USER_ROLES.STUDENT) {
            const [answers] = await query(`
                SELECT qa.*, 
                       qq.question_text, 
                       qq.question_type,
                       qq.correct_answer,
                       qq.explanation,
                       qq.points
                FROM quiz_answers qa
                JOIN quiz_questions qq ON qa.question_id = qq.id
                WHERE qa.attempt_id = ?
                ORDER BY qq.order_index
            `, [latestAttempt.id]);

            detailedResults = answers;
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                quiz_info: quiz,
                attempts: attempts,
                latest_attempt: latestAttempt,
                detailed_results: detailedResults
            }
        });

    } catch (error) {
        console.error('Get student quiz results error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch student quiz results'
        });
    }
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

module.exports = {
    createQuiz,
    getQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    startQuizAttempt,
    submitQuizAnswer,
    submitQuizAttempt,
    getQuizResults,
    getStudentQuizResults
};