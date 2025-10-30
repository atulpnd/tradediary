import { Trade, OptionsTradeType } from './types';

export const calculatePnl = (trade: Trade): number => {
    // P/L per share/unit
    const cePnl = trade.ceExitPrice - trade.ceEntryPrice;
    const pePnl = trade.peExitPrice - trade.peEntryPrice;
  
    if (trade.type === OptionsTradeType.SELL) {
      // For a sell (short) position, profit is made if exit price is lower than entry price.
      // Profit = (Entry - Exit). So we negate the (Exit - Entry) result.
      return (-cePnl - pePnl) * trade.quantity;
    } else { // BUY
      // For a buy (long) position, profit is made if exit price is higher than entry price.
      // Profit = (Exit - Entry).
      return (cePnl + pePnl) * trade.quantity;
    }
};

export const calculateLegPnl = (
    entryPrice: number,
    exitPrice: number,
    quantity: number,
    type: OptionsTradeType
  ): number => {
    if (type === OptionsTradeType.SELL) {
      // For a sell, profit is entry - exit
      return (entryPrice - exitPrice) * quantity;
    } else { // BUY
      // For a buy, profit is exit - entry
      return (exitPrice - entryPrice) * quantity;
    }
};

export const calculateSl = (entryPrice: number): number => {
    if (isNaN(entryPrice) || entryPrice <= 0) return 0;
    return entryPrice * 1.5;
};

export const getTradeDay = (tradeDate: string): string => {
    if (!tradeDate) return '';
    // The date from input is timezone-agnostic, treat as UTC to avoid off-by-one errors
    const date = new Date(tradeDate + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
};