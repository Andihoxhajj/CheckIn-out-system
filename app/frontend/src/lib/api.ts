import axios from 'axios';
import type { Booking, Villa } from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const fetchVillas = async () => {
  const { data } = await api.get<Villa[]>('/villas/list');
  return data;
};

export const createBooking = async (payload: {
  guestName: string;
  guestPhone: string;
  guestID: string;
  villaId: number;
  checkIn: string;
  checkOut: string;
}) => {
  const { data } = await api.post<Booking>('/bookings/create', payload);
  return data;
};

export const checkoutBooking = async (bookingId: number) => {
  const { data } = await api.post<Booking>('/bookings/checkout', { bookingId });
  return data;
};

export const fetchHistory = async (params?: {
  villaId?: number;
  from?: string;
  to?: string;
}) => {
  const { data } = await api.get<Booking[]>('/bookings/history', { params });
  return data;
};

export const updateVilla = async (payload: Partial<Villa> & { id: number }) => {
  const { data } = await api.patch<Villa>('/villas/update', payload);
  return data;
};

