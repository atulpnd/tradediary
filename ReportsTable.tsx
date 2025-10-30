import React from 'react';
import { Trade, OptionsTradeType } from './types';
import { calculatePnl, calculateLegPnl, calculateSl, getTradeDay } from './tradeUtils';

interface ReportsTableProps {
  trades: Trade[];
}

const ReportsTable: React.FC<ReportsTableProps> = ({ trades }) => {

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border shadow-md overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-text-secondary whitespace-nowrap">
          <thead className="text-xs text-brand-text-secondary uppercase bg-brand-surface">
            <tr>
              <th scope="col" className="px-4 py-3">Trade Date</th>
              <th scope="col" className="px-4 py-3">Trade Day</th>
              <th scope="col" className="px-4 py-3">Strike</th>
              <th scope="col" className="px-4 py-3 text-right">Quantity</th>
              <th scope="col" className="px-4 py-3 text-right">Total PNL</th>
              <th scope="col" className="px-4 py-3 text-right">CE Entry</th>
              <th scope="col" className="px-4 py-3 text-right">CE Exit</th>
              <th scope="col" className="px-4 py-3 text-right">CE SL</th>
              <th scope="col" className="px-4 py-3">CE Entry Time</th>
              <th scope="col" className="px-4 py-3">CE Exit Time</th>
              <th scope="col" className="px-4 py-3 text-right">CE PNL</th>
              <th scope="col" className="px-4 py-3 text-right">PE Entry</th>
              <th scope="col" className="px-4 py-3 text-right">PE Exit</th>
              <th scope="col" className="px-4 py-3">PE Entry Time</th>
              <th scope="col" className="px-4 py-3">PE Exit Time</th>
              <th scope="col" className="px-4 py-3 text-right">PE SL</th>
              <th scope="col" className="px-4 py-3 text-right">PE PNL</th>
              <th scope="col" className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {trades.length > 0 ? (
                trades.map((trade) => {
                const totalPnl = calculatePnl(trade);
                const totalPnlColor = totalPnl >= 0 ? 'text-brand-green' : 'text-brand-red';

                const cePnl = calculateLegPnl(trade.ceEntryPrice, trade.ceExitPrice, trade.quantity, trade.type);
                const cePnlColor = cePnl >= 0 ? 'text-brand-green' : 'text-brand-red';

                const pePnl = calculateLegPnl(trade.peEntryPrice, trade.peExitPrice, trade.quantity, trade.type);
                const pePnlColor = pePnl >= 0 ? 'text-brand-green' : 'text-brand-red';

                return (
                  <tr key={trade.id} className="bg-brand-surface border-b border-brand-border hover:bg-brand-border/50">
                    <th scope="row" className="px-4 py-4 font-medium text-brand-text-primary">{trade.tradeDate}</th>
                    <td className="px-4 py-4">{getTradeDay(trade.tradeDate)}</td>
                    <td className="px-4 py-4">{trade.strike}</td>
                    <td className="px-4 py-4 text-right">{trade.quantity}</td>
                    <td className={`px-4 py-4 text-right font-bold ${totalPnlColor}`}>{formatCurrency(totalPnl)}</td>
                    <td className="px-4 py-4 text-right">{trade.ceEntryPrice.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right">{trade.ceExitPrice.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right">{calculateSl(trade.ceEntryPrice).toFixed(2)}</td>
                    <td className="px-4 py-4">{trade.ceEntryTime}</td>
                    <td className="px-4 py-4">{trade.ceExitTime}</td>
                    <td className={`px-4 py-4 text-right font-semibold ${cePnlColor}`}>{formatCurrency(cePnl)}</td>
                    <td className="px-4 py-4 text-right">{trade.peEntryPrice.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right">{trade.peExitPrice.toFixed(2)}</td>
                    <td className="px-4 py-4">{trade.peEntryTime}</td>
                    <td className="px-4 py-4">{trade.peExitTime}</td>
                    <td className="px-4 py-4 text-right">{calculateSl(trade.peEntryPrice).toFixed(2)}</td>
                    <td className={`px-4 py-4 text-right font-semibold ${pePnlColor}`}>{formatCurrency(pePnl)}</td>
                    <td className="px-4 py-4 max-w-[200px] truncate" title={trade.notes}>{trade.notes}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={18} className="text-center py-8 text-brand-text-secondary">No trades match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;