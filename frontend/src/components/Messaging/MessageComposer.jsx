import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X, Send, Paperclip, Smile, Bold, Italic, List, Image, Link, Eye, EyeOff,
  Users, UserPlus, Clock, Calendar, AlertCircle, CheckCircle, Tag, Hash,
  AtSign, Plus, Minus, Trash2, RefreshCw, Save, Download, Upload, FileText,
  Video, Music, File, Archive, Bookmark, Pin, Lock, Globe, Shield, Bell,
  MessageSquare, Hash as HashIcon, Number, Type, AlignLeft, AlignCenter
} from 'lucide-react';
import Button from '../../Common/Button';
import Modal from '../../Common/Modal';
import LoadingSpinner from '../../Common/LoadingSpinner';

const MessageComposer = ({ isOpen, onClose, onSend, replyTo = null, forwardFrom = null }) => {
  const { t } = useTranslation();
  
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showRecipientSearch, setShowRecipientSearch] = useState(false);
  
  const [messageData, setMessageData] = useState({
    subject: '',
    body: '',
    category: 'general',
    priority: 'medium',
    scheduleSend: false,
    sendDate: '',
    sendTime: '',
    requireConfirmation: false,
    allowReply: true,
    confidential: false,
    tags: [],
  });

  const categories = [
    { id: 'academic', name: t('messaging.academic'), color: 'bg-blue-100 text-blue-800' },
    { id: 'announcement', name: t('messaging.announcement'), color: 'bg-green-100 text-green-800' },
    { id: 'assignment', name: t('messaging.assignment'), color: 'bg-purple-100 text-purple-800' },
    { id: 'grade', name: t('messaging.grade'), color: 'bg-yellow-100 text-yellow-800' },
    { id: 'parent', name: t('messaging.parent'), color: 'bg-red-100 text-red-800' },
    { id: 'general', name: t('messaging.general'), color: 'bg-gray-100 text-gray-800' },
  ];

  const priorities = [
    { id: 'high', name: t('messaging.high'), icon: <AlertCircle className="w-4 h-4" />, color: 'bg-red-100 text-red-800' },
    { id: 'medium', name: t('messaging.medium'), icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'low', name: t('messaging.low'), icon: <CheckCircle className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
  ];

  const recipientTypes = [
    { id: 'student', name: t('messaging.students'), icon: <Users className="w-4 h-4" /> },
    { id: 'teacher', name: t('messaging.teachers'), icon: <UserPlus className="w-4 h-4" /> },
    { id: 'parent', name: t('messaging.parents'), icon: <Users className="w-4 h-4" /> },
    { id: 'class', name: t('messaging.class'), icon: <Hash className="w-4 h-4" /> },
    { id: 'grade', name: t('messaging.gradeLevel'), icon: <Number className="w-4 h-4" /> },
  ];

  const mockUsers = [
    { id: 'S2023001', name: 'ደመሰሰ ታደሰ', type: 'student', grade: '10', section: 'A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demesese' },
    { id: 'S2023002', name: 'ሙሉጌታ አባይ', type: 'student', grade: '10', section: 'A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mulugata' },
    { id: 'TCH001', name: 'Mr. Alemayehu', type: 'teacher', subject: 'Mathematics', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemayehu' },
    { id: 'TCH002', name: 'Mrs. Selamawit', type: 'teacher', subject: 'History', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Selamawit' },
    { id: 'PAR001', name: 'Parent: Mrs. Tadese', type: 'parent', child: 'ደመሰሰ ታደሰ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Parent' },
  ];

  const mockGroups = [
    { id: 'G10A', name: 'Grade 10 Section A', type: 'class', count: 32 },
    { id: 'G10', name: 'Grade 10 All Sections', type: 'grade', count: 150 },
    { id: 'MATH_T', name: 'Mathematics Teachers', type: 'department', count: 8 },
    { id: 'ALL_STU', name: 'All Students', type: 'all', count: 1200 },
  ];

  useEffect(() => {
    if (replyTo) {
      setMessageData({
        ...messageData,
        subject: `Re: ${replyTo.subject}`,
        recipients: [replyTo.sender],
      });
    } else if (forwardFrom) {
      setMessageData({
        ...messageData,
        subject: `Fwd: ${forwardFrom.subject}`,
        body: `\n\n--- Forwarded message ---\nFrom: ${forwardFrom.sender.name}\nDate: ${forwardFrom.timestamp}\nSubject: ${forwardFrom.subject}\n\n${forwardFrom.body}`,
      });
    }
  }, [replyTo, forwardFrom]);

  const handleInputChange = (field, value) => {
    setMessageData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecipientSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = [
      ...mockUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.id.toLowerCase().includes(query.toLowerCase())
      ),
      ...mockGroups.filter(group =>
        group.name.toLowerCase().includes(query.toLowerCase())
      ),
    ];

    setSearchResults(results.slice(0, 5));
  };

  const addRecipient = (recipient) => {
    if (!recipients.some(r => r.id === recipient.id)) {
      setRecipients([...recipients, recipient]);
    }
    setShowRecipientSearch(false);
    setSearchResults([]);
  };

  const removeRecipient = (recipientId) => {
    setRecipients(recipients.filter(r => r.id !== recipientId));
  };

  const addAttachment = (file) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert(t('messaging.fileTooLarge'));
      return;
    }
    
    const newAttachment = {
      id: Date.now(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      file,
    };
    
    setAttachments([...attachments, newAttachment]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(attachments.filter(a => a.id !== attachmentId));
  };

  const addTag = (tag) => {
    if (!messageData.tags.includes(tag) && messageData.tags.length < 5) {
      setMessageData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove) => {
    setMessageData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSend = async () => {
    if (!messageData.subject.trim()) {
      alert(t('messaging.subjectRequired'));
      return;
    }
    
    if (!messageData.body.trim()) {
      alert(t('messaging.bodyRequired'));
      return;
    }
    
    if (recipients.length === 0) {
      alert(t('messaging.recipientRequired'));
      return;
    }

    setSending(true);
    try {
      const message = {
        ...messageData,
        recipients,
        attachments,
        sentAt: new Date().toISOString(),
        id: Date.now(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSend(message);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t('messaging.sendFailed'));
    } finally {
      setSending(false);
    }
  };

  const saveDraft = async () => {
    setSavingDraft(true);
    try {
      const draft = {
        ...messageData,
        recipients,
        attachments,
        savedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(t('messaging.draftSaved'));
    } catch (error) {
      console.error('Error saving draft:', error);
      alert(t('messaging.saveFailed'));
    } finally {
      setSavingDraft(false);
    }
  };

  const resetForm = () => {
    setMessageData({
      subject: '',
      body: '',
      category: 'general',
      priority: 'medium',
      scheduleSend: false,
      sendDate: '',
      sendTime: '',
      requireConfirmation: false,
      allowReply: true,
      confidential: false,
      tags: [],
    });
    setRecipients([]);
    setAttachments([]);
  };

  const formatFileType = (type) => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('image')) return 'Image';
    if (type.includes('video')) return 'Video';
    if (type.includes('audio')) return 'Audio';
    return 'File';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('messaging.newMessage')}
      size="xl"
    >
      <div className="space-y-6">
        {/* Recipients */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('messaging.to')} *
          </label>
          <div className="space-y-3">
            {/* Selected Recipients */}
            <div className="flex flex-wrap gap-2 mb-2">
              {recipients.map(recipient => (
                <div
                  key={recipient.id}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>{recipient.name}</span>
                  <button
                    onClick={() => removeRecipient(recipient.id)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Recipient Search */}
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('messaging.searchRecipients')}
                  onChange={(e) => handleRecipientSearch(e.target.value)}
                  onFocus={() => setShowRecipientSearch(true)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={() => setShowRecipientSearch(!showRecipientSearch)}
                  variant="outline"
                  className="px-4"
                >
                  <Users className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Results */}
              {showRecipientSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {/* Quick Groups */}
                  <div className="p-3 border-b">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">
                      {t('messaging.quickGroups')}
                    </h4>
                    <div className="space-y-1">
                      {mockGroups.map(group => (
                        <button
                          key={group.id}
                          onClick={() => addRecipient(group)}
                          className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{group.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{group.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Individual Users */}
                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">
                      {t('messaging.individuals')}
                    </h4>
                    <div className="space-y-1">
                      {searchResults.length > 0 ? (
                        searchResults.map(user => (
                          <button
                            key={user.id}
                            onClick={() => addRecipient(user)}
                            className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-50 rounded"
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-gray-500">
                                {user.type} • {user.grade || user.subject || user.child}
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-sm text-gray-500">
                          {t('messaging.noResults')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('messaging.subject')} *
          </label>
          <input
            type="text"
            value={messageData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder={t('messaging.enterSubject')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category & Priority */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('messaging.category')}
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleInputChange('category', category.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    messageData.category === category.id
                      ? `${category.color} font-medium`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('messaging.priority')}
            </label>
            <div className="flex gap-2">
              {priorities.map(priority => (
                <button
                  key={priority.id}
                  onClick={() => handleInputChange('priority', priority.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    messageData.priority === priority.id
                      ? `${priority.color} font-medium`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {priority.icon}
                  {priority.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('messaging.message')} *
          </label>
          
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-gray-100 rounded-t-lg border border-gray-300">
            <button className="p-1.5 hover:bg-gray-200 rounded" title={t('messaging.bold')}>
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title={t('messaging.italic')}>
              <Italic className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title={t('messaging.bulletList')}>
              <List className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title={t('messaging.insertLink')}>
              <Link className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded" title={t('messaging.insertImage')}>
              <Image className="w-4 h-4" />
            </button>
            <div className="flex-1"></div>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {showAdvanced ? t('messaging.simple') : t('messaging.advanced')}
            </button>
          </div>
          
          <textarea
            value={messageData.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder={t('messaging.typeYourMessage')}
            rows="8"
            className="w-full px-4 py-3 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{t('messaging.advancedOptions')}</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Schedule Send */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={messageData.scheduleSend}
                    onChange={(e) => handleInputChange('scheduleSend', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">{t('messaging.scheduleSend')}</span>
                </label>
                
                {messageData.scheduleSend && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={messageData.sendDate}
                      onChange={(e) => handleInputChange('sendDate', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="time"
                      value={messageData.sendTime}
                      onChange={(e) => handleInputChange('sendTime', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('messaging.tags')}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {messageData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder={t('messaging.addTags')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      addTag(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={messageData.requireConfirmation}
                  onChange={(e) => handleInputChange('requireConfirmation', e.target.checked)}
                  className="rounded"
                />
                <div>
                  <span className="text-sm font-medium">{t('messaging.requireConfirmation')}</span>
                  <p className="text-xs text-gray-600">{t('messaging.confirmationDesc')}</p>
                </div>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={messageData.allowReply}
                  onChange={(e) => handleInputChange('allowReply', e.target.checked)}
                  className="rounded"
                />
                <div>
                  <span className="text-sm font-medium">{t('messaging.allowReply')}</span>
                  <p className="text-xs text-gray-600">{t('messaging.replyDesc')}</p>
                </div>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={messageData.confidential}
                  onChange={(e) => handleInputChange('confidential', e.target.checked)}
                  className="rounded"
                />
                <div>
                  <span className="text-sm font-medium">{t('messaging.confidential')}</span>
                  <p className="text-xs text-gray-600">{t('messaging.confidentialDesc')}</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            {t('messaging.attachments')}
          </label>
          
          {/* Attachment List */}
          {attachments.length > 0 && (
            <div className="mb-4 space-y-2">
              {attachments.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-sm text-gray-600">
                        {attachment.size} • {formatFileType(attachment.type)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* File Upload */}
          <div className="relative">
            <input
              type="file"
              multiple
              onChange={(e) => {
                Array.from(e.target.files).forEach(file => addAttachment(file));
                e.target.value = '';
              }}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  {t('messaging.dropOrClick')}
                </p>
                <p className="text-xs text-gray-600">
                  {t('messaging.maxFileSize')}: 10MB
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            <Button
              onClick={saveDraft}
              disabled={savingDraft}
              variant="outline"
            >
              {savingDraft ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {t('messaging.saveDraft')}
                </>
              )}
            </Button>
            
            <Button
              onClick={() => {
                resetForm();
                onClose();
              }}
              variant="outline"
            >
              {t('messaging.discard')}
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
            >
              {t('messaging.cancel')}
            </Button>
            
            <Button
              onClick={handleSend}
              disabled={sending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {sending ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {t('messaging.send')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MessageComposer;