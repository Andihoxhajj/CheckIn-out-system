import { useState } from 'react';
import { useVillaStore } from '@/store/useVillaStore';

export const Settings = () => {
  const { villas, updateVillaPrice, fetchVillas } = useVillaStore();
  const [message, setMessage] = useState<string>();

  const handlePriceUpdate = async (id: number, price: number) => {
    await updateVillaPrice(id, price);
    setMessage('Pricing updated');
    setTimeout(() => setMessage(undefined), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Villa pricing</h2>
            <p className="text-sm text-slate-400">Adjust nightly rates per villa.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchVillas()}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {villas.map((villa) => (
            <div key={villa.id} className="rounded-xl border border-slate-800 p-4">
              <p className="text-sm uppercase tracking-wide text-slate-400">{villa.name}</p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min={50}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  defaultValue={villa.pricePerNight}
                  onBlur={(event) => handlePriceUpdate(villa.id, Number(event.target.value))}
                />
                <span className="text-sm text-slate-400">EUR / night</span>
              </div>
            </div>
          ))}
        </div>

        {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold">Invoice styling</h3>
          <p className="mt-2 text-sm text-slate-400">
            Customize typography, accent color, and signature block. (Coming soon)
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold">Data export</h3>
          <p className="mt-2 text-sm text-slate-400">
            Copy <code className="rounded bg-slate-800 px-1">app/database/app.db</code> or invoices under{' '}
            <code className="rounded bg-slate-800 px-1">app/invoices</code> for backups. Automated exports with cloud sync
            arrive next release.
          </p>
        </div>
      </div>
    </div>
  );
};

