import { supabase } from './supabase';

export type CommissionType = 'percentage' | 'fixed';

export interface CommissionRule {
  type: CommissionType;
  value: number;
  minAmount?: number | null;
  maxAmount?: number | null;
}

export interface CommissionResult {
  amount: number;
  rate: number; // percent for percentage, absolute for fixed
  type: CommissionType;
  finalAmount: number; // equals amount for fixed, bookingAmount * rate/100 for percentage
  source: 'override' | 'tier' | 'default';
}

interface OperatorRow {
  id: string;
  partnerLevel?: 'none' | 'partner' | 'official' | string | null;
  commission_type?: CommissionType | null;
  custom_commission_rate?: number | null;
  commission_override?: boolean | null;
}

interface CommissionTierRow {
  operator_status: string;
  rate: number;
  min_booking_amount: number | null;
  max_booking_amount: number | null;
  valid_from: string; // date
  valid_until: string | null; // date or null
  is_active: boolean;
}

function mapPartnerLevelToStatus(level?: string | null): string {
  if (!level) return 'C';
  const l = String(level).toLowerCase();
  if (l === 'official') return 'A';
  if (l === 'partner') return 'B';
  return 'C';
}

export async function calculateCommission(bookingAmount: number, operatorId: string): Promise<CommissionResult> {
  // 1) Try operator override
  if (supabase) {
    const { data: op } = await supabase.from('operators').select('id, partner_level, commission_type, custom_commission_rate, commission_override').eq('id', operatorId).maybeSingle<OperatorRow>();
    if (op && op.commission_override && op.custom_commission_rate && op.custom_commission_rate > 0) {
      const type: CommissionType = (op.commission_type as CommissionType) || 'percentage';
      const rate = op.custom_commission_rate;
      const amount = type === 'percentage' ? Math.round(bookingAmount * rate) / 100 : rate;
      return { amount, rate, type, finalAmount: amount, source: 'override' };
    }

    // 2) Try tier by status and amount/date
    const status = mapPartnerLevelToStatus(op?.partnerLevel || (op as any)?.partner_level);
    const today = new Date().toISOString().slice(0, 10);
    const { data: tiers } = await supabase
      .from('commission_tiers')
      .select('operator_status, rate, min_booking_amount, max_booking_amount, valid_from, valid_until, is_active')
      .eq('operator_status', status)
      .eq('is_active', true)
      .lte('valid_from', today)
      .or(`valid_until.is.null,valid_until.gte.${today}`)
      .returns<CommissionTierRow[]>();

    if (tiers && tiers.length) {
      // choose tier by amount bounds (first match)
      const tier = tiers.find(t => (t.min_booking_amount == null || bookingAmount >= Number(t.min_booking_amount)) && (t.max_booking_amount == null || bookingAmount <= Number(t.max_booking_amount)) ) || tiers[0];
      const rate = tier.rate;
      const type: CommissionType = 'percentage';
      const amount = Math.round(bookingAmount * rate) / 100;
      return { amount, rate, type, finalAmount: amount, source: 'tier' };
    }
  }

  // 3) Fallback default: 10% percentage
  const rate = 10;
  const amount = Math.round(bookingAmount * rate) / 100;
  return { amount, rate, type: 'percentage', finalAmount: amount, source: 'default' };
}

