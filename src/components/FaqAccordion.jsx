'use client';

import { useState } from 'react';

export default function FaqAccordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, i) => (
        <div key={i} className="card !rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="font-display text-base font-bold text-ink">
              {item.q}
            </span>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 ${
                open === i ? 'rotate-45' : ''
              }`}
            >
              +
            </span>
          </button>
          {open === i && (
            <p className="border-t border-ink/5 px-6 py-5 text-sm leading-relaxed text-ink/60">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}