'use client';

import type { CardType } from '@/lib/rules/types';

type CardInfo = {
  name: string;
  fee: string;
};

const CARDS: Record<CardType, CardInfo> = {
  blue: { name: 'Bilt Blue', fee: '$0 annual fee' },
  obsidian: { name: 'Bilt Obsidian', fee: '$95 annual fee' },
  palladium: { name: 'Bilt Palladium', fee: '$495 annual fee' },
};

interface CardSelectorProps {
  value: CardType;
  onChange: (card: CardType) => void;
}

export default function CardSelector({ value, onChange }: CardSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        Select Card
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(CARDS) as CardType[]).map((card) => (
          <button
            key={card}
            type="button"
            onClick={() => onChange(card)}
            className={`p-4 rounded-lg border-2 transition-all ${
              value === card
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <div className="font-semibold text-lg text-gray-900 dark:text-white">{CARDS[card].name}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {CARDS[card].fee}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
