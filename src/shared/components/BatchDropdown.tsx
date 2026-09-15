import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface BatchDropdownProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

const enToBnNumber = (en: number | string) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(en).split('').map(d => /\d/.test(d) ? bnDigits[Number(d)] : d).join('');
};

const generateBatchOptions = () => {
  const options = [];
  for (let year = 2026; year >= 1913; year--) {
    options.push(year);
  }
  return options;
};

export const BatchDropdown: React.FC<BatchDropdownProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => generateBatchOptions(), []);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(year => {
      // Allow searching by english number (e.g. 23 for 2023) or bengali number
      const engStr = String(year);
      const benStr = enToBnNumber(year);
      return engStr.includes(searchTerm) || benStr.includes(searchTerm);
    });
  }, [searchTerm, options]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearchTerm(''); // Reset search when closed
    }
  }, [isOpen]);

  const displayValue = value || 'ব্যাচ নির্বাচন করুন';

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none font-bold bg-white cursor-pointer flex justify-between items-center"
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400 font-normal'}>{displayValue}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-slate-100 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="সাল খুঁজুন (যেমন: 23 বা 2023)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00732A]/20 focus:border-[#00732A]"
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(year => {
                const optValue = `ব্যাচ ${enToBnNumber(year)}`;
                const isSelected = value === optValue;
                
                return (
                  <div
                    key={year}
                    onClick={() => {
                      onChange(optValue);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2.5 text-xs sm:text-sm rounded-lg cursor-pointer transition-colors font-medium flex items-center justify-between ${
                      isSelected 
                        ? 'bg-emerald-50 text-[#00732A]' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>ব্যাচ {enToBnNumber(year)} ({year})</span>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#00732A]" />}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-slate-500">
                কোনো ব্যাচ পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
