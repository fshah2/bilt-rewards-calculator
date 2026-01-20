'use client';

import type { CalculatorResults } from '@/lib/rules/types';

interface ResultsSectionProps {
  results: CalculatorResults;
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

export default function ResultsSection({ results }: ResultsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Results</h2>

      {/* Top-line tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Estimated Points Earned
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatPoints(results.points.total)}
          </div>
        </div>

        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Estimated Bilt Cash Earned
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(results.biltCash.earnedFromSpend)}
          </div>
        </div>

        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Estimated Out-of-Pocket Fees
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(results.fees.totalOutOfPocket)}
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Breakdown</h3>

        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <span className="font-medium text-gray-900 dark:text-white">Points from Rent</span>
            <span className="font-semibold">
              {formatPoints(results.points.rent)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <span className="font-medium text-gray-900 dark:text-white">Points from Mortgage</span>
            <span className="font-semibold">
              {formatPoints(results.points.mortgage)}
            </span>
          </div>

          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="font-medium mb-2 text-gray-900 dark:text-white">Points from Card Spend</div>
            <div className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
              <div className="flex justify-between">
                <span>Dining</span>
                <span>{formatPoints(results.points.cardSpend.byCategory.dining)}</span>
              </div>
              <div className="flex justify-between">
                <span>Grocery</span>
                <span>{formatPoints(results.points.cardSpend.byCategory.grocery)}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel</span>
                <span>{formatPoints(results.points.cardSpend.byCategory.travel)}</span>
              </div>
              <div className="flex justify-between">
                <span>Other</span>
                <span>{formatPoints(results.points.cardSpend.byCategory.other)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-gray-300 dark:border-gray-600">
                <span>Total</span>
                <span>{formatPoints(results.points.cardSpend.total)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <span className="font-medium text-gray-900 dark:text-white">Bilt Cash from Spend</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(results.biltCash.earnedFromSpend)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <span className="font-medium text-gray-900 dark:text-white">Bilt Cash Used (Unlocking)</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              -{formatCurrency(results.biltCash.redeemedForUnlocking)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <span className="font-medium text-gray-900 dark:text-white">Bilt Cash Used (Fees)</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              -{formatCurrency(results.biltCash.appliedToFees)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <span className="font-medium text-gray-900 dark:text-white">Net Bilt Cash Change</span>
            <span
              className={`font-semibold ${
                results.biltCash.netChange >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatCurrency(results.biltCash.netChange)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <span className="font-medium text-gray-900 dark:text-white">Fees Out-of-Pocket</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(results.fees.totalOutOfPocket)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
