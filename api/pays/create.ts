// Vercel Serverless Function (framework-agnostic)
// Avoid Next.js types to keep typecheck green in Expo project

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const { amount, currency, description, bookingId } = req.body || {};

    if (typeof amount !== 'number' || !bookingId) {
      res.status(400).json({ success: false, error: 'Invalid payload' });
      return;
    }

    const paymentData = {
      publicId: process.env.CLOUDPAYMENTS_PUBLIC_ID,
      amount,
      currency: currency || 'RUB',
      description: description || `Бронирование #${bookingId}`,
      accountId: bookingId,
    };

    // TODO: Integrate real CloudPayments init if needed

    res.status(200).json({ success: true, paymentData, message: 'Платеж инициирован' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка создания платежа' });
  }
}

