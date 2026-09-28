import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';

interface PaymentMethodDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: any[];
  className?: string;
}

export const PaymentMethodDropdown: React.FC<PaymentMethodDropdownProps> = ({ value, onChange, options, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const currentOption = options.find((m) => m.id === value) || options[0];
  const displayLabel = currentOption ? `${currentOption.label} ${currentOption.type ? `(${currentOption.type})` : ''} ${currentOption.actionMeta ? `— [${currentOption.actionMeta.shortBadge}]` : ''}` : 'পেমেন্ট মাধ্যম নির্বাচন করুন';

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#00732A] focus:outline-none font-bold text-slate-800 bg-white cursor-pointer flex justify-between items-center"
      >
        <span className="truncate pr-2 flex items-center gap-2">
          {currentOption?.isLimitOut && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          {displayLabel}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map((m) => {
              const isSelected = value === m.id;
              
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    onChange(m.id);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-3 text-xs sm:text-sm rounded-lg cursor-pointer transition-colors flex flex-col gap-1 mb-1 ${
                    isSelected 
                      ? 'bg-emerald-50 border border-emerald-100' 
                      : 'hover:bg-slate-50 border border-transparent'
                  } ${m.isLimitOut ? 'opacity-80' : ''}`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2 text-slate-800">
                      {m.color && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />}
                      <span>{m.label} {m.type ? `(${m.type})` : ''}</span>
                    </div>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#00732A]" />}
                  </div>
                  
                  <div className="flex items-center gap-2 pl-4.5 flex-wrap">
                    {m.actionMeta && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${m.actionMeta.tagBg}`}>
                        {m.actionMeta.shortBadge}
                      </span>
                    )}
                    {m.isLimitOut && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        সীমা শেষ - গ্রহণযোগ্য নয়
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
