import React, { useState, useMemo } from 'react';
import { Trade, OptionsTradeType } from './types';
import ReportsTable from './ReportsTable';
import { calculatePnl, calculateLegPnl, calculateSl, getTradeDay } from './tradeUtils';

interface ReportsPageProps {
  trades: Trade[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ trades }) => {
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState<'all' | OptionsTradeType>('all');

  const currentMonthTrades = useMemo(() => {
    const now = new Date();
    // Use UTC to avoid timezone issues with date boundaries
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    return trades.filter(trade => {
        const [year, month, day] = trade.tradeDate.split('-').map(Number);
        const tradeDateUTC = new Date(Date.UTC(year, month - 1, day));
        return tradeDateUTC >= startOfMonth && tradeDateUTC <= endOfMonth;
    });
  }, [trades]);

  const filteredTrades = useMemo(() => {
    const searchText = filterText.toLowerCase();
    return currentMonthTrades.filter(trade => {
      const typeMatches = filterType === 'all' || trade.type === filterType;
      
      const textMatches =
        !searchText ||
        String(trade.strike).toLowerCase().includes(searchText) ||
        trade.notes?.toLowerCase().includes(searchText);

      return typeMatches && textMatches;
    });
  }, [currentMonthTrades, filterText, filterType]);

  const exportToCsv = () => {
    if (filteredTrades.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = [
      'Trade Date', 'Trade Day', 'Strike', 'Quantity', 'Total PNL',
      'CE Entry', 'CE Exit', 'CE SL', 'CE Entry Time', 'CE Exit Time', 'CE PNL',
      'PE Entry', 'PE Exit', 'PE Entry Time', 'PE Exit Time', 'PE SL', 'PE PNL',
      'Notes'
    ];
    
    const escapeCsvCell = (cell: string | number | undefined) => {
        const cellStr = String(cell ?? '');
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
    };

    const csvRows = [
      headers.join(','),
      ...filteredTrades.map(trade =>
        [
          trade.tradeDate,
          getTradeDay(trade.tradeDate),
          trade.strike,
          trade.quantity,
          calculatePnl(trade).toFixed(2),
          trade.ceEntryPrice,
          trade.ceExitPrice,
          calculateSl(trade.ceEntryPrice).toFixed(2),
          trade.ceEntryTime,
          trade.ceExitTime,
          calculateLegPnl(trade.ceEntryPrice, trade.ceExitPrice, trade.quantity, trade.type).toFixed(2),
          trade.peEntryPrice,
          trade.peExitPrice,
          trade.peEntryTime,
          trade.peExitTime,
          calculateSl(trade.peEntryPrice).toFixed(2),
          calculateLegPnl(trade.peEntryPrice, trade.peExitPrice, trade.quantity, trade.type).toFixed(2),
          escapeCsvCell(trade.notes)
        ].join(',')
      ),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'trade_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-primary mb-6">Reports</h1>
      
      <div className="bg-brand-surface p-4 rounded-lg border border-brand-border shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="filterText" className="block text-sm font-medium text-brand-text-secondary mb-1">
              Search by Strike or Notes
            </label>
            <input
              id="filterText"
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="e.g., 19000 or volatility"
              className="w-full bg-brand-bg border border-brand-border rounded-md shadow-sm p-2 focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>
          <div>
            <label htmlFor="filterType" className="block text-sm font-medium text-brand-text-secondary mb-1">
              Filter by Trade Type
            </label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | OptionsTradeType)}
              className="w-full bg-brand-bg border border-brand-border rounded-md shadow-sm p-2 focus:ring-brand-blue focus:border-brand-blue"
            >
              <option value="all">All Types</option>
              <option value={OptionsTradeType.BUY}>Buy</option>
              <option value={OptionsTradeType.SELL}>Sell</option>
            </select>
          </div>
          <button
            onClick={exportToCsv}
            className="w-full md:w-auto justify-self-end bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      <ReportsTable trades={filteredTrades} />
    </div>
  );
};

export default ReportsPage;