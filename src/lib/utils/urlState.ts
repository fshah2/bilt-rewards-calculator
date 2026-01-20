import type { CalculatorInputs } from '@/lib/rules/types';

/**
 * Encode calculator inputs to URL query parameters.
 * Uses base64 JSON encoding for compactness.
 */
export function encodeStateToUrl(inputs: CalculatorInputs): string {
  try {
    const json = JSON.stringify(inputs);
    const encoded = btoa(json);
    return encoded;
  } catch (error) {
    console.error('Error encoding state:', error);
    return '';
  }
}

/**
 * Decode URL query parameters to calculator inputs.
 */
export function decodeStateFromUrl(encoded: string): Partial<CalculatorInputs> | null {
  try {
    const json = atob(encoded);
    const inputs = JSON.parse(json) as Partial<CalculatorInputs>;
    return inputs;
  } catch (error) {
    console.error('Error decoding state:', error);
    return null;
  }
}

/**
 * Get shareable URL with encoded state.
 */
export function getShareableUrl(inputs: CalculatorInputs): string {
  const encoded = encodeStateToUrl(inputs);
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.set('state', encoded);
    return url.toString();
  }
  return '';
}
