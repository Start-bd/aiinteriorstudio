import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Zap, Crown, Building2, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { PRICING_TIERS, CREDIT_PACKS, formatCurrency } from '@/lib/pricing';
import { createSubscriptionCheckout, createCreditPackCheckout } from '@/lib/stripe';
import { toast } from 'sonner';

type Currency = 'USD' | 'BDT';
type BillingPeriod = 'monthly' | 'yearly';

const tierIcons = {
  free: Zap,
  basic: Sparkles,
  pro: Crown,
  business: Building2,
};

export default function Pricing() {
  const { user } = useAuth();
  const { subscriptionTier } = useCredits();
  const navigate = useNavigate();
  
  const [currency, setCurrency] = useState<Currency>('USD');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      navigate('/auth?redirect=/pricing');
      return;
    }

    const tier = PRICING_TIERS.find(t => t.id === tierId);
    if (!tier || tier.id === 'free') return;

    try {
      setLoading(tierId);
      await createSubscriptionCheckout(tier, billingPeriod);
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleBuyCredits = async (packId: string) => {
    if (!user) {
      navigate('/auth?redirect=/pricing');
      return;
    }

    const pack = CREDIT_PACKS.find(p => p.id === packId);
    if (!pack) return;

    try {
      setLoading(packId);
      await createCreditPackCheckout(pack);
    } catch (error) {
      console.error('Credit purchase error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // Stripe always charges in USD. BDT is shown only as an approximate conversion
  // so the displayed amount matches what the customer is actually billed.
  const USD_TO_BDT = 122;

  const getPrice = (usd: number, _bdt?: number) => {
    const yearlyUsd = billingPeriod === 'yearly' ? usd * 12 * 0.8 : usd;
    return currency === 'USD'
      ? formatCurrency(yearlyUsd, 'USD')
      : formatCurrency(Math.round(yearlyUsd * USD_TO_BDT), 'BDT');
  };

  const getPackPrice = (usd: number) =>
    currency === 'USD'
      ? formatCurrency(usd, 'USD')
      : formatCurrency(Math.round(usd * USD_TO_BDT), 'BDT');

  return (
    <>
      <Helmet>
        <title>Pricing | Interior of AI</title>
        <meta name="description" content="Choose your Interior of AI plan. Start free, upgrade anytime for unlimited AI interior design generations." />
        <link rel="canonical" href="https://interiorofai.com/pricing" />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Choose Your <span className="text-gradient-gold">Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Start free, upgrade anytime
            </p>
            {currency === 'BDT' && (
              <p className="text-sm text-muted-foreground mb-4">
                BDT amounts are approximate. All payments are processed and charged in USD.
              </p>
            )}

            {/* Currency & Billing Period Toggles */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {/* Currency Toggle */}
              <div className="inline-flex rounded-full bg-secondary p-1">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    currency === 'USD'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('BDT')}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    currency === 'BDT'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  BDT (৳)
                </button>
              </div>

              {/* Billing Period Toggle */}
              <div className="inline-flex rounded-full bg-secondary p-1">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    billingPeriod === 'yearly'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Yearly
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Subscription Tiers */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {PRICING_TIERS.map((tier) => {
              const Icon = tierIcons[tier.id as keyof typeof tierIcons];
              const isCurrentPlan = subscriptionTier === tier.id;

              return (
                <Card
                  key={tier.id}
                  className={`relative glass-card border-border hover-lift ${
                    tier.popular ? 'ring-2 ring-primary' : ''
                  } ${isCurrentPlan ? 'border-2 border-green-500' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-2xl font-display">
                      {tier.displayName}
                    </CardTitle>
                    <div className="text-4xl font-bold mt-2">
                      {tier.id === 'free' ? 'Free' : getPrice(tier.price.usd, tier.price.bdt)}
                    </div>
                    {tier.id !== 'free' && (
                      <div className="text-muted-foreground">
                        per {billingPeriod === 'monthly' ? 'month' : 'year'}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSubscribe(tier.id)}
                      disabled={loading === tier.id || isCurrentPlan || tier.id === 'free'}
                      className={`w-full ${
                        tier.popular
                          ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90'
                          : ''
                      }`}
                      variant={tier.popular ? 'default' : 'outline'}
                    >
                      {loading === tier.id ? 'Processing...' : 
                       isCurrentPlan ? 'Current Plan' :
                       tier.id === 'free' ? 'Get Started' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Credit Packs */}
          <Card className="glass-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-display">
                Or Buy <span className="text-gradient-gold">Credit Packs</span>
              </CardTitle>
              <p className="text-muted-foreground">
                One-time purchase, credits never expire
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                {CREDIT_PACKS.map((pack) => (
                  <div 
                    key={pack.id} 
                    className="border-2 border-border rounded-xl p-6 hover:border-primary transition-all bg-card"
                  >
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold mb-2">
                        {pack.name}
                      </div>
                      <div className="text-3xl font-bold text-foreground">
                        {pack.credits}
                      </div>
                      <div className="text-sm text-muted-foreground">credits</div>
                      {pack.bonus > 0 && (
                        <div className="mt-2 text-sm text-green-500 font-semibold">
                          +{pack.bonus} bonus credits
                        </div>
                      )}
                    </div>

                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-primary">
                        {getPackPrice(pack.price.usd)}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBuyCredits(pack.id)}
                      disabled={loading === pack.id}
                      className="w-full"
                      variant="outline"
                    >
                      {loading === pack.id ? 'Processing...' : 'Buy Now'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Link */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Have questions? <Link to="/#faq" className="text-primary hover:underline">Check our FAQ</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
