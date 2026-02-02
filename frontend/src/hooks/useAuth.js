import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export const useAuthGuard = (requiredRole = null, requiredPermission = null) => {
  const { user, isAuthenticated, loading, hasPermission, getDashboardPath } = useAuth();
  
  const checkAccess = () => {
    if (loading) return { allowed: false, reason: 'loading' };
    
    if (!isAuthenticated || !user) {
      return { allowed: false, reason: 'unauthenticated', redirectTo: '/login' };
    }
    
    if (requiredRole && user.role !== requiredRole) {
      const dashboardPath = getDashboardPath(user.role);
      return { 
        allowed: false, 
        reason: 'unauthorized_role', 
        redirectTo: dashboardPath,
        message: `Required role: ${requiredRole}, your role: ${user.role}`
      };
    }
    
    if (requiredPermission && !hasPermission(requiredPermission)) {
      const dashboardPath = getDashboardPath(user.role);
      return { 
        allowed: false, 
        reason: 'insufficient_permissions', 
        redirectTo: dashboardPath,
        message: `Required permission: ${requiredPermission}`
      };
    }
    
    return { allowed: true };
  };
  
  const requireAuth = (Component) => {
    return function RequireAuthComponent(props) {
      const { isAuthenticated, loading } = useAuth();
      
      if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
      }
      
      if (!isAuthenticated) {
        window.location.href = '/login';
        return null;
      }
      
      return <Component {...props} />;
    };
  };
  
  const requireRole = (role) => (Component) => {
    return function RequireRoleComponent(props) {
      const { user, isAuthenticated, loading, getDashboardPath } = useAuth();
      
      if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
      }
      
      if (!isAuthenticated) {
        window.location.href = '/login';
        return null;
      }
      
      if (user.role !== role) {
        const dashboardPath = getDashboardPath(user.role);
        window.location.href = dashboardPath;
        return null;
      }
      
      return <Component {...props} />;
    };
  };
  
  const requirePermission = (permission) => (Component) => {
    return function RequirePermissionComponent(props) {
      const { user, isAuthenticated, loading, hasPermission, getDashboardPath } = useAuth();
      
      if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
      }
      
      if (!isAuthenticated) {
        window.location.href = '/login';
        return null;
      }
      
      if (!hasPermission(permission)) {
        const dashboardPath = getDashboardPath(user.role);
        window.location.href = dashboardPath;
        return null;
      }
      
      return <Component {...props} />;
    };
  };
  
  const withAuth = (Component) => {
    return function WithAuthComponent(props) {
      const auth = useAuth();
      return <Component {...props} auth={auth} />;
    };
  };
  
  return {
    user,
    isAuthenticated,
    loading,
    checkAccess,
    requireAuth,
    requireRole,
    requirePermission,
    withAuth
  };
};

export const useUserRole = () => {
  const { user } = useAuth();
  
  const isSuperAdmin = () => user?.role === 'super_admin';
  const isDirector = () => user?.role === 'director';
  const isSchoolAdmin = () => user?.role === 'school_admin';
  const isTeacher = () => user?.role === 'teacher';
  const isStudent = () => user?.role === 'student';
  const isParent = () => user?.role === 'parent';
  const isLibrarian = () => user?.role === 'librarian';
  const isOther = () => user?.role === 'other';
  
  const getRoleName = () => {
    if (!user) return '';
    
    const roleNames = {
      super_admin: 'Super Admin',
      director: 'Director',
      school_admin: 'School Administrator',
      teacher: 'Teacher',
      student: 'Student',
      parent: 'Parent',
      librarian: 'Librarian',
      other: 'Other'
    };
    
    return roleNames[user.role] || user.role;
  };
  
  const canManageGrades = (grades = []) => {
    if (!user) return false;
    
    if (isSuperAdmin() || isSchoolAdmin()) return true;
    
    if (isDirector()) {
      if (user.name === 'Mr. Kidane') return true;
      if (user.name === 'Mr. Andargachew') {
        return grades.every(grade => grade >= 11);
      }
      if (user.name === 'Mr. Zerihun') {
        return grades.every(grade => grade <= 10);
      }
    }
    
    if (isTeacher()) {
      return grades.every(grade => user.grades?.includes(grade));
    }
    
    return false;
  };
  
  const canManageSubjects = (subjects = []) => {
    if (!user) return false;
    
    if (isSuperAdmin() || isSchoolAdmin()) return true;
    
    if (isDirector()) return true;
    
    if (isTeacher()) {
      return subjects.every(subject => user.subjects?.includes(subject));
    }
    
    return false;
  };
  
  const canViewStudentData = (studentGrade) => {
    if (!user) return false;
    
    if (isSuperAdmin() || isSchoolAdmin()) return true;
    
    if (isDirector()) {
      if (user.name === 'Mr. Kidane') return true;
      if (user.name === 'Mr. Andargachew') return studentGrade >= 11;
      if (user.name === 'Mr. Zerihun') return studentGrade <= 10;
    }
    
    if (isTeacher()) {
      return user.grades?.includes(studentGrade);
    }
    
    if (isParent()) {
      return user.linkedStudents?.some(student => student.grade === studentGrade);
    }
    
    if (isStudent()) {
      return user.grade === studentGrade;
    }
    
    return false;
  };
  
  const getAccessibleGrades = () => {
    if (!user) return [];
    
    if (isSuperAdmin() || isSchoolAdmin() || (isDirector() && user.name === 'Mr. Kidane')) {
      return [9, 10, 11, 12];
    }
    
    if (isDirector() && user.name === 'Mr. Andargachew') {
      return [11, 12];
    }
    
    if (isDirector() && user.name === 'Mr. Zerihun') {
      return [9, 10];
    }
    
    if (isTeacher()) {
      return user.grades || [];
    }
    
    if (isStudent()) {
      return [user.grade];
    }
    
    if (isParent()) {
      const grades = user.linkedStudents?.map(student => student.grade) || [];
      return [...new Set(grades)];
    }
    
    return [];
  };
  
  const getAccessibleSections = (grade = null) => {
    if (!user) return [];
    
    if (isSuperAdmin() || isSchoolAdmin() || (isDirector() && user.name === 'Mr. Kidane')) {
      return ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    }
    
    if (isTeacher()) {
      if (grade && !user.grades?.includes(grade)) return [];
      return user.sections || [];
    }
    
    if (isStudent()) {
      if (grade && grade !== user.grade) return [];
      return [user.section];
    }
    
    if (isParent()) {
      const sections = user.linkedStudents
        ?.filter(student => !grade || student.grade === grade)
        .map(student => student.section) || [];
      return [...new Set(sections)];
    }
    
    return [];
  };
  
  return {
    role: user?.role,
    roleName: getRoleName(),
    isSuperAdmin: isSuperAdmin(),
    isDirector: isDirector(),
    isSchoolAdmin: isSchoolAdmin(),
    isTeacher: isTeacher(),
    isStudent: isStudent(),
    isParent: isParent(),
    isLibrarian: isLibrarian(),
    isOther: isOther(),
    canManageGrades,
    canManageSubjects,
    canViewStudentData,
    getAccessibleGrades,
    getAccessibleSections,
    getUserName: () => user?.name || user?.firstName || 'User',
    getUserEmail: () => user?.email || '',
    getUserAvatar: () => user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3b82f6&color=ffffff`
  };
};