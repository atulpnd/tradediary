import React, { useMemo } from 'react';
import { Trade, OptionsTradeType } from './types';
import StatCard from './StatCard';
import { calculatePnl } from './tradeUtils';

interface StatsPageProps {
  trades: Trade[];
}

const StatsPage: React.FC<StatsPageProps> = ({ trades }) => {
  const tradeStats = useMemo(() => {
    const totalTrades = trades.length;
    if (totalTrades === 0) {
      return {
        totalTrades: 0,
        buyTrades: 0,
        sellTrades: 0,
        bestTradePnl: 0,
        worstTradePnl: 0,
        totalProfit: 0,
        totalLoss: 0,
        avgWin: 0,
        avgLoss: 0,
        profitFactor: 0,
      };
    }

    const buyTrades = trades.filter(t => t.type === OptionsTradeType.BUY).length;
    const sellTrades = trades.filter(t => t.type === OptionsTradeType.SELL).length;

    const tradePnls = trades.map(calculatePnl);
    
    const bestTradePnl = Math.max(...tradePnls, 0);
    const worstTradePnl = Math.min(...tradePnls, 0);

    const winningTrades = tradePnls.filter(pnl => pnl > 0);
    const losingTrades = tradePnls.filter(pnl => pnl < 0);

    const totalProfit = winningTrades.reduce((acc, pnl) => acc + pnl, 0);
    const totalLoss = Math.abs(losingTrades.reduce((acc, pnl) => acc + pnl, 0));

    const avgWin = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;
    
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : Infinity;

    return {
      totalTrades,
      buyTrades,
      sellTrades,
      bestTradePnl,
      worstTradePnl,
      totalProfit,
      totalLoss,
      avgWin,
      avgLoss,
      profitFactor,
    };
  }, [trades]);
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-primary mb-6">Statistics</h1>

      <h2 className="text-xl font-semibold text-brand-text-primary mb-4">Overall Performance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard label="Total Trades" value={tradeStats.totalTrades} />
        <StatCard label="Buy Trades" value={tradeStats.buyTrades} description={`${((tradeStats.buyTrades / tradeStats.totalTrades) * 100 || 0).toFixed(1)}% of total`} />
        <StatCard label="Sell Trades" value={tradeStats.sellTrades} description={`${((tradeStats.sellTrades / tradeStats.totalTrades) * 100 || 0).toFixed(1)}% of total`} />
        <StatCard 
            label="Best Trade P/L" 
            value={formatCurrency(tradeStats.bestTradePnl)} 
            colorClass="text-brand-green"
        />
        <StatCard 
            label="Worst Trade P/L" 
            value={formatCurrency(tradeStats.worstTradePnl)} 
            colorClass="text-brand-red"
        />
        <StatCard label="Max Drawdown" value="0.00%" description="Coming soon..." />
        <StatCard label="Sharpe Ratio" value="N/A" description="Coming soon..." />
        <StatCard label="Avg. Holding Period" value="0 days" description="Coming soon..." />
      </div>

      <h2 className="text-xl font-semibold text-brand-text-primary mb-4">P/L Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <StatCard 
            label="Gross Profit" 
            value={formatCurrency(tradeStats.totalProfit)} 
            colorClass="text-brand-green"
            description="Sum of all winning trades."
        />
        <StatCard 
            label="Gross Loss" 
            value={formatCurrency(tradeStats.totalLoss)} 
            colorClass="text-brand-red"
            description="Sum of all losing trades."
        />
        <StatCard 
            label="Avg. Win" 
            value={formatCurrency(tradeStats.avgWin)} 
            colorClass="text-brand-green"
            description="Average P/L on winning trades."
        />
        <StatCard 
            label="Avg. Loss" 
            value={formatCurrency(tradeStats.avgLoss)} 
            colorClass="text-brand-red"
            description="Average P/L on losing trades."
        />
        <StatCard 
            label="Profit Factor" 
            value={isFinite(tradeStats.profitFactor) ? tradeStats.profitFactor.toFixed(2) : '∞'}
            description="Gross Profit / Gross Loss."
        />
      </div>


       <div className="mt-8 bg-brand-surface p-6 rounded-lg border border-brand-border">
          <h2 className="text-lg font-semibold text-brand-text-primary mb-4">More Analytics Coming Soon</h2>
          <p className="text-brand-text-secondary">
            We're working on adding more in-depth analytics, including performance by strike price, day of the week analysis, and custom reporting. Stay tuned!
          </p>
      </div>
    </div>
  );
};

export default StatsPage;