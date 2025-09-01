export interface EcoAction {
  id: string;
  type: 'cleanup' | 'recycle' | 'carpool' | 'eco-tour' | 'quest' | 'review';
  title: string;
  points: number;
  timestamp: number;
  evidenceUrl?: string;
  location?: { latitude: number; longitude: number };
  verified?: boolean;
}

export interface EcoBalance {
  total: number;
  level: number;
  nextLevelAt: number;
}

let mockActions: EcoAction[] = [
  { id: 'a1', type: 'eco-tour', title: 'Участие в эко‑туре', points: 50, timestamp: Date.now() - 86400000, verified: true },
  { id: 'a2', type: 'cleanup', title: 'Уборка локации', points: 30, timestamp: Date.now() - 43200000, verified: true },
  { id: 'a3', type: 'recycle', title: 'Сданный пластик', points: 10, timestamp: Date.now() - 3600000, verified: false },
];

export async function getEcoBalance(): Promise<EcoBalance> {
  await new Promise(r => setTimeout(r, 200));
  const total = mockActions.reduce((s, a) => s + a.points, 0);
  const level = Math.floor(total / 100) + 1;
  const nextLevelAt = level * 100;
  return { total, level, nextLevelAt };
}

export async function listEcoActions(): Promise<EcoAction[]> {
  await new Promise(r => setTimeout(r, 150));
  return [...mockActions].sort((a, b) => b.timestamp - a.timestamp);
}

export async function addEcoAction(action: Omit<EcoAction, 'id' | 'timestamp' | 'verified'> & { timestamp?: number }): Promise<EcoAction> {
  await new Promise(r => setTimeout(r, 200));
  const item: EcoAction = {
    id: String(Date.now()),
    timestamp: action.timestamp ?? Date.now(),
    verified: false,
    ...action,
  } as EcoAction;
  mockActions.push(item);
  return item;
}

export async function verifyEcoAction(id: string): Promise<boolean> {
  await new Promise(r => setTimeout(r, 150));
  const idx = mockActions.findIndex(a => a.id === id);
  if (idx === -1) return false;
  mockActions[idx].verified = true;
  return true;
}

