"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

export interface AccordionItem {
  q: string;
  a: string;
}

export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();
  const reduced = useReducedMotion();

  return (
    <div>
      {items.map((item, i) => {
        const open = openIndex === i;
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={i} className="border-b border-edge">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left font-body text-lg font-medium text-primary"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="font-display text-xl text-tertiary transition-transform duration-300"
                  style={{ transform: open ? "rotate(45deg)" : "none" }}
                >
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-base leading-[1.7] text-secondary">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
