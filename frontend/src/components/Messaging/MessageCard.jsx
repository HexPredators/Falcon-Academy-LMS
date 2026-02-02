import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Star, Paperclip, Eye, EyeOff, Clock, User, Users, Check, CheckCheck,
  AlertCircle, Archive, Trash2, Reply, Forward, MoreVertical, Lock,
  Bookmark, Tag, Hash, AtSign, Calendar, FileText, Video, Music, File,
  MessageSquare, Pin, Shield, Bell, UserCheck, UserMinus, Download,
  ExternalLink, Copy, Share2, Heart, ThumbsUp, Flag, ZoomIn, RefreshCw,
  Image, ChevronDown, ChevronUp, Link, BookOpen, GraduationCap
} from 'lucide-react';

const MessageCard = ({ message, isSelected, onSelect, onClick }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const getSenderIcon = (role) => {
    switch(role) {
      case 'teacher': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'student': return <User className="w-4 h-4 text-green-600" />;
      case 'parent': return <Users className="w-4 h-4 text-purple-600" />;
      case 'admin': return <Shield className="w-4 h-4 text-red-600" />;
      case 'director': return <Shield className="w-4 h-4 text-yellow-600" />;
      case 'librarian': return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-50 text-red-700 border border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'low': return 'bg-blue-50 text-blue-700 border border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'academic': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'announcement': return <Bell className="w-4 h-4 text-green-500" />;
      case 'assignment': return <Bookmark className="w-4 h-4 text-purple-500" />;
      case 'grade': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'parent': return <Users className="w-4 h-4 text-red-500" />;
      case 'library': return <BookOpen className="w-4 h-4 text-indigo-500" />;
      case 'quiz': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAttachmentIcon = (type) => {
    if (type?.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (type?.includes('image')) return <Image className="w-4 h-4 text-green-500" />;
    if (type?.includes('video')) return <Video className="w-4 h-4 text-purple-500" />;
    if (type?.includes('audio')) return <Music className="w-4 h-4 text-blue-500" />;
    if (type?.includes('word') || type?.includes('document')) return <FileText className="w-4 h-4 text-blue-500" />;
    if (type?.includes('excel') || type?.includes('spreadsheet')) return <FileText className="w-4 h-4 text-green-500" />;
    if (type?.includes('zip') || type?.includes('compressed')) return <File className="w-4 h-4 text-gray-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return t('messaging.justNow');
    } else if (diffMins < 60) {
      return `${diffMins}m ${t('messaging.ago')}`;
    } else if (diffHours < 24) {
      return `${diffHours}h ${t('messaging.ago')}`;
    } else if (diffDays < 7) {
      return `${diffDays}d ${t('messaging.ago')}`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}w ${t('messaging.ago')}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatRecipients = (recipients) => {
    if (!recipients) return t('messaging.multipleRecipients');
    
    if (Array.isArray(recipients)) {
      if (recipients.length === 0) return t('messaging.noRecipients');
      if (recipients.length === 1) {
        return `${recipients[0].name} (${t(`roles.${recipients[0].role}`)})`;
      } else if (recipients.length === 2) {
        return `${recipients[0].name}, ${recipients[1].name}`;
      } else {
        return `${recipients[0].name}, ${recipients[1].name} +${recipients.length - 2}`;
      }
    }
    
    const specialRecipients = {
      'all_students': t('messaging.allStudents'),
      'all_teachers': t('messaging.allTeachers'),
      'all_parents': t('messaging.allParents'),
      'grade_9': t('messaging.grade9'),
      'grade_10': t('messaging.grade10'),
      'grade_11': t('messaging.grade11'),
      'grade_12': t('messaging.grade12'),
      'natural_science': t('messaging.naturalScience'),
      'social_science': t('messaging.socialScience')
    };
    
    return specialRecipients[recipients] || recipients;
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      '9': 'bg-blue-100 text-blue-800',
      '10': 'bg-green-100 text-green-800',
      '11': 'bg-purple-100 text-purple-800',
      '12': 'bg-yellow-100 text-yellow-800'
    };
    return gradeColors[grade] || 'bg-gray-100 text-gray-800';
  };

  const handleDownload = (attachment) => {
    console.log('Downloading:', attachment);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: message.subject,
        text: message.preview,
        url: window.location.href,
      });
    }
  };

  const handleMenuAction = (action) => {
    setIsMenuOpen(false);
    switch(action) {
      case 'archive':
        console.log('Archive message:', message.id);
        break;
      case 'delete':
        console.log('Delete message:', message.id);
        break;
      case 'mark_read':
        console.log('Mark as read:', message.id);
        break;
      case 'mark_unread':
        console.log('Mark as unread:', message.id);
        break;
      case 'pin':
        console.log('Pin message:', message.id);
        break;
      case 'report':
        console.log('Report message:', message.id);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`relative flex items-start gap-4 p-6 transition-all duration-300 cursor-pointer border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-white ${
        isSelected ? 'bg-gradient-to-r from-blue-50 to-blue-25' : message.read ? 'bg-white' : 'bg-blue-50/30'
      } ${message.pinned ? 'border-l-4 border-l-yellow-400' : ''}`}
      onClick={onClick}
    >
      {/* Checkbox */}
      <div className="flex items-start pt-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(message.id, e.target.checked);
          }}
          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
        />
      </div>

      {/* Sender Avatar */}
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
            <span className="text-blue-700 font-semibold text-lg">
              {message.sender?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
            {getSenderIcon(message.sender?.role)}
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 truncate">
              {message.sender?.name || t('messaging.unknownSender')}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <AtSign className="w-3 h-3" />
              {message.sender?.email || 'no-email@falcon.edu'}
            </span>
            
            {message.sender?.role && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {t(`roles.${message.sender.role}`)}
              </span>
            )}
            
            {message.grade && (
              <span className={`text-xs px-2 py-1 rounded-full ${getGradeColor(message.grade)}`}>
                Grade {message.grade}
              </span>
            )}
            
            {message.section && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                Section {message.section}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {message.priority && (
              <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(message.priority)}`}>
                {t(`messaging.priority.${message.priority}`)}
              </span>
            )}
            
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(message.timestamp)}
            </span>
            
            {message.pinned && (
              <Pin className="w-4 h-4 text-yellow-500 rotate-45" />
            )}
            
            {message.encrypted && (
              <Lock className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="flex items-center gap-2 mb-3">
          {message.category && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              {getCategoryIcon(message.category)}
              <span className="capitalize">{message.category}</span>
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {message.subject}
          </h3>
          
          {!message.read && (
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          )}
        </div>

        {/* Message Body */}
        <div className="mb-4">
          <p className={`text-gray-700 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {message.body || message.preview}
          </p>
          
          {message.body && message.body.length > 150 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  {t('messaging.showLess')}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {t('messaging.showMore')}
                </>
              )}
            </button>
          )}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Paperclip className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {message.attachments.length} {t('messaging.attachment', { count: message.attachments.length })}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="group relative flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {getAttachmentIcon(attachment.type)}
                    <span className="text-sm text-gray-700 truncate max-w-[150px]">
                      {attachment.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({Math.round(attachment.size / 1024)} KB)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(attachment);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title={t('common.download')}
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Preview:', attachment);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                      title={t('common.preview')}
                    >
                      <ZoomIn className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipients & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Recipients */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span className="font-medium">{t('messaging.to')}:</span>
              <span className="text-gray-700">
                {formatRecipients(message.recipients)}
              </span>
            </div>

            {/* Read Status */}
            {message.readStatus && (
              <div className="flex items-center gap-1 text-sm">
                {message.readStatus.read === message.readStatus.total ? (
                  <CheckCheck className="w-4 h-4 text-blue-600" />
                ) : (
                  <Check className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-600">
                  {message.readStatus.read}/{message.readStatus.total} {t('messaging.read')}
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Reply to:', message.id);
              }}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title={t('messaging.reply')}
            >
              <Reply className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Forward:', message.id);
              }}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title={t('messaging.forward')}
            >
              <Forward className="w-4 h-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Star:', message.id);
              }}
              className={`p-2 rounded-lg transition-colors ${
                message.starred
                  ? 'text-yellow-500 hover:bg-yellow-50'
                  : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              title={t('messaging.star')}
            >
              <Star className="w-4 h-4" fill={message.starred ? 'currentColor' : 'none'} />
            </button>

            {/* More Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('common.more')}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
                  <div className="py-1">
                    <button
                      onClick={() => handleMenuAction('mark_read')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {t('messaging.markAsRead')}
                    </button>
                    
                    <button
                      onClick={() => handleMenuAction('mark_unread')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <EyeOff className="w-4 h-4" />
                      {t('messaging.markAsUnread')}
                    </button>
                    
                    <button
                      onClick={() => handleMenuAction('pin')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Pin className="w-4 h-4" />
                      {t('messaging.pinMessage')}
                    </button>
                    
                    <button
                      onClick={() => handleMenuAction('archive')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      {t('messaging.archive')}
                    </button>
                    
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      {t('common.copyLink')}
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      {t('common.share')}
                    </button>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <button
                      onClick={() => handleMenuAction('report')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                      {t('messaging.reportMessage')}
                    </button>
                    
                    <button
                      onClick={() => handleMenuAction('delete')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
      )}
    </div>
  );
};

export default MessageCard;