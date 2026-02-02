import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Reply, Forward, Star, Archive, Trash2, MoreVertical, 
  Paperclip, Download, Eye, EyeOff, Clock, User, Users, AtSign,
  ChevronDown, ChevronUp, MessageSquare, CheckCheck, Check, Pin,
  Bookmark, Tag, Filter, Search, RefreshCw, AlertCircle, Bell,
  Smile, Send, Image, Bold, Italic, List, Link, Plus, Minus,
  ThumbsUp, Heart, Share2, Copy, Flag, Lock, Unlock, ZoomIn,
  Calendar, Hash, Number, Type, AlignLeft, AlignCenter, UserPlus
} from 'lucide-react';
import MessageComposer from './MessageComposer';
import Button from '../../Common/Button';
import LoadingSpinner from '../../Common/LoadingSpinner';

const MessageThread = () => {
  const { t } = useTranslation();
  const { threadId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [showForward, setShowForward] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const messagesEndRef = useRef(null);
  const threadRef = useRef(null);

  const filterTypes = [
    { id: 'all', name: t('messaging.allMessages') },
    { id: 'unread', name: t('messaging.unread') },
    { id: 'starred', name: t('messaging.starred') },
    { id: 'with_attachments', name: t('messaging.withAttachments') },
    { id: 'from_teacher', name: t('messaging.fromTeachers') },
    { id: 'from_student', name: t('messaging.fromStudents') },
  ];

  useEffect(() => {
    fetchThread();
  }, [threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchThread = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockThread = {
          id: threadId,
          subject: 'Algebra Assignment Discussion',
          participants: [
            {
              id: 'TCH001',
              name: 'Mr. Alemayehu',
              role: 'teacher',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemayehu',
              status: 'online',
            },
            {
              id: 'S2023001',
              name: 'ደመሰሰ ታደሰ',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demesese',
              status: 'offline',
            },
            {
              id: 'S2023002',
              name: 'ሙሉጌታ አባይ',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mulugata',
              status: 'online',
            },
            {
              id: 'S2023003',
              name: 'ትንሳኤ መኮንን',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tinsae',
              status: 'away',
            },
          ],
          tags: ['algebra', 'assignment', 'homework', 'mathematics'],
          priority: 'high',
          category: 'academic',
          createdAt: '2024-02-15',
          lastActivity: '2024-02-20 14:30',
          totalMessages: 24,
          unreadCount: 3,
          isStarred: true,
          isArchived: false,
        };

        const mockMessages = [
          {
            id: 1,
            sender: {
              id: 'TCH001',
              name: 'Mr. Alemayehu',
              role: 'teacher',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemayehu',
            },
            content: 'Hello class, I\'ve reviewed the algebra assignments. Overall, great work! I\'ve attached feedback for each student.',
            timestamp: '2024-02-15 09:00:00',
            read: true,
            starred: true,
            hasAttachment: true,
            attachments: [
              { name: 'assignment_feedback.pdf', size: '2.4 MB', type: 'pdf' },
            ],
            reactions: {
              thumbsUp: 5,
              heart: 3,
            },
            isOriginal: true,
          },
          {
            id: 2,
            sender: {
              id: 'S2023001',
              name: 'ደመሰሰ ታደሰ',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demesese',
            },
            content: 'Thank you, sir! I\'ve reviewed your feedback. Could you please explain problem #3 in more detail?',
            timestamp: '2024-02-15 10:15:00',
            read: true,
            starred: false,
            repliedTo: 1,
          },
          {
            id: 3,
            sender: {
              id: 'TCH001',
              name: 'Mr. Alemayehu',
              role: 'teacher',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemayehu',
            },
            content: 'Sure, problem #3 involves solving quadratic equations using the quadratic formula. The key is to remember the formula: x = [-b ± √(b² - 4ac)] / 2a',
            timestamp: '2024-02-15 11:30:00',
            read: true,
            starred: true,
            repliedTo: 2,
          },
          {
            id: 4,
            sender: {
              id: 'S2023002',
              name: 'ሙሉጌታ አባይ',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mulugata',
            },
            content: 'I found an alternative method using factorization. Would you like me to share it with the class?',
            timestamp: '2024-02-15 14:45:00',
            read: false,
            starred: true,
            repliedTo: 3,
          },
          {
            id: 5,
            sender: {
              id: 'TCH001',
              name: 'Mr. Alemayehu',
              role: 'teacher',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemayehu',
            },
            content: 'Yes, please share! Multiple methods help everyone understand better.',
            timestamp: '2024-02-15 15:20:00',
            read: false,
            starred: false,
            repliedTo: 4,
          },
          {
            id: 6,
            sender: {
              id: 'S2023003',
              name: 'ትንሳኤ መኮንን',
              role: 'student',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tinsae',
            },
            content: 'I\'ve uploaded a document with all the factorization steps. Please check the attachments.',
            timestamp: '2024-02-20 14:30:00',
            read: false,
            starred: false,
            hasAttachment: true,
            attachments: [
              { name: 'factorization_method.docx', size: '1.2 MB', type: 'docx' },
            ],
            repliedTo: 5,
          },
        ];

        setThread(mockThread);
        setMessages(mockMessages);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error loading thread:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: {
        id: 'CURRENT_USER',
        name: 'Current User',
        role: 'teacher',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      starred: false,
      repliedTo: replyingTo?.id,
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setReplyingTo(null);
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    threadRef.current?.focus();
  };

  const handleStarMessage = (messageId) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
      )
    );
  };

  const handleMarkAsRead = (messageId) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleDeleteMessages = () => {
    setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg.id)));
    setSelectedMessages([]);
  };

  const handleStarThread = () => {
    setThread(prev => ({ ...prev, isStarred: !prev.isStarred }));
  };

  const handleArchiveThread = () => {
    setThread(prev => ({ ...prev, isArchived: !prev.isArchived }));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMessageStatus = (message) => {
    if (message.sender.id === 'CURRENT_USER') {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
    return message.read ? (
      <Eye className="w-4 h-4 text-gray-400" />
    ) : (
      <EyeOff className="w-4 h-4 text-blue-500" />
    );
  };

  const filteredMessages = messages.filter(message => {
    if (filterType === 'unread') return !message.read;
    if (filterType === 'starred') return message.starred;
    if (filterType === 'with_attachments') return message.hasAttachment;
    if (filterType === 'from_teacher') return message.sender.role === 'teacher';
    if (filterType === 'from_student') return message.sender.role === 'student';
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">{t('messaging.loadingThread')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/messages')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{thread.subject}</h1>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  thread.priority === 'high' ? 'bg-red-100 text-red-800' :
                  thread.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {thread.priority}
                </span>
                {thread.isStarred && (
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{thread.participants.length} {t('messaging.participants')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{thread.totalMessages} {t('messaging.messages')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{t('messaging.lastActivity')}: {formatDate(thread.lastActivity)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setShowReply(true)}
              variant="outline"
              className="px-6"
            >
              <Reply className="w-5 h-5 mr-2" />
              {t('messaging.reply')}
            </Button>
            <Button
              onClick={() => setShowForward(true)}
              variant="outline"
              className="px-6"
            >
              <Forward className="w-5 h-5 mr-2" />
              {t('messaging.forward')}
            </Button>
            <button
              onClick={handleStarThread}
              className={`p-2 rounded-lg ${
                thread.isStarred
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Star className={`w-5 h-5 ${thread.isStarred ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleArchiveThread}
              className={`p-2 rounded-lg ${
                thread.isArchived
                  ? 'bg-purple-50 text-purple-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Archive className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {thread.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Thread */}
        <div className="flex-1">
          {/* Thread Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Selection Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedMessages.length === messages.length && messages.length > 0}
                    onChange={() => {
                      if (selectedMessages.length === messages.length) {
                        setSelectedMessages([]);
                      } else {
                        setSelectedMessages(messages.map(m => m.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">
                    {selectedMessages.length > 0
                      ? `${selectedMessages.length} ${t('messaging.selected')}`
                      : t('messaging.selectAll')}
                  </span>
                </div>

                {selectedMessages.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setMessages(prev =>
                          prev.map(msg =>
                            selectedMessages.includes(msg.id)
                              ? { ...msg, read: true }
                              : msg
                          )
                        );
                        setSelectedMessages([]);
                      }}
                      className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                    >
                      {t('messaging.markRead')}
                    </button>
                    <button
                      onClick={() => {
                        setMessages(prev =>
                          prev.map(msg =>
                            selectedMessages.includes(msg.id)
                              ? { ...msg, starred: !msg.starred }
                              : msg
                          )
                        );
                        setSelectedMessages([]);
                      }}
                      className="px-3 py-1.5 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100"
                    >
                      {t('messaging.star')}
                    </button>
                    <button
                      onClick={handleDeleteMessages}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      {t('messaging.delete')}
                    </button>
                  </div>
                )}
              </div>

              {/* Filter & Search */}
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {filterTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('messaging.searchInThread')}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Messages List */}
            <div className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
              {filteredMessages.map(message => (
                <div
                  key={message.id}
                  className={`p-6 transition-colors ${
                    selectedMessages.includes(message.id) ? 'bg-blue-50' :
                    !message.read ? 'bg-gray-50' :
                    'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message.id)}
                        onChange={() => handleSelectMessage(message.id)}
                        className="rounded"
                      />
                    </div>

                    {/* Message Content */}
                    <div className="flex-1">
                      {/* Message Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={message.sender.avatar}
                            alt={message.sender.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900">
                                {message.sender.name}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                message.sender.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                                message.sender.role === 'student' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {message.sender.role}
                              </span>
                              {message.isOriginal && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                  {t('messaging.original')}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(message.timestamp)} • {formatDate(message.timestamp)}</span>
                              {getMessageStatus(message)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStarMessage(message.id)}
                            className={`p-1.5 rounded ${
                              message.starred
                                ? 'text-yellow-500 hover:bg-yellow-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${message.starred ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleReply(message)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Reply className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Reply Indicator */}
                      {message.repliedTo && (
                        <div className="mb-3 ml-12 pl-4 border-l-2 border-gray-300 text-sm text-gray-500">
                          {t('messaging.replyingTo')} {messages.find(m => m.id === message.repliedTo)?.sender.name}
                        </div>
                      )}

                      {/* Message Body */}
                      <div className="ml-12">
                        <p className="text-gray-800 whitespace-pre-wrap mb-4">
                          {message.content}
                        </p>

                        {/* Attachments */}
                        {message.hasAttachment && message.attachments && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {message.attachments.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg"
                                >
                                  <Paperclip className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-600">{file.size}</p>
                                  </div>
                                  <button className="ml-2 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                                    {t('messaging.download')}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reactions */}
                        {message.reactions && (
                          <div className="flex items-center gap-2 mb-4">
                            <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{message.reactions.thumbsUp}</span>
                            </button>
                            <button className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                              <Heart className="w-3 h-3" />
                              <span>{message.reactions.heart}</span>
                            </button>
                            <button className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900">
                              + {t('messaging.react')}
                            </button>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleMarkAsRead(message.id)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            {message.read ? t('messaging.markUnread') : t('messaging.markRead')}
                          </button>
                          <button className="text-sm text-gray-600 hover:text-gray-900">
                            {t('messaging.forward')}
                          </button>
                          <button className="text-sm text-gray-600 hover:text-gray-900">
                            {t('messaging.copy')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Area */}
            <div className="border-t border-gray-200 p-6">
              {replyingTo && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-700">
                      {t('messaging.replyingTo')} {replyingTo.sender.name}
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {replyingTo.content}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <div className="pt-2">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                    alt="You"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                
                <div className="flex-1">
                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 mb-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <Bold className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <Italic className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <List className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <Link className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <Image className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <Paperclip className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="flex-1"></div>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      {t('messaging.richText')}
                    </button>
                  </div>

                  {/* Text Area */}
                  <textarea
                    ref={threadRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('messaging.typeYourReply')}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                        <Smile className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                        <Image className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setNewMessage('')}
                        variant="outline"
                        size="sm"
                      >
                        {t('messaging.clear')}
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        {t('messaging.send')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 space-y-6">
          {/* Participants */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{t('messaging.participants')}</h3>
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="text-gray-600 hover:text-gray-900"
              >
                {showParticipants ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            <div className="space-y-3">
              {thread.participants.slice(0, showParticipants ? undefined : 3).map(participant => (
                <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        participant.status === 'online' ? 'bg-green-500' :
                        participant.status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{participant.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{participant.role}</p>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>

            {!showParticipants && thread.participants.length > 3 && (
              <button
                onClick={() => setShowParticipants(true)}
                className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                + {thread.participants.length - 3} {t('messaging.more')}
              </button>
            )}
          </div>

          {/* Thread Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('messaging.threadDetails')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('messaging.category')}</span>
                <span className="font-medium capitalize">{thread.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('messaging.priority')}</span>
                <span className={`font-medium capitalize ${
                  thread.priority === 'high' ? 'text-red-600' :
                  thread.priority === 'medium' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {thread.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('messaging.created')}</span>
                <span className="font-medium">{formatDate(thread.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('messaging.messages')}</span>
                <span className="font-medium">{thread.totalMessages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('messaging.unread')}</span>
                <span className="font-medium text-blue-600">{thread.unreadCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t('messaging.quickActions')}</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowReply(true)}
                className="w-full p-3 bg-white hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3"
              >
                <Reply className="w-5 h-5" />
                <span className="font-medium">{t('messaging.replyAll')}</span>
              </button>
              <button
                onClick={() => setShowForward(true)}
                className="w-full p-3 bg-white hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3"
              >
                <Forward className="w-5 h-5" />
                <span className="font-medium">{t('messaging.forwardThread')}</span>
              </button>
              <button
                onClick={() => {/* Export thread */}}
                className="w-full p-3 bg-white hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">{t('messaging.exportThread')}</span>
              </button>
              <button
                onClick={() => {/* Print thread */}}
                className="w-full p-3 bg-white hover:bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3"
              >
                <Printer className="w-5 h-5" />
                <span className="font-medium">{t('messaging.printThread')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Composer Modals */}
      {showReply && (
        <MessageComposer
          isOpen={showReply}
          onClose={() => setShowReply(false)}
          onSend={(message) => {
            console.log('Reply sent:', message);
            setShowReply(false);
          }}
          replyTo={thread}
        />
      )}

      {showForward && (
        <MessageComposer
          isOpen={showForward}
          onClose={() => setShowForward(false)}
          onSend={(message) => {
            console.log('Forward sent:', message);
            setShowForward(false);
          }}
          forwardFrom={thread}
        />
      )}
    </div>
  );
};

export default MessageThread;