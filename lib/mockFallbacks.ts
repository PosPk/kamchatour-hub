export const useMockFallbacks = process.env.EXPO_PUBLIC_USE_MOCKS === 'true';

async function realPaymentInitiate(amount: number, description: string) {
  const r = await fetch('/api/pays/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, description, bookingId: `demo_${Date.now()}` }) });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'payment init failed');
  return j;
}

export const mockPayment = {
  initiate: async (amount: number, description: string) => {
    if (useMockFallbacks) {
      return Promise.resolve({ success: true, transactionId: `mock_${Date.now()}`, amount, description });
    }
    return await realPaymentInitiate(amount, description);
  }
};

import { supabase as client } from './supabase';
export const mockSupabase = {
  from: (table: string) => {
    if (useMockFallbacks || !client) {
      return {
        select: async () => ({ data: [], error: null }),
        insert: async (_data: any) => ({ error: null }),
        update: async (_data: any) => ({ error: null }),
        eq: function () { return this; },
        order: function () { return this; },
        single: async () => ({ data: null, error: null }),
        limit: function () { return this; },
      } as any;
    }
    return (client as any).from(table);
  }
};

