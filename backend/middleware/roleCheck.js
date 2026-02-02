const User = require('../models/User');
const DirectorAssignment = require('../models/DirectorAssignment');

const roleHierarchy = {
    'super_admin': 100,
    'director_kidane': 90,
    'director_andargachew': 85,
    'director_zerihun': 85,
    'school_admin': 80,
    'teacher': 70,
    'librarian': 60,
    'parent': 50,
    'student': 40,
    'other': 30
};

const checkRoleHierarchy = (requiredLevel) => {
    return (req, res, next) => {
        const userLevel = roleHierarchy[req.user.role] || 0;
        
        if (userLevel < requiredLevel) {
            return res.status(403).json({ 
                success: false, 
                message: 'Insufficient role hierarchy level' 
            });
        }
        
        next();
    };
};

const checkDirectorAccess = async (req, res, next) => {
    try {
        if (req.user.role.startsWith('director_')) {
            const directorAssignment = await DirectorAssignment.findOne({ 
                userId: req.user._id 
            });

            if (!directorAssignment) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Director assignment not found' 
                });
            }

            req.directorAccess = {
                gradeRanges: directorAssignment.gradeRanges,
                permissions: directorAssignment.permissions,
                assignedGrades: directorAssignment.assignedGrades
            };
        }
        
        next();
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error checking director access' 
        });
    }
};

const checkTeacherAccess = async (req, res, next) => {
    try {
        if (req.user.role === 'teacher') {
            const teacher = await User.findById(req.user._id)
                .select('assignedGrades assignedSections assignedSubjects')
                .populate('assignedSubjects');

            if (!teacher) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Teacher profile not found' 
                });
            }

            req.teacherAccess = {
                grades: teacher.assignedGrades || [],
                sections: teacher.assignedSections || [],
                subjects: teacher.assignedSubjects || []
            };
        }
        
        next();
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error checking teacher access' 
        });
    }
};

const checkStudentAccess = async (req, res, next) => {
    try {
        if (req.user.role === 'student') {
            const student = await User.findById(req.user._id)
                .select('grade section stream');

            if (!student) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Student profile not found' 
                });
            }

            req.studentAccess = {
                grade: student.grade,
                section: student.section,
                stream: student.stream
            };
        }
        
        next();
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error checking student access' 
        });
    }
};

const checkParentAccess = async (req, res, next) => {
    try {
        if (req.user.role === 'parent') {
            const parent = await User.findById(req.user._id)
                .select('linkedChildren')
                .populate({
                    path: 'linkedChildren',
                    select: 'grade section stream fullName favId'
                });

            if (!parent) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Parent profile not found' 
                });
            }

            req.parentAccess = {
                children: parent.linkedChildren || [],
                childrenIds: parent.linkedChildren.map(child => child._id)
            };
        }
        
        next();
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error checking parent access' 
        });
    }
};

const validateActionPermission = (action) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id)
                .select('permissions role');

            if (!user) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            const hasPermission = user.permissions?.includes(action) || 
                                 user.roleDetails?.defaultPermissions?.includes(action);

            if (!hasPermission) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Permission denied for action: ${action}` 
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error validating permission' 
            });
        }
    };
};

const checkResourceOwnership = (resourceModel, paramField = 'id', ownerField = 'userId') => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[paramField];
            const resource = await resourceModel.findById(resourceId);

            if (!resource) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Resource not found' 
                });
            }

            if (resource[ownerField].toString() !== req.user._id.toString() && 
                !req.user.role.startsWith('director_') && 
                req.user.role !== 'super_admin' && 
                req.user.role !== 'school_admin') {
                
                return res.status(403).json({ 
                    success: false, 
                    message: 'You do not own this resource' 
                });
            }

            req.resource = resource;
            next();
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error checking resource ownership' 
            });
        }
    };
};

module.exports = {
    checkRoleHierarchy,
    checkDirectorAccess,
    checkTeacherAccess,
    checkStudentAccess,
    checkParentAccess,
    validateActionPermission,
    checkResourceOwnership,
    roleHierarchy
};