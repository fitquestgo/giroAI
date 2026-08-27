"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export function Header({ onOpenModal }: { onOpenModal: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:rounded">
            <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
              <defs>
                <style>
                  {`.h-white { fill: white; } .h-red { fill: #EF3B36; } .h-teal { fill: #00A89A; }`}
                </style>
              </defs>
              <rect width="64" height="64" rx="12" fill="#1a1a1a" />
              <path className="h-white" d="M 32 16 Q 20 16 20 32 Q 20 48 32 48 L 32 16 Z" />
              <path className="h-red" d="M 32 16 Q 44 16 44 32 Q 44 48 32 48 L 32 16 Z" />
              <circle className="h-teal" cx="32" cy="32" r="5" />
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link
              href="#como-funciona"
              onClick={handleNavClick}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:rounded"
            >
              Como funciona
            </Link>
            <Link
              href="/testar"
              onClick={handleNavClick}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:rounded"
            >
              Oportunidades
            </Link>
            <button
              type="button"
              onClick={() => {
                onOpenModal();
                handleNavClick();
              }}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:rounded"
            >
              Cadastrar estoque
            </button>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/testar"
              className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              Explorar oportunidades
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                href="#como-funciona"
                onClick={handleNavClick}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                Como funciona
              </Link>
              <Link
                href="/testar"
                onClick={handleNavClick}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                Oportunidades
              </Link>
              <button
                type="button"
                onClick={() => {
                  onOpenModal();
                  handleNavClick();
                }}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                Cadastrar estoque
              </button>
              <div className="border-t border-gray-200 pt-4">
                <Link
                  href="/testar"
                  onClick={handleNavClick}
                  className="inline-flex w-full items-center justify-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                >
                  Explorar oportunidades
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
