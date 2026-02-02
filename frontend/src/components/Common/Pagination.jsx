import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronFirst, 
  ChevronLast,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showSizeChanger = true,
  showQuickJumper = false,
  showTotal = true,
  showFirstLast = true,
  showPrevNext = true,
  compact = false,
  disabled = false,
  siblingCount = 1,
  boundaryCount = 1,
  variant = 'default',
  className = '',
  ...props
}) => {
  const { t } = useTranslation();
  const [jumpToPage, setJumpToPage] = React.useState('');

  const handlePageChange = (page) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const page = parseInt(jumpToPage, 10);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpToPage('');
    }
  };

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
    
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, boundaryCount + 2);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1);

    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - boundaryCount - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, '...', ...middleRange, '...', totalPages];
    }
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const variants = {
    default: 'bg-white border-gray-200 text-gray-700',
    primary: 'bg-blue-50 border-blue-200 text-blue-700',
    secondary: 'bg-gray-50 border-gray-200 text-gray-700',
    minimal: 'bg-transparent border-transparent text-gray-700'
  };

  const buttonVariants = {
    default: 'hover:bg-gray-50',
    primary: 'hover:bg-blue-100',
    secondary: 'hover:bg-gray-100',
    minimal: 'hover:bg-gray-50'
  };

  const activeButtonVariants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    minimal: 'bg-blue-600 text-white hover:bg-blue-700'
  };

  if (totalPages <= 1 && !showSizeChanger && !showTotal) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}
    >
      {showTotal && totalItems > 0 && (
        <div className="text-sm text-gray-600">
          {t('showing')}{' '}
          <span className="font-semibold text-gray-900">{startItem.toLocaleString()}</span>{' '}
          {t('to')}{' '}
          <span className="font-semibold text-gray-900">{endItem.toLocaleString()}</span>{' '}
          {t('of')}{' '}
          <span className="font-semibold text-gray-900">{totalItems.toLocaleString()}</span>{' '}
          {t('entries')}
        </div>
      )}

      <div className="flex items-center space-x-2">
        {showSizeChanger && (
          <div className="flex items-center space-x-2 mr-4">
            <label className="text-sm text-gray-600">{t('show')}</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              disabled={disabled}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">{t('entries')}</span>
          </div>
        )}

        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            className={`p-2 rounded-lg border ${
              disabled || currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : `border-gray-300 ${buttonVariants[variant]} text-gray-700`
            }`}
            aria-label={t('first_page')}
          >
            <ChevronFirst className="w-4 h-4" />
          </button>
        )}

        {showPrevNext && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            className={`p-2 rounded-lg border ${
              disabled || currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : `border-gray-300 ${buttonVariants[variant]} text-gray-700`
            }`}
            aria-label={t('previous_page')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center space-x-1">
          <AnimatePresence mode="wait">
            {pageNumbers?.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                ) : (
                  <motion.button
                    key={page}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={() => handlePageChange(page)}
                    disabled={disabled}
                    className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      currentPage === page
                        ? activeButtonVariants[variant]
                        : `border-gray-300 ${buttonVariants[variant]} text-gray-700`
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={t('page')} ${page}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </motion.button>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </div>

        {showPrevNext && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            className={`p-2 rounded-lg border ${
              disabled || currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : `border-gray-300 ${buttonVariants[variant]} text-gray-700`
            }`}
            aria-label={t('next_page')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            className={`p-2 rounded-lg border ${
              disabled || currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : `border-gray-300 ${buttonVariants[variant]} text-gray-700`
            }`}
            aria-label={t('last_page')}
          >
            <ChevronLast className="w-4 h-4" />
          </button>
        )}
      </div>

      {showQuickJumper && (
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">{t('jump_to')}</label>
          <form onSubmit={handleJumpToPage} className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              disabled={disabled}
              className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              placeholder={t('page')}
            />
            <button
              type="submit"
              disabled={disabled}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('go')}
            </button>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export const PaginationCompact = (props) => (
  <Pagination
    compact
    showFirstLast={false}
    showSizeChanger={false}
    showTotal={false}
    showQuickJumper={false}
    siblingCount={0}
    boundaryCount={1}
    {...props}
  />
);

export const PaginationMini = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className={`px-4 py-2 text-sm font-medium rounded-lg ${
          disabled || currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
        }`}
      >
        {t('previous')}
      </button>
      
      <span className="text-sm text-gray-600">
        {t('page')} {currentPage} {t('of')} {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className={`px-4 py-2 text-sm font-medium rounded-lg ${
          disabled || currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
        }`}
      >
        {t('next')}
      </button>
    </div>
  );
};

export default Pagination;