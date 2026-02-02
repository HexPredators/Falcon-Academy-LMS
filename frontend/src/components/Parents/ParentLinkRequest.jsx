import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link as LinkIcon, Search, UserPlus, Users, Clock, CheckCircle,
  XCircle, AlertCircle, ChevronRight, Filter, RefreshCw, Eye,
  UserCheck, Mail, Phone, GraduationCap, BookOpen, Calendar,
  MoreVertical, Send, UserX, ExternalLink, Copy, QrCode,
  Shield, Lock, Unlock, History, Bell, Star
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const ParentLinkRequest = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    favId: '',
    grade: '',
    section: '',
    relation: 'parent',
    verificationCode: ''
  });

  const grades = ['9', '10', '11', '12'];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const relations = [
    { value: 'parent', label: t('parents.parent'), icon: Users },
    { value: 'guardian', label: t('parents.guardian'), icon: Shield },
    { value: 'sibling', label: t('parents.sibling'), icon: UserCheck },
    { value: 'relative', label: t('parents.relative'), icon: Users }
  ];

  useEffect(() => {
    fetchRequests();
    generateVerificationCode();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const mockRequests = [
        {
          id: 1,
          studentName: 'Samuel Tekle',
          favId: 'FAV2023001',
          grade: '10',
          section: 'B',
          status: 'pending',
          requestedAt: '2024-01-15T10:30:00',
          studentEmail: 'samuel@falcon.edu',
          studentPhone: '+251911223344',
          relation: 'parent',
          studentPhoto: 'ST',
          verificationCode: 'ABC123'
        },
        {
          id: 2,
          studentName: 'Meron Abebe',
          favId: 'FAV2023002',
          grade: '11',
          section: 'A',
          status: 'approved',
          requestedAt: '2024-01-14T14:20:00',
          approvedAt: '2024-01-15T09:15:00',
          studentEmail: 'meron@falcon.edu',
          relation: 'guardian',
          studentPhoto: 'MA'
        },
        {
          id: 3,
          studentName: 'Tewodros Kassahun',
          favId: 'FAV2023003',
          grade: '9',
          section: 'C',
          status: 'rejected',
          requestedAt: '2024-01-13T11:45:00',
          rejectedAt: '2024-01-14T16:30:00',
          reason: 'Information mismatch',
          studentEmail: 'tewodros@falcon.edu',
          relation: 'parent',
          studentPhoto: 'TK'
        }
      ];
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setFormData(prev => ({ ...prev, verificationCode: code }));
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.favId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && request.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchStudent = async () => {
    if (!formData.favId || !formData.studentName) {
      alert(t('parents.fillRequiredFields'));
      return;
    }

    setLoading(true);
    try {
      console.log('Searching student:', formData);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudent = {
        name: 'Test Student',
        favId: formData.favId,
        grade: '10',
        section: 'B',
        photo: 'TS'
      };
      setSelectedStudent(mockStudent);
    } catch (error) {
      console.error('Error searching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedStudent) {
      alert(t('parents.selectStudentFirst'));
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting link request:', formData);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(t('parents.requestSubmitted'));
      setShowLinkForm(false);
      setSelectedStudent(null);
      setFormData({
        studentName: '',
        favId: '',
        grade: '',
        section: '',
        relation: 'parent',
        verificationCode: ''
      });
      fetchRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    setLoading(true);
    try {
      console.log(`${action} request:`, requestId);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: action } : req
      ));
    } catch (error) {
      console.error(`Error ${action} request:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = (requestId) => {
    console.log('Resend verification for:', requestId);
    generateVerificationCode();
  };

  const handleGenerateQR = (request) => {
    console.log('Generate QR for:', request);
    const qrData = {
      parentId: user?.id,
      studentId: request.favId,
      verificationCode: formData.verificationCode
    };
    console.log('QR Data:', qrData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <LinkIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('parents.linkRequests')}</h1>
                <p className="text-gray-600 mt-1">{t('parents.manageChildLinks')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={fetchRequests}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all hover:shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">{t('common.refresh')}</span>
              </button>
              
              <button
                onClick={() => setShowLinkForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5" />
                <span className="font-semibold">{t('parents.newRequest')}</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">{t('parents.totalRequests')}</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{requests.length}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">{t('parents.pending')}</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-2">
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">{t('parents.approved')}</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {requests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">{t('parents.rejected')}</p>
                  <p className="text-3xl font-bold text-red-900 mt-2">
                    {requests.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="w-10 h-10 text-red-500 opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Link Form Modal */}
        {showLinkForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{t('parents.newLinkRequest')}</h2>
                      <p className="text-gray-600 mt-1">{t('parents.linkFormDesc')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowLinkForm(false);
                      setSelectedStudent(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Steps */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedStudent ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      1
                    </div>
                    <div className={`h-1 w-24 ${
                      selectedStudent ? 'bg-green-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedStudent ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      2
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Student Search */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-600" />
                        {t('parents.studentSearch')}
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('parents.studentFullName')} *
                          </label>
                          <input
                            type="text"
                            value={formData.studentName}
                            onChange={(e) => handleInputChange('studentName', e.target.value)}
                            placeholder={t('parents.namePlaceholder')}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('parents.favId')} *
                          </label>
                          <input
                            type="text"
                            value={formData.favId}
                            onChange={(e) => handleInputChange('favId', e.target.value)}
                            placeholder="FAV2023XXX"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('parents.grade')}
                            </label>
                            <select
                              value={formData.grade}
                              onChange={(e) => handleInputChange('grade', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="">{t('parents.selectGrade')}</option>
                              {grades.map(grade => (
                                <option key={grade} value={grade}>Grade {grade}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('parents.section')}
                            </label>
                            <select
                              value={formData.section}
                              onChange={(e) => handleInputChange('section', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="">{t('parents.selectSection')}</option>
                              {sections.map(section => (
                                <option key={section} value={section}>Section {section}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('parents.relation')}
                          </label>
                          <select
                            value={formData.relation}
                            onChange={(e) => handleInputChange('relation', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            {relations.map(rel => (
                              <option key={rel.value} value={rel.value}>{rel.label}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={handleSearchStudent}
                          disabled={loading || !formData.studentName || !formData.favId}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Search className="w-5 h-5" />
                          <span className="font-semibold">{t('parents.searchStudent')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Verification Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {t('parents.verificationInfo')}
                      </h4>
                      <p className="text-blue-800 text-sm mb-4">
                        {t('parents.verificationDesc')}
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-blue-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">{t('parents.verificationCode')}</p>
                            <p className="text-2xl font-bold text-blue-700 font-mono">
                              {formData.verificationCode}
                            </p>
                          </div>
                          <button
                            onClick={generateVerificationCode}
                            className="p-2 hover:bg-blue-100 rounded-lg"
                            title={t('parents.regenerateCode')}
                          >
                            <RefreshCw className="w-5 h-5 text-blue-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Student Details & Submit */}
                  <div className="space-y-6">
                    {selectedStudent ? (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div>
                              <h3 className="font-bold text-green-900">{t('parents.studentFound')}</h3>
                              <p className="text-green-700 text-sm">{t('parents.verifyDetails')}</p>
                            </div>
                          </div>

                          {/* Student Card */}
                          <div className="bg-white rounded-lg border border-green-300 p-6">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                  {selectedStudent.photo}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    FAV ID: {selectedStudent.favId}
                                  </span>
                                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                    Grade {selectedStudent.grade} - Section {selectedStudent.section}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{t('parents.grade')}:</span>
                                <span className="font-medium">Grade {selectedStudent.grade}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{t('parents.section')}:</span>
                                <span className="font-medium">Section {selectedStudent.section}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{t('parents.email')}:</span>
                                <span className="font-medium truncate">student@falcon.edu</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{t('parents.phone')}:</span>
                                <span className="font-medium">+251 XXX XXX XXX</span>
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <button
                            onClick={handleSubmitRequest}
                            disabled={loading}
                            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                          >
                            <Send className="w-5 h-5" />
                            <span className="font-semibold">{t('parents.submitRequest')}</span>
                          </button>
                        </div>

                        {/* QR Code Option */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <QrCode className="w-5 h-5" />
                            {t('parents.qrOption')}
                          </h4>
                          <p className="text-gray-700 text-sm mb-4">
                            {t('parents.qrDesc')}
                          </p>
                          <button
                            onClick={() => handleGenerateQR(selectedStudent)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
                          >
                            <QrCode className="w-5 h-5" />
                            <span className="font-medium">{t('parents.generateQR')}</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                        <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-6">
                          <UserCheck className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {t('parents.searchStudentFirst')}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {t('parents.searchStudentDesc')}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{t('parents.requiredFieldsNote')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('parents.searchRequests')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="all">{t('parents.allStatus')}</option>
                <option value="pending">{t('parents.pending')}</option>
                <option value="approved">{t('parents.approved')}</option>
                <option value="rejected">{t('parents.rejected')}</option>
              </select>

              <button
                onClick={generateVerificationCode}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium">{t('parents.newCode')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(skeleton => (
              <div key={skeleton} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('parents.noRequests')}</h3>
            <p className="text-gray-600 mb-6">{t('parents.noRequestsDesc')}</p>
            <button
              onClick={() => setShowLinkForm(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {t('parents.createFirstRequest')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Student Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-lg font-bold">
                            {request.studentPhoto}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                          {getStatusIcon(request.status)}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{request.studentName}</h3>
                        <div className="flex items-center gap-4 flex-wrap mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{t('parents.favId')}:</span>
                            <span className="font-medium">{request.favId}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              Grade {request.grade} - Section {request.section}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm capitalize">{request.relation}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {new Date(request.requestedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="flex items-center gap-4 mt-3">
                          {request.studentEmail && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{request.studentEmail}</span>
                            </div>
                          )}
                          {request.studentPhone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{request.studentPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-4">
                      <span className={`px-4 py-2 rounded-full border ${getStatusColor(request.status)} flex items-center gap-2`}>
                        {getStatusIcon(request.status)}
                        <span className="font-medium capitalize">{request.status}</span>
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(request.id, 'approved')}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-medium">{t('common.approve')}</span>
                            </button>
                            <button
                              onClick={() => handleAction(request.id, 'rejected')}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              <span className="font-medium">{t('common.reject')}</span>
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleResendVerification(request.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          <span className="font-medium">{t('parents.resendCode')}</span>
                        </button>
                        
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {request.status === 'rejected' && request.reason && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-900">{t('parents.rejectionReason')}</p>
                          <p className="text-red-800 mt-1">{request.reason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Verification Code */}
                  {request.status === 'pending' && request.verificationCode && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-yellow-900">{t('parents.verificationCode')}</p>
                          <p className="text-2xl font-bold text-yellow-700 font-mono mt-1">
                            {request.verificationCode}
                          </p>
                          <p className="text-sm text-yellow-800 mt-2">
                            {t('parents.shareCodeWithStudent')}
                          </p>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(request.verificationCode)}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>{t('common.copy')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentLinkRequest;