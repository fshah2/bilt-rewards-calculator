'use client';

import { useState } from 'react';

export default function AccordionHowItWorks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-gray-900 dark:text-white">How this estimate works</span>
        <span className="text-xl text-gray-900 dark:text-white">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <p>
            Points and Bilt Cash posting and merchant classification is based
            on MCC and eligibility rules; actual results may vary.
          </p>
          <p>
            <strong>Eligible Purchases exclusions</strong> include balance
            transfers, cash advances, cash-like transactions, person-to-person
            payments, fees/interest, etc.
          </p>
          <p>
            <strong>Obsidian grocery 3X cap:</strong> $25,000 per calendar
            year; then 1X.
          </p>
          <p>
            Rent/mortgage payments must be made through Bilt app/website and
            require account in good standing; calculator assumes eligibility.
          </p>
          <p>
            <strong>Partner boosts not modeled.</strong> This calculator does
            not include Lyft, dining network, portal multipliers, or other
            partner bonuses.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Note on points calculation:</strong> Points are calculated
            conservatively using integer flooring. Actual posting may vary
            slightly.
          </p>
        </div>
      )}
    </div>
  );
}
