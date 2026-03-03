import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Subscription {
  id: string;
  tier: 'basic' | 'pro' | 'business';
  status: 'active' | 'cancelled' | 'past_due' | 'incomplete';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    subscription: null,
    loading: true,
    error: null
  });

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setState({ subscription: null, loading: false, error: null });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, tier, status, current_period_start, current_period_end, cancel_at_period_end, cancelled_at, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;

      setState({
        subscription: data as Subscription | null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setState({
        subscription: null,
        loading: false,
        error: 'Failed to fetch subscription'
      });
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isSubscribed = state.subscription?.status === 'active';
  const isPro = state.subscription?.tier === 'pro' || state.subscription?.tier === 'business';

  return {
    ...state,
    isSubscribed,
    isPro,
    refreshSubscription: fetchSubscription
  };
}
