import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Zap, Calendar, CreditCard, ArrowUpRight, Check, Infinity } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useSubscription } from "@/hooks/useSubscription";
import { PRICING_TIERS, formatCurrency } from "@/lib/pricing";
import { format } from "date-fns";

export function SubscriptionManagement() {
  const { credits, subscriptionTier, isUnlimited, loading: creditsLoading } = useCredits();
  const { subscription, loading: subscriptionLoading } = useSubscription();

  const currentTier = PRICING_TIERS.find(t => t.name === subscriptionTier) || PRICING_TIERS[0];
  const nextTier = PRICING_TIERS.find(t => {
    const tierOrder = ['free', 'basic', 'pro', 'business'];
    return tierOrder.indexOf(t.name) === tierOrder.indexOf(subscriptionTier) + 1;
  });

  const creditsUsedPercent = currentTier.credits > 0 
    ? Math.min(100, ((currentTier.credits - credits) / currentTier.credits) * 100)
    : 0;

  if (creditsLoading || subscriptionLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card className="glass-card border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-display">Current Plan</CardTitle>
                <CardDescription>Manage your subscription and credits</CardDescription>
              </div>
            </div>
            <Badge 
              variant={subscriptionTier === 'free' ? 'secondary' : 'default'}
              className={subscriptionTier === 'pro' ? 'bg-gradient-gold text-primary-foreground' : ''}
            >
              {currentTier.displayName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {/* Credits Display */}
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Available Credits
              </span>
              <span className="font-display font-bold text-lg">
                {isUnlimited ? (
                  <span className="flex items-center gap-1">
                    <Infinity className="w-5 h-5 text-primary" />
                    Unlimited
                  </span>
                ) : (
                  `${credits} / ${currentTier.credits}`
                )}
              </span>
            </div>
            {!isUnlimited && (
              <Progress value={100 - creditsUsedPercent} className="h-2" />
            )}
          </div>

          {/* Subscription Details */}
          {subscription && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Billing Period
                </p>
                <p className="font-medium text-sm">
                  {subscription.current_period_start && subscription.current_period_end 
                    ? `${format(new Date(subscription.current_period_start), 'MMM d')} - ${format(new Date(subscription.current_period_end), 'MMM d, yyyy')}`
                    : 'Monthly'
                  }
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  Next Payment
                </p>
                <p className="font-medium text-sm">
                  {subscription.current_period_end 
                    ? format(new Date(subscription.current_period_end), 'MMM d, yyyy')
                    : '-'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Plan Features */}
          <div>
            <p className="text-sm font-medium mb-3">Included in your plan:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentTier.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upgrade Card */}
        {nextTier && (
          <Card className="glass-card border-border hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-primary" />
                Upgrade to {nextTier.displayName}
              </CardTitle>
              <CardDescription>
                {nextTier.credits === -1 ? 'Unlimited generations' : `${nextTier.credits} generations/month`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-bold">{formatCurrency(nextTier.price.usd, 'USD')}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2">
                {nextTier.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="block">
                <Button className="w-full" variant="gold">
                  Upgrade Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Buy Credits Card */}
        <Card className="glass-card border-border hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Need More Credits?
            </CardTitle>
            <CardDescription>
              Purchase credit packs for one-time use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Credit packs never expire and can be used anytime. Perfect for occasional bursts of creativity.
            </p>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
              <div className="text-center">
                <p className="text-2xl font-display font-bold">10</p>
                <p className="text-xs text-muted-foreground">credits</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-display font-bold">25</p>
                <p className="text-xs text-muted-foreground">credits</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-display font-bold">60</p>
                <p className="text-xs text-muted-foreground">credits</p>
              </div>
            </div>
            <Link to="/pricing" className="block">
              <Button className="w-full" variant="outline">
                View Credit Packs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* View All Plans */}
      <div className="text-center pt-4">
        <Link to="/pricing">
          <Button variant="link" className="text-muted-foreground hover:text-foreground">
            View all pricing plans and features
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}