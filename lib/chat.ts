export interface Thread {
  id: string;
  title: string;
  participantName: string;
  lastMessage?: string;
  updatedAt: number;
}

export interface Message {
  id: string;
  threadId: string;
  author: 'me' | 'operator';
  text: string;
  createdAt: number;
}

let mockThreads: Thread[] = [
  { id: 't-op1', title: 'Камчатка-Тур', participantName: 'Менеджер Ольга', lastMessage: 'Ждём подтверждение дат', updatedAt: Date.now() - 3600000 },
  { id: 't-op2', title: 'Вулканы Камчатки', participantName: 'Алексей', lastMessage: 'Отправил программу', updatedAt: Date.now() - 7200000 }
];

let mockMessages: Message[] = [
  { id: 'm1', threadId: 't-op1', author: 'operator', text: 'Здравствуйте! Подтвердите даты.', createdAt: Date.now() - 86400000 },
  { id: 'm2', threadId: 't-op1', author: 'me', text: 'Даты подходят, спасибо!', createdAt: Date.now() - 82800000 },
  { id: 'm3', threadId: 't-op2', author: 'operator', text: 'Программа на 3 дня во вложении.', createdAt: Date.now() - 3600000 }
];

export async function listThreads(): Promise<Thread[]> {
  await new Promise(r => setTimeout(r, 150));
  return [...mockThreads].sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getThread(id: string): Promise<{ thread: Thread | null; messages: Message[] }>{
  await new Promise(r => setTimeout(r, 120));
  const thread = mockThreads.find(t => t.id === id) ?? null;
  const messages = mockMessages.filter(m => m.threadId === id).sort((a, b) => a.createdAt - b.createdAt);
  return { thread, messages };
}

export async function sendMessage(threadId: string, text: string): Promise<Message> {
  await new Promise(r => setTimeout(r, 100));
  const msg: Message = { id: String(Date.now()), threadId, author: 'me', text, createdAt: Date.now() };
  mockMessages.push(msg);
  const tIdx = mockThreads.findIndex(t => t.id === threadId);
  if (tIdx !== -1) {
    mockThreads[tIdx].lastMessage = text;
    mockThreads[tIdx].updatedAt = Date.now();
  }
  return msg;
}

