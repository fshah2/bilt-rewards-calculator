'use client';

import type { TimeMode } from '@/lib/rules/types';

interface ModeToggleProps {
  value: TimeMode;
  onChange: (mode: TimeMode) => void;
}

export default function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        Time Period
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('monthly')}
          className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all text-gray-900 dark:text-white ${
            value === 'monthly'
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 font-semibold'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onChange('yearly')}
          className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all text-gray-900 dark:text-white ${
            value === 'yearly'
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 font-semibold'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }`}
        >
          Yearly
        </button>
      </div>
    </div>
  );
}
