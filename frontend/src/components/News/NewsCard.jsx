import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, Clock, Eye, Heart, Share2, Bookmark, MoreVertical,
  Globe, Lock, Users, GraduationCap, AlertCircle, Pin, 
  ChevronRight, ExternalLink, BookOpen, Megaphone, Flag,
  ThumbsUp, MessageCircle, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NewsCard = ({ news, pinned = false }) => {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      case 'academic': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'events': return <Calendar className="w-4 h-4 text-green-600" />;
      case 'announcements': return <Megaphone className="w-4 h-4 text-purple-600" />;
      case 'emergency': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'holidays': return <Calendar className="w-4 h-4 text-yellow-600" />;
      default: return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.content,
        url: window.location.href,
      });
    }
  };

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      pinned ? 'border-yellow-300 border-2' : 'border-gray-200'
    } ${news.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}>
      {/* Pinned Badge */}
      {pinned && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full shadow-lg">
            <Pin className="w-3 h-3 rotate-45" />
            <span className="text-xs font-semibold">{t('news.pinned')}</span>
          </div>
        </div>
      )}

      {/* Image */}
      {news.imageUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Priority Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getPriorityBadge(news.priority)}`}>
              {t(`news.priority.${news.priority}`)}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="text-sm font-medium text-blue-700">{news.author}</span>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  {getVisibilityIcon(news.visibility)}
                  <span>{t(`news.${news.visibility}`)}</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  {getCategoryIcon(news.category)}
                  <span className="capitalize">{news.category}</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3">
              {news.title}
            </h3>
          </div>
          
          {/* More Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    {t('common.open')}
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    {t('common.download')}
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    {t('common.share')}
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <Flag className="w-4 h-4" />
                    {t('common.report')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">
            {truncateText(news.content, 150)}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(news.date)}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{formatTime(news.date)}</span>
            </div>
            
            {/* Views */}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{news.views}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Grade Badge */}
            {news.grade !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Grade {news.grade}
              </span>
            )}
            
            {/* Section Badge */}
            {news.section !== 'all' && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                Section {news.section}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isLiked 
                  ? 'bg-red-50 text-red-600' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">
                {isLiked ? news.likes + 1 : news.likes}
              </span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <ThumbsUp className="w-5 h-5" />
              <span className="font-medium">Like</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Comment</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-all ${
                isBookmarked
                  ? 'text-yellow-500 hover:bg-yellow-50'
                  : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              title={t('common.bookmark')}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title={t('common.share')}
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <Link
              to={`/news/${news.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <span className="font-medium">{t('news.readMore')}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;