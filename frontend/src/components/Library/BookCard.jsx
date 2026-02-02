import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Star, Eye, Download, Share2, Heart, Bookmark, MoreVertical, Clock, Hash, User, Calendar, FileText } from 'lucide-react';

const BookCard = ({ book, viewMode, onRead, onDownload, onShare, onLike, onBookmark, onClick }) => {
  const { t } = useTranslation();

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'mathematics': return <Hash className="w-4 h-4" />;
      case 'science': return <FileText className="w-4 h-4" />;
      case 'literature': return <BookOpen className="w-4 h-4" />;
      case 'history': return <Calendar className="w-4 h-4" />;
      case 'languages': return <User className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'mathematics': return 'bg-blue-100 text-blue-700';
      case 'science': return 'bg-green-100 text-green-700';
      case 'literature': return 'bg-purple-100 text-purple-700';
      case 'history': return 'bg-yellow-100 text-yellow-700';
      case 'languages': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatReads = (reads) => {
    if (reads >= 1000) return `${(reads / 1000).toFixed(1)}K`;
    return reads.toString();
  };

  const renderGridCard = () => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300 group">
      {/* Book Cover */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={book.thumbnail}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {book.isNew && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              {t('library.new')}
            </span>
          )}
          {book.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
              {t('library.featured')}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {book.readingProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${book.readingProgress}%` }}
            ></div>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRead();
              }}
              className="p-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              title={t('library.read')}
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="p-3 bg-white text-green-600 rounded-full hover:bg-green-50 transition-colors"
              title={t('library.download')}
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category and Grade */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getCategoryColor(book.category)}`}>
              {getCategoryIcon(book.category)}
              {t(`library.${book.category}`)}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              G{book.grade}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <Bookmark className={`w-5 h-5 ${book.isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </button>
        </div>

        {/* Title and Author */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-1 flex items-center gap-1">
          <User className="w-3 h-3" />
          {book.author}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900">{book.rating}</span>
              <span className="text-xs text-gray-500">({book.reviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{formatReads(book.reads)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {book.pages}p
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={`flex items-center gap-1 text-sm transition-colors ${
              book.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${book.isLiked ? 'fill-current' : ''}`} />
            <span>{t('library.like')}</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('library.share')}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderListCard = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group">
      <div className="flex gap-6">
        {/* Book Cover */}
        <div className="relative flex-shrink-0">
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-32 h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />
          {book.readingProgress > 0 && (
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${book.readingProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h3>
                {book.isNew && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    {t('library.new')}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                {book.author}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bookmark className={`w-5 h-5 ${book.isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4 line-clamp-2">
            {book.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 ${getCategoryColor(book.category)}`}>
              {getCategoryIcon(book.category)}
              {t(`library.${book.category}`)}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              Grade {book.grade}
            </span>
            {book.stream && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                {book.stream}
              </span>
            )}
            {book.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-gray-900">{book.rating}</span>
                <span className="text-sm text-gray-500">({book.reviews} {t('library.reviews')})</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{formatReads(book.reads)} {t('library.reads')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{book.pages} {t('library.pages')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  book.isLiked ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${book.isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRead();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                {t('library.read')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('library.download')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div onClick={onClick} className="cursor-pointer">
      {viewMode === 'grid' ? renderGridCard() : renderListCard()}
    </div>
  );
};

export default BookCard;