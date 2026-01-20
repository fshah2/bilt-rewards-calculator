'use client';

import type { CalculatorInputs, CardType } from '@/lib/rules/types';
import { calcTotals } from '@/lib/rules/calculator';
import ResultsSection from './ResultsSection';

interface CompareCardsViewProps {
  inputs: Omit<CalculatorInputs, 'card'>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPoints(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.floor(value));
}

export default function CompareCardsView({ inputs }: CompareCardsViewProps) {
  const cards: CardType[] = ['blue', 'obsidian', 'palladium'];
  const cardNames: Record<CardType, string> = {
    blue: 'Bilt Blue',
    obsidian: 'Bilt Obsidian',
    palladium: 'Bilt Palladium',
  };

  const results = cards.map((card) => ({
    card,
    name: cardNames[card],
    result: calcTotals({ ...inputs, card }),
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compare All Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map(({ card, name, result }) => (
          <div
            key={card}
            className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>

            <div className="space-y-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Total Points
                </div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPoints(result.points.total)}
                </div>
              </div>

              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Bilt Cash Earned
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(result.biltCash.earnedFromSpend)}
                </div>
              </div>

              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Out-of-Pocket Fees
                </div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(result.fees.totalOutOfPocket)}
                </div>
              </div>

              <div className="text-sm space-y-1 pt-2 border-t border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                <div className="flex justify-between">
                  <span>Points from Rent</span>
                  <span>{formatPoints(result.points.rent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Points from Mortgage</span>
                  <span>{formatPoints(result.points.mortgage)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Points from Spend</span>
                  <span>{formatPoints(result.points.cardSpend.total)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
