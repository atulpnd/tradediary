import React from 'react';
import { Trade } from './types';
import DashboardStats from './DashboardStats';
import TradeChart from './TradeChart';
import TradeLogTable from './TradeLogTable';

interface DashboardPageProps {
    trades: Trade[];
    onDeleteTrade: (id: number) => void;
    onEditTrade: (trade: Trade) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ trades, onDeleteTrade, onEditTrade }) => {
    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-text-primary mb-6">Dashboard</h1>
            <DashboardStats trades={trades} />
            <div className="mt-8 grid grid-cols-1 gap-8">
                <TradeChart trades={trades} />
                <TradeLogTable trades={trades} onDeleteTrade={onDeleteTrade} onEditTrade={onEditTrade} />
            </div>
        </div>
    );
};

export default DashboardPage;