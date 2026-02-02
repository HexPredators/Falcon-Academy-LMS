const OpenAI = require('openai');
const { query, execute } = require('../config/database');
const { USER_ROLES, AI_MODULES, ETHIOPIAN_SUBJECTS, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getAIResponse = async (req, res) => {
    try {
        const userId = req.user.id;
        const { module, query: userQuery, context, language = 'en' } = req.body;

        if (!userQuery) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Query is required'
            });
        }

        let systemPrompt = '';
        let userContext = '';

        switch (module) {
            case AI_MODULES.HOW_WE_WORK:
                systemPrompt = `You are Falcon Academy AI Assistant. Explain how the Falcon Academy DLMS platform works.
                Focus on: user registration, assignment submission, quiz taking, parent linking, digital library, and communication features.
                Keep explanations clear and concise.`;
                break;

            case AI_MODULES.LESSON_PLANNER:
                const { subject, grade, duration, topic, learning_objectives } = context || {};
                systemPrompt = `You are an expert Ethiopian curriculum teacher. Create a detailed lesson plan.
                Subject: ${subject || 'General'}
                Grade: ${grade || '9-12'}
                Duration: ${duration || '40 minutes'}
                Topic: ${topic || 'General Topic'}
                Learning Objectives: ${learning_objectives || 'Understand the topic'}
                
                Include: Introduction, Main Activity, Assessment, and Homework.
                Align with Ethiopian educational standards.`;
                break;

            case AI_MODULES.STUDY_PLANNER:
                const [student] = await query(
                    'SELECT s.grade, s.section, s.stream FROM students s WHERE s.user_id = ?',
                    [userId]
                );

                const [upcomingAssignments] = await query(`
                    SELECT a.* 
                    FROM assignments a
                    JOIN students s ON a.grade = s.grade AND a.section = s.section
                    WHERE s.user_id = ? AND a.due_date > NOW()
                    ORDER BY a.due_date ASC
                    LIMIT 10
                `, [userId]);

                const [upcomingQuizzes] = await query(`
                    SELECT q.* 
                    FROM quizzes q
                    JOIN students s ON q.grade = s.grade AND q.section = s.section
                    WHERE s.user_id = ? AND q.end_time > NOW()
                    ORDER BY q.start_time ASC
                    LIMIT 10
                `, [userId]);

                userContext = `Student Grade: ${student?.grade || 'N/A'}, Section: ${student?.section || 'N/A'}
                Upcoming Assignments: ${JSON.stringify(upcomingAssignments)}
                Upcoming Quizzes: ${JSON.stringify(upcomingQuizzes)}
                User Query: ${userQuery}`;

                systemPrompt = `You are a study planner assistant for Falcon Academy students.
                Create personalized study plans based on upcoming assignments and quizzes.
                Consider time management, subject priority, and effective study techniques.
                Provide specific recommendations for each subject.`;
                break;

            case AI_MODULES.LEARNING_SUPPORT:
                const { learning_subject, concept } = context || {};
                systemPrompt = `You are a learning support assistant for Ethiopian students.
                Subject: ${learning_subject || 'General'}
                Concept: ${concept || 'General Concept'}
                
                Explain concepts in multiple ways with examples.
                Provide practice questions and solutions.
                Suggest additional resources and study tips.`;
                break;

            default:
                systemPrompt = `You are Falcon Academy AI Assistant. Help users with their questions about the platform, 
                Ethiopian curriculum, assignments, quizzes, and general academic support.`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userContext || userQuery
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });

        const aiResponse = completion.choices[0].message.content;

        await execute(
            'INSERT INTO ai_interactions (user_id, module, user_query, ai_response) VALUES (?, ?, ?, ?)',
            [userId, module, userQuery, aiResponse]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                response: aiResponse,
                module: module,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Get AI response error:', error);
        
        if (error.code === 'insufficient_quota') {
            return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
                success: false,
                message: 'AI service quota exceeded. Please contact administrator.'
            });
        }

        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to get AI response. Please try again.'
        });
    }
};

const generateLessonPlan = async (req, res) => {
    try {
        const { subject, grade, topic, duration_minutes, learning_objectives, teaching_methods } = req.body;

        if (!subject || !grade || !topic) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Subject, grade, and topic are required'
            });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Ethiopian curriculum lesson planner. Create detailed lesson plans aligned with Ethiopian educational standards.
                    Format: Title, Learning Objectives, Materials, Introduction, Main Activities, Assessment, Homework, and Teacher Notes.`
                },
                {
                    role: "user",
                    content: `Create a lesson plan for:
                    Subject: ${subject}
                    Grade: ${grade}
                    Topic: ${topic}
                    Duration: ${duration_minutes || 40} minutes
                    Learning Objectives: ${learning_objectives || 'Understand the topic'}
                    Teaching Methods: ${teaching_methods || 'Interactive lecture and group work'}`
                }
            ],
            max_tokens: 1500,
            temperature: 0.7
        });

        const lessonPlan = completion.choices[0].message.content;

        const result = await execute(
            `INSERT INTO lesson_plans 
            (subject, grade, topic, duration_minutes, learning_objectives, 
             teaching_methods, content, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [subject, grade, topic, duration_minutes, learning_objectives, 
             teaching_methods, lessonPlan, req.user.id]
        );

        const planId = result.insertId;

        const [newPlan] = await query(
            'SELECT * FROM lesson_plans WHERE id = ?',
            [planId]
        );

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Lesson plan generated successfully',
            data: newPlan
        });

    } catch (error) {
        console.error('Generate lesson plan error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to generate lesson plan'
        });
    }
};

const generateStudyPlan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { days_ahead = 7, focus_subjects, study_hours_per_day } = req.body;

        const [student] = await query(
            'SELECT s.grade, s.section, s.stream FROM students s WHERE s.user_id = ?',
            [userId]
        );

        if (!student) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Student information not found'
            });
        }

        const [assignments] = await query(`
            SELECT a.* 
            FROM assignments a
            JOIN students s ON a.grade = s.grade AND a.section = s.section
            WHERE s.user_id = ? AND a.due_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? DAY)
            ORDER BY a.due_date ASC
        `, [userId, days_ahead]);

        const [quizzes] = await query(`
            SELECT q.* 
            FROM quizzes q
            JOIN students s ON q.grade = s.grade AND q.section = s.section
            WHERE s.user_id = ? AND q.end_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL ? DAY)
            ORDER BY q.start_time ASC
        `, [userId, days_ahead]);

        const subjects = student.grade === 11 || student.grade === 12 ? 
            ETHIOPIAN_SUBJECTS[student.grade][student.stream] : 
            ETHIOPIAN_SUBJECTS[student.grade];

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are an expert study planner for Ethiopian high school students.
                    Create personalized weekly study plans considering assignments, quizzes, and subject priorities.
                    Include: Daily schedule, subject focus, break times, and revision strategies.`
                },
                {
                    role: "user",
                    content: `Create a ${days_ahead}-day study plan for:
                    Grade: ${student.grade}
                    Stream: ${student.stream || 'N/A'}
                    Subjects: ${subjects.join(', ')}
                    Focus Subjects: ${focus_subjects || 'All'}
                    Study Hours Per Day: ${study_hours_per_day || 3}
                    
                    Upcoming Assignments: ${JSON.stringify(assignments.map(a => ({title: a.title, subject: a.subject, due_date: a.due_date})))}
                    Upcoming Quizzes: ${JSON.stringify(quizzes.map(q => ({title: q.title, subject: q.subject, date: q.start_time})))}`
                }
            ],
            max_tokens: 2000,
            temperature: 0.7
        });

        const studyPlan = completion.choices[0].message.content;

        const result = await execute(
            `INSERT INTO study_plans 
            (student_id, days_ahead, focus_subjects, study_hours_per_day, content) 
            VALUES (?, ?, ?, ?, ?)`,
            [userId, days_ahead, focus_subjects, study_hours_per_day, studyPlan]
        );

        const planId = result.insertId;

        const [newPlan] = await query(
            'SELECT * FROM study_plans WHERE id = ?',
            [planId]
        );

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Study plan generated successfully',
            data: newPlan
        });

    } catch (error) {
        console.error('Generate study plan error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to generate study plan'
        });
    }
};

const explainConcept = async (req, res) => {
    try {
        const { subject, concept, grade, explanation_type = 'simple' } = req.body;

        if (!subject || !concept) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Subject and concept are required'
            });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Ethiopian curriculum teacher. Explain concepts clearly for Ethiopian students.
                    Use appropriate examples, analogies, and Ethiopian context when possible.
                    Provide step-by-step explanations and practice questions.`
                },
                {
                    role: "user",
                    content: `Explain this concept for Ethiopian students:
                    Subject: ${subject}
                    Concept: ${concept}
                    Grade Level: ${grade || '9-12'}
                    Explanation Type: ${explanation_type}
                    
                    Include: Definition, Examples, Step-by-step explanation, Common mistakes, and Practice questions.`
                }
            ],
            max_tokens: 1500,
            temperature: 0.7
        });

        const explanation = completion.choices[0].message.content;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                explanation: explanation,
                subject: subject,
                concept: concept,
                grade: grade,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Explain concept error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to generate explanation'
        });
    }
};

const generatePracticeQuestions = async (req, res) => {
    try {
        const { subject, topic, grade, question_count = 5, question_type = 'mixed' } = req.body;

        if (!subject || !topic) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Subject and topic are required'
            });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Ethiopian curriculum exam question generator.
                    Create practice questions aligned with Ethiopian educational standards.
                    Include multiple choice, short answer, and problem-solving questions.
                    Provide answers and explanations for each question.`
                },
                {
                    role: "user",
                    content: `Generate ${question_count} practice questions for:
                    Subject: ${subject}
                    Topic: ${topic}
                    Grade: ${grade || '9-12'}
                    Question Type: ${question_type}
                    
                    Format each question with: Question, Options (if multiple choice), Correct Answer, Explanation.
                    Make questions challenging but appropriate for the grade level.`
                }
            ],
            max_tokens: 2000,
            temperature: 0.7
        });

        const questions = completion.choices[0].message.content;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                questions: questions,
                subject: subject,
                topic: topic,
                grade: grade,
                question_count: question_count,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Generate practice questions error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to generate practice questions'
        });
    }
};

const getAIHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { module, start_date, end_date, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT * FROM ai_interactions 
            WHERE user_id = ?
        `;
        const queryParams = [userId];

        if (module) {
            baseQuery += ' AND module = ?';
            queryParams.push(module);
        }

        if (start_date) {
            baseQuery += ' AND DATE(created_at) >= ?';
            queryParams.push(start_date);
        }

        if (end_date) {
            baseQuery += ' AND DATE(created_at) <= ?';
            queryParams.push(end_date);
        }

        baseQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const history = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM ai_interactions
            WHERE user_id = ?
        `;
        const countParams = [userId];

        if (module) {
            countQuery += ' AND module = ?';
            countParams.push(module);
        }

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: history,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get AI history error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch AI history'
        });
    }
};

const getLessonPlans = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subject, grade, created_by, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT lp.*, u.full_name as creator_name
            FROM lesson_plans lp
            JOIN users u ON lp.created_by = u.id
            WHERE 1=1
        `;
        const queryParams = [];

        if (subject) {
            baseQuery += ' AND lp.subject = ?';
            queryParams.push(subject);
        }

        if (grade) {
            baseQuery += ' AND lp.grade = ?';
            queryParams.push(grade);
        }

        if (created_by) {
            baseQuery += ' AND lp.created_by = ?';
            queryParams.push(created_by);
        }

        if (req.user.role === USER_ROLES.TEACHER) {
            baseQuery += ' AND (lp.created_by = ? OR lp.is_public = 1)';
            queryParams.push(userId);
        }

        baseQuery += ' ORDER BY lp.created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const lessonPlans = await query(baseQuery, queryParams);

        const countQuery = `
            SELECT COUNT(*) as total
            FROM lesson_plans lp
            WHERE 1=1
        `;
        const countParams = queryParams.slice(0, -2);

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: lessonPlans,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get lesson plans error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch lesson plans'
        });
    }
};

const getStudyPlans = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const studyPlans = await query(`
            SELECT sp.*, u.full_name as student_name
            FROM study_plans sp
            JOIN users u ON sp.student_id = u.id
            WHERE sp.student_id = ?
            ORDER BY sp.created_at DESC
            LIMIT ? OFFSET ?
        `, [userId, parseInt(limit), offset]);

        const [{ total }] = await query(
            'SELECT COUNT(*) as total FROM study_plans WHERE student_id = ?',
            [userId]
        );

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: studyPlans,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get study plans error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch study plans'
        });
    }
};

module.exports = {
    getAIResponse,
    generateLessonPlan,
    generateStudyPlan,
    explainConcept,
    generatePracticeQuestions,
    getAIHistory,
    getLessonPlans,
    getStudyPlans
};