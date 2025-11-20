interface Props {
  open: boolean;
  guestName?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export const CheckoutModal = ({ open, guestName, onConfirm, onClose }: Props) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold">Confirm check-out</h2>
        <p className="mt-2 text-sm text-slate-400">
          {guestName ? `${guestName} will be checked-out and an invoice will be generated.` : 'Generate invoice?'}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

