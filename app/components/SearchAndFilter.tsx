"use client";

import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: Array<{
    key: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  }>;
  placeholder?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filters = [],
  placeholder = "Search...",
  showClearButton = true,
  onClear
}) => {
  const handleClear = () => {
    onSearchChange('');
    filters.forEach(filter => filter.onChange('all'));
    onClear?.();
  };

  const hasActiveFilters = searchTerm || filters.some(filter => filter.value !== 'all');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {filters.map((filter) => (
          <div key={filter.key} className="flex items-center gap-2">
            <FaFilter className="text-gray-400 text-sm" />
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Clear Button */}
        {showClearButton && hasActiveFilters && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <FaTimes className="text-xs" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <FaTimes className="text-xs" />
              </button>
            </span>
          )}
          {filters.map((filter) => {
            if (filter.value !== 'all') {
              const selectedOption = filter.options.find(opt => opt.value === filter.value);
              return (
                <span key={filter.key} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {filter.label}: {selectedOption?.label}
                  <button
                    onClick={() => filter.onChange('all')}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;