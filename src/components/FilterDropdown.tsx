import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string | null;
  label: string;
  style?: string;
  activeStyle?: string;
}

interface FilterDropdownProps {
  label: string;
  options: Option[];
  selectedValue: string | null;
  onSelect: (value: any) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selectedValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string | null) => {
    onSelect(value);
    setIsOpen(false);
  };

  const baseButtonClass = "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200 border-2 w-full flex items-center justify-between";
  const buttonStyle = selectedOption ? selectedOption.activeStyle : 'border-gray-300 dark:border-gray-600';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseButtonClass} ${buttonStyle}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="truncate min-w-0">
          <span className="font-normal opacity-80 mr-1">{label}:</span>
          {selectedOption.label}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1">
          {options.map(option => (
            <button
              key={option.value || 'all'}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                selectedValue === option.value
                  ? `font-bold ${option.activeStyle || 'bg-cyan-500 text-white'}`
                  : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;