import React, { useMemo } from 'react';
import { Trade } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculatePnl } from './tradeUtils';

interface TradeChartProps {
  trades: Trade[];
}

const TradeChart: React.FC<TradeChartProps> = ({ trades }) => {
  const chartData = useMemo(() => {
    if (trades.length === 0) return [];

    const sortedTrades = [...trades].sort((a, b) => new Date(`${a.tradeDate}T${a.ceExitTime}`).getTime() - new Date(`${b.tradeDate}T${b.ceExitTime}`).getTime());
    
    let cumulativePl = 0;
    return sortedTrades.map((trade, index) => {
      const pnl = calculatePnl(trade);
      cumulativePl += pnl;
      return {
        name: `Trade ${index + 1}`,
        strike: trade.strike,
        pnl: pnl,
        cumulativePl: cumulativePl,
      };
    });
  }, [trades]);

  if (trades.length === 0) {
    return (
      <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-md h-96 flex items-center justify-center">
        <p className="text-brand-text-secondary">No trades yet. Add a trade to see your P/L chart.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-surface border border-brand-border p-3 rounded-md shadow-lg">
          <p className="label font-bold">{`${label} (Strike: ${payload[0].payload.strike})`}</p>
          <p className="intro text-brand-green">{`Cumulative P/L: ${payload[0].value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`}</p>
          <p className="desc" style={{ color: payload[0].payload.pnl >= 0 ? '#26a69a' : '#ef5350' }}>
            {`Trade P/L: ${payload[0].payload.pnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-brand-surface p-4 sm:p-6 rounded-lg border border-brand-border shadow-md">
       <h2 className="text-lg font-semibold text-brand-text-primary mb-4">P/L Over Time</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 30,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" />
            <XAxis dataKey="name" stroke="#8c8f96" />
            <YAxis 
              stroke="#8c8f96" 
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
              domain={['auto', 'auto']}
              />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="cumulativePl" name="Cumulative P/L" stroke="#2962ff" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradeChart;