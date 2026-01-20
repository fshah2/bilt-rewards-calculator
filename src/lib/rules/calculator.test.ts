import { describe, it, expect } from 'vitest';
import {
  calcHousing,
  calcCardSpendPoints,
  calcBiltCashFromSpend,
  calcTotals,
} from './calculator';
import type { CalculatorInputs, HousingInput } from './types';

describe('calcHousing', () => {
  it('returns zeros for undefined input', () => {
    const result = calcHousing(undefined, 'monthly');
    expect(result.points).toBe(0);
    expect(result.feeOutOfPocket).toBe(0);
  });

  it('calculates max points mode correctly', () => {
    const input: HousingInput = {
      amount: 2000,
      option: 'max_points',
      applyBiltCashToFee: false,
    };
    const result = calcHousing(input, 'monthly');
    expect(result.points).toBe(2000);
    expect(result.feeOutOfPocket).toBe(60); // 3% of 2000
    expect(result.biltCashAppliedToFee).toBe(0);
  });

  it('applies Bilt Cash to fee in max points mode', () => {
    const input: HousingInput = {
      amount: 2000,
      option: 'max_points',
      applyBiltCashToFee: true,
      biltCashBalanceAllocatedToFee: 40,
    };
    const result = calcHousing(input, 'monthly');
    expect(result.points).toBe(2000);
    expect(result.feeOutOfPocket).toBe(20); // 60 - 40
    expect(result.biltCashAppliedToFee).toBe(40);
  });

  it('caps Bilt Cash applied at fee amount', () => {
    const input: HousingInput = {
      amount: 2000,
      option: 'max_points',
      applyBiltCashToFee: true,
      biltCashBalanceAllocatedToFee: 100, // More than fee
    };
    const result = calcHousing(input, 'monthly');
    expect(result.feeOutOfPocket).toBe(0);
    expect(result.biltCashAppliedToFee).toBe(60); // Capped at fee
  });

  it('calculates no-fee unlock mode correctly', () => {
    const input: HousingInput = {
      amount: 2000,
      option: 'no_fee_unlock',
      biltCashRedeemForUnlock: 30, // $30 → 1000 points
    };
    const result = calcHousing(input, 'monthly');
    expect(result.points).toBe(1000); // $30 / 3 * 100 = 1000
    expect(result.feeOutOfPocket).toBe(0);
    expect(result.biltCashRedeemedForUnlock).toBe(30);
  });

  it('caps unlock points at 1 point per $1', () => {
    const input: HousingInput = {
      amount: 2000,
      option: 'no_fee_unlock',
      biltCashRedeemForUnlock: 100, // Would unlock 3333 points, but capped at 2000
    };
    const result = calcHousing(input, 'monthly');
    expect(result.points).toBe(2000); // Capped at payment amount
    expect(result.biltCashRedeemedForUnlock).toBe(100);
  });
});

describe('calcCardSpendPoints', () => {
  it('calculates Blue card correctly (1X all)', () => {
    const spend = { dining: 500, grocery: 300, travel: 200, other: 100 };
    const result = calcCardSpendPoints(spend, 'blue');
    expect(result.total).toBe(1100); // 500 + 300 + 200 + 100
    expect(result.byCategory.dining).toBe(500);
    expect(result.byCategory.grocery).toBe(300);
    expect(result.byCategory.travel).toBe(200);
    expect(result.byCategory.other).toBe(100);
  });

  it('calculates Palladium correctly (2X all)', () => {
    const spend = { dining: 500, grocery: 300, travel: 200, other: 100 };
    const result = calcCardSpendPoints(spend, 'palladium');
    expect(result.total).toBe(2200); // 2 * (500 + 300 + 200 + 100)
    expect(result.byCategory.dining).toBe(1000);
    expect(result.byCategory.grocery).toBe(600);
    expect(result.byCategory.travel).toBe(400);
    expect(result.byCategory.other).toBe(200);
  });

  it('calculates Obsidian with dining selected (3X dining, 2X travel, 1X others)', () => {
    const spend = { dining: 500, grocery: 300, travel: 200, other: 100 };
    const result = calcCardSpendPoints(spend, 'obsidian', 'dining');
    expect(result.total).toBe(2400); // 3*500 + 1*300 + 2*200 + 1*100
    expect(result.byCategory.dining).toBe(1500);
    expect(result.byCategory.grocery).toBe(300);
    expect(result.byCategory.travel).toBe(400);
    expect(result.byCategory.other).toBe(100);
  });

  it('calculates Obsidian with grocery selected (3X grocery with cap)', () => {
    const spend = { dining: 500, grocery: 26000, travel: 200, other: 100 };
    const result = calcCardSpendPoints(spend, 'obsidian', 'grocery', undefined, 'yearly');
    // First 25000 at 3X, remaining 1000 at 1X
    expect(result.byCategory.grocery).toBe(76000); // 3*25000 + 1*1000
    expect(result.byCategory.dining).toBe(500);
    expect(result.byCategory.travel).toBe(400);
    expect(result.byCategory.other).toBe(100);
  });

  it('handles Obsidian grocery cap in monthly mode with YTD', () => {
    const spend = { dining: 500, grocery: 3000, travel: 200, other: 100 };
    const result = calcCardSpendPoints(spend, 'obsidian', 'grocery', 24000, 'monthly');
    // YTD is 24000, cap is 25000, so 1000 remaining at 3X, 2000 at 1X
    expect(result.byCategory.grocery).toBe(5000); // 3*1000 + 1*2000
  });

  it('floors points conservatively', () => {
    const spend = { dining: 500.99, grocery: 300.33, travel: 200.77, other: 100.11 };
    const result = calcCardSpendPoints(spend, 'blue');
    expect(result.byCategory.dining).toBe(500);
    expect(result.byCategory.grocery).toBe(300);
    expect(result.byCategory.travel).toBe(200);
    expect(result.byCategory.other).toBe(100);
  });
});

describe('calcBiltCashFromSpend', () => {
  it('calculates 4% on eligible spend', () => {
    const spend = { dining: 500, grocery: 300, travel: 200, other: 100 };
    const result = calcBiltCashFromSpend(spend);
    expect(result).toBe(44); // 0.04 * 1100
  });

  it('returns 0 for zero spend', () => {
    const spend = { dining: 0, grocery: 0, travel: 0, other: 0 };
    const result = calcBiltCashFromSpend(spend);
    expect(result).toBe(0);
  });
});

describe('calcTotals', () => {
  it('calculates complete totals correctly', () => {
    const inputs: CalculatorInputs = {
      mode: 'monthly',
      card: 'blue',
      rent: {
        amount: 2000,
        option: 'max_points',
        applyBiltCashToFee: false,
      },
      spend: { dining: 500, grocery: 300, travel: 200, other: 100 },
    };

    const result = calcTotals(inputs);

    expect(result.points.rent).toBe(2000);
    expect(result.points.cardSpend.total).toBe(1100);
    expect(result.points.total).toBe(3100);

    expect(result.biltCash.earnedFromSpend).toBe(44);
    expect(result.fees.rentOutOfPocket).toBe(60);
    expect(result.fees.totalOutOfPocket).toBe(60);
  });

  it('handles Obsidian with grocery cap', () => {
    const inputs: CalculatorInputs = {
      mode: 'yearly',
      card: 'obsidian',
      obsidianBonusCategory: 'grocery',
      spend: { dining: 500, grocery: 26000, travel: 200, other: 100 },
    };

    const result = calcTotals(inputs);
    expect(result.points.cardSpend.byCategory.grocery).toBe(76000);
  });

  it('multiplies monthly values by 12 in yearly mode', () => {
    const monthlyInputs: CalculatorInputs = {
      mode: 'monthly',
      card: 'blue',
      rent: {
        amount: 2000,
        option: 'max_points',
        applyBiltCashToFee: false,
      },
      spend: { dining: 500, grocery: 300, travel: 200, other: 100 },
    };

    const yearlyInputs: CalculatorInputs = {
      ...monthlyInputs,
      mode: 'yearly',
    };

    const monthlyResult = calcTotals(monthlyInputs);
    const yearlyResult = calcTotals(yearlyInputs);

    // Yearly should be 12x monthly (approximately, accounting for flooring)
    expect(yearlyResult.points.rent).toBe(monthlyResult.points.rent * 12);
    expect(yearlyResult.points.cardSpend.total).toBe(monthlyResult.points.cardSpend.total * 12);
    expect(yearlyResult.fees.rentOutOfPocket).toBe(monthlyResult.fees.rentOutOfPocket * 12);
    expect(yearlyResult.biltCash.earnedFromSpend).toBe(monthlyResult.biltCash.earnedFromSpend * 12);
  });
});
