export enum OptionsTradeType {
  BUY = 'Buy',
  SELL = 'Sell',
}

export interface Trade {
  id: number;
  tradeDate: string;
  strike: number;
  type: OptionsTradeType;
  quantity: number;
  ceEntryPrice: number;
  ceExitPrice: number;
  peEntryPrice: number;
  peExitPrice: number;
  ceEntryTime: string;
  ceExitTime: string;
  peEntryTime: string;
  peExitTime: string;
  notes?: string;
}

export type Page = 'dashboard' | 'stats' | 'calendar' | 'reports';

export type DateFilter =
  | 'today'
  | 'yesterday'
  | 'this-wk'
  | 'last-wk'
  | 'this-mo'
  | 'last-mo'
  | 'last-3-mo'
  | 'this-yr'
  | 'last-yr'
  | 'all';