import React, { useState, useEffect, useMemo } from 'react';
import { Trade, OptionsTradeType } from './types';

interface AddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  onUpdateTrade: (trade: Trade) => void;
  tradeToEdit?: Trade | null;
}

const InputField = ({ label, id, ...props }: { label: string, id: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">
      <span className="text-red-500 mr-1">*</span>{label}
    </label>
    <input id={id} {...props} className="w-full bg-brand-bg border border-brand-border rounded-md shadow-sm p-2 focus:ring-brand-blue focus:border-brand-blue" required />
  </div>
);

const DisplayField = ({ label, value, description, valueClassName }: { label: string; value: string; description: string; valueClassName?: string; }) => (
    <div>
      <p className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</p>
      <p className={`w-full p-2 min-h-[42px] flex items-center font-semibold ${valueClassName || 'text-brand-text-primary'}`}>{value || ' '}</p>
      <p className="text-xs text-brand-text-secondary/70">{description}</p>
    </div>
  );

const AddTradeModal: React.FC<AddTradeModalProps> = ({ isOpen, onClose, onAddTrade, onUpdateTrade, tradeToEdit }) => {
  const [tradeDate, setTradeDate] = useState('');
  const [strike, setStrike] = useState('');
  const [type, setType] = useState<OptionsTradeType>(OptionsTradeType.SELL);
  const [quantity, setQuantity] = useState('');
  const [ceEntryPrice, setCeEntryPrice] = useState('');
  const [ceExitPrice, setCeExitPrice] = useState('');
  const [peEntryPrice, setPeEntryPrice] = useState('');
  const [peExitPrice, setPeExitPrice] = useState('');
  const [ceEntryTime, setCeEntryTime] = useState('');
  const [ceExitTime, setCeExitTime] = useState('');
  const [peEntryTime, setPeEntryTime] = useState('');
  const [peExitTime, setPeExitTime] = useState('');
  const [notes, setNotes] = useState('');

  const [tradeDay, setTradeDay] = useState('');
  const [tradeWeekDay, setTradeWeekDay] = useState('');
  
  const isEditing = !!tradeToEdit;

  const resetForm = () => {
    const today = new Date();
    // Adjust for timezone offset to get correct YYYY-MM-DD
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const todayStr = today.toISOString().split('T')[0];
    
    setTradeDate(todayStr);
    setStrike('');
    setType(OptionsTradeType.SELL);
    setQuantity('375');
    setCeEntryPrice('');
    setCeExitPrice('');
    setPeEntryPrice('');
    setPeExitPrice('');
    setCeEntryTime('09:16:00');
    setCeExitTime('14:45:00');
    setPeEntryTime('09:16:00');
    setPeExitTime('14:45:00');
    setNotes('');
  };
  
  const populateForm = (trade: Trade) => {
    setTradeDate(trade.tradeDate);
    setStrike(String(trade.strike));
    setType(trade.type);
    setQuantity(String(trade.quantity));
    setCeEntryPrice(String(trade.ceEntryPrice));
    setCeExitPrice(String(trade.ceExitPrice));
    setPeEntryPrice(String(trade.peEntryPrice));
    setPeExitPrice(String(trade.peExitPrice));
    setCeEntryTime(trade.ceEntryTime);
    setCeExitTime(trade.ceExitTime);
    setPeEntryTime(trade.peEntryTime);
    setPeExitTime(trade.peExitTime);
    setNotes(trade.notes || '');
  };

  useEffect(() => {
    if (isOpen) {
        if (tradeToEdit) {
            populateForm(tradeToEdit);
        } else {
            resetForm();
        }
    }
  }, [isOpen, tradeToEdit]);

  useEffect(() => {
    if (tradeDate) {
      // The date from input is timezone-agnostic, treat as UTC to avoid off-by-one errors
      const date = new Date(tradeDate + 'T00:00:00Z');
      setTradeDay(String(date.getUTCDate()));
      setTradeWeekDay(date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }));
    } else {
      setTradeDay('');
      setTradeWeekDay('');
    }
  }, [tradeDate]);

  const parsedQuantity = useMemo(() => parseInt(quantity, 10) || 0, [quantity]);

  const ceSl = useMemo(() => {
    const entry = parseFloat(ceEntryPrice);
    if (isNaN(entry)) return '0.00';
    return (entry * 1.5).toFixed(2);
  }, [ceEntryPrice]);

  const peSl = useMemo(() => {
    const entry = parseFloat(peEntryPrice);
    if (isNaN(entry)) return '0.00';
    return (entry * 1.5).toFixed(2);
  }, [peEntryPrice]);

  const cePnl = useMemo(() => {
    const entry = parseFloat(ceEntryPrice);
    const exit = parseFloat(ceExitPrice);
    if (isNaN(entry) || isNaN(exit) || !parsedQuantity) return 0;

    const pnlPerShare = entry - exit; // For SELL, profit is entry - exit
    if (type === OptionsTradeType.BUY) {
      return -pnlPerShare * parsedQuantity; // For BUY, it's the opposite
    }
    return pnlPerShare * parsedQuantity;
  }, [ceEntryPrice, ceExitPrice, parsedQuantity, type]);

  const pePnl = useMemo(() => {
    const entry = parseFloat(peEntryPrice);
    const exit = parseFloat(peExitPrice);
    if (isNaN(entry) || isNaN(exit) || !parsedQuantity) return 0;

    const pnlPerShare = entry - exit; // For SELL, profit is entry - exit
    if (type === OptionsTradeType.BUY) {
      return -pnlPerShare * parsedQuantity; // For BUY, it's the opposite
    }
    return pnlPerShare * parsedQuantity;
  }, [peEntryPrice, peExitPrice, parsedQuantity, type]);
  
  const totalPnl = useMemo(() => cePnl + pePnl, [cePnl, pePnl]);

  const getTradeData = (): Omit<Trade, 'id'> | null => {
    if (!tradeDate || !strike || !quantity || !ceEntryPrice || !ceExitPrice || !peEntryPrice || !peExitPrice || !ceEntryTime || !ceExitTime || !peEntryTime || !peExitTime) {
      alert("Please fill in all required fields.");
      return null;
    }

    return {
      tradeDate,
      strike: parseInt(strike, 10),
      type,
      quantity: parseInt(quantity, 10),
      ceEntryPrice: parseFloat(ceEntryPrice),
      ceExitPrice: parseFloat(ceExitPrice),
      peEntryPrice: parseFloat(peEntryPrice),
      peExitPrice: parseFloat(peExitPrice),
      ceEntryTime,
      ceExitTime,
      peEntryTime,
      peExitTime,
      notes,
    };
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeData = getTradeData();
    if (tradeData) {
        if (tradeToEdit) {
            onUpdateTrade({ ...tradeData, id: tradeToEdit.id });
        } else {
            onAddTrade(tradeData);
        }
      onClose();
    }
  };
  
  const handleSaveAndNew = (e: React.MouseEvent) => {
    e.preventDefault();
    const tradeData = getTradeData();
    if (tradeData) {
      onAddTrade(tradeData);
      resetForm();
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-brand-surface rounded-lg shadow-xl w-full max-w-3xl border border-brand-border">
        <div className="flex justify-between items-center p-5 border-b border-brand-border">
          <h3 className="text-xl font-semibold text-brand-text-primary">{isEditing ? 'Edit Trade' : 'Add New Trade'}</h3>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <InputField label="Trade Date" id="tradeDate" type="date" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)} />
              <InputField label="Strike Number" id="strike" type="text" inputMode="numeric" pattern="\d*" value={strike} onChange={(e) => setStrike(e.target.value)} />
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-brand-text-secondary mb-1"><span className="text-red-500 mr-1">*</span>Trade Type</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value as OptionsTradeType)} className="w-full bg-brand-bg border border-brand-border rounded-md shadow-sm p-2 focus:ring-brand-blue focus:border-brand-blue">
                  <option value={OptionsTradeType.SELL}>Sell</option>
                  <option value={OptionsTradeType.BUY}>Buy</option>
                </select>
              </div>
              <InputField label="Quantity" id="quantity" type="text" inputMode="numeric" pattern="\d*" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <div className="sm:col-span-2">
                <DisplayField 
                    label="Total PNL" 
                    value={totalPnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} 
                    description="Calculated from CE PNL + PE PNL"
                    valueClassName={`text-lg ${totalPnl >= 0 ? 'text-brand-green' : 'text-brand-red'}`}
                />
              </div>
              <DisplayField label="Trade Day" value={tradeDay} description="This field is calculated upon save" />
              <DisplayField label="Trade WeekDay" value={tradeWeekDay} description="This field is calculated upon save" />
            </div>

            <h4 className="text-lg font-semibold text-brand-text-primary mt-4 pt-4 border-t border-brand-border">CE Leg</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <InputField label="CE Entry Price" id="ceEntry" type="text" inputMode="decimal" pattern="\d*\.?\d*" value={ceEntryPrice} onChange={(e) => setCeEntryPrice(e.target.value)} />
                <InputField label="CE Exit Price" id="ceExit" type="text" inputMode="decimal" pattern="\d*\.?\d*" value={ceExitPrice} onChange={(e) => setCeExitPrice(e.target.value)} />
                <DisplayField label="CE PNL" value={cePnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} description="Leg-specific PNL" valueClassName={cePnl >= 0 ? 'text-brand-green' : 'text-brand-red'} />
                <InputField label="CE Entry Time" id="ceEntryTime" type="time" step="1" value={ceEntryTime} onChange={(e) => setCeEntryTime(e.target.value)} />
                <InputField label="CE Exit Time" id="ceExitTime" type="time" step="1" value={ceExitTime} onChange={(e) => setCeExitTime(e.target.value)} />
                <DisplayField label="CE SL" value={ceSl} description="150% of entry price" />
            </div>

            <h4 className="text-lg font-semibold text-brand-text-primary mt-4 pt-4 border-t border-brand-border">PE Leg</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <InputField label="PE Entry Price" id="peEntry" type="text" inputMode="decimal" pattern="\d*\.?\d*" value={peEntryPrice} onChange={(e) => setPeEntryPrice(e.target.value)} />
                <InputField label="PE Exit Price" id="peExit" type="text" inputMode="decimal" pattern="\d*\.?\d*" value={peExitPrice} onChange={(e) => setPeExitPrice(e.target.value)} />
                <DisplayField label="PE PNL" value={pePnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} description="Leg-specific PNL" valueClassName={pePnl >= 0 ? 'text-brand-green' : 'text-brand-red'} />
                <InputField label="PE Entry Time" id="peEntryTime" type="time" step="1" value={peEntryTime} onChange={(e) => setPeEntryTime(e.target.value)} />
                <InputField label="PE Exit Time" id="peExitTime" type="time" step="1" value={peExitTime} onChange={(e) => setPeExitTime(e.target.value)} />
                <DisplayField label="PE SL" value={peSl} description="150% of entry price" />
            </div>
            
            <h4 className="text-lg font-semibold text-brand-text-primary mt-4 pt-4 border-t border-brand-border">Notes</h4>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-brand-text-secondary mb-1">Notes</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-brand-bg border border-brand-border rounded-md shadow-sm p-2 focus:ring-brand-blue focus:border-brand-blue"></textarea>
            </div>
          </div>
          <div className="flex items-center justify-end p-5 border-t border-brand-border">
            <button type="button" onClick={onClose} className="bg-brand-border text-brand-text-primary px-4 py-2 rounded-md mr-2 hover:bg-gray-600">Cancel</button>
            {!isEditing && (
                <button type="button" onClick={handleSaveAndNew} className="bg-brand-surface text-brand-text-primary px-4 py-2 rounded-md mr-2 border border-brand-blue hover:bg-brand-blue/20">Save & New</button>
            )}
            <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTradeModal;