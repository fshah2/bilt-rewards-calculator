export type CardType = 'blue' | 'obsidian' | 'palladium';
export type HousingOption = 'max_points' | 'no_fee_unlock';
export type ObsidianBonusCategory = 'dining' | 'grocery';
export type TimeMode = 'monthly' | 'yearly';

export type SpendInputs = {
  dining: number;
  grocery: number;
  travel: number;
  other: number;
};

export type HousingInput = {
  amount: number; // USD
  option: HousingOption;

  // Max Points:
  applyBiltCashToFee?: boolean;
  biltCashBalanceAllocatedToFee?: number;

  // No Fee Unlock:
  biltCashRedeemForUnlock?: number;
};

export type CalculatorInputs = {
  mode: TimeMode;
  card: CardType;

  rent?: HousingInput;
  mortgage?: HousingInput;

  spend: SpendInputs;

  // Obsidian-only:
  obsidianBonusCategory?: ObsidianBonusCategory;
  groceryYTD?: number; // only when obsidian + grocery selected in monthly mode
};

export type HousingResult = {
  points: number;
  feeOutOfPocket: number;
  biltCashAppliedToFee: number;
  biltCashRedeemedForUnlock: number;
  costPerPoint?: number;
  impliedPercentOfPayment?: number;
};

export type CardSpendResult = {
  total: number;
  byCategory: {
    dining: number;
    grocery: number;
    travel: number;
    other: number;
  };
};

export type CalculatorResults = {
  points: {
    rent: number;
    mortgage: number;
    cardSpend: CardSpendResult;
    total: number;
  };
  biltCash: {
    earnedFromSpend: number;
    redeemedForUnlocking: number;
    appliedToFees: number;
    netChange: number;
  };
  fees: {
    rentOutOfPocket: number;
    mortgageOutOfPocket: number;
    totalOutOfPocket: number;
  };
};
