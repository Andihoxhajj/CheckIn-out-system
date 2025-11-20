import { create } from 'zustand';
import type { Booking, Villa } from '@/types';
import {
  checkoutBooking,
  createBooking,
  fetchHistory,
  fetchVillas,
  updateVilla,
} from '@/lib/api';

interface VillaState {
  villas: Villa[];
  history: Booking[];
  loading: boolean;
  error?: string;
  fetchVillas: () => Promise<void>;
  fetchHistory: (filters?: { villaId?: number; from?: string; to?: string }) => Promise<void>;
  createBooking: (payload: Omit<Parameters<typeof createBooking>[0], never>) => Promise<void>;
  checkoutBooking: (bookingId: number) => Promise<void>;
  updateVillaPrice: (id: number, pricePerNight: number) => Promise<void>;
  updateVillaStatus: (id: number, status: Villa['status']) => Promise<void>;
}

export const useVillaStore = create<VillaState>((set, get) => ({
  villas: [],
  history: [],
  loading: false,
  error: undefined,
  fetchVillas: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await fetchVillas();
      set({ villas: data, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to load villas' });
      throw error;
    }
  },
  fetchHistory: async (filters) => {
    set({ loading: true, error: undefined });
    try {
      const data = await fetchHistory(filters);
      set({ history: data, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to load history' });
      throw error;
    }
  },
  createBooking: async (payload) => {
    await createBooking(payload);
    await Promise.all([get().fetchVillas(), get().fetchHistory()]);
  },
  checkoutBooking: async (bookingId) => {
    await checkoutBooking(bookingId);
    await Promise.all([get().fetchVillas(), get().fetchHistory()]);
  },
  updateVillaPrice: async (id, pricePerNight) => {
    await updateVilla({ id, pricePerNight });
    await get().fetchVillas();
  },
  updateVillaStatus: async (id, status) => {
    await updateVilla({ id, status });
    await get().fetchVillas();
  },
}));

