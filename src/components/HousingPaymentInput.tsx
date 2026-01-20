'use client';

import { useState } from 'react';
import type { HousingInput } from '@/lib/rules/types';
import Tooltip from './Tooltip';

interface HousingPaymentInputProps {
  label: string;
  value: HousingInput | undefined;
  onChange: (input: HousingInput | undefined) => void;
  mode: 'monthly' | 'yearly';
}

export default function HousingPaymentInput({
  label,
  value,
  onChange,
  mode,
}: HousingPaymentInputProps) {
  const [isEnabled, setIsEnabled] = useState(!!value);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (!enabled) {
      onChange(undefined);
    } else {
      onChange({
        amount: 0,
        option: 'max_points',
        applyBiltCashToFee: true,
        biltCashBalanceAllocatedToFee: 0,
      });
    }
  };

  if (!isEnabled) {
    return (
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={false}
            onChange={(e) => handleToggle(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-medium text-gray-900 dark:text-white">Add {label}</span>
        </label>
      </div>
    );
  }

  const amount = value?.amount ?? 0;
  const option = value?.option ?? 'max_points';
  const feeDue = 0.03 * amount;
  const cashNeededFull1x = feeDue;

  return (
    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={true}
            onChange={(e) => handleToggle(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-medium text-lg text-gray-900 dark:text-white">{label}</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
          Monthly Amount (USD)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount || ''}
          onChange={(e) =>
            onChange({
              ...value!,
              amount: parseFloat(e.target.value) || 0,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Payment Option
        </label>
        <div className="space-y-2">
          <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <input
              type="radio"
              name={`${label}-option`}
              checked={option === 'max_points'}
              onChange={() =>
                onChange({
                  ...value!,
                  option: 'max_points',
                  applyBiltCashToFee: true,
                  biltCashBalanceAllocatedToFee: 0,
                })
              }
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">Max Points</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Earn 1 point per $1
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                3% transaction fee
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Bilt Cash can automatically cover some/all of the fee
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <input
              type="radio"
              name={`${label}-option`}
              checked={option === 'no_fee_unlock'}
              onChange={() =>
                onChange({
                  ...value!,
                  option: 'no_fee_unlock',
                  biltCashRedeemForUnlock: 0,
                })
              }
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">No Transaction Fee</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                No fee
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Optional: Redeem Bilt Cash to unlock points
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                $3 Bilt Cash → 100 points (max 1 point per $1)
              </div>
              {amount > 0 && (
                <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Bilt Cash needed to fully unlock 1x points: $
                  {cashNeededFull1x.toFixed(2)}
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      {option === 'max_points' && amount > 0 && (
        <div className="space-y-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value?.applyBiltCashToFee ?? true}
              onChange={(e) =>
                onChange({
                  ...value!,
                  applyBiltCashToFee: e.target.checked,
                })
              }
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Apply Bilt Cash to fee?
            </span>
          </label>
          {value?.applyBiltCashToFee && (
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                Available Bilt Cash balance allocated to this fee (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={value?.biltCashBalanceAllocatedToFee || 0}
                onChange={(e) =>
                  onChange({
                    ...value!,
                    biltCashBalanceAllocatedToFee:
                      parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          )}
        </div>
      )}

      {option === 'no_fee_unlock' && amount > 0 && (
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            How much Bilt Cash do you want to redeem for this payment? (USD)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={value?.biltCashRedeemForUnlock || 0}
            onChange={(e) =>
              onChange({
                ...value!,
                biltCashRedeemForUnlock: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
      )}
    </div>
  );
}
