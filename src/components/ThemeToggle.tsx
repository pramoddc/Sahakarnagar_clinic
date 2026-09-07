import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  variant?: 'compact' | 'detailed' | 'dropdown';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'detailed', className = '' }) => {
  const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Options list
  const options: { mode: ThemeMode; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      mode: 'light',
      label: 'Daylight Mode',
      desc: 'Standard daylight contrast for reception & offices',
      icon: Sun
    },
    {
      mode: 'dark',
      label: 'Low-Light Clinic',
      desc: 'Eye-strain relief for exam bays & night charting',
      icon: Moon
    },
    {
      mode: 'system',
      label: 'System Default',
      desc: 'Sync with operating system preference',
      icon: Laptop
    }
  ];

  if (variant === 'compact') {
    return (
      <button
        type="button"
        id="theme-toggle-compact"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'Daylight Light' : 'Low-Light Clinic Dark'} Mode`}
        title={`Currently in ${isDark ? 'Low-Light Clinic' : 'Daylight'} Mode. Click to switch.`}
        className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center border ${
          isDark
            ? 'bg-stone-800 border-stone-700 text-amber-300 hover:bg-stone-700 hover:text-amber-200'
            : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
        } ${className}`}
      >
        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-700" />}
      </button>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div className="flex items-center space-x-1">
        {/* Direct One-Click Toggle Button */}
        <button
          type="button"
          id="theme-toggle-main"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'Daylight Light' : 'Low-Light Clinic Dark'} Mode`}
          title="Click to toggle light/dark modes directly"
          className={`group flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border shadow-xs cursor-pointer ${
            isDark
              ? 'bg-stone-800/90 hover:bg-stone-800 text-stone-200 border-stone-700 hover:border-amber-500/50'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover:rotate-12 duration-200" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-600 transition-transform group-hover:rotate-45 duration-200" />
            )}
          </div>
          <span className="hidden sm:inline font-medium">
            {isDark ? 'Low-Light Clinic' : 'Daylight'}
          </span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
              isDark
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}
          >
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Dropdown Opener for explicit selection */}
        <button
          type="button"
          id="theme-toggle-options-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Theme mode options"
          aria-expanded={isOpen}
          className={`p-1.5 rounded-lg transition-colors border shadow-xs cursor-pointer ${
            isDark
              ? 'bg-stone-800/90 text-stone-400 hover:text-stone-200 border-stone-700 hover:bg-stone-700'
              : 'bg-stone-50 text-stone-500 hover:text-stone-800 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          id="theme-dropdown-menu"
          className={`absolute right-0 mt-2 w-72 rounded-2xl border shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md ${
            isDark
              ? 'bg-stone-900/95 border-stone-700 text-stone-100'
              : 'bg-white/95 border-stone-200 text-stone-900'
          }`}
        >
          <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800 mb-1">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Clinical Display Mode
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
              Adjust lighting contrast to suit electrotherapy bays or bright desk lighting.
            </p>
          </div>

          <div className="space-y-1">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.mode;
              return (
                <button
                  key={opt.mode}
                  id={`theme-opt-${opt.mode}`}
                  type="button"
                  onClick={() => {
                    setTheme(opt.mode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start space-x-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-teal-950/60 border border-teal-700/50 text-teal-100'
                        : 'bg-teal-50 border border-teal-200 text-teal-900'
                      : isDark
                      ? 'hover:bg-stone-800/80 text-stone-300 hover:text-stone-100'
                      : 'hover:bg-stone-50 text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                      isSelected
                        ? isDark
                          ? 'bg-teal-800 text-teal-200'
                          : 'bg-teal-700 text-white'
                        : isDark
                        ? 'bg-stone-800 text-stone-400'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{opt.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 ml-1.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 px-3 py-1 flex items-center justify-between text-[10px] text-stone-400">
            <span>Status: <strong className="text-stone-700 dark:text-stone-300">{resolvedTheme === 'dark' ? 'Low-Light Active' : 'Daylight Active'}</strong></span>
            <span>Shortcut: Click toggle button anytime</span>
          </div>
        </div>
      )}
    </div>
  );
};
