import { clsx } from 'clsx';
import { CalendarPlus, LogOut } from 'lucide-react';
import type { Villa } from '@/types';

interface Props {
  villa: Villa;
  onCreateBooking: (villa: Villa) => void;
  onCheckout: (bookingId: number) => void;
  onMarkAvailable: (villaId: number) => void;
}

const statusColors: Record<Villa['status'], string> = {
  Available: 'bg-emerald-500/15 text-emerald-300',
  Occupied: 'bg-rose-500/20 text-rose-200',
  Cleaning: 'bg-amber-500/20 text-amber-200',
  Reserved: 'bg-cyan-500/20 text-cyan-200',
};

export const VillaCard = ({ villa, onCreateBooking, onCheckout, onMarkAvailable }: Props) => {
  const activeBooking = villa.bookings?.[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{villa.name}</h3>
          <p className="text-xs uppercase tracking-wide text-slate-500">€{villa.pricePerNight} / night</p>
        </div>
        <span className={clsx('rounded-full px-3 py-1 text-[11px] font-semibold', statusColors[villa.status])}>
          {villa.status}
        </span>
      </div>

      {activeBooking ? (
        <div className="mt-3 space-y-1 rounded-xl bg-slate-800/80 p-3 text-xs text-slate-300">
          <p className="text-sm font-medium text-slate-100">{activeBooking.guestName}</p>
          <p>
            {new Date(activeBooking.checkIn).toLocaleDateString()} →{' '}
            {new Date(activeBooking.checkOut).toLocaleDateString()}
          </p>
          <p className="text-slate-400">{activeBooking.guestPhone}</p>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500">No current booking</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCreateBooking(villa)}
          className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-700"
          disabled={villa.status === 'Occupied'}
        >
          <CalendarPlus size={16} />
          Check-in
        </button>
        <button
          type="button"
          onClick={() => activeBooking && onCheckout(activeBooking.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!activeBooking}
        >
          <LogOut size={16} />
          Check-out
        </button>
        {villa.status === 'Cleaning' && (
          <button
            type="button"
            onClick={() => onMarkAvailable(villa.id)}
            className="inline-flex items-center rounded-lg border border-emerald-500/60 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
          >
            Mark Ready
          </button>
        )}
      </div>
    </div>
  );
};

