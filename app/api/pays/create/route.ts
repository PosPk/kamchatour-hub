import { NextResponse } from 'next/server';

export async function POST(req: any) {
  try {
    const { amount, currency, description, bookingId } = await req.json();
    if (typeof amount !== 'number' || !bookingId) return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    const paymentData = {
      publicId: process.env.CLOUDPAYMENTS_PUBLIC_ID || '',
      amount,
      currency: currency || 'RUB',
      description: description || `Бронирование #${bookingId}`,
      accountId: bookingId,
    };
    return NextResponse.json({ success: true, paymentData, message: 'Платеж инициирован' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Ошибка создания платежа' }, { status: 500 });
  }
}

