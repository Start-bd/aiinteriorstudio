import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RoomType {
  id: string;
  name: string;
  display_name: string;
  icon: string | null;
  sort_order: number;
}

export function useRoomTypes() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        const { data, error } = await supabase
          .from('room_types')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;

        setRoomTypes(data || []);
      } catch (err) {
        console.error('Error fetching room types:', err);
        setError('Failed to load room types');
      } finally {
        setLoading(false);
      }
    }

    fetchRoomTypes();
  }, []);

  return { roomTypes, loading, error };
}
