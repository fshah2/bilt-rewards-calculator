'use client';

import type {
  SpendInputs,
  CardType,
  ObsidianBonusCategory,
  TimeMode,
} from '@/lib/rules/types';

interface SpendSectionProps {
  spend: SpendInputs;
  onChange: (spend: SpendInputs) => void;
  card: CardType;
  obsidianBonusCategory: ObsidianBonusCategory;
  onObsidianBonusCategoryChange: (category: ObsidianBonusCategory) => void;
  groceryYTD: number | undefined;
  onGroceryYTDChange: (value: number | undefined) => void;
  mode: TimeMode;
}

export default function SpendSection({
  spend,
  onChange,
  card,
  obsidianBonusCategory,
  onObsidianBonusCategoryChange,
  groceryYTD,
  onGroceryYTDChange,
  mode,
}: SpendSectionProps) {
  const isObsidian = card === 'obsidian';
  const isGrocerySelected = isObsidian && obsidianBonusCategory === 'grocery';
  const showGroceryYTD = isGrocerySelected && mode === 'monthly';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Card Spend</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Enter your monthly spending in each category (eligible purchases only).
      </p>

      {isObsidian && (
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Choose your Obsidian 3X category
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white">
              <input
                type="radio"
                name="obsidian-bonus"
                checked={obsidianBonusCategory === 'dining'}
                onChange={() => onObsidianBonusCategoryChange('dining')}
              />
              <span>Dining</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-white">
              <input
                type="radio"
                name="obsidian-bonus"
                checked={obsidianBonusCategory === 'grocery'}
                onChange={() => onObsidianBonusCategoryChange('grocery')}
              />
              <span>Grocery</span>
            </label>
          </div>
          {isGrocerySelected && (
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                3X grocery up to $25,000 per calendar year, then 1X.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Dining (USD)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={spend.dining || ''}
            onChange={(e) =>
              onChange({ ...spend, dining: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Grocery (USD)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={spend.grocery || ''}
            onChange={(e) =>
              onChange({ ...spend, grocery: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
          {showGroceryYTD && (
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year-to-date grocery spend (USD) - Optional
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={groceryYTD || ''}
                onChange={(e) =>
                  onGroceryYTDChange(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="0.00"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Travel (USD)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={spend.travel || ''}
            onChange={(e) =>
              onChange({ ...spend, travel: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Other (USD)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={spend.other || ''}
            onChange={(e) =>
              onChange({ ...spend, other: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
}
