import React, { useState, useMemo } from 'react';
import {
  ChevronUp, ChevronDown, Filter, MoreVertical, Download,
  Printer, Eye, Edit, Trash2, Copy, Share2, RefreshCw,
  Search, X, CheckCircle, AlertCircle, Clock, Star,
  Users, TrendingUp, TrendingDown, Hash, ChevronLeft,
  ChevronRight, Calendar, FileText, BookOpen, User,
  Award, Target, BarChart3, MessageSquare, Bookmark,
  CheckSquare, Square
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectChange,
  sortable = false,
  onSort,
  sortColumn,
  sortDirection,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  searchable = false,
  onSearch,
  actions = [],
  bulkActions = [],
  className = '',
  striped = true,
  hoverable = true,
  compact = false,
  bordered = false,
  showHeader = true,
  showFooter = false,
  footerContent,
  rowClassName,
  cellClassName,
  headerClassName,
  title,
  subtitle,
  showStats = false,
  exportable = false,
  onExport,
  refreshable = false,
  onRefresh,
  filterable = false,
  onFilter,
  initialFilters = {},
  customFilters,
  showSelectionInfo = true,
  showActionsColumn = true,
  virtualized = false,
  estimatedRowHeight = 52,
  ...props
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [columnVisibility, setColumnVisibility] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  const visibleColumns = useMemo(() => 
    columns.filter(col => columnVisibility[col.key]),
    [columns, columnVisibility]
  );

  const filteredData = useMemo(() => {
    if (!searchQuery && Object.keys(filters).length === 0) return data;
    
    return data.filter(item => {
      if (searchQuery) {
        const matchesSearch = columns.some(col => {
          const value = String(item[col.key] || '').toLowerCase();
          return value.includes(searchQuery.toLowerCase());
        });
        if (!matchesSearch) return false;
      }

      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return String(item[key] || '') === String(value);
      });
    });
  }, [data, searchQuery, filters, columns]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize, pagination]);

  const handleSelectAll = (e) => {
    if (!selectable || !onSelectChange) return;
    
    if (e.target.checked) {
      const allIds = filteredData.map(item => item.id);
      onSelectChange(allIds);
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectRow = (id) => {
    if (!selectable || !onSelectChange) return;
    
    const newSelected = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    onSelectChange(newSelected);
  };

  const handleSort = (columnKey) => {
    if (!sortable || !onSort) return;
    
    const newDirection = 
      sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleBulkAction = (action) => {
    if (action.onClick && selectedRows.length > 0) {
      action.onClick(selectedRows);
    }
    setSelectedAction(null);
  };

  const handleExport = (format) => {
    if (onExport) {
      onExport(format, filteredData);
    }
  };

  const toggleRowExpand = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleColumnVisibility = (columnKey) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-400 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600 animate-pulse" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600 animate-pulse" />
    );
  };

  const getCellContent = (item, column) => {
    if (column.render) {
      return column.render(item, column);
    }

    const value = item[column.key];
    
    if (value === undefined || value === null) {
      return column.placeholder || '-';
    }

    switch (column.format) {
      case 'date':
        return new Date(value).toLocaleDateString('en-ET', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      
      case 'datetime':
        return new Date(value).toLocaleString('en-ET', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      
      case 'currency':
        return new Intl.NumberFormat('am-ET', {
          style: 'currency',
          currency: 'ETB',
          minimumFractionDigits: 2
        }).format(value);
      
      case 'percentage':
        return (
          <span className={`font-semibold ${value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {value}%
          </span>
        );
      
      case 'status':
        const statusConfig = {
          active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: t('active') },
          pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: t('pending') },
          inactive: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: t('inactive') },
          success: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: t('success') },
          warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: t('warning') },
          error: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: t('error') },
          completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: t('completed') },
          submitted: { color: 'bg-purple-100 text-purple-800', icon: FileText, label: t('submitted') },
          graded: { color: 'bg-indigo-100 text-indigo-800', icon: Award, label: t('graded') }
        };
        
        const config = statusConfig[value] || { color: 'bg-gray-100 text-gray-800', icon: Hash, label: value };
        const Icon = config.icon;
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </span>
        );
      
      case 'badge':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {value}
          </span>
        );
      
      case 'progress':
        return (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>{value}%</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        );
      
      case 'rating':
        return (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">{value}/5</span>
          </div>
        );
      
      case 'trend':
        const isPositive = value > 0;
        const IconTrend = isPositive ? TrendingUp : TrendingDown;
        
        return (
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <IconTrend className="w-4 h-4 mr-1" />
            <span>{Math.abs(value)}%</span>
          </div>
        );
      
      default:
        return value;
    }
  };

  const renderHeader = () => (
    <div className="mb-6 space-y-4">
      {(title || subtitle) && (
        <div>
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t('search') + '...'}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          )}

          {filterable && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                showFilters
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>{t('filter')}</span>
              {Object.values(filters).some(f => f && f !== 'all') && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(f => f && f !== 'all').length}
                </span>
              )}
            </button>
          )}

          {refreshable && onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              title={t('refresh')}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {showSelectionInfo && selectedRows.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-blue-700">
                {selectedRows.length} {t('selected')}
              </span>
            </div>
          )}

          {bulkActions.length > 0 && selectedRows.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setSelectedAction(!selectedAction)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>{t('actions')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {selectedAction && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    {bulkActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleBulkAction(action)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2"
                      >
                        {action.icon && <action.icon className="w-4 h-4" />}
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {exportable && (
            <div className="relative">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{t('export')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customFilters ? (
                customFilters
              ) : (
                columns
                  .filter(col => col.filterable)
                  .map(col => (
                    <div key={col.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {col.title}
                      </label>
                      <select
                        value={filters[col.key] || ''}
                        onChange={(e) => handleFilterChange(col.key, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">{t('all')}</option>
                        {col.filterOptions?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderTable = () => (
    <div className={`overflow-hidden ${bordered ? 'border border-gray-200' : ''} rounded-xl`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
          {showHeader && (
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                {selectable && (
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                    </div>
                  </th>
                )}
                
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${headerClassName}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.title}</span>
                      {sortable && column.sortable !== false && (
                        <button
                          onClick={() => handleSort(column.key)}
                          className="p-1 hover:bg-white rounded transition-colors duration-200"
                        >
                          {getSortIcon(column.key)}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                
                {showActionsColumn && (actions.length > 0 || props.onRowExpand) && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                )}
              </tr>
            </thead>
          )}
          
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index}>
                  {selectable && (
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                  {showActionsColumn && (
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                    </td>
                  )}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={(selectable ? 1 : 0) + visibleColumns.length + (showActionsColumn ? 1 : 0)}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <Search className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-500 text-lg">{emptyMessage}</p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {t('clear_search')}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <React.Fragment key={item.id || index}>
                  <tr
                    className={`
                      ${striped && index % 2 === 0 ? 'bg-gray-50' : ''}
                      ${hoverable ? 'hover:bg-blue-50 transition-colors duration-150' : ''}
                      ${selectedRows.includes(item.id) ? 'bg-blue-50 ring-2 ring-blue-200' : ''}
                      ${rowClassName ? rowClassName(item) : ''}
                    `}
                  >
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleSelectRow(item.id)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                      </td>
                    )}
                    
                    {visibleColumns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${cellClassName || ''} ${
                          column.className ? column.className(item) : ''
                        }`}
                        onClick={onRowClick ? () => onRowClick(item) : undefined}
                      >
                        <div className={onRowClick ? 'cursor-pointer' : ''}>
                          {getCellContent(item, column)}
                        </div>
                      </td>
                    ))}
                    
                    {showActionsColumn && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          {props.onRowExpand && (
                            <button
                              onClick={() => toggleRowExpand(item.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            >
                              {expandedRows.has(item.id) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick?.(item)}
                              className={`p-1.5 rounded transition-colors duration-200 ${
                                action.variant === 'danger'
                                  ? 'text-red-600 hover:bg-red-50'
                                  : action.variant === 'success'
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-blue-600 hover:bg-blue-50'
                              }`}
                              title={action.label}
                            >
                              {action.icon ? <action.icon className="w-4 h-4" /> : action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                  
                  {props.onRowExpand && expandedRows.has(item.id) && (
                    <tr>
                      <td
                        colSpan={(selectable ? 1 : 0) + visibleColumns.length + (showActionsColumn ? 1 : 0)}
                        className="px-6 py-4 bg-gray-50"
                      >
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {props.onRowExpand(item)}
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="mt-6">
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hash className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('total_items')}</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems || data.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('filtered_items')}</p>
                <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('selected_items')}</p>
                <p className="text-2xl font-bold text-gray-900">{selectedRows.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{t('page')}</p>
                <p className="text-2xl font-bold text-gray-900">{currentPage} / {totalPages}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showFooter && footerContent ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          {footerContent}
        </div>
      ) : null}
    </div>
  );

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;
    
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    }
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-700">
          {t('showing')}{' '}
          <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>{' '}
          {t('to')}{' '}
          <span className="font-medium">
            {Math.min(currentPage * pageSize, totalItems || data.length)}
          </span>{' '}
          {t('of')}{' '}
          <span className="font-medium">{totalItems || data.length}</span>{' '}
          {t('results')}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size} {t('per_page')}
              </option>
            ))}
          </select>
          
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {pages.map((page, index) => (
              <button
                key={index}
                onClick={() => page !== '...' && onPageChange?.(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : page === '...'
                    ? 'text-gray-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${
                currentPage === totalPages
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {renderHeader()}
      {renderTable()}
      {renderPagination()}
      {renderFooter()}
    </div>
  );
};

export default Table;