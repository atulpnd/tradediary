import React, { useState, useMemo } from 'react';
import { Trade } from './types';
import { calculatePnl } from './tradeUtils';

interface CalendarPageProps {
    trades: Trade[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ trades }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const tradesByDate = useMemo(() => {
        const map = new Map<string, Trade[]>();
        trades.forEach(trade => {
            const date = trade.tradeDate.split('T')[0];
            if (!map.has(date)) {
                map.set(date, []);
            }
            map.get(date)!.push(trade);
        });
        return map;
    }, [trades]);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay(); // 0 for Sunday, 1 for Monday...
    const daysInMonth = endOfMonth.getDate();

    const calendarDays = Array.from({ length: startDay }, (_, i) => ({ day: null, key: `empty-start-${i}` }));
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push({ day, key: `day-${day}` });
    }

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-primary mb-6">Trade Calendar</h1>
            <div className="bg-brand-surface rounded-lg border border-brand-border shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="p-2 rounded-full hover:bg-brand-border">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-xl font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={nextMonth} className="p-2 rounded-full hover:bg-brand-border">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-brand-text-secondary">
                    {weekDays.map(day => <div key={day} className="p-2 font-medium">{day.toUpperCase()}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map(({day, key}) => {
                        if (!day) return <div key={key} className="border border-transparent rounded-md"></div>;

                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayTrades = tradesByDate.get(dateStr) || [];
                        const dayPnl = dayTrades.reduce((acc, trade) => acc + calculatePnl(trade), 0);

                        let pnlBgColor = '';
                        let pnlTextColor = '';
                        if (dayTrades.length > 0) {
                            if (dayPnl > 0) {
                                pnlBgColor = 'bg-brand-green/10';
                                pnlTextColor = 'text-brand-green';
                            } else if (dayPnl < 0) {
                                pnlBgColor = 'bg-brand-red/10';
                                pnlTextColor = 'text-brand-red';
                            }
                        }
                        
                        return (
                            <div key={key} className={`h-28 border border-brand-border/50 rounded-md p-1.5 flex flex-col text-left ${pnlBgColor} transition-colors hover:border-brand-border`}>
                                <span className="font-semibold text-brand-text-primary">{day}</span>
                                {dayTrades.length > 0 && (
                                    <div className="mt-1 text-xs overflow-y-auto space-y-0.5">
                                        {dayTrades.map(trade => (
                                            <div key={trade.id} className="truncate" title={`${trade.strike}: ${calculatePnl(trade).toFixed(2)}`}>
                                                {trade.strike}
                                            </div>
                                        ))}
                                        <div className={`font-bold mt-1 text-right ${pnlTextColor}`}>
                                            {dayPnl.toFixed(2)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;