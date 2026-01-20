'use client';

interface CompareCardsToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function CompareCardsToggle({
  enabled,
  onChange,
}: CompareCardsToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      <span className="text-sm font-medium text-gray-900 dark:text-white">Compare all cards</span>
    </label>
  );
}
