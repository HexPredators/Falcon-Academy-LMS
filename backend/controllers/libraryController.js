const { query, execute } = require('../config/database');
const { uploadFile, deleteFile, getSignedURL } = require('../config/cloudinary');
const { USER_ROLES, BOOK_CATEGORIES, API_RESPONSE_CODES } = require('../config/constants');
const { getTranslation } = require('../config/language');

const uploadBook = async (req, res) => {
    try {
        const uploaderId = req.user.id;
        const { 
            title, 
            author, 
            description, 
            category, 
            subject, 
            grade, 
            language, 
            isbn, 
            publisher, 
            publish_year,
            page_count 
        } = req.body;

        if (!req.file) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Book file is required'
            });
        }

        if (category === BOOK_CATEGORIES.ACADEMIC && (!subject || !grade)) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Subject and grade are required for academic books'
            });
        }

        const uploadResult = await uploadFile(req.file.path, 'falcon_academy/books');
        if (!uploadResult.success) {
            return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
                success: false,
                message: 'Failed to upload book file'
            });
        }

        const result = await execute(
            `INSERT INTO books 
            (title, author, description, category, subject, grade, language, 
             isbn, publisher, publish_year, page_count, file_url, file_public_id, 
             file_size, file_format, uploaded_by, approved) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, author, description, category, subject, grade, language, 
             isbn, publisher, publish_year, page_count, uploadResult.url, 
             uploadResult.public_id, uploadResult.bytes, uploadResult.format, 
             uploaderId, req.user.role !== USER_ROLES.STUDENT]
        );

        const bookId = result.insertId;

        const [newBook] = await query(`
            SELECT b.*, u.full_name as uploaded_by_name
            FROM books b
            JOIN users u ON b.uploaded_by = u.id
            WHERE b.id = ?
        `, [bookId]);

        if (newBook.file_url) {
            newBook.file_url = getSignedURL(newBook.file_public_id);
        }

        return res.status(API_RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Book uploaded successfully',
            data: newBook
        });

    } catch (error) {
        console.error('Upload book error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to upload book'
        });
    }
};

const getBooks = async (req, res) => {
    try {
        const user = req.user;
        const { 
            category, 
            subject, 
            grade, 
            language, 
            search, 
            approved = true,
            page = 1, 
            limit = 20 
        } = req.query;
        const offset = (page - 1) * limit;

        let baseQuery = `
            SELECT b.*, 
                   u.full_name as uploaded_by_name,
                   u.profile_image as uploaded_by_image,
                   COUNT(DISTINCT rp.id) as read_count,
                   AVG(rp.progress_percentage) as avg_progress,
                   AVG(br.rating) as avg_rating,
                   COUNT(DISTINCT br.id) as review_count
            FROM books b
            JOIN users u ON b.uploaded_by = u.id
            LEFT JOIN reading_progress rp ON b.id = rp.book_id
            LEFT JOIN book_reviews br ON b.id = br.book_id
            WHERE 1=1
        `;
        const queryParams = [];

        if (category) {
            baseQuery += ' AND b.category = ?';
            queryParams.push(category);
        }

        if (subject) {
            baseQuery += ' AND b.subject = ?';
            queryParams.push(subject);
        }

        if (grade) {
            baseQuery += ' AND b.grade = ?';
            queryParams.push(grade);
        }

        if (language) {
            baseQuery += ' AND b.language = ?';
            queryParams.push(language);
        }

        if (search) {
            baseQuery += ' AND (b.title LIKE ? OR b.author LIKE ? OR b.description LIKE ?)';
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        if (approved !== 'all') {
            baseQuery += ' AND b.approved = ?';
            queryParams.push(approved === 'true');
        }

        if (user.role === USER_ROLES.STUDENT) {
            if (category === BOOK_CATEGORIES.ACADEMIC && grade && user.grade != grade) {
                return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                    success: false,
                    message: 'Access denied to other grade academic books'
                });
            }
            baseQuery += ' AND b.approved = 1';
        }

        baseQuery += ' GROUP BY b.id ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), offset);

        const books = await query(baseQuery, queryParams);

        books.forEach(book => {
            if (book.file_url) {
                book.file_url = getSignedURL(book.file_public_id);
            }
        });

        const countQuery = `
            SELECT COUNT(*) as total
            FROM books b
            WHERE 1=1
        `;
        const countParams = queryParams.slice(0, -2);

        const [{ total }] = await query(countQuery, countParams);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: books,
            pagination: {
                total: total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get books error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch books'
        });
    }
};

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const [book] = await query(`
            SELECT b.*, 
                   u.full_name as uploaded_by_name,
                   u.profile_image as uploaded_by_image
            FROM books b
            JOIN users u ON b.uploaded_by = u.id
            WHERE b.id = ?
        `, [id]);

        if (!book) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (!book.approved && user.role === USER_ROLES.STUDENT) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Book not approved yet'
            });
        }

        if (book.category === BOOK_CATEGORIES.ACADEMIC && book.grade && user.role === USER_ROLES.STUDENT && user.grade != book.grade) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Access denied to other grade academic books'
            });
        }

        if (book.file_url) {
            book.file_url = getSignedURL(book.file_public_id);
        }

        const [readingProgress] = await query(`
            SELECT rp.*, u.full_name as reader_name
            FROM reading_progress rp
            JOIN users u ON rp.user_id = u.id
            WHERE rp.book_id = ?
            ORDER BY rp.updated_at DESC
            LIMIT 10
        `, [id]);

        const [reviews] = await query(`
            SELECT br.*, u.full_name as reviewer_name, u.profile_image
            FROM book_reviews br
            JOIN users u ON br.user_id = u.id
            WHERE br.book_id = ?
            ORDER BY br.created_at DESC
        `, [id]);

        const [stats] = await query(`
            SELECT 
                COUNT(DISTINCT rp.user_id) as total_readers,
                AVG(rp.progress_percentage) as avg_progress,
                AVG(br.rating) as avg_rating,
                COUNT(DISTINCT br.id) as total_reviews
            FROM books b
            LEFT JOIN reading_progress rp ON b.id = rp.book_id
            LEFT JOIN book_reviews br ON b.id = br.book_id
            WHERE b.id = ?
        `, [id]);

        const userProgress = await query(
            'SELECT * FROM reading_progress WHERE book_id = ? AND user_id = ?',
            [id, user.id]
        );

        const userReview = await query(
            'SELECT * FROM book_reviews WHERE book_id = ? AND user_id = ?',
            [id, user.id]
        );

        book.reading_progress = readingProgress;
        book.reviews = reviews;
        book.stats = stats;
        book.user_progress = userProgress[0] || null;
        book.user_review = userReview[0] || null;

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: book
        });

    } catch (error) {
        console.error('Get book by ID error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch book details'
        });
    }
};

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const uploaderId = req.user.id;
        const updates = req.body;

        const [book] = await query('SELECT * FROM books WHERE id = ?', [id]);
        if (!book) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (book.uploaded_by !== uploaderId && req.user.role !== USER_ROLES.SUPER_ADMIN && req.user.role !== USER_ROLES.LIBRARIAN) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot update other users\' books'
            });
        }

        const allowedFields = [
            'title', 'author', 'description', 'category', 'subject', 
            'grade', 'language', 'isbn', 'publisher', 'publish_year', 
            'page_count', 'approved'
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
                `UPDATE books SET ${setClause}, updated_at = NOW() WHERE id = ?`,
                values
            );
        }

        if (req.file) {
            if (book.file_public_id) {
                await deleteFile(book.file_public_id);
            }

            const uploadResult = await uploadFile(req.file.path, 'falcon_academy/books');
            if (uploadResult.success) {
                await execute(
                    'UPDATE books SET file_url = ?, file_public_id = ?, file_size = ?, file_format = ? WHERE id = ?',
                    [uploadResult.url, uploadResult.public_id, uploadResult.bytes, uploadResult.format, id]
                );
            }
        }

        const [updatedBook] = await query(`
            SELECT b.*, u.full_name as uploaded_by_name
            FROM books b
            JOIN users u ON b.uploaded_by = u.id
            WHERE b.id = ?
        `, [id]);

        if (updatedBook.file_url) {
            updatedBook.file_url = getSignedURL(updatedBook.file_public_id);
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        });

    } catch (error) {
        console.error('Update book error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update book'
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const uploaderId = req.user.id;

        const [book] = await query('SELECT * FROM books WHERE id = ?', [id]);
        if (!book) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (book.uploaded_by !== uploaderId && req.user.role !== USER_ROLES.SUPER_ADMIN && req.user.role !== USER_ROLES.LIBRARIAN) {
            return res.status(API_RESPONSE_CODES.FORBIDDEN).json({
                success: false,
                message: 'Cannot delete other users\' books'
            });
        }

        if (book.file_public_id) {
            await deleteFile(book.file_public_id);
        }

        await execute('DELETE FROM books WHERE id = ?', [id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Book deleted successfully'
        });

    } catch (error) {
        console.error('Delete book error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to delete book'
        });
    }
};

const updateReadingProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { book_id } = req.params;
        const { progress_percentage, current_page, last_read_position } = req.body;

        const [book] = await query('SELECT * FROM books WHERE id = ?', [book_id]);
        if (!book) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Book not found'
            });
        }

        const [existingProgress] = await query(
            'SELECT * FROM reading_progress WHERE book_id = ? AND user_id = ?',
            [book_id, userId]
        );

        if (existingProgress) {
            await execute(
                `UPDATE reading_progress 
                SET progress_percentage = ?, current_page = ?, last_read_position = ?, 
                    updated_at = NOW(), time_spent = time_spent + TIMESTAMPDIFF(SECOND, last_updated, NOW())
                WHERE id = ?`,
                [progress_percentage, current_page, last_read_position, existingProgress.id]
            );
        } else {
            await execute(
                `INSERT INTO reading_progress 
                (book_id, user_id, progress_percentage, current_page, last_read_position) 
                VALUES (?, ?, ?, ?, ?)`,
                [book_id, userId, progress_percentage, current_page, last_read_position]
            );
        }

        const [updatedProgress] = await query(
            'SELECT * FROM reading_progress WHERE book_id = ? AND user_id = ?',
            [book_id, userId]
        );

        if (progress_percentage >= 100) {
            await execute(
                `INSERT INTO user_achievements (user_id, achievement_type, book_id) 
                VALUES (?, 'book_completed', ?) 
                ON DUPLICATE KEY UPDATE updated_at = NOW()`,
                [userId, book_id]
            );
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: 'Reading progress updated',
            data: updatedProgress
        });

    } catch (error) {
        console.error('Update reading progress error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to update reading progress'
        });
    }
};

const getReadingProgress = async (req, res) => {
    try {
        const userId = req.user.role === USER_ROLES.STUDENT ? req.user.id : req.params.user_id;
        const { book_id, category, completed } = req.query;

        let baseQuery = `
            SELECT rp.*, 
                   b.title, b.author, b.category, b.subject, b.grade,
                   b.cover_image, b.page_count
            FROM reading_progress rp
            JOIN books b ON rp.book_id = b.id
            WHERE rp.user_id = ?
        `;
        const queryParams = [userId];

        if (book_id) {
            baseQuery += ' AND rp.book_id = ?';
            queryParams.push(book_id);
        }

        if (category) {
            baseQuery += ' AND b.category = ?';
            queryParams.push(category);
        }

        if (completed === 'true') {
            baseQuery += ' AND rp.progress_percentage >= 100';
        } else if (completed === 'false') {
            baseQuery += ' AND rp.progress_percentage < 100';
        }

        baseQuery += ' ORDER BY rp.updated_at DESC';

        const progress = await query(baseQuery, queryParams);

        const [stats] = await query(`
            SELECT 
                COUNT(DISTINCT rp.book_id) as total_books,
                SUM(CASE WHEN rp.progress_percentage >= 100 THEN 1 ELSE 0 END) as completed_books,
                AVG(rp.progress_percentage) as avg_progress,
                SUM(rp.time_spent) as total_reading_time
            FROM reading_progress rp
            WHERE rp.user_id = ?
        `, [userId]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                reading_progress: progress,
                statistics: stats
            }
        });

    } catch (error) {
        console.error('Get reading progress error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch reading progress'
        });
    }
};

const addBookReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { book_id } = req.params;
        const { rating, review_text } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(API_RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const [book] = await query('SELECT * FROM books WHERE id = ?', [book_id]);
        if (!book) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Book not found'
            });
        }

        const [existingReview] = await query(
            'SELECT * FROM book_reviews WHERE book_id = ? AND user_id = ?',
            [book_id, userId]
        );

        if (existingReview) {
            await execute(
                'UPDATE book_reviews SET rating = ?, review_text = ?, updated_at = NOW() WHERE id = ?',
                [rating, review_text, existingReview.id]
            );
        } else {
            await execute(
                'INSERT INTO book_reviews (book_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)',
                [book_id, userId, rating, review_text]
            );
        }

        const [newReview] = await query(`
            SELECT br.*, u.full_name as reviewer_name, u.profile_image
            FROM book_reviews br
            JOIN users u ON br.user_id = u.id
            WHERE br.book_id = ? AND br.user_id = ?
        `, [book_id, userId]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            message: existingReview ? 'Review updated' : 'Review added',
            data: newReview
        });

    } catch (error) {
        console.error('Add book review error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to add review'
        });
    }
};

const getBookReviews = async (req, res) => {
    try {
        const { book_id } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const [book] = await query('SELECT * FROM books WHERE id = ?', [book_id]);
        if (!book) {
            return res.status(API_RESPONSE_CODES.NOT_FOUND).json({
                success: false,
                message: 'Book not found'
            });
        }

        const reviews = await query(`
            SELECT br.*, u.full_name as reviewer_name, u.profile_image
            FROM book_reviews br
            JOIN users u ON br.user_id = u.id
            WHERE br.book_id = ?
            ORDER BY br.created_at DESC
            LIMIT ? OFFSET ?
        `, [book_id, parseInt(limit), offset]);

        const [{ total }] = await query(
            'SELECT COUNT(*) as total FROM book_reviews WHERE book_id = ?',
            [book_id]
        );

        const [ratingStats] = await query(`
            SELECT 
                AVG(rating) as avg_rating,
                COUNT(*) as total_reviews,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
            FROM book_reviews
            WHERE book_id = ?
        `, [book_id]);

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: {
                reviews: reviews,
                rating_stats: ratingStats,
                pagination: {
                    total: total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get book reviews error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch book reviews'
        });
    }
};

const getRecommendedBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10 } = req.query;

        const [user] = await query('SELECT grade, section FROM students WHERE user_id = ?', [userId]);
        
        let recommendedBooks = [];

        if (user) {
            const [academicBooks] = await query(`
                SELECT b.*, AVG(br.rating) as avg_rating
                FROM books b
                LEFT JOIN book_reviews br ON b.id = br.book_id
                WHERE b.category = 'academic' 
                  AND b.grade = ? 
                  AND b.approved = 1
                GROUP BY b.id
                ORDER BY avg_rating DESC, b.created_at DESC
                LIMIT ?
            `, [user.grade, parseInt(limit)]);

            recommendedBooks = [...academicBooks];
        }

        const [popularBooks] = await query(`
            SELECT b.*, 
                   COUNT(DISTINCT rp.id) as read_count,
                   AVG(br.rating) as avg_rating
            FROM books b
            LEFT JOIN reading_progress rp ON b.id = rp.book_id
            LEFT JOIN book_reviews br ON b.id = br.book_id
            WHERE b.approved = 1
            GROUP BY b.id
            ORDER BY read_count DESC, avg_rating DESC
            LIMIT ?
        `, [parseInt(limit)]);

        recommendedBooks = [...recommendedBooks, ...popularBooks.filter(book => 
            !recommendedBooks.some(rec => rec.id === book.id)
        )].slice(0, parseInt(limit));

        recommendedBooks.forEach(book => {
            if (book.file_url) {
                book.file_url = getSignedURL(book.file_public_id);
            }
        });

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: recommendedBooks
        });

    } catch (error) {
        console.error('Get recommended books error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch recommended books'
        });
    }
};

const getLibraryStats = async (req, res) => {
    try {
        const user = req.user;

        const [totalStats] = await query(`
            SELECT 
                COUNT(*) as total_books,
                SUM(CASE WHEN category = 'academic' THEN 1 ELSE 0 END) as academic_books,
                SUM(CASE WHEN category = 'fiction' THEN 1 ELSE 0 END) as fiction_books,
                SUM(CASE WHEN category = 'reference' THEN 1 ELSE 0 END) as reference_books,
                SUM(CASE WHEN approved = 0 THEN 1 ELSE 0 END) as pending_approval
            FROM books
        `);

        const [languageStats] = await query(`
            SELECT 
                language,
                COUNT(*) as book_count
            FROM books
            WHERE approved = 1
            GROUP BY language
            ORDER BY book_count DESC
        `);

        const [gradeStats] = await query(`
            SELECT 
                grade,
                COUNT(*) as book_count
            FROM books
            WHERE category = 'academic' AND approved = 1
            GROUP BY grade
            ORDER BY grade
        `);

        const [readingStats] = await query(`
            SELECT 
                COUNT(DISTINCT rp.user_id) as active_readers,
                COUNT(DISTINCT rp.book_id) as books_being_read,
                AVG(rp.progress_percentage) as avg_progress,
                SUM(rp.time_spent) as total_reading_time
            FROM reading_progress rp
        `);

        const [recentUploads] = await query(`
            SELECT b.*, u.full_name as uploaded_by_name
            FROM books b
            JOIN users u ON b.uploaded_by = u.id
            WHERE b.approved = 1
            ORDER BY b.created_at DESC
            LIMIT 10
        `);

        recentUploads.forEach(book => {
            if (book.file_url) {
                book.file_url = getSignedURL(book.file_public_id);
            }
        });

        const stats = {
            total: totalStats,
            languages: languageStats,
            grades: gradeStats,
            reading: readingStats,
            recent_uploads: recentUploads
        };

        if (user.role === USER_ROLES.STUDENT) {
            const [studentStats] = await query(`
                SELECT 
                    COUNT(DISTINCT rp.book_id) as books_read,
                    AVG(rp.progress_percentage) as avg_progress,
                    SUM(rp.time_spent) as total_reading_time,
                    COUNT(DISTINCT br.book_id) as books_reviewed
                FROM reading_progress rp
                LEFT JOIN book_reviews br ON rp.user_id = br.user_id
                WHERE rp.user_id = ?
            `, [user.id]);

            stats.student = studentStats;
        }

        return res.status(API_RESPONSE_CODES.SUCCESS).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get library stats error:', error);
        return res.status(API_RESPONSE_CODES.SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch library statistics'
        });
    }
};

module.exports = {
    uploadBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    updateReadingProgress,
    getReadingProgress,
    addBookReview,
    getBookReviews,
    getRecommendedBooks,
    getLibraryStats
};