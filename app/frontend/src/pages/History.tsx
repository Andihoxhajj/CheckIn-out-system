import { useEffect, useState } from 'react';
import { useVillaStore } from '@/store/useVillaStore';
import { HistoryTable } from '@/components/HistoryTable';

export const History = () => {
  const { history, fetchHistory, villas } = useVillaStore();
  const [filters, setFilters] = useState<{ villaId?: number; from?: string; to?: string }>({});

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const handleFilter = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <label className="text-xs uppercase tracking-wide text-slate-400">
            Villa
            <select
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              value={filters.villaId ?? ''}
              onChange={(e) => handleFilter('villaId', e.target.value)}
            >
              <option value="">All</option>
              {villas.map((villa) => (
                <option key={villa.id} value={villa.id}>
                  {villa.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase tracking-wide text-slate-400">
            From
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              value={filters.from ?? ''}
              onChange={(e) => handleFilter('from', e.target.value)}
            />
          </label>
          <label className="text-xs uppercase tracking-wide text-slate-400">
            To
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              value={filters.to ?? ''}
              onChange={(e) => handleFilter('to', e.target.value)}
            />
          </label>
          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={() => fetchHistory(filters)}
              className="w-full rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters({});
                void fetchHistory();
              }}
              className="w-full rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <HistoryTable history={history} />
    </div>
  );
};

