import React, { useMemo } from 'react';
import { Trade } from './types';
import StatCard from './StatCard';
import { calculatePnl } from './tradeUtils';

interface DashboardStatsProps {
  trades: Trade[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ trades }) => {
  const stats = useMemo(() => {
    if (trades.length === 0) {
      return {
        totalPl: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        profitFactor: 0,
      };
    }

    const tradeResults = trades.map(trade => {
      const pnl = calculatePnl(trade);
      return { pnl };
    });

    const totalPl = tradeResults.reduce((acc, curr) => acc + curr.pnl, 0);
    const winningTrades = tradeResults.filter(t => t.pnl > 0);
    const losingTrades = tradeResults.filter(t => t.pnl < 0);

    const winRate = (winningTrades.length / trades.length) * 100;
    
    const totalWinAmount = winningTrades.reduce((acc, curr) => acc + curr.pnl, 0);
    const totalLossAmount = Math.abs(losingTrades.reduce((acc, curr) => acc + curr.pnl, 0));

    const avgWin = winningTrades.length > 0 ? totalWinAmount / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? totalLossAmount / losingTrades.length : 0;

    const profitFactor = totalLossAmount > 0 ? totalWinAmount / totalLossAmount : Infinity;

    return { totalPl, winRate, avgWin, avgLoss, profitFactor };
  }, [trades]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };
  
  const totalPlColor = stats.totalPl >= 0 ? 'text-brand-green' : 'text-brand-red';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
      <StatCard 
        label="Total P/L" 
        value={formatCurrency(stats.totalPl)} 
        colorClass={totalPlColor} 
        description="Net profit or loss from all trades."
      />
      <StatCard 
        label="Win Rate" 
        value={`${stats.winRate.toFixed(2)}%`} 
        description="Percentage of profitable trades."
      />
      <StatCard 
        label="Avg. Win" 
        value={formatCurrency(stats.avgWin)} 
        colorClass="text-brand-green"
        description="Average profit on winning trades."
      />
      <StatCard 
        label="Avg. Loss" 
        value={formatCurrency(stats.avgLoss)} 
        colorClass="text-brand-red"
        description="Average loss on losing trades."
      />
      <StatCard 
        label="Profit Factor" 
        value={isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : '∞'}
        description="Gross profit / Gross loss."
      />
    </div>
  );
};

export default DashboardStats;