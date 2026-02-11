import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
    label: string;
    value: string;
    onChange: (date: string) => void;
    required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, required }) => {
    const { core } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    
    // Initialize viewDate with value or current date. Fix timezone offset by using parts.
    const [viewDate, setViewDate] = useState(() => {
        if (value) {
             const [y, m, d] = value.split('-').map(Number);
             return new Date(y, m - 1, d);
        }
        return new Date();
    });
    const containerRef = useRef<HTMLDivElement>(null);

    const accentBg = core === 'MOTOS' ? 'bg-red-600' : 'bg-blue-600';
    const hoverBg = core === 'MOTOS' ? 'hover:bg-red-50 dark:hover:bg-red-900/30' : 'hover:bg-blue-50 dark:hover:bg-blue-900/30';

    // Update view when modal opens or value changes externally
    useEffect(() => {
        if (value) {
             const [y, m, d] = value.split('-').map(Number);
             setViewDate(new Date(y, m - 1, d));
        }
    }, [isOpen, value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const calendarData = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        // Empty slots for prev month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    }, [viewDate]);

    const handleSelectDay = (day: number) => {
        const year = viewDate.getFullYear();
        const month = String(viewDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        onChange(`${year}-${month}-${dayStr}`);
        setIsOpen(false);
    };

    const changeMonth = (increment: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + increment, 1));
    };

    const monthName = viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    const formattedDate = value ? new Date(value.split('-').join('/')).toLocaleDateString('pt-BR') : '';

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-slate-200 transition-colors hover:border-slate-300 dark:hover:border-slate-500"
            >
                <span className={!value ? 'text-slate-400' : ''}>{formattedDate || 'Selecione a data'}</span>
                <CalendarIcon size={18} className="text-slate-400" />
            </div>

            {/* Hidden native input for required validation if needed */}
            {required && <input type="text" className="sr-only" required value={value} onChange={() => {}} />}

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 w-[280px] animate-scale-in">
                    <div className="flex items-center justify-between mb-4">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold text-slate-800 dark:text-white capitalize text-sm">{monthName}</span>
                        <button type="button" onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-7 mb-2">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                            <div key={d} className="text-center text-xs font-bold text-slate-400">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarData.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} />;
                            
                            // Check if selected
                            const isSelected = value && 
                                parseInt(value.split('-')[2]) === day && 
                                parseInt(value.split('-')[1]) === viewDate.getMonth() + 1 &&
                                parseInt(value.split('-')[0]) === viewDate.getFullYear();

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleSelectDay(day)}
                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                                        ${isSelected 
                                            ? `${accentBg} text-white` 
                                            : `text-slate-700 dark:text-slate-200 ${hoverBg}`
                                        }
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};