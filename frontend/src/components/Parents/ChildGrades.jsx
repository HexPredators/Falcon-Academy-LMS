import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Award, TrendingUp, TrendingDown, BarChart3, Filter, Download,
  Print, Share2, Eye, EyeOff, Calendar, Clock, BookOpen, FileText,
  Star, CheckCircle, XCircle, AlertCircle, Users, GraduationCap,
  Target, RefreshCw, ChevronDown, ChevronUp, ExternalLink, Lock,
  Unlock, MessageSquare, ThumbsUp, Book, Calculator, Globe,
  Hash, Percent, Home, School, Brain, Zap, Shield
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const ChildGrades = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState('semester1');
  const [loading, setLoading] = useState(true);
  const [gradesData, setGradesData] = useState(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const children = [
    {
      id: 1,
      name: 'Samuel Tekle',
      grade: '10',
      section: 'B',
      favId: 'FAV2023001',
      photo: 'ST',
      overallGrade: 'A',
      gpa: 3.8,
      rank: 5,
      totalStudents: 45
    },
    {
      id: 2,
      name: 'Meron Abebe',
      grade: '11',
      section: 'A',
      favId: 'FAV2023002',
      photo: 'MA',
      overallGrade: 'B+',
      gpa: 3.4,
      rank: 12,
      totalStudents: 40
    }
  ];

  const terms = [
    { value: 'semester1', label: t('parents.semester1') },
    { value: 'semester2', label: t('parents.semester2') },
    { value: 'midterm', label: t('parents.midterm') },
    { value: 'final', label: t('parents.final') }
  ];

  const subjects = [
    {
      id: 1,
      name: 'Mathematics',
      code: 'MATH101',
      teacher: 'Mr. Alemu',
      grade: 'A',
      score: 95,
      weight: 4.0,
      assignments: [
        { title: 'Algebra Test', score: '92/100', weight: 30 },
        { title: 'Geometry Project', score: '98/100', weight: 20 },
        { title: 'Calculus Quiz', score: '96/100', weight: 15 },
        { title: 'Final Exam', score: '94/100', weight: 35 }
      ],
      trend: 'up',
      improvement: '+3%',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Physics',
      code: 'PHYS101',
      teacher: 'Mrs. Selam',
      grade: 'A-',
      score: 90,
      weight: 3.7,
      assignments: [
        { title: 'Mechanics Test', score: '88/100', weight: 30 },
        { title: 'Optics Lab', score: '92/100', weight: 25 },
        { title: 'Final Exam', score: '90/100', weight: 45 }
      ],
      trend: 'up',
      improvement: '+5%',
      color: 'purple'
    },
    {
      id: 3,
      name: 'Chemistry',
      code: 'CHEM101',
      teacher: 'Dr. Tekle',
      grade: 'B+',
      score: 87,
      weight: 3.3,
      assignments: [
        { title: 'Organic Chemistry', score: '85/100', weight: 30 },
        { title: 'Lab Reports', score: '90/100', weight: 20 },
        { title: 'Final Exam', score: '86/100', weight: 50 }
      ],
      trend: 'stable',
      improvement: '0%',
      color: 'green'
    },
    {
      id: 4,
      name: 'Biology',
      code: 'BIO101',
      teacher: 'Ms. Frehiwot',
      grade: 'A',
      score: 93,
      weight: 4.0,
      assignments: [
        { title: 'Genetics Test', score: '94/100', weight: 25 },
        { title: 'Ecology Project', score: '95/100', weight: 20 },
        { title: 'Lab Practical', score: '92/100', weight: 25 },
        { title: 'Final Exam', score: '91/100', weight: 30 }
      ],
      trend: 'up',
      improvement: '+4%',
      color: 'red'
    },
    {
      id: 5,
      name: 'English',
      code: 'ENG101',
      teacher: 'Mr. John',
      grade: 'A-',
      score: 91,
      weight: 3.7,
      assignments: [
        { title: 'Literature Essay', score: '92/100', weight: 25 },
        { title: 'Grammar Test', score: '95/100', weight: 20 },
        { title: 'Oral Presentation', score: '90/100', weight: 15 },
        { title: 'Final Exam', score: '88/100', weight: 40 }
      ],
      trend: 'stable',
      improvement: '+1%',
      color: 'yellow'
    },
    {
      id: 6,
      name: 'Amharic',
      code: 'AMH101',
      teacher: 'Mrs. Aster',
      grade: 'A',
      score: 96,
      weight: 4.0,
      assignments: [
        { title: 'Grammar Test', score: '98/100', weight: 25 },
        { title: 'Essay Writing', score: '95/100', weight: 25 },
        { title: 'Oral Exam', score: '96/100', weight: 20 },
        { title: 'Final Exam', score: '95/100', weight: 30 }
      ],
      trend: 'up',
      improvement: '+2%',
      color: 'orange'
    }
  ];

  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
    }
    fetchGradesData();
  }, [selectedChild, selectedTerm]);

  const fetchGradesData = async () => {
    setLoading(true);
    try {
      const mockData = {
        overallGPA: 3.8,
        totalSubjects: 6,
        averageScore: 92,
        classRank: 5,
        totalStudents: 45,
        percentage: 89,
        termAverage: 91,
        previousTerm: 88,
        improvement: '+3',
        attendance: 94,
        assignmentsCompleted: 24,
        totalAssignments: 26,
        quizzesAverage: 89,
        examsAverage: 93,
        subjects: subjects
      };
      setGradesData(mockData);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600 bg-green-100 border-green-200';
    if (grade >= 80) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (grade >= 60) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getLetterGrade = (score) => {
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getWeight = (score) => {
    if (score >= 93) return 4.0;
    if (score >= 90) return 3.7;
    if (score >= 87) return 3.3;
    if (score >= 83) return 3.0;
    if (score >= 80) return 2.7;
    if (score >= 77) return 2.3;
    if (score >= 73) return 2.0;
    if (score >= 70) return 1.7;
    if (score >= 67) return 1.3;
    if (score >= 60) return 1.0;
    return 0.0;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log('Downloading grades report');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedChild?.name}'s Grades`,
        text: `Check out ${selectedChild?.name}'s academic performance`,
        url: window.location.href,
      });
    }
  };

  const calculateGPA = () => {
    if (!gradesData?.subjects) return 0;
    const totalWeight = gradesData.subjects.reduce((sum, subject) => sum + subject.weight, 0);
    return (totalWeight / gradesData.subjects.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('parents.childGrades')}</h1>
                <p className="text-gray-600 mt-1">{t('parents.trackAcademicGrades')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {terms.map(term => (
                  <option key={term.value} value={term.value}>
                    {term.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={fetchGradesData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all hover:shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">{t('common.refresh')}</span>
              </button>
            </div>
          </div>

          {/* Child Selector */}
          <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all min-w-[300px] ${
                  selectedChild?.id === child.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300'
                    : 'bg-white border border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {child.photo}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      child.gpa >= 3.7 ? 'bg-green-100 text-green-600' :
                      child.gpa >= 3.3 ? 'bg-blue-100 text-blue-600' :
                      child.gpa >= 3.0 ? 'bg-yellow-100 text-yellow-600' :
                      child.gpa >= 2.7 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <span className="text-xs font-bold">{child.gpa}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">{child.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">Grade {child.grade} - Section {child.section}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                      {child.favId}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold">{child.overallGrade}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span>GPA: {child.gpa}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>Rank: {child.rank}/{child.totalStudents}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(skeleton => (
              <div key={skeleton} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            ))}
          </div>
        ) : gradesData && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Overall GPA */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-blue-700">{t('parents.overallGPA')}</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {calculateGPA()}
                    </p>
                  </div>
                  <Award className="w-12 h-12 text-blue-500 opacity-80" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-800">
                    {gradesData.improvement} {t('parents.fromLastTerm')}
                  </span>
                  <span className="font-semibold text-blue-900">
                    {t('parents.classRank')}: {gradesData.classRank}/{gradesData.totalStudents}
                  </span>
                </div>
              </div>

              {/* Average Score */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-green-700">{t('parents.averageScore')}</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {gradesData.averageScore}%
                    </p>
                  </div>
                  <Percent className="w-12 h-12 text-green-500 opacity-80" />
                </div>
                <div className="text-sm text-green-800">
                  {t('parents.termAverage')}: {gradesData.termAverage}%
                </div>
              </div>

              {/* Assignments */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-purple-700">{t('parents.assignments')}</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {gradesData.assignmentsCompleted}/{gradesData.totalAssignments}
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-500 opacity-80" />
                </div>
                <div className="text-sm text-purple-800">
                  {t('parents.completionRate')}: {Math.round((gradesData.assignmentsCompleted / gradesData.totalAssignments) * 100)}%
                </div>
              </div>

              {/* Assessment Averages */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">{t('parents.assessmentAverage')}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <p className="text-xl font-bold text-yellow-900">{gradesData.quizzesAverage}%</p>
                        <p className="text-xs text-yellow-800">{t('parents.quizzes')}</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-yellow-900">{gradesData.examsAverage}%</p>
                        <p className="text-xs text-yellow-800">{t('parents.exams')}</p>
                      </div>
                    </div>
                  </div>
                  <BarChart3 className="w-12 h-12 text-yellow-500 opacity-80" />
                </div>
              </div>
            </div>

            {/* Subject Grades Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <div className="flex items-center justify-between p-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Book className="w-6 h-6 text-blue-600" />
                    {t('parents.subjectGrades')}
                  </h2>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                    >
                      <Print className="w-5 h-5" />
                      <span className="font-medium">{t('common.print')}</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span className="font-medium">{t('common.download')}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">{t('common.share')}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        {t('parents.subject')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        {t('parents.teacher')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        {t('parents.grade')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        {t('parents.score')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        {t('parents.weight')}
                      </th>
                      <th className="px6 py-4 text-left text-sm font-semibold text-gray-900">
                        {t('parents.trend')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        {t('parents.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {gradesData.subjects.map((subject, index) => (
                      <tr 
                        key={subject.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-${subject.color}-100 flex items-center justify-center`}>
                              <Book className={`w-5 h-5 text-${subject.color}-600`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{subject.name}</p>
                              <p className="text-sm text-gray-600">{subject.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{subject.teacher}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-2 rounded-full border font-bold ${getGradeColor(subject.score)}`}>
                            {subject.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">{subject.score}%</span>
                            {subject.trend === 'up' ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : subject.trend === 'down' ? (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            ) : (
                              <BarChart3 className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-gray-900">{subject.weight}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              subject.trend === 'up' ? 'text-green-600' :
                              subject.trend === 'down' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {subject.improvement}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg">
                              <Download className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                              <MessageSquare className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('parents.summary')}</p>
                    <div className="flex items-center gap-6 mt-2">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{calculateGPA()}</p>
                        <p className="text-sm text-gray-600">{t('parents.cumulativeGPA')}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{gradesData.averageScore}%</p>
                        <p className="text-sm text-gray-600">{t('parents.averageScore')}</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {gradesData.classRank}/{gradesData.totalStudents}
                        </p>
                        <p className="text-sm text-gray-600">{t('parents.classRank')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t('parents.attendance')}</p>
                    <p className="text-2xl font-bold text-green-600">{gradesData.attendance}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Detail Modal */}
            {selectedSubject && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 bg-${selectedSubject.color}-100 rounded-lg`}>
                          <Book className={`w-6 h-6 text-${selectedSubject.color}-600`} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedSubject.name}</h2>
                          <p className="text-gray-600 mt-1">{selectedSubject.code} • {selectedSubject.teacher}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedSubject(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <XCircle className="w-6 h-6 text-gray-500" />
                      </button>
                    </div>

                    {/* Grade Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{t('parents.finalGrade')}</p>
                        <p className={`text-3xl font-bold mt-2 ${getGradeColor(selectedSubject.score).split(' ')[0]}`}>
                          {selectedSubject.grade}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{t('parents.finalScore')}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {selectedSubject.score}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{t('parents.weight')}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {selectedSubject.weight}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('parents.breakdown')}
                    </h3>
                    
                    <div className="space-y-4">
                      {selectedSubject.assignments.map((assignment, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                          <div>
                            <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600">
                                {t('parents.weight')}: {assignment.weight}%
                              </span>
                              <span className="text-sm text-gray-600">
                                {t('parents.score')}: {assignment.score}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${
                              parseInt(assignment.score) >= 90 ? 'text-green-600' :
                              parseInt(assignment.score) >= 80 ? 'text-blue-600' :
                              parseInt(assignment.score) >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {assignment.score}
                            </span>
                            <button className="p-2 hover:bg-gray-200 rounded-lg">
                              <ExternalLink className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Performance Analysis */}
                    <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        {t('parents.performanceAnalysis')}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-blue-800 mb-2">{t('parents.strengths')}</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm">Excellent in problem-solving</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm">Consistent assignment submission</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm text-blue-800 mb-2">{t('parents.areasForImprovement')}</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm">Need more practice on advanced topics</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedSubject(null)}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        {t('common.close')}
                      </button>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors">
                          <MessageSquare className="w-5 h-5" />
                          <span className="font-medium">{t('parents.contactTeacher')}</span>
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                          <Download className="w-5 h-5" />
                          <span className="font-medium">{t('parents.downloadReport')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Term Comparison */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  {t('parents.termComparison')}
                </h2>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-purple-800">{t('parents.trendAnalysis')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">{t('parents.currentTerm')}</h3>
                    <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      {t('parents.semester1')}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">{t('parents.averageScore')}</p>
                      <p className="text-2xl font-bold text-green-600">{gradesData.termAverage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('parents.gpa')}</p>
                      <p className="text-2xl font-bold text-gray-900">{calculateGPA()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">{t('parents.previousTerm')}</h3>
                    <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {t('parents.previous')}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">{t('parents.averageScore')}</p>
                      <p className="text-2xl font-bold text-blue-600">{gradesData.previousTerm}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('parents.gpa')}</p>
                      <p className="text-2xl font-bold text-gray-900">3.6</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">{t('parents.improvement')}</h3>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      gradesData.improvement.startsWith('+') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {gradesData.improvement}%
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">{t('parents.scoreIncrease')}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <p className="text-xl font-bold text-green-600">
                          {gradesData.termAverage - gradesData.previousTerm}%
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('parents.rankImprovement')}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Award className="w-5 h-5 text-purple-600" />
                        <p className="text-xl font-bold text-purple-600">
                          +3 {t('parents.positions')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{t('parents.nextTermGoals')}</h3>
                      <p className="text-gray-600 text-sm">
                        {t('parents.targetImprovement')}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">{t('parents.setGoals')}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChildGrades;