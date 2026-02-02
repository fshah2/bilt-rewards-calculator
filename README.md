# Bilt Card 2.0 Rewards Calculator

A simple, user-friendly, mobile-first single-page calculator for estimating Bilt Points and Bilt Cash earnings across the Bilt Blue, Obsidian, and Palladium cards.
https://www.calculatebiltrewards.online/

## Features

- **Three Card Support**: Calculate rewards for Bilt Blue ($0 annual fee), Bilt Obsidian ($95 annual fee), and Bilt Palladium ($495 annual fee)
- **Housing Payments**: Model rent and mortgage payments with two options:
  - **Max Points**: 1 point per $1 with 3% transaction fee (can be offset with Bilt Cash)
  - **No Transaction Fee**: Optional unlock points via Bilt Cash redemption ($3 → 100 points, capped at 1 point per $1)
- **Card Spend Categories**: Dining, Grocery, Travel, and Other
- **Obsidian Features**:
  - Choose 3X category (Dining or Grocery)
  - Grocery 3X cap modeling ($25,000 per calendar year)
- **Time Modes**: Monthly or Yearly calculations
- **Compare Cards**: Toggle to compare all three cards side-by-side
- **Share Links**: Generate shareable URLs with encoded calculator state
- **Mobile-First Design**: Responsive UI optimized for all screen sizes

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vitest** for unit testing
- **Pure Functions**: All calculations are client-side with a rules engine

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd biltrewardscalculator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Calculation Rules & Assumptions

### Bilt Cash
- **Earned**: 4% on eligible card spend (Dining, Grocery, Travel, Other)
- **Not Earned**: Rent and mortgage payments do NOT earn Bilt Cash
- **Usage**: Can be applied to transaction fees or redeemed to unlock points

### Points by Card

#### Bilt Blue
- **Card Spend**: 1X on all categories
- **Housing**: 1X (with fee) or unlock via Bilt Cash

#### Bilt Obsidian
- **Travel**: 2X
- **Selected Category**: 3X (Dining or Grocery)
- **Other Categories**: 1X
- **Grocery Cap**: 3X up to $25,000 per calendar year, then 1X

#### Bilt Palladium
- **Card Spend**: 2X on all eligible purchases
- **Housing**: 1X (with fee) or unlock via Bilt Cash

### Housing Payment Options

#### Max Points Mode
- Earn 1 point per $1 of payment
- 3% transaction fee
- Option to apply Bilt Cash to offset fee
- Points = floor(payment_amount)

#### No Transaction Fee + Unlock Mode
- No transaction fee
- Optional: Redeem Bilt Cash to unlock points
- Conversion: $3 Bilt Cash → 100 points
- Cap: Maximum 1 point per $1 of payment
- Points = min(floor((bilt_cash_redeemed / 3) * 100), floor(payment_amount))

### Points Calculation Strategy

- **Conservative Integer Points**: All points are calculated using `Math.floor()` to ensure conservative estimates
- **Per-Category Flooring**: Points are floored per category for transparency, then summed
- **Cents Ignored**: Fractional dollars are ignored in point calculations (e.g., $500.99 → 500 points)

### Exclusions & Disclaimers

- **Eligible Purchases Exclusions**: Balance transfers, cash advances, cash-like transactions, person-to-person payments, fees/interest, etc.
- **Partner Boosts**: Not modeled (Lyft, dining network, portal multipliers, etc.)
- **Merchant Classification**: Based on MCC codes; actual results may vary
- **Eligibility**: Assumes account in good standing and payments made through Bilt app/website

## Share Links

The calculator supports sharing estimates via URL parameters. The state is encoded as base64 JSON in the `state` query parameter. When someone opens a shared link, the calculator automatically restores the inputs.

## License

This project is provided as-is for educational and personal use.

## Notes

- This calculator is a frontend-only tool with no backend, authentication, or data scraping
- All calculations are performed client-side
- The calculator provides estimates; actual rewards may vary based on merchant classification and Bilt's terms
- For the most accurate information, refer to official Bilt documentation and terms
