import React, { useEffect, useMemo, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { TonConnectUIProvider, TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { JETTON_NAME, JETTON_SYMBOL } from '../config/token';

const MANIFEST_URL = '/tonconnect-manifest.json';

function Header() {
	return (
		<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12 }}>
			<h3 style={{ margin: 0 }}>{JETTON_NAME} ({JETTON_SYMBOL})</h3>
			<TonConnectButton />
		</header>
	);
}

function Actions() {
	const [ui] = useTonConnectUI();
	const [sending, setSending] = useState(false);

	const transfer = async () => {
		try {
			setSending(true);
			await ui.sendTransaction({
				validUntil: Math.floor(Date.now() / 1000) + 60,
				messages: [
					{
						address: 'UQCtWQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
						amount: '10000'
					}
				]
			});
		} finally {
			setSending(false);
		}
	};

	return (
		<div style={{ padding: 16, display: 'grid', gap: 12 }}>
			<button disabled={sending} onClick={transfer} style={{ padding: 12, borderRadius: 10 }}>
				Отправить 0.00001 TON (тест)
			</button>
		</div>
	);
}

export function App() {
	useEffect(() => {
		WebApp.ready();
		WebApp.expand();
	}, []);

	const manifestUrl = useMemo(() => MANIFEST_URL, []);

	return (
		<TonConnectUIProvider manifestUrl={manifestUrl} uiPreferences={{ borderRadius: 'm', theme: 'SYSTEM' }}>
			<div style={{ color: 'white', background: '#10141f', minHeight: '100vh' }}>
				<Header />
				<main>
					<p style={{ padding: 16, opacity: 0.85 }}>Подключите кошелёк TON и получите эко-баллы.</p>
					<Actions />
				</main>
			</div>
		</TonConnectUIProvider>
	);
}