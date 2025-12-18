import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type AppRole = 'admin' | 'moderator' | 'user';

interface UserRoleState {
  roles: AppRole[];
  isAdmin: boolean;
  isModerator: boolean;
  loading: boolean;
  error: string | null;
}

export function useUserRole() {
  const { user } = useAuth();
  const [state, setState] = useState<UserRoleState>({
    roles: [],
    isAdmin: false,
    isModerator: false,
    loading: true,
    error: null
  });

  const fetchRoles = useCallback(async () => {
    if (!user) {
      setState({
        roles: [],
        isAdmin: false,
        isModerator: false,
        loading: false,
        error: null
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;

      const roles = (data?.map(r => r.role) || []) as AppRole[];
      
      setState({
        roles,
        isAdmin: roles.includes('admin'),
        isModerator: roles.includes('moderator') || roles.includes('admin'),
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch roles'
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const hasRole = useCallback((role: AppRole): boolean => {
    return state.roles.includes(role);
  }, [state.roles]);

  const hasAnyRole = useCallback((roles: AppRole[]): boolean => {
    return roles.some(role => state.roles.includes(role));
  }, [state.roles]);

  return {
    ...state,
    hasRole,
    hasAnyRole,
    refreshRoles: fetchRoles
  };
}
