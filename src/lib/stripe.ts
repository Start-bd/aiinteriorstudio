import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';
import type { PricingTier, CreditPack } from './pricing';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!key) {
      console.warn('Stripe public key not configured');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export async function createSubscriptionCheckout(
  tier: PricingTier,
  billingPeriod: 'monthly' | 'yearly' = 'monthly'
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      tier: tier.name,
      mode: 'subscription',
      billingPeriod
    }
  });

  if (error) {
    throw new Error(error.message || 'Failed to create checkout session');
  }

  if (data?.url) {
    window.location.href = data.url;
  }
}

export async function createCreditPackCheckout(
  pack: CreditPack
): Promise<void> {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      packId: pack.id,
      credits: pack.credits + pack.bonus,
      amount: pack.price.usd,
      mode: 'payment'
    }
  });

  if (error) {
    throw new Error(error.message || 'Failed to create checkout session');
  }

  if (data?.url) {
    window.location.href = data.url;
  }
}

export async function createCustomerPortalSession(): Promise<string | null> {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      mode: 'portal'
    }
  });

  if (error) {
    throw new Error(error.message || 'Failed to create portal session');
  }

  return data?.url || null;
}
