import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Style {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  thumbnail_url: string | null;
  prompt_template: string;
  negative_prompt_template: string | null;
  is_premium: boolean;
  sort_order: number;
}

export function useStyles() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStyles() {
      try {
        const { data, error } = await supabase
          .from('styles')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;

        setStyles(data || []);
      } catch (err) {
        console.error('Error fetching styles:', err);
        setError('Failed to load styles');
      } finally {
        setLoading(false);
      }
    }

    fetchStyles();
  }, []);

  return { styles, loading, error };
}
