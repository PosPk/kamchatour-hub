import { useEffect, useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase as client } from '../lib/supabase';
const supabase: SupabaseClient | null = client;

export interface BookingStatusResult {
  status: string | undefined;
  isLoading: boolean;
  error: string | undefined;
}

export const useBookingStatus = (bookingId: string | undefined): BookingStatusResult => {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayRef = useRef<number>(5000);

  useEffect(() => {
    if (!bookingId || !supabase) return;

    let isMounted = true;

    const subscribe = supabase
      .channel(`booking-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`,
        },
        (payload) => {
          if (!isMounted) return;
          const next = (payload as any).new?.status as string | undefined;
          if (next) {
            setStatus(next);
            setIsLoading(false);
            delayRef.current = 5000; // reset poll cadence on live update
          }
        }
      )
      .subscribe();

    const poll = async () => {
      if (!isMounted || !supabase) return;
      try {
        const { data, error: qErr } = await supabase
          .from('bookings')
          .select('status')
          .eq('id', bookingId)
          .single();
        if (qErr) throw qErr;
        const next = data?.status as string | undefined;
        if (next) {
          setStatus(next);
          setIsLoading(false);
        }
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load booking status');
        setIsLoading(false);
      } finally {
        if (!isMounted) return;
        const nextDelay = Math.min(delayRef.current * 2, 20000);
        delayRef.current = nextDelay;
        timeoutRef.current = setTimeout(poll, nextDelay);
      }
    };

    // initial poll
    poll();

    return () => {
      isMounted = false;
      try { supabase.removeChannel(subscribe); } catch {}
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [bookingId]);

  return { status, isLoading, error };
};

