SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fav_id VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('super_admin', 'director_all', 'director_11_12', 'director_9_10', 
              'school_admin', 'teacher', 'student', 'parent', 'librarian') NOT NULL,
    grade_access JSON,
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_image VARCHAR(500),
    
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_token VARCHAR(64),
    email_token_expires DATETIME,
    otp_code VARCHAR(6),
    otp_expires_at DATETIME,

    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(64),
    two_factor_backup_codes JSON,
    two_factor_method ENUM('app', 'sms'),
 
    failed_login_attempts INT DEFAULT 0,
    last_login_at DATETIME,
    last_login_ip VARCHAR(45),
    account_locked_until DATETIME,
 
    current_session_id VARCHAR(64),
    last_password_change DATETIME,
    security_level ENUM('basic', 'standard', 'high') DEFAULT 'standard',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_fav_id (fav_id),
    INDEX idx_role (role),
    INDEX idx_verified (is_verified),
    INDEX idx_active (is_active)
);

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    grade INT NOT NULL CHECK (grade BETWEEN 9 AND 12),
    section ENUM('A','B','C','D','E','F','G') NOT NULL,
    stream ENUM('Natural Science', 'Social Science'),
    admission_number VARCHAR(50) UNIQUE,
    admission_date DATE DEFAULT CURRENT_DATE,
    date_of_birth DATE,
    guardian_name VARCHAR(200),
    guardian_phone VARCHAR(20),
    address TEXT,
    emergency_contact JSON,
    academic_status ENUM('active', 'inactive', 'suspended', 'graduated') DEFAULT 'active',
    previous_school VARCHAR(200),
    
    overall_performance DECIMAL(5,2) DEFAULT 0.00,
    attendance_rate DECIMAL(5,2) DEFAULT 0.00,
    behavior_rating ENUM('excellent', 'good', 'satisfactory', 'needs_improvement') DEFAULT 'satisfactory',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK ((grade >= 11 AND stream IS NOT NULL) OR (grade < 11 AND stream IS NULL)),
    
    INDEX idx_grade_section (grade, section),
    INDEX idx_stream (stream),
    INDEX idx_academic_status (academic_status),
    INDEX idx_admission_number (admission_number)
);

CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    teacher_id VARCHAR(50) UNIQUE NOT NULL,
    subjects_taught JSON NOT NULL,
    assigned_grades JSON,
    assigned_sections JSON,
    qualifications JSON,
    specialization VARCHAR(200),
    years_of_experience INT DEFAULT 0,
    join_date DATE DEFAULT CURRENT_DATE,
    employment_type ENUM('full_time', 'part_time', 'contract') DEFAULT 'full_time',
    office_number VARCHAR(20),
    bio TEXT,
    expertise_areas JSON,
    
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_students_taught INT DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    
    status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_status (status),
    INDEX idx_subjects (subjects_taught(255))
);

CREATE TABLE parents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    occupation VARCHAR(100),
    employer VARCHAR(100),
    work_phone VARCHAR(20),
    address TEXT,
    marital_status ENUM('married', 'single', 'divorced', 'widowed'),
    education_level VARCHAR(100),
    preferred_language VARCHAR(50) DEFAULT 'English',
    notification_preferences JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_occupation (occupation)
);

CREATE TABLE parent_child_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NOT NULL,
    student_id INT NOT NULL,
    relationship ENUM('mother', 'father', 'guardian', 'other') NOT NULL,
    link_status ENUM('pending', 'approved', 'rejected', 'blocked') DEFAULT 'pending',
    student_approved BOOLEAN DEFAULT FALSE,
    admin_approved BOOLEAN DEFAULT FALSE,
    request_data JSON NOT NULL,
    verification_notes TEXT,
    
    can_view_grades BOOLEAN DEFAULT TRUE,
    can_view_attendance BOOLEAN DEFAULT TRUE,
    can_view_assignments BOOLEAN DEFAULT TRUE,
    can_receive_notifications BOOLEAN DEFAULT TRUE,
    can_communicate_teachers BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_parent_student (parent_id, student_id),
    
    INDEX idx_link_status (link_status),
    INDEX idx_student_approved (student_approved)
);

CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(200),
    target_grade INT NOT NULL,
    target_section ENUM('A','B','C','D','E','F','G') NOT NULL,
    due_date DATETIME NOT NULL,
    max_points DECIMAL(5,2) DEFAULT 100.00,
    assignment_file_url VARCHAR(500),
    instructions TEXT,
    rubric JSON,
    
    difficulty_level ENUM('easy', 'medium', 'hard', 'challenging') DEFAULT 'medium',
    estimated_completion_time INT, -- in minutes
    tags JSON,
    resources JSON,
    
    status ENUM('draft', 'active', 'completed', 'cancelled') DEFAULT 'active',
    visibility ENUM('immediate', 'scheduled') DEFAULT 'immediate',
    publish_at DATETIME,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(user_id) ON DELETE CASCADE,
    CHECK (target_grade BETWEEN 9 AND 12),
    
    INDEX idx_grade_section (target_grade, target_section),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status),
    INDEX idx_teacher_subject (teacher_id, subject),
    INDEX idx_publish_at (publish_at)
);

CREATE TABLE assignment_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_file_url VARCHAR(500),
    submission_text TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    status ENUM('draft', 'submitted', 'graded', 'late', 'resubmitted') DEFAULT 'submitted',
    version INT DEFAULT 1,
    is_late BOOLEAN DEFAULT FALSE,
    late_minutes INT DEFAULT 0,
    
    points_earned DECIMAL(5,2),
    percentage DECIMAL(5,2),
    grade_letter VARCHAR(3),
    teacher_feedback TEXT,
    rubric_scores JSON,
    graded_at DATETIME,
    graded_by INT,
    
    student_notes TEXT,
    draft_data JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES teachers(user_id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_assignment_student (assignment_id, student_id),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_status (status),
    INDEX idx_grade (points_earned)
);

CREATE TABLE quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    teacher_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    target_grade INT NOT NULL,
    target_section ENUM('A','B','C','D','E','F','G') NOT NULL,
    
    time_limit_minutes INT DEFAULT 30,
    available_from DATETIME,
    available_until DATETIME,
    allow_retakes BOOLEAN DEFAULT FALSE,
    max_attempts INT DEFAULT 1,
    shuffle_questions BOOLEAN DEFAULT TRUE,
    show_results ENUM('immediate', 'after_deadline', 'manual') DEFAULT 'immediate',
    
    questions JSON NOT NULL,
    total_points DECIMAL(5,2) DEFAULT 100.00,
    passing_grade DECIMAL(5,2) DEFAULT 60.00,
    
    instructions TEXT,
    allowed_resources JSON,
    security_settings JSON,
    
    status ENUM('draft', 'active', 'completed', 'cancelled') DEFAULT 'draft',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(user_id) ON DELETE CASCADE,
    CHECK (target_grade BETWEEN 9 AND 12),
    
    INDEX idx_grade_section (target_grade, target_section),
    INDEX idx_available (available_from, available_until),
    INDEX idx_status (status)
);

CREATE TABLE quiz_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    student_id INT NOT NULL,
    attempt_number INT DEFAULT 1,
    
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at DATETIME,
    time_spent_seconds INT DEFAULT 0,
    
    answers JSON,
    auto_grade DECIMAL(5,2),
    teacher_grade DECIMAL(5,2),
    final_grade DECIMAL(5,2),
    question_analysis JSON,
    
    status ENUM('in_progress', 'submitted', 'graded', 'abandoned') DEFAULT 'in_progress',
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    fullscreen_violations INT DEFAULT 0,
    tab_switch_violations INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_quiz_student_attempt (quiz_id, student_id, attempt_number),
    INDEX idx_started_at (started_at),
    INDEX idx_status (status),
    INDEX idx_grade (final_grade)
);

CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    subject VARCHAR(100),
    grade_level JSON,
    stream ENUM('Natural Science', 'Social Science', 'General') DEFAULT 'General',
    book_type ENUM('academic', 'fiction', 'resource', 'teacher_upload', 'user_contributed') NOT NULL,
    
    file_url VARCHAR(500),
    file_size BIGINT,
    file_format VARCHAR(10),
    cover_image_url VARCHAR(500),
    preview_url VARCHAR(500),
    
    isbn VARCHAR(20),
    publisher VARCHAR(200),
    publication_year YEAR,
    edition VARCHAR(50),
    description TEXT,
    keywords JSON,
    
    total_downloads INT DEFAULT 0,
    total_views INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    
    uploaded_by INT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by INT,
    approved_at DATETIME,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_subject_grade (subject, grade_level(255)),
    INDEX idx_book_type (book_type),
    INDEX idx_status (status),
    FULLTEXT idx_search (title, author, description)
);

CREATE TABLE reading_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    
    current_page INT DEFAULT 0,
    total_pages INT DEFAULT 0,
    percentage_complete DECIMAL(5,2) DEFAULT 0.00,
    reading_time_seconds INT DEFAULT 0,
    
    bookmarks JSON,
    notes JSON,
    last_position VARCHAR(100),
    
    last_read_at DATETIME,
    reading_sessions INT DEFAULT 1,
    average_session_time INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_book (user_id, book_id),
    INDEX idx_progress (percentage_complete),
    INDEX idx_last_read (last_read_at)
);

CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id INT NOT NULL,
    
    visibility_level ENUM('public', 'school', 'grade', 'section', 'role') NOT NULL,
    target_grades JSON,
    target_sections JSON,
    target_roles JSON,
    
    published_at DATETIME,
    expires_at DATETIME,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    
    featured_image VARCHAR(500),
    attachments JSON,
    view_count INT DEFAULT 0,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_visibility (visibility_level),
    INDEX idx_published (published_at),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    FULLTEXT idx_news_search (title, content, excerpt)
);

CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    
    message_type ENUM('direct', 'announcement', 'notification', 'system') DEFAULT 'direct',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    
    status ENUM('draft', 'sent', 'delivered', 'read', 'archived') DEFAULT 'sent',
    read_at DATETIME,
    delivered_at DATETIME,
    
    parent_message_id INT,
    thread_id VARCHAR(64),
    
    attachments JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE SET NULL,
    
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_thread (thread_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

CREATE TABLE analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    
    grade_level INT,
    section VARCHAR(1),
    subject VARCHAR(100),
    resource_id INT,
    resource_type VARCHAR(50),
    
    duration_seconds INT DEFAULT 0,
    success_rate DECIMAL(5,2),
    score DECIMAL(5,2),
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at),
    INDEX idx_user_events (user_id, event_type),
    INDEX idx_grade_subject (grade_level, subject)
);

CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(64) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_fingerprint VARCHAR(64),
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_token (session_token),
    INDEX idx_expires (expires_at)
);

CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    INDEX idx_user_actions (user_id, action)
);

SET FOREIGN_KEY_CHECKS=1;

INSERT INTO users (fav_id, email, password, first_name, last_name, role, grade_access, is_verified, is_active) VALUES
('SUPER001', 'superadmin@falconacademy.edu.et', '$2b$12$hashedpassword1', 'System', 'Administrator', 'super_admin', '[9,10,11,12]', TRUE, TRUE),
('DIR001', 'kidane@falconacademy.edu.et', '$2b$12$hashedpassword2', 'Kidane', 'Manager', 'director_all', '[9,10,11,12]', TRUE, TRUE),
('DIR002', 'andargachew@falconacademy.edu.et', '$2b$12$hashedpassword3', 'Andargachew', 'Manager', 'director_11_12', '[11,12]', TRUE, TRUE),
('DIR003', 'zerihun@falconacademy.edu.et', '$2b$12$hashedpassword4', 'Zerihun', 'Manager', 'director_9_10', '[9,10]', TRUE, TRUE);

INSERT INTO users (fav_id, email, password, first_name, last_name, role, grade_access, is_verified) VALUES
('TCH001', 'teacher@falconacademy.edu.et', '$2b$12$hashedpassword5', 'Abebe', 'Kebede', 'teacher', '[9,10,11,12]', TRUE);

INSERT INTO teachers (user_id, teacher_id, subjects_taught, assigned_grades, assigned_sections, qualifications) VALUES
(5, 'TCH001', '["Mathematics", "Physics"]', '[9,10,11,12]', '["A","B","C"]', '[{"degree": "MSc in Mathematics", "university": "Addis Ababa University", "year": 2018}]');

SELECT '🎉 Falcon Academy DLMS Database Schema Created Successfully!' as status;