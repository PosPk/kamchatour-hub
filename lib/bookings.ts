export interface Booking {
  id: string;
  title: string;
  operatorName: string;
  dateFrom: number;
  dateTo: number;
  meetingPoint?: { name: string; latitude: number; longitude: number };
  voucherCode: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  documents: { name: string; url: string }[];
  cancellationPolicy?: { type: 'flexible'|'moderate'|'strict'; freeUntilHours?: number; feePercent?: number };
}

let mockBookings: Booking[] = [
  { id: 'b1', title: 'Вулканы и гейзеры', operatorName: 'Вулканы Камчатки', dateFrom: Date.now()+86400000, dateTo: Date.now()+3*86400000, meetingPoint: { name: 'Площадь Ленина', latitude: 53.0375, longitude: 158.6559 }, voucherCode: 'KAM-98342', status: 'confirmed', documents: [{ name: 'Договор', url: '#' }] },
];

export async function listBookings(): Promise<Booking[]> {
  await new Promise(r => setTimeout(r, 180));
  return [...mockBookings].sort((a, b) => a.dateFrom - b.dateFrom);
}

export async function getBooking(id: string): Promise<Booking | null> {
  await new Promise(r => setTimeout(r, 120));
  return mockBookings.find(b => b.id === id) ?? null;
}

export function calculateRefund(booking: Booking, cancelAt: Date = new Date()): { refundable: number; fee: number; note: string }{
  const total = booking.total ?? 0;
  const policy = booking.cancellationPolicy ?? { type: 'moderate', freeUntilHours: 72, feePercent: 20 };
  const hoursBefore = (booking.dateFrom - cancelAt.getTime())/3600000;
  if (policy.type === 'flexible' && hoursBefore >= (policy.freeUntilHours ?? 24)) return { refundable: total, fee: 0, note: 'Бесплатная отмена' };
  if (hoursBefore >= (policy.freeUntilHours ?? 72)) return { refundable: total, fee: 0, note: 'Бесплатная отмена' };
  const fee = Math.round(total * ((policy.feePercent ?? 20)/100));
  return { refundable: Math.max(0, total - fee), fee, note: `Штраф ${policy.feePercent ?? 20}%` };
}

