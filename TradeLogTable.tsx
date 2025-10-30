import React from 'react';
import { Trade, OptionsTradeType } from './types';
import { calculatePnl } from './tradeUtils';

interface TradeLogTableProps {
  trades: Trade[];
  onDeleteTrade: (id: number) => void;
  onEditTrade: (trade: Trade) => void;
}

const TradeLogTable: React.FC<TradeLogTableProps> = ({ trades, onDeleteTrade, onEditTrade }) => {
  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border shadow-md overflow-hidden">
      <h2 className="text-lg font-semibold text-brand-text-primary p-4 sm:p-6 border-b border-brand-border">Trade Log</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-text-secondary">
          <thead className="text-xs text-brand-text-secondary uppercase bg-brand-surface">
            <tr>
              <th scope="col" className="px-6 py-3">Trade Date</th>
              <th scope="col" className="px-6 py-3">Strike</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3 text-right">Quantity</th>
              <th scope="col" className="px-6 py-3 text-right">CE Entry</th>
              <th scope="col" className="px-6 py-3 text-right">CE Exit</th>
              <th scope="col" className="px-6 py-3 text-right">PE Entry</th>
              <th scope="col" className="px-6 py-3 text-right">PE Exit</th>
              <th scope="col" className="px-6 py-3 text-right">P/L</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.length > 0 ? (
                [...trades].reverse().map((trade) => {
                const pnl = calculatePnl(trade);
                const pnlColor = pnl >= 0 ? 'text-brand-green' : 'text-brand-red';

                return (
                  <tr key={trade.id} className="bg-brand-surface border-b border-brand-border hover:bg-brand-border/50">
                    <th scope="row" className="px-6 py-4 font-medium text-brand-text-primary whitespace-nowrap">{trade.tradeDate}</th>
                    <td className="px-6 py-4">{trade.strike}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${trade.type === OptionsTradeType.BUY ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">{trade.quantity}</td>
                    <td className="px-6 py-4 text-right">{trade.ceEntryPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{trade.ceExitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{trade.peEntryPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">{trade.peExitPrice.toFixed(2)}</td>
                    <td className={`px-6 py-4 text-right font-bold ${pnlColor}`}>
                      {pnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                            <button onClick={() => onEditTrade(trade)} className="text-brand-blue hover:text-blue-500 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                                </svg>
                            </button>
                            <button onClick={() => onDeleteTrade(trade.id)} className="text-red-500 hover:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-8 text-brand-text-secondary">No trades logged.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeLogTable;