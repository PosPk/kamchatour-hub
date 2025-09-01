import React, { createContext, useContext, useState } from 'react';

interface ChatMessage { role: 'user' | 'assistant' | 'system'; content: string }
interface AIState {
	messages: ChatMessage[];
	send: (content: string) => Promise<void>;
	loading: boolean;
}

const AIContext = createContext<AIState | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [loading, setLoading] = useState(false);

	const send = async (content: string) => {
		const next = [...messages, { role: 'user', content } as ChatMessage];
		setMessages(next);
		setLoading(true);
		try {
			const r = await fetch('/api/ai/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: next })
			});
			const data = await r.json();
			const reply = (data?.content as string) || '…';
			setMessages(m => [...m, { role: 'assistant', content: reply }]);
		} catch (e) {
			setMessages(m => [...m, { role: 'assistant', content: 'Ошибка ответа ИИ' }]);
		} finally {
			setLoading(false);
		}
	};

	return <AIContext.Provider value={{ messages, send, loading }}>{children}</AIContext.Provider>;
};

export const useAI = () => {
	const ctx = useContext(AIContext);
	if (!ctx) throw new Error('useAI must be used within AIProvider');
	return ctx;
};

