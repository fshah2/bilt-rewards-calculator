'use client';

import Image from 'next/image';
import type { CardType } from '@/lib/rules/types';

type CardInfo = {
  name: string;
  fee: string;
  imageSrc: string;
  imageAlt: string;
};

const CARDS: Record<CardType, CardInfo> = {
  blue: {
    name: 'Bilt Blue',
    fee: '$0 annual fee',
    imageSrc: '/cards/blue.png',
    imageAlt: 'Bilt Blue card',
  },
  obsidian: {
    name: 'Bilt Obsidian',
    fee: '$95 annual fee',
    imageSrc: '/cards/obsidian.png',
    imageAlt: 'Bilt Obsidian card',
  },
  palladium: {
    name: 'Bilt Palladium',
    fee: '$495 annual fee',
    imageSrc: '/cards/palladium.png',
    imageAlt: 'Bilt Palladium card',
  },
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
        {(Object.keys(CARDS) as CardType[]).map((card) => {
          const selected = value === card;
          const info = CARDS[card];

          return (
            <button
              key={card}
              type="button"
              onClick={() => onChange(card)}
              className={[
                'rounded-lg border-2 transition-all text-left',
                'p-4',
                selected
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400',
              ].join(' ')}
            >
              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                {info.name}
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300">
                {info.fee}
              </div>

              {/* Card image (inside the tile, below text) */}
              <div className="mt-3">
                {/* Dimension-locked wrapper prevents layout shift */}
                <div className="relative w-full max-w-[320px] aspect-[1.6/1]">
                  <Image
                    src={info.imageSrc}
                    alt={info.imageAlt}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 260px, 320px"
                    className="object-contain"
                    priority={selected}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
