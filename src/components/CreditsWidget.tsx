import { Link } from 'react-router-dom';
import { Coins, Sparkles, Crown } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CreditsWidgetProps {
  showUpgrade?: boolean;
  compact?: boolean;
}

export function CreditsWidget({ showUpgrade = true, compact = false }: CreditsWidgetProps) {
  const { credits, subscriptionTier, isUnlimited, loading } = useCredits();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  const tierColors: Record<string, string> = {
    free: 'text-muted-foreground',
    basic: 'text-blue-500',
    pro: 'text-primary',
    business: 'text-amber-500'
  };

  const tierIcons: Record<string, typeof Coins> = {
    free: Coins,
    basic: Sparkles,
    pro: Crown,
    business: Crown
  };

  const TierIcon = tierIcons[subscriptionTier] || Coins;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <TierIcon className={`h-4 w-4 ${tierColors[subscriptionTier]}`} />
        <span className="text-sm font-medium">
          {isUnlimited ? '∞' : credits}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-2">
      <div className="flex items-center gap-2">
        <TierIcon className={`h-5 w-5 ${tierColors[subscriptionTier]}`} />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground capitalize">
            {subscriptionTier} Plan
          </span>
          <span className="text-lg font-bold">
            {isUnlimited ? (
              <span className="flex items-center gap-1">
                <span className="text-primary">∞</span>
                <span className="text-xs font-normal text-muted-foreground">Unlimited</span>
              </span>
            ) : (
              <span>
                {credits} <span className="text-xs font-normal text-muted-foreground">credits</span>
              </span>
            )}
          </span>
        </div>
      </div>
      
      {showUpgrade && subscriptionTier === 'free' && (
        <Link to="/pricing">
          <Button size="sm" variant="default" className="ml-2">
            Upgrade
          </Button>
        </Link>
      )}
    </div>
  );
}
