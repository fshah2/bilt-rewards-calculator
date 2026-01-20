'use client';

import { useState } from 'react';
import type { CalculatorInputs } from '@/lib/rules/types';
import { getShareableUrl } from '@/lib/utils/urlState';

interface ShareLinkButtonProps {
  inputs: CalculatorInputs;
}

export default function ShareLinkButton({ inputs }: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = getShareableUrl(inputs);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {copied ? '✓ Copied!' : 'Share this estimate'}
    </button>
  );
}
