"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

interface AdminPendingFilterToggleProps {
  label?: string;
}

export const AdminPendingFilterToggle = ({
  label = "Show only not-approved events",
}: AdminPendingFilterToggleProps) => {
  const [pending, setPending] = useQueryState(
    "pending",
    parseAsBoolean.withDefault(false)
  );

  async function handleToggle() {
    await setPending(!pending);
  }

  return (
    <div className="mt-8 flex justify-end">
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 shadow-sm hover:bg-zinc-800"
      >
        <span
          className={`h-4 w-7 rounded-full border border-zinc-600 bg-zinc-800 p-0.5 transition-colors ${
            pending ? "bg-emerald-500/40" : ""
          }`}
        >
          <span
            className={`block h-3 w-3 rounded-full bg-zinc-200 transition-transform ${
              pending ? "translate-x-3" : ""
            }`}
          />
        </span>
        <span>{label}</span>
      </button>
    </div>
  );
};
