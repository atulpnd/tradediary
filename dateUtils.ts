import { DateFilter } from './types';

export const getDateRange = (filter: DateFilter): { start: Date; end: Date } | null => {
  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);

  // Function to set time to the start of the day
  const setStartOfDay = (date: Date) => date.setHours(0, 0, 0, 0);
  
  // Function to set time to the end of the day
  const setEndOfDay = (date: Date) => date.setHours(23, 59, 59, 999);

  switch (filter) {
    case 'today':
      setStartOfDay(start);
      setEndOfDay(end);
      return { start, end };

    case 'yesterday':
      start.setDate(now.getDate() - 1);
      end.setDate(now.getDate() - 1);
      setStartOfDay(start);
      setEndOfDay(end);
      return { start, end };

    case 'this-wk':
      const firstDayOfWeek = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1); // Assuming Monday is the first day
      start.setDate(firstDayOfWeek);
      end.setDate(firstDayOfWeek + 6);
      setStartOfDay(start);
      setEndOfDay(end);
      return { start, end };
      
    case 'last-wk':
      const firstDayOfLastWeek = now.getDate() - now.getDay() - 6;
      start.setDate(firstDayOfLastWeek);
      end.setDate(firstDayOfLastWeek + 6);
      setStartOfDay(start);
      setEndOfDay(end);
      return { start, end };

    case 'this-mo':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartOfDay(start);
      setEndOfDay(end);
      return { start, end };

    case 'last-mo':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      setStartOfDay(start);
      setEndOfDay(end);
      return { start, end };

    case 'last-3-mo':
        start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        setStartOfDay(start);
        setEndOfDay(end);
        return { start, end };

    case 'this-yr':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
      setStartOfDay(start);
      setEndOfDay(end);
      return { start, end };

    case 'last-yr':
      start = new Date(now.getFullYear() - 1, 0, 1);
      end = new Date(now.getFullYear() - 1, 11, 31);
      setStartOfDay(start);
      setEndOfDay(end);
      return { start, end };

    case 'all':
    default:
      return null;
  }
};