import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, Search, X } from 'lucide-react';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  multiple = false,
  searchable = false,
  clearable = false,
  icon: Icon,
  className = '',
  wrapperClassName = '',
  labelClassName = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current && 
        !selectRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const selectedOption = dropdown.querySelector('[data-selected="true"]');
      if (selectedOption) {
        selectedOption.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen]);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOptions = multiple
    ? options.filter(option => value?.includes(option.value))
    : options.find(option => option.value === value);

  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = value?.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...(value || []), optionValue];
      onChange({ target: { value: newValue } });
    } else {
      onChange({ target: { value: optionValue } });
      setIsOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (multiple) {
      onChange({ target: { value: [] } });
    } else {
      onChange({ target: { value: '' } });
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case ' ':
        e.preventDefault();
        break;
    }
  };

  const getDisplayValue = () => {
    if (multiple) {
      if (!selectedOptions || selectedOptions.length === 0) {
        return placeholder;
      }
      if (selectedOptions.length <= 2) {
        return selectedOptions.map(opt => opt.label).join(', ');
      }
      return `${selectedOptions.length} selected`;
    }
    return selectedOptions?.label || placeholder;
  };

  const isSelected = (optionValue) => {
    if (multiple) {
      return value?.includes(optionValue);
    }
    return value === optionValue;
  };

  const getBorderColor = () => {
    if (error) return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    if (isOpen) return 'border-blue-500 ring-2 ring-blue-200';
    return 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
  };

  const getBackgroundColor = () => {
    if (disabled) return 'bg-gray-100 cursor-not-allowed';
    return 'bg-white cursor-pointer';
  };

  return (
    <div className={`space-y-1.5 relative ${wrapperClassName}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative" ref={selectRef}>
        {/* Select Box */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          className={`
            w-full rounded-xl border transition-all
            ${getBorderColor()}
            ${getBackgroundColor()}
            ${Icon ? 'pl-10' : 'pl-4'}
            ${clearable || isOpen ? 'pr-10' : 'pr-4'}
            py-3
            ${disabled ? 'opacity-60' : ''}
            ${className}
          `}
          {...props}
        >
          {/* Icon */}
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Icon className="w-5 h-5" />
            </div>
          )}

          {/* Display Value */}
          <div className="flex items-center justify-between">
            <span className={`truncate ${!selectedOptions || (multiple && selectedOptions.length === 0) ? 'text-gray-400' : 'text-gray-900'}`}>
              {getDisplayValue()}
            </span>

            {/* Selected Tags for Multiple */}
            {multiple && selectedOptions && selectedOptions.length > 0 && (
              <div className="flex items-center gap-1 ml-2">
                {selectedOptions.slice(0, 2).map(option => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option.value);
                      }}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedOptions.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{selectedOptions.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Chevron */}
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Clear Button */}
        {clearable && value && (multiple ? value.length > 0 : value) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 max-h-64 overflow-hidden"
          >
            {/* Search Input */}
            {searchable && (
              <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto max-h-56">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const selected = isSelected(option.value);
                  const highlighted = index === highlightedIndex;

                  return (
                    <div
                      key={option.value}
                      data-selected={selected}
                      onClick={() => handleSelect(option.value)}
                      className={`
                        flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
                        ${highlighted ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        ${selected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="flex items-center gap-3">
                        {/* Checkbox for multiple select */}
                        {multiple && (
                          <div className={`
                            w-4 h-4 border rounded flex items-center justify-center
                            ${selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
                          `}>
                            {selected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        )}

                        {/* Option Icon */}
                        {option.icon && (
                          <div className="text-gray-400">
                            <option.icon className="w-4 h-4" />
                          </div>
                        )}

                        {/* Option Content */}
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-sm text-gray-500">{option.description}</div>
                          )}
                        </div>
                      </div>

                      {/* Single select checkmark */}
                      {!multiple && selected && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}

                      {/* Badge */}
                      {option.badge && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          option.badgeColor === 'red' ? 'bg-red-100 text-red-800' :
                          option.badgeColor === 'green' ? 'bg-green-100 text-green-800' :
                          option.badgeColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {option.badge}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected Count for Multiple */}
            {multiple && selectedOptions && selectedOptions.length > 0 && (
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {selectedOptions.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange({ target: { value: [] } })}
                    className="text-red-600 hover:text-red-800"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper Text & Error */}
      {(helperText || error) && (
        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;