'use client';

import type { HousingInput, TimeMode } from '@/lib/rules/types';
import HousingPaymentInput from './HousingPaymentInput';

interface HousingSectionProps {
  rent: HousingInput | undefined;
  mortgage: HousingInput | undefined;
  onRentChange: (input: HousingInput | undefined) => void;
  onMortgageChange: (input: HousingInput | undefined) => void;
  mode: TimeMode;
}

export default function HousingSection({
  rent,
  mortgage,
  onRentChange,
  onMortgageChange,
  mode,
}: HousingSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Housing Payments</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Rent and mortgage payments can earn points. Choose your payment option
        for each.
      </p>
      <div className="space-y-4">
        <HousingPaymentInput
          label="Rent"
          value={rent}
          onChange={onRentChange}
          mode={mode}
        />
        <HousingPaymentInput
          label="Mortgage"
          value={mortgage}
          onChange={onMortgageChange}
          mode={mode}
        />
      </div>
    </div>
  );
}
