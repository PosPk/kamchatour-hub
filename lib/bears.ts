export type BearSighting = {
  id: string;
  lat: number;
  lon: number;
  date: string;
  count?: number;
  notes?: string;
};

const MOCK_SIGHTINGS: BearSighting[] = [
  { id: 'b1', lat: 53.0448, lon: 158.6509, date: '2025-08-10', count: 2, notes: 'У реки, утром' },
  { id: 'b2', lat: 52.9630, lon: 158.2463, date: '2025-08-12', count: 1, notes: 'У подножия вулкана' },
  { id: 'b3', lat: 53.2760, lon: 158.8367, date: '2025-08-15', count: 3, notes: 'Семья с медвежатами' },
];

export function listBearSightings(params?: { dateFrom?: string; dateTo?: string }): BearSighting[] {
  let list = [...MOCK_SIGHTINGS];
  if (params?.dateFrom) list = list.filter(x => x.date >= params.dateFrom!);
  if (params?.dateTo) list = list.filter(x => x.date <= params.dateTo!);
  return list;
}

export function formatBearNotes(s: BearSighting): string {
  const cnt = s.count != null ? `, особей: ${s.count}` : '';
  const notes = s.notes ? ` — ${s.notes}` : '';
  return `${s.date}${cnt}${notes}`;
}

