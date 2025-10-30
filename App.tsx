import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Trade, Page, DateFilter } from './types';
import Sidebar from './Sidebar';
import Header from './Header';
import AddTradeModal from './AddTradeModal';
import DashboardPage from './DashboardPage';
import StatsPage from './StatsPage';
import CalendarPage from './CalendarPage';
import ReportsPage from './ReportsPage';
import { getDateRange } from './dateUtils';
import { getTrades, addTrade as apiAddTrade, updateTrade as apiUpdateTrade, deleteTrade as apiDeleteTrade } from './api';

const App: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [activeFilter, setActiveFilter] = useState<DateFilter>('all');
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  useEffect(() => {
    getTrades()
      .then(fetchedTrades => {
        setTrades(fetchedTrades);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch trades:", err);
        setError("Could not load trade data. Please check your setup and ensure the Google Apps Script URL is correct.");
        setLoading(false);
      });
  }, []);

  const addTrade = useCallback((trade: Omit<Trade, 'id'>) => {
    const newTrade = { ...trade, id: Date.now() };
    
    // Optimistic update
    const originalTrades = trades;
    setTrades(prevTrades => [...prevTrades, newTrade]);
    
    apiAddTrade(newTrade).catch(err => {
      console.error("Failed to add trade:", err);
      // Revert on failure
      setTrades(originalTrades);
      alert("Error: Could not save the new trade. Your changes have been reverted.");
    });
  }, [trades]);

  const updateTrade = useCallback((updatedTrade: Trade) => {
    const originalTrades = trades;
    setTrades(prevTrades =>
      prevTrades.map(trade =>
        trade.id === updatedTrade.id ? updatedTrade : trade
      )
    );
    
    apiUpdateTrade(updatedTrade).catch(err => {
      console.error("Failed to update trade:", err);
      setTrades(originalTrades);
      alert("Error: Could not update the trade. Your changes have been reverted.");
    });
  }, [trades]);

  const deleteTrade = useCallback((id: number) => {
    const originalTrades = trades;
    setTrades(prevTrades => prevTrades.filter(trade => trade.id !== id));

    apiDeleteTrade(id).catch(err => {
      console.error("Failed to delete trade:", err);
      setTrades(originalTrades);
      alert("Error: Could not delete the trade. Your changes have been reverted.");
    });
  }, [trades]);

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingTrade(null);
  };

  const filteredTrades = useMemo(() => {
    if (activeFilter === 'all') {
      return trades;
    }
    const range = getDateRange(activeFilter);
    if (!range) return trades;

    const { start, end } = range;
    return trades.filter(trade => {
      const tradeDate = new Date(trade.tradeDate);
      return tradeDate >= start && tradeDate <= end;
    });
  }, [trades, activeFilter]);

  const renderPage = () => {
    if (error) {
      return (
        <div className="p-4 text-center text-red-400 bg-red-900/50 border border-red-500 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Configuration Error</h2>
          <p>{error}</p>
          <p className="mt-2 text-sm">Please follow the `SETUP_INSTRUCTIONS.md` file carefully.</p>
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        return <DashboardPage trades={filteredTrades} onDeleteTrade={deleteTrade} onEditTrade={handleEditTrade} />;
      case 'stats':
        return <StatsPage trades={filteredTrades} />;
      case 'calendar':
        return <CalendarPage trades={filteredTrades} />;
      case 'reports':
        return <ReportsPage trades={filteredTrades} />;
      default:
        return <DashboardPage trades={filteredTrades} onDeleteTrade={deleteTrade} onEditTrade={handleEditTrade} />;
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-brand-bg flex flex-col justify-center items-center">
            <svg className="animate-spin h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="text-xl text-brand-text-secondary mt-4">Loading your trading journal...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg font-sans flex text-brand-text-primary">
      <Sidebar 
        activePage={activePage}
        setActivePage={setActivePage}
        onNewTradeClick={() => setIsModalOpen(true)}
      />
      <div className="flex-1 flex flex-col max-w-[calc(100%-16rem)]">
        <Header activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
      <AddTradeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTrade={addTrade}
        onUpdateTrade={updateTrade}
        tradeToEdit={editingTrade}
      />
    </div>
  );
};

export default App;
