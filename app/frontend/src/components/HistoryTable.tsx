import type { Booking } from '@/types';
import dayjs from 'dayjs';
import { Download } from 'lucide-react';

interface Props {
  history: Booking[];
}

export const HistoryTable = ({ history }: Props) => {
  if (!history.length) {
    return <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500">No history yet</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-900/60 text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Guest</th>
            <th className="px-4 py-3 font-medium">Villa</th>
            <th className="px-4 py-3 font-medium">Dates</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {history.map((booking) => (
            <tr key={booking.id} className="border-t border-slate-800/60 text-slate-200">
              <td className="px-4 py-3 font-medium">{booking.guestName}</td>
              <td className="px-4 py-3">{booking.villa?.name ?? `#${booking.villaId}`}</td>
              <td className="px-4 py-3 text-slate-400">
                {dayjs(booking.checkIn).format('DD MMM YYYY')} → {dayjs(booking.checkOut).format('DD MMM YYYY')}
              </td>
              <td className="px-4 py-3 font-semibold text-emerald-300">€{booking.totalPrice.toFixed(2)}</td>
              <td className="px-4 py-3">
                {booking.pdfPath ? (
                  <a
                    href={`file://${booking.pdfPath}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    <Download size={14} />
                    Invoice
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

