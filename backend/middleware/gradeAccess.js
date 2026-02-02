const User = require('../models/User');

const grades9to10 = [9, 10];
const grades11to12 = [11, 12];
const allGrades = [9, 10, 11, 12];

const checkGradeAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication required' 
        });
    }

    const userGradeAccess = getUserGradeAccess(req.user);
    req.userGradeAccess = userGradeAccess;
    
    next();
};

const getUserGradeAccess = (user) => {
    switch (user.role) {
        case 'super_admin':
            return { hasAccess: true, grades: allGrades, allGrades: true };
        
        case 'director_kidane':
            return { hasAccess: true, grades: allGrades, allGrades: true };
        
        case 'director_aleme':
            return { hasAccess: true, grades: grades11to12, allGrades: false };
        
        case 'director_zerihun':
            return { hasAccess: true, grades: grades9to10, allGrades: false };
        
        case 'school_admin':
            const adminGrades = user.assignedGrades || [];
            return { 
                hasAccess: adminGrades.length > 0, 
                grades: adminGrades, 
                allGrades: false 
            };
        
        case 'teacher':
            const teacherGrades = user.assignedGrades || [];
            return { 
                hasAccess: teacherGrades.length > 0, 
                grades: teacherGrades, 
                allGrades: false 
            };
        
        case 'student':
            return { 
                hasAccess: true, 
                grades: [user.grade], 
                allGrades: false,
                specificGrade: user.grade,
                section: user.section,
                stream: user.stream
            };
        
        case 'parent':
            return { 
                hasAccess: true, 
                grades: [], 
                allGrades: false,
                throughChildren: true 
            };
        
        default:
            return { hasAccess: false, grades: [], allGrades: false };
    }
};

const requireGradeAccess = (targetGrades) => {
    return (req, res, next) => {
        const userAccess = req.userGradeAccess || getUserGradeAccess(req.user);
        
        if (!userAccess.hasAccess) {
            return res.status(403).json({ 
                success: false, 
                message: 'No grade access assigned' 
            });
        }

        if (userAccess.allGrades) {
            return next();
        }

        if (req.user.role === 'parent') {
            return next();
        }

        const hasAccess = targetGrades.some(grade => 
            userAccess.grades.includes(grade)
        );

        if (!hasAccess) {
            return res.status(403).json({ 
                success: false, 
                message: `Access denied for grades: ${targetGrades.join(', ')}` 
            });
        }

        next();
    };
};

const filterByUserGradeAccess = (query, user) => {
    const userAccess = getUserGradeAccess(user);
    
    if (userAccess.allGrades) {
        return query;
    }

    if (userAccess.grades.length > 0) {
        query.grade = { $in: userAccess.grades };
    } else if (user.role === 'parent') {
        query._id = { $in: user.linkedChildren || [] };
    } else if (user.role === 'student') {
        query._id = user._id;
    }

    return query;
};

const checkSectionAccess = (targetSections) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        if (req.user.role === 'super_admin' || 
            req.user.role.startsWith('director_')) {
            return next();
        }

        if (req.user.role === 'teacher') {
            const teacherSections = req.user.assignedSections || [];
            const hasAccess = targetSections.some(section => 
                teacherSections.includes(section)
            );

            if (!hasAccess) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied for these sections' 
                });
            }
        }

        if (req.user.role === 'student') {
            if (!targetSections.includes(req.user.section)) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied for this section' 
                });
            }
        }

        next();
    };
};

const checkStreamAccess = (targetStreams) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        if (req.user.role === 'super_admin' || 
            req.user.role.startsWith('director_') ||
            req.user.role === 'school_admin') {
            return next();
        }

        if (req.user.role === 'teacher') {
            const teacherStreams = req.user.assignedStreams || ['natural', 'social'];
            
            if (req.user.assignedGrades?.includes(11) || req.user.assignedGrades?.includes(12)) {
                const hasAccess = targetStreams.some(stream => 
                    teacherStreams.includes(stream)
                );

                if (!hasAccess) {
                    return res.status(403).json({ 
                        success: false, 
                        message: 'Access denied for these streams' 
                    });
                }
            }
        }

        if (req.user.role === 'student' && req.user.grade >= 11) {
            if (!targetStreams.includes(req.user.stream)) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied for this stream' 
                });
            }
        }

        next();
    };
};

const validateGradeRange = (minGrade = 9, maxGrade = 12) => {
    return (req, res, next) => {
        const { grade } = req.body;
        
        if (grade !== undefined) {
            if (grade < minGrade || grade > maxGrade) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Grade must be between ${minGrade} and ${maxGrade}` 
                });
            }

            if (grade >= 11) {
                const { stream } = req.body;
                if (!stream || !['natural', 'social'].includes(stream)) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Stream is required for grades 11-12 (natural or social)' 
                    });
                }
            }
        }

        next();
    };
};

const filterResourcesByAccess = (resources, user) => {
    const userAccess = getUserGradeAccess(user);
    
    if (userAccess.allGrades) {
        return resources;
    }

    if (userAccess.throughChildren && user.role === 'parent') {
        const childIds = user.linkedChildren?.map(child => child.toString()) || [];
        return resources.filter(resource => 
            childIds.includes(resource.studentId?.toString())
        );
    }

    if (userAccess.grades.length > 0) {
        return resources.filter(resource => {
            if (resource.grade && userAccess.grades.includes(resource.grade)) {
                if (user.role === 'teacher' && resource.section) {
                    const teacherSections = user.assignedSections || [];
                    return teacherSections.includes(resource.section);
                }
                return true;
            }
            return false;
        });
    }

    if (user.role === 'student') {
        return resources.filter(resource => 
            resource.grade === user.grade && 
            resource.section === user.section
        );
    }

    return [];
};

module.exports = {
    checkGradeAccess,
    requireGradeAccess,
    filterByUserGradeAccess,
    checkSectionAccess,
    checkStreamAccess,
    validateGradeRange,
    filterResourcesByAccess,
    getUserGradeAccess,
    grades9to10,
    grades11to12,
    allGrades
};