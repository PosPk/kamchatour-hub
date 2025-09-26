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

