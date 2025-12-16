// Interior of AI - Pricing Configuration

export interface PricingTier {
  id: string;
  name: string;
  displayName: string;
  price: {
    usd: number;
    bdt: number;
  };
  credits: number; // -1 means unlimited
  features: string[];
  stripePriceId?: string;
  popular?: boolean;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: {
    usd: number;
    bdt: number;
  };
  bonus: number;
  stripePriceId?: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'free',
    displayName: 'Free',
    price: { usd: 0, bdt: 0 },
    credits: 3,
    features: [
      '3 generations per month',
      'Standard quality',
      'Public gallery access',
      'Basic styles',
      'Watermarked downloads'
    ]
  },
  {
    id: 'basic',
    name: 'basic',
    displayName: 'Basic',
    price: { usd: 9, bdt: 299 },
    credits: 50,
    features: [
      '50 generations per month',
      'High quality (HD)',
      'Priority processing',
      'All styles unlocked',
      'No watermarks',
      'Commercial use'
    ],
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_BASIC
  },
  {
    id: 'pro',
    name: 'pro',
    displayName: 'Pro',
    price: { usd: 19, bdt: 599 },
    credits: -1, // Unlimited
    features: [
      'Unlimited generations',
      'Ultra HD quality',
      'Instant processing',
      'Premium styles',
      'Advanced editing',
      'Priority support',
      'Commercial license'
    ],
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
    popular: true
  },
  {
    id: 'business',
    name: 'business',
    displayName: 'Business',
    price: { usd: 49, bdt: 1499 },
    credits: -1, // Unlimited
    features: [
      'Everything in Pro',
      'Team collaboration (5 seats)',
      'White-label exports',
      'Custom branding',
      'Dedicated support',
      'SLA guarantee',
      'Extended commercial license'
    ],
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_BUSINESS
  }
];

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: 'pack_10',
    name: 'Starter',
    credits: 10,
    price: { usd: 5, bdt: 159 },
    bonus: 0
  },
  {
    id: 'pack_25',
    name: 'Popular',
    credits: 25,
    price: { usd: 10, bdt: 299 },
    bonus: 5
  },
  {
    id: 'pack_60',
    name: 'Best Value',
    credits: 60,
    price: { usd: 20, bdt: 599 },
    bonus: 15
  },
  {
    id: 'pack_150',
    name: 'Power User',
    credits: 150,
    price: { usd: 45, bdt: 1399 },
    bonus: 50
  }
];

export function formatCurrency(amount: number, currency: 'USD' | 'BDT'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  } else {
    return `৳${amount.toLocaleString('en-IN')}`;
  }
}

export function getTierByName(name: string): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.name === name);
}
