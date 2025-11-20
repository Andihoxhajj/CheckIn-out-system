import { useState } from 'react';
import type { Villa } from '@/types';

interface Props {
  open: boolean;
  villa?: Villa;
  onClose: () => void;
  onSubmit: (data: {
    guestName: string;
    guestPhone: string;
    guestID: string;
    villaId: number;
    checkIn: string;
    checkOut: string;
  }) => Promise<void>;
}

export const BookingModal = ({ open, villa, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState({
    guestName: '',
    guestPhone: '',
    guestID: '',
    checkIn: '',
    checkOut: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  if (!open || !villa) return null;

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(undefined);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ ...form, villaId: villa.id });
      setForm({ guestName: '', guestPhone: '', guestID: '', checkIn: '', checkOut: '' });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{villa.name} · New Booking</h2>
            <p className="text-sm text-slate-400">€{villa.pricePerNight} / night</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-400 transition hover:text-slate-200"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          <input
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm focus:border-brand focus:outline-none"
            placeholder="Guest full name"
            value={form.guestName}
            onChange={(e) => handleChange('guestName', e.target.value)}
            required
          />
          <input
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm focus:border-brand focus:outline-none"
            placeholder="Phone number"
            value={form.guestPhone}
            onChange={(e) => handleChange('guestPhone', e.target.value)}
            required
          />
          <input
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm focus:border-brand focus:outline-none"
            placeholder="ID / Passport"
            value={form.guestID}
            onChange={(e) => handleChange('guestID', e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm text-slate-400">
              Check-in
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-brand focus:outline-none"
                value={form.checkIn}
                onChange={(e) => handleChange('checkIn', e.target.value)}
                required
              />
            </label>
            <label className="text-sm text-slate-400">
              Check-out
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-200 focus:border-brand focus:outline-none"
                value={form.checkOut}
                onChange={(e) => handleChange('checkOut', e.target.value)}
                required
              />
            </label>
          </div>
        </div>

        {error && <p className="mt-4 rounded-lg bg-rose-500/20 px-3 py-2 text-sm text-rose-200">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/40 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-600"
        >
          {isSubmitting ? 'Saving…' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

