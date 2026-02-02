import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Eye, Heart, Share2, Bookmark,
  Globe, Lock, Users, GraduationCap, AlertCircle, Pin, 
  MessageCircle, ThumbsUp, Download, ExternalLink, Copy,
  Flag, Edit, Trash2, User, BookOpen, Megaphone, Image,
  Video, FileText, ChevronLeft, ChevronRight, Printer,
  MoreVertical, CheckCheck, AtSign, Hash, Tag
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const NewsView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchRelatedNews();
    fetchComments();
  }, [id]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const mockNews = {
        id: 1,
        title: "Mid-Term Examination Schedule",
        content: `
          <div class="space-y-4">
            <p>The mid-term examinations for all grades will commence from next Monday. Please check your respective timetables.</p>
            
            <h3>Important Points:</h3>
            <ul class="list-disc pl-6 space-y-2">
              <li>Examinations will be held from 8:00 AM to 11:00 AM</li>
              <li>Students must bring their ID cards</li>
              <li>Strict COVID-19 protocols will be followed</li>
              <li>No electronic devices allowed in examination halls</li>
            </ul>
            
            <h3>Schedule:</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 border">Date</th>
                    <th class="py-2 px-4 border">Grade 9</th>
                    <th class="py-2 px-4 border">Grade 10</th>
                    <th class="py-2 px-4 border">Grade 11</th>
                    <th class="py-2 px-4 border">Grade 12</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="py-2 px-4 border">Jan 20</td>
                    <td class="py-2 px-4 border">Mathematics</td>
                    <td class="py-2 px-4 border">Physics</td>
                    <td class="py-2 px-4 border">Biology</td>
                    <td class="py-2 px-4 border">Chemistry</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `,
        fullContent: `Full detailed content about the mid-term examinations...`,
        author: {
          name: "Academic Office",
          role: "admin",
          avatar: "AO"
        },
        date: "2024-01-15T10:00:00",
        lastUpdated: "2024-01-15T14:30:00",
        visibility: "school",
        category: "academic",
        priority: "high",
        views: 245,
        likes: 34,
        shares: 12,
        grade: "all",
        section: "all",
        pinned: true,
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop",
        attachments: [
          {
            id: 1,
            name: "examination_schedule.pdf",
            size: 2457600,
            type: "application/pdf",
            url: "#"
          },
          {
            id: 2,
            name: "exam_rules.docx",
            size: 153600,
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            url: "#"
          }
        ],
        tags: ["exams", "academic", "schedule", "grades"]
      };
      setNews(mockNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
    const mockRelated = [
      {
        id: 2,
        title: "Annual Sports Day Celebration",
        category: "events",
        date: "2024-01-14T14:30:00",
        views: 189
      },
      {
        id: 3,
        title: "Library Renovation Complete",
        category: "academic",
        date: "2024-01-13T09:15:00",
        views: 112
      }
    ];
    setRelatedNews(mockRelated);
  };

  const fetchComments = async () => {
    const mockComments = [
      {
        id: 1,
        author: "John Doe",
        role: "teacher",
        avatar: "JD",
        content: "Thanks for the detailed schedule. When will the results be announced?",
        date: "2024-01-15T11:30:00",
        likes: 5
      },
      {
        id: 2,
        author: "Sarah Smith",
        role: "student",
        avatar: "SS",
        content: "Are there any changes to the examination rooms?",
        date: "2024-01-15T12:15:00",
        likes: 3
      }
    ];
    setComments(mockComments);
  };

  const getVisibilityIcon = (visibility) => {
    switch(visibility) {
      case 'public': return <Globe className="w-4 h-4 text-green-600" />;
      case 'school': return <Lock className="w-4 h-4 text-blue-600" />;
      case 'grade': return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'section': return <Users className="w-4 h-4 text-orange-600" />;
      default: return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'academic': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'events': return <Calendar className="w-5 h-5 text-green-600" />;
      case 'announcements': return <Megaphone className="w-5 h-5 text-purple-600" />;
      case 'emergency': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        text: news?.content,
        url: window.location.href,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAll = () => {
    console.log('Downloading all attachments');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      author: user?.name || 'Anonymous',
      role: user?.role || 'guest',
      avatar: user?.name?.charAt(0) || 'A',
      content: newComment,
      date: new Date().toISOString(),
      likes: 0
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  const canEditDelete = ['admin', 'director'].includes(user?.role);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('news.loading')}</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('news.notFound')}</h3>
          <p className="text-gray-600 mb-6">{t('news.newsNotFound')}</p>
          <button
            onClick={() => navigate('/news')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {t('news.backToNews')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/news')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('news.backToNews')}</span>
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('common.print')}
              >
                <Printer className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleCopyLink}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title={t('common.copyLink')}
              >
                <Copy className="w-5 h-5" />
              </button>
              
              {canEditDelete && (
                <div className="relative">
                  <button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {showMoreOptions && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <button
                          onClick={() => navigate(`/news/edit/${news.id}`)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => console.log('Delete news:', news.id)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('common.delete')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
              {/* Badges */}
              <div className="flex items-center gap-3 flex-wrap mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                  {getCategoryIcon(news.category)}
                  <span className="font-medium capitalize">{news.category}</span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full">
                  {getVisibilityIcon(news.visibility)}
                  <span>{t(`news.${news.visibility}`)}</span>
                </div>
                
                {news.priority === 'high' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">{t('news.highPriority')}</span>
                  </div>
                )}
                
                {news.pinned && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                    <Pin className="w-4 h-4 rotate-45" />
                    <span className="font-medium">{t('news.pinned')}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
                {news.title}
              </h1>

              {/* Author & Date */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {news.author.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{news.author.name}</p>
                      <p className="text-sm text-gray-600">{t(`roles.${news.author.role}`)}</p>
                    </div>
                  </div>
                  
                  <div className="h-8 w-px bg-gray-300"></div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">{formatDate(news.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{formatTime(news.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Eye className="w-5 h-5" />
                      <span className="font-bold text-lg">{news.views}</span>
                    </div>
                    <p className="text-sm text-gray-500">{t('news.views')}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Heart className="w-5 h-5" />
                      <span className="font-bold text-lg">{news.likes}</span>
                    </div>
                    <p className="text-sm text-gray-500">{t('news.likes')}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Share2 className="w-5 h-5" />
                      <span className="font-bold text-lg">{news.shares}</span>
                    </div>
                    <p className="text-sm text-gray-500">{t('news.shares')}</p>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {news.imageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
              </div>

              {/* Attachments */}
              {news.attachments && news.attachments.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      {t('news.attachments')}
                    </h3>
                    <button
                      onClick={handleDownloadAll}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {t('news.downloadAll')}
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {news.attachments.map(att => (
                      <div key={att.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                        <div className="flex items-center gap-4">
                          <FileText className="w-8 h-8 text-red-500" />
                          <div>
                            <p className="font-medium text-gray-900">{att.name}</p>
                            <p className="text-sm text-gray-600">{formatFileSize(att.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => console.log('Preview:', att.id)}
                            className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            {t('common.preview')}
                          </button>
                          <button
                            onClick={() => console.log('Download:', att.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {news.tags && news.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-600" />
                    {t('news.tags')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                      >
                        <Hash className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                        isLiked
                          ? 'bg-red-50 text-red-600'
                          : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="font-semibold">
                        {isLiked ? t('news.liked') : t('news.like')}
                      </span>
                    </button>
                    
                    <button className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-semibold">{t('news.react')}</span>
                    </button>
                    
                    <button
                      onClick={handleBookmark}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                        isBookmarked
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                      <span className="font-semibold">
                        {isBookmarked ? t('news.bookmarked') : t('news.bookmark')}
                      </span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-semibold">{t('news.share')}</span>
                    </button>
                    
                    <button
                      onClick={() => console.log('Report news')}
                      className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Flag className="w-5 h-5" />
                      <span className="font-semibold">{t('common.report')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                {t('news.comments')}
                <span className="text-gray-500 font-normal text-lg">
                  ({comments.length})
                </span>
              </h2>

              {/* Add Comment */}
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={t('news.addCommentPlaceholder')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <AtSign className="w-4 h-4" />
                        {t('news.commentHint')}
                      </div>
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {t('news.postComment')}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {comment.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">{comment.author}</span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {t(`roles.${comment.role}`)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.date)} at {formatTime(comment.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:text-red-600">
                              <Heart className="w-4 h-4" />
                            </button>
                            <button className="p-1 hover:text-blue-600">
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <button className="flex items-center gap-1 hover:text-blue-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Like ({comment.likes})</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-blue-600">
                            <MessageCircle className="w-4 h-4" />
                            <span>Reply</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-red-600">
                            <Flag className="w-4 h-4" />
                            <span>Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related News */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                {t('news.relatedNews')}
              </h3>
              
              <div className="space-y-4">
                {relatedNews.map(item => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/news/${item.id}`)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded ${
                        item.category === 'academic' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {item.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDate(item.date)}</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate('/news')}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span className="font-medium">{t('news.viewAllNews')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* News Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t('news.newsInfo')}</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('news.published')}</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(news.date)} at {formatTime(news.date)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('news.lastUpdated')}</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(news.lastUpdated)} at {formatTime(news.lastUpdated)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('news.visibility')}</p>
                  <div className="flex items-center gap-2">
                    {getVisibilityIcon(news.visibility)}
                    <span className="font-medium text-gray-900">
                      {t(`news.${news.visibility}`)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('news.targetAudience')}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {news.grade === 'all' ? t('news.allGrades') : `Grade ${news.grade}`}
                    </span>
                    {news.section !== 'all' && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Section {news.section}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t('news.quickActions')}</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <ExternalLink className="w-5 h-5" />
                  <span className="font-medium">{t('news.openInNewTab')}</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">{t('news.downloadAsPDF')}</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <Copy className="w-5 h-5" />
                  <span className="font-medium">{t('news.copyContent')}</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Flag className="w-5 h-5" />
                  <span className="font-medium">{t('news.reportError')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsView;