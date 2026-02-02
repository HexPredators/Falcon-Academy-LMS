import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Users, 
  BarChart3, 
  TrendingUp,
  Clock,
  Award,
  MessageSquare
} from 'lucide-react';

const StatsGrid = ({ stats, liveUpdates, userRole }) => {
  const getStatsForRole = () => {
    const baseStats = [
      {
        icon: <FileText className="h-6 w-6" />,
        label: 'Total Assignments',
        value: stats.totalAssignments || 0,
        change: '+12%',
        trend: 'up',
        color: 'blue'
      },
      {
        icon: <BookOpen className="h-6 w-6" />,
        label: 'Active Courses',
        value: stats.activeCourses || 0,
        change: '+5%',
        trend: 'up',
        color: 'green'
      }
    ];

    if (userRole === 'student') {
      baseStats.push(
        {
          icon: <Award className="h-6 w-6" />,
          label: 'Average Grade',
          value: `${stats.averageGrade || 0}%`,
          change: '+2.5%',
          trend: 'up',
          color: 'purple'
        },
        {
          icon: <Clock className="h-6 w-6" />,
          label: 'Study Hours',
          value: stats.studyHours || '0h',
          change: '+3h',
          trend: 'up',
          color: 'orange'
        }
      );
    }

    if (userRole === 'teacher') {
      baseStats.push(
        {
          icon: <Users className="h-6 w-6" />,
          label: 'Total Students',
          value: stats.totalStudents || 0,
          change: '+8%',
          trend: 'up',
          color: 'indigo'
        },
        {
          icon: <MessageSquare className="h-6 w-6" />,
          label: 'Pending Grading',
          value: stats.pendingGrading || 0,
          change: '-3',
          trend: 'down',
          color: 'red'
        }
      );
    }

    if (userRole.includes('director') || userRole === 'super_admin') {
      baseStats.push(
        {
          icon: <Users className="h-6 w-6" />,
          label: 'Total Users',
          value: stats.totalUsers || 0,
          change: '+15%',
          trend: 'up',
          color: 'indigo'
        },
        {
          icon: <BarChart3 className="h-6 w-6" />,
          label: 'Platform Activity',
          value: stats.platformActivity || 'High',
          change: '+22%',
          trend: 'up',
          color: 'teal'
        }
      );
    }

    return baseStats;
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden"
        >
          {/* Live update indicator */}
          {liveUpdates && (
            <div className="absolute top-3 right-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <div className={`flex items-center mt-2 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${
                  stat.trend === 'down' ? 'rotate-180' : ''
                }`} />
                <span>{stat.change} from last week</span>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
              {stat.icon}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-${stat.color}-500 h-2 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;