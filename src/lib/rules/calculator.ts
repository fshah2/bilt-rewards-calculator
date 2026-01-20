import type {
  CardType,
  HousingInput,
  SpendInputs,
  CalculatorInputs,
  CalculatorResults,
  HousingResult,
  CardSpendResult,
  ObsidianBonusCategory,
} from './types';

/**
 * Calculate housing payment rewards and fees.
 * 
 * Flooring strategy: Points are floored at the final step for each housing payment.
 * Fees and cash use normal floating-point math (formatted to 2 decimals in UI).
 */
export function calcHousing(
  input: HousingInput | undefined,
  mode: 'monthly' | 'yearly'
): HousingResult {
  if (!input || input.amount <= 0) {
    return {
      points: 0,
      feeOutOfPocket: 0,
      biltCashAppliedToFee: 0,
      biltCashRedeemedForUnlock: 0,
    };
  }

  const amount = input.amount;

  if (input.option === 'max_points') {
    // Max Points mode: 1 point per $1, 3% fee
    const feeDue = 0.03 * amount;
    const applyCash = input.applyBiltCashToFee ?? true;
    const allocatedBalance = input.biltCashBalanceAllocatedToFee ?? 0;
    
    const biltCashAppliedToFee = applyCash
      ? Math.min(allocatedBalance, feeDue)
      : 0;
    
    const feeOutOfPocket = feeDue - biltCashAppliedToFee;
    const points = Math.floor(amount); // Conservative integer points

    const costPerPoint = points > 0 ? feeOutOfPocket / points : undefined;

    return {
      points,
      feeOutOfPocket,
      biltCashAppliedToFee,
      biltCashRedeemedForUnlock: 0,
      costPerPoint,
    };
  } else {
    // No Transaction Fee + unlock mode
    const biltCashRedeemed = input.biltCashRedeemForUnlock ?? 0;
    
    // $3 Bilt Cash → 100 points
    const pointsUnlockedByCash = Math.floor((biltCashRedeemed / 3) * 100);
    
    // Cap at 1 point per $1 of payment
    const pointsCap = Math.floor(amount);
    const points = Math.min(pointsUnlockedByCash, pointsCap);

    const impliedPercentOfPayment = amount > 0
      ? biltCashRedeemed / amount
      : undefined;

    const costPerPoint = points > 0 ? biltCashRedeemed / points : undefined;

    return {
      points,
      feeOutOfPocket: 0,
      biltCashAppliedToFee: 0,
      biltCashRedeemedForUnlock: biltCashRedeemed,
      costPerPoint,
      impliedPercentOfPayment,
    };
  }
}

/**
 * Calculate Bilt Cash earned from eligible card spend.
 * Housing payments do NOT earn Bilt Cash.
 */
export function calcBiltCashFromSpend(spend: SpendInputs): number {
  return 0.04 * (spend.dining + spend.grocery + spend.travel + spend.other);
}

/**
 * Calculate points from card spend based on card type.
 * 
 * Flooring strategy: Floor each category result separately for transparency,
 * then sum. This ensures conservative integer points per category.
 */
export function calcCardSpendPoints(
  spend: SpendInputs,
  card: CardType,
  obsidianBonusCategory?: ObsidianBonusCategory,
  groceryYTD?: number,
  mode: 'monthly' | 'yearly' = 'monthly'
): CardSpendResult {
  if (card === 'blue') {
    // Blue: 1X on all spend
    return {
      total: Math.floor(spend.dining) + Math.floor(spend.grocery) +
             Math.floor(spend.travel) + Math.floor(spend.other),
      byCategory: {
        dining: Math.floor(spend.dining),
        grocery: Math.floor(spend.grocery),
        travel: Math.floor(spend.travel),
        other: Math.floor(spend.other),
      },
    };
  }

  if (card === 'palladium') {
    // Palladium: 2X on all eligible purchases
    return {
      total: Math.floor(2 * spend.dining) + Math.floor(2 * spend.grocery) +
             Math.floor(2 * spend.travel) + Math.floor(2 * spend.other),
      byCategory: {
        dining: Math.floor(2 * spend.dining),
        grocery: Math.floor(2 * spend.grocery),
        travel: Math.floor(2 * spend.travel),
        other: Math.floor(2 * spend.other),
      },
    };
  }

  // Obsidian: Travel 2X, selected category 3X, others 1X
  // Grocery 3X has a $25,000 per calendar year cap
  const bonusCategory = obsidianBonusCategory ?? 'dining';

  let diningPoints: number;
  let groceryPoints: number;
  let travelPoints: number;
  let otherPoints: number;

  // Travel is always 2X
  travelPoints = Math.floor(2 * spend.travel);

  // Other is always 1X
  otherPoints = Math.floor(spend.other);

  if (bonusCategory === 'dining') {
    diningPoints = Math.floor(3 * spend.dining);
    groceryPoints = Math.floor(spend.grocery);
  } else {
    // Grocery selected: 3X with cap
    diningPoints = Math.floor(spend.dining);
    
    if (mode === 'yearly') {
      // Yearly mode: model cap precisely
      const cap = 25000;
      const eligibleGroceryFor3x = Math.min(spend.grocery, cap);
      const remainderGrocery = Math.max(0, spend.grocery - cap);
      groceryPoints = Math.floor(3 * eligibleGroceryFor3x) + Math.floor(remainderGrocery);
    } else {
      // Monthly mode
      if (groceryYTD !== undefined) {
        // With YTD: model cap precisely
        const cap = 25000;
        const capRemaining = Math.max(0, cap - groceryYTD);
        const eligibleThisMonth = Math.min(spend.grocery, capRemaining);
        const remainderThisMonth = Math.max(0, spend.grocery - capRemaining);
        groceryPoints = Math.floor(3 * eligibleThisMonth) + Math.floor(remainderThisMonth);
      } else {
        // Without YTD: approximate with annualized
        const annualizedGrocery = spend.grocery * 12;
        const cap = 25000;
        if (annualizedGrocery <= cap) {
          groceryPoints = Math.floor(3 * spend.grocery);
        } else {
          // Approximate: assume cap is spread evenly
          const monthlyCap = cap / 12;
          const eligibleThisMonth = Math.min(spend.grocery, monthlyCap);
          const remainderThisMonth = Math.max(0, spend.grocery - monthlyCap);
          groceryPoints = Math.floor(3 * eligibleThisMonth) + Math.floor(remainderThisMonth);
        }
      }
    }
  }

  return {
    total: diningPoints + groceryPoints + travelPoints + otherPoints,
    byCategory: {
      dining: diningPoints,
      grocery: groceryPoints,
      travel: travelPoints,
      other: otherPoints,
    },
  };
}

/**
 * Calculate all totals from calculator inputs.
 * 
 * In yearly mode, multiplies monthly recurring values (housing and spend) by 12.
 */
export function calcTotals(inputs: CalculatorInputs): CalculatorResults {
  // For yearly mode, multiply monthly amounts by 12
  const multiplier = inputs.mode === 'yearly' ? 12 : 1;

  // Adjust housing inputs for yearly mode
  const rentInput: typeof inputs.rent = inputs.rent
    ? {
        ...inputs.rent,
        amount: inputs.rent.amount * multiplier,
        biltCashBalanceAllocatedToFee:
          (inputs.rent.biltCashBalanceAllocatedToFee ?? 0) * multiplier,
        biltCashRedeemForUnlock:
          (inputs.rent.biltCashRedeemForUnlock ?? 0) * multiplier,
      }
    : undefined;

  const mortgageInput: typeof inputs.mortgage = inputs.mortgage
    ? {
        ...inputs.mortgage,
        amount: inputs.mortgage.amount * multiplier,
        biltCashBalanceAllocatedToFee:
          (inputs.mortgage.biltCashBalanceAllocatedToFee ?? 0) * multiplier,
        biltCashRedeemForUnlock:
          (inputs.mortgage.biltCashRedeemForUnlock ?? 0) * multiplier,
      }
    : undefined;

  // Adjust spend inputs for yearly mode
  const spendInput: SpendInputs = {
    dining: inputs.spend.dining * multiplier,
    grocery: inputs.spend.grocery * multiplier,
    travel: inputs.spend.travel * multiplier,
    other: inputs.spend.other * multiplier,
  };

  const rentResult = calcHousing(rentInput, inputs.mode);
  const mortgageResult = calcHousing(mortgageInput, inputs.mode);

  const cardSpendResult = calcCardSpendPoints(
    spendInput,
    inputs.card,
    inputs.obsidianBonusCategory,
    inputs.groceryYTD, // YTD is already annual, no need to multiply
    inputs.mode
  );

  const biltCashEarned = calcBiltCashFromSpend(spendInput);
  const biltCashRedeemed = rentResult.biltCashRedeemedForUnlock +
                          mortgageResult.biltCashRedeemedForUnlock;
  const biltCashApplied = rentResult.biltCashAppliedToFee +
                          mortgageResult.biltCashAppliedToFee;
  const biltCashNet = biltCashEarned - biltCashRedeemed - biltCashApplied;

  return {
    points: {
      rent: rentResult.points,
      mortgage: mortgageResult.points,
      cardSpend: cardSpendResult,
      total: rentResult.points + mortgageResult.points + cardSpendResult.total,
    },
    biltCash: {
      earnedFromSpend: biltCashEarned,
      redeemedForUnlocking: biltCashRedeemed,
      appliedToFees: biltCashApplied,
      netChange: biltCashNet,
    },
    fees: {
      rentOutOfPocket: rentResult.feeOutOfPocket,
      mortgageOutOfPocket: mortgageResult.feeOutOfPocket,
      totalOutOfPocket: rentResult.feeOutOfPocket + mortgageResult.feeOutOfPocket,
    },
  };
}
