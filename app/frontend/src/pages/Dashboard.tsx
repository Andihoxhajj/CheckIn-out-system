import { useEffect, useMemo, useState } from 'react';
import { useVillaStore } from '@/store/useVillaStore';
import { BookingModal } from '@/components/BookingModal';
import { VillaCard } from '@/components/VillaCard';
import { CheckoutModal } from '@/components/CheckoutModal';
import type { Villa } from '@/types';

export const Dashboard = () => {
  const { villas, fetchVillas, createBooking, checkoutBooking, updateVillaStatus } = useVillaStore();
  const [bookingVilla, setBookingVilla] = useState<Villa>();
  const [checkoutId, setCheckoutId] = useState<number>();

  useEffect(() => {
    void fetchVillas();
  }, [fetchVillas]);

  const summary = useMemo(() => {
    const stats = {
      total: villas.length,
      occupied: villas.filter((v: Villa) => v.status === 'Occupied').length,
      available: villas.filter((v: Villa) => v.status === 'Available').length,
      cleaning: villas.filter((v: Villa) => v.status === 'Cleaning').length,
    };
    return stats;
  }, [villas]);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Total Villas</p>
          <p className="text-2xl font-semibold">{summary.total}</p>
        </div>
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Occupied</p>
          <p className="text-2xl font-semibold text-rose-300">{summary.occupied}</p>
        </div>
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Available</p>
          <p className="text-2xl font-semibold text-emerald-300">{summary.available}</p>
        </div>
        <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">Cleaning</p>
          <p className="text-2xl font-semibold text-amber-300">{summary.cleaning}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {villas.map((villa: Villa) => (
          <VillaCard
            key={villa.id}
            villa={villa}
            onCreateBooking={setBookingVilla}
            onCheckout={(id) => setCheckoutId(id)}
            onMarkAvailable={(id) => {
              void updateVillaStatus(id, 'Available');
            }}
          />
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Live occupancy</h3>
            <p className="text-sm text-slate-400">Quick glance at which villas are free vs in use.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchVillas()}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs uppercase tracking-wide text-slate-300 hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="border-b border-slate-800 px-3 py-2">Villa</th>
                <th className="border-b border-slate-800 px-3 py-2">Status</th>
                <th className="border-b border-slate-800 px-3 py-2">Rate</th>
                <th className="border-b border-slate-800 px-3 py-2">Guest</th>
                <th className="border-b border-slate-800 px-3 py-2 text-right">Check-out</th>
              </tr>
            </thead>
            <tbody>
              {villas.map((villa) => {
                const activeBooking = villa.bookings?.[0];
                return (
                  <tr key={villa.id} className="border-b border-slate-900/60 text-slate-200">
                    <td className="px-3 py-3 font-medium">{villa.name}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs">{villa.status}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-400">€{villa.pricePerNight}</td>
                    <td className="px-3 py-3 text-sm">{activeBooking?.guestName ?? '—'}</td>
                    <td className="px-3 py-3 text-right text-slate-400">
                      {activeBooking ? new Date(activeBooking.checkOut).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <BookingModal
        open={Boolean(bookingVilla)}
        villa={bookingVilla}
        onClose={() => setBookingVilla(undefined)}
        onSubmit={async (payload) => {
          await createBooking(payload);
        }}
      />

      <CheckoutModal
        open={Boolean(checkoutId)}
        guestName={villas
          .flatMap((villa) => villa.bookings ?? [])
          .find((booking) => booking.id === checkoutId)?.guestName}
        onClose={() => setCheckoutId(undefined)}
        onConfirm={async () => {
          if (checkoutId) {
            await checkoutBooking(checkoutId);
            setCheckoutId(undefined);
          }
        }}
      />
    </>
  );
};

