import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = req.body || {};
    // Basic log for debugging; replace with proper logger/Sentry in prod
    try { console.log('cloudpays webhook', { headers: req.headers, body }); } catch {}

    // TODO: Verify CloudPayments signature (X-Signature)

    if (!supabase) {
      res.status(500).json({ success: false, error: 'Supabase not configured' });
      return;
    }

    const bookingId = body?.AccountId;
    if (!bookingId) {
      res.status(400).json({ success: false, error: 'No booking id' });
      return;
    }

    const status = body?.Status === 'Completed' ? 'paid' : 'payment_failed';

    const { error } = await supabase
      .from('bookings')
      .update({ status, payment_data: body })
      .eq('id', bookingId);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('cloudpays webhook error', error);
    res.status(500).json({ success: false, error: 'Ошибка обработки вебхука' });
  }
}

