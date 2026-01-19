import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CreditsState {
  credits: number;
  subscriptionTier: 'free' | 'basic' | 'pro' | 'business';
  isUnlimited: boolean;
  loading: boolean;
}

export function useCredits() {
  const { user } = useAuth();
  const [state, setState] = useState<CreditsState>({
    credits: 0,
    subscriptionTier: 'free',
    isUnlimited: false,
    loading: true
  });

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      // Use profiles_safe view to avoid exposing sensitive fields like stripe_customer_id
      const { data, error } = await supabase
        .from('profiles_safe')
        .select('credits, subscription_tier')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      const tier = (data?.subscription_tier || 'free') as CreditsState['subscriptionTier'];
      const isUnlimited = tier === 'pro' || tier === 'business';

      setState({
        credits: data?.credits || 0,
        subscriptionTier: tier,
        isUnlimited,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching credits:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('credits-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newData = payload.new as { credits: number; subscription_tier: string };
          const tier = (newData.subscription_tier || 'free') as CreditsState['subscriptionTier'];
          const isUnlimited = tier === 'pro' || tier === 'business';
          
          setState({
            credits: newData.credits || 0,
            subscriptionTier: tier,
            isUnlimited,
            loading: false
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const hasEnoughCredits = useCallback((amount: number = 1): boolean => {
    if (state.isUnlimited) return true;
    return state.credits >= amount;
  }, [state.credits, state.isUnlimited]);

  const refreshCredits = useCallback(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    ...state,
    hasEnoughCredits,
    refreshCredits
  };
}
