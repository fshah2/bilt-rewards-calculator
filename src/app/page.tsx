'use client';

import { useState, useEffect } from 'react';
import type {
  CalculatorInputs,
  CardType,
  TimeMode,
  HousingInput,
  SpendInputs,
  ObsidianBonusCategory,
} from '@/lib/rules/types';
import { calcTotals } from '@/lib/rules/calculator';
import { decodeStateFromUrl } from '@/lib/utils/urlState';
import CardSelector from '@/components/CardSelector';
import ModeToggle from '@/components/ModeToggle';
import HousingSection from '@/components/HousingSection';
import SpendSection from '@/components/SpendSection';
import ResultsSection from '@/components/ResultsSection';
import AccordionHowItWorks from '@/components/AccordionHowItWorks';
import ShareLinkButton from '@/components/ShareLinkButton';
import CompareCardsToggle from '@/components/CompareCardsToggle';
import CompareCardsView from '@/components/CompareCardsView';

const DEFAULT_INPUTS: CalculatorInputs = {
  mode: 'monthly',
  card: 'blue',
  spend: {
    dining: 0,
    grocery: 0,
    travel: 0,
    other: 0,
  },
  obsidianBonusCategory: 'dining',
};

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [compareMode, setCompareMode] = useState(false);

  // Load state from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const encodedState = params.get('state');
      if (encodedState) {
        const decoded = decodeStateFromUrl(encodedState);
        if (decoded) {
          setInputs((prev) => ({
            ...DEFAULT_INPUTS,
            ...decoded,
            spend: { ...DEFAULT_INPUTS.spend, ...decoded.spend },
          }));
        }
      }
    }
  }, []);

  const results = calcTotals(inputs);

  const handleCardChange = (card: CardType) => {
    setInputs((prev) => ({
      ...prev,
      card,
      // Reset Obsidian-specific fields if switching away
      ...(card !== 'obsidian' && {
        obsidianBonusCategory: undefined,
        groceryYTD: undefined,
      }),
    }));
  };

  const handleModeChange = (mode: TimeMode) => {
    setInputs((prev) => ({ ...prev, mode }));
  };

  const handleRentChange = (rent: HousingInput | undefined) => {
    setInputs((prev) => ({ ...prev, rent }));
  };

  const handleMortgageChange = (mortgage: HousingInput | undefined) => {
    setInputs((prev) => ({ ...prev, mortgage }));
  };

  const handleSpendChange = (spend: SpendInputs) => {
    setInputs((prev) => ({ ...prev, spend }));
  };

  const handleObsidianBonusCategoryChange = (
    category: ObsidianBonusCategory
  ) => {
    setInputs((prev) => ({
      ...prev,
      obsidianBonusCategory: category,
      // Reset groceryYTD if switching away from grocery
      ...(category !== 'grocery' && { groceryYTD: undefined }),
    }));
  };

  const handleGroceryYTDChange = (value: number | undefined) => {
    setInputs((prev) => ({ ...prev, groceryYTD: value }));
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-white drop-shadow-lg">
            Bilt Card 2.0 Rewards Calculator
          </h1>
          <p className="text-center text-gray-200 drop-shadow">
            (Blue / Obsidian / Palladium)
          </p>
        </header>

        {/* Card selector and mode toggle */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 space-y-6">
          <CardSelector value={inputs.card} onChange={handleCardChange} />
          <ModeToggle value={inputs.mode} onChange={handleModeChange} />
          {inputs.mode === 'yearly' && (
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-sm text-gray-800 dark:text-gray-200">
              <strong className="text-gray-900 dark:text-white">Note:</strong> In yearly mode, enter your monthly amounts. The calculator will multiply by 12 to show annual totals.
            </div>
          )}
          <div className="flex items-center justify-between">
            <CompareCardsToggle
              enabled={compareMode}
              onChange={setCompareMode}
            />
            <ShareLinkButton inputs={inputs} />
          </div>
        </div>

        {/* Compare mode */}
        {compareMode ? (
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
            <CompareCardsView
              inputs={{
                mode: inputs.mode,
                rent: inputs.rent,
                mortgage: inputs.mortgage,
                spend: inputs.spend,
                obsidianBonusCategory: inputs.obsidianBonusCategory,
                groceryYTD: inputs.groceryYTD,
              }}
            />
          </div>
        ) : (
          <>
            {/* Housing section */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
              <HousingSection
                rent={inputs.rent}
                mortgage={inputs.mortgage}
                onRentChange={handleRentChange}
                onMortgageChange={handleMortgageChange}
                mode={inputs.mode}
              />
            </div>

            {/* Card spend section */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
              <SpendSection
                spend={inputs.spend}
                onChange={handleSpendChange}
                card={inputs.card}
                obsidianBonusCategory={inputs.obsidianBonusCategory ?? 'dining'}
                onObsidianBonusCategoryChange={handleObsidianBonusCategoryChange}
                groceryYTD={inputs.groceryYTD}
                onGroceryYTDChange={handleGroceryYTDChange}
                mode={inputs.mode}
              />
            </div>

            {/* Results section */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6">
              <ResultsSection results={results} />
            </div>
          </>
        )}

        {/* How it works accordion */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-md p-6">
          <AccordionHowItWorks />
        </div>
      </div>
    </main>
  );
}
