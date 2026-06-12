"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { LanguageToggle } from "./language-toggle";

export function TopBar({ dict, locale }: { dict: Dict; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = [
    { href: "/wall", label: dict.nav.wall },
    { href: "/map", label: dict.nav.map },
    { href: "/manifesto", label: dict.nav.manifesto },
    { href: "/press", label: dict.nav.press },
    { href: "/participate", label: dict.nav.participate },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? "border-b border-edge bg-bg" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="font-display text-base text-primary"
            aria-label="The Millionaire's Dollar — home"
          >
            M.D.
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={dict.nav.menu}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 flex-col items-end justify-center gap-1.5"
          >
            <span aria-hidden="true" className="h-px w-6 bg-primary" />
            <span aria-hidden="true" className="h-px w-6 bg-primary" />
            <span aria-hidden="true" className="h-px w-4 bg-primary" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.menu}
          >
            <div className="container-site flex h-16 items-center justify-between sm:h-20">
              <span className="font-display text-base text-primary">M.D.</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-11 items-center font-mono text-xs uppercase tracking-[0.2em] text-secondary transition-colors duration-300 hover:text-primary"
              >
                {dict.nav.close}
              </button>
            </div>
            <nav className="container-site mt-12 sm:mt-24" aria-label="Main">
              <ul className="space-y-2">
                {links.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.05 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 font-display text-3xl font-light text-primary transition-colors duration-300 hover:text-accent-bright sm:text-[3rem] sm:leading-[1.15]"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-16 border-t border-edge pt-6">
                <LanguageToggle locale={locale} label={dict.nav.language} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
