import api from './client';
import type { ExchangeRate, ConvertResult, Currency } from '@/types';

export const exchangeRatesApi = {
  /** GET /exchange-rates/today — fetches from CBU if not cached */
  getToday: async (): Promise<ExchangeRate> => {
    const res = await api.get<ExchangeRate>('/exchange-rates/today');
    return res.data;
  },

  /** GET /exchange-rates/latest — most recent stored rate */
  getLatest: async (): Promise<ExchangeRate> => {
    const res = await api.get<ExchangeRate>('/exchange-rates/latest');
    return res.data;
  },

  /** GET /exchange-rates/convert?amount=&from=&to= */
  convert: async (amount: number, from: Currency, to: Currency): Promise<ConvertResult> => {
    const res = await api.get<ConvertResult>('/exchange-rates/convert', {
      params: { amount, from, to },
    });
    return res.data;
  },

  /** GET /exchange-rates — list all stored historical rates */
  getAll: async (): Promise<ExchangeRate[]> => {
    const res = await api.get<ExchangeRate[]>('/exchange-rates');
    return res.data;
  },
};
