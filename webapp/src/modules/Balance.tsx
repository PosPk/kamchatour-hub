import React, { useEffect, useMemo, useState } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { TONAPI_BASE } from '../config/network';
import { JETTON_MINTER_ADDRESS, TOKEN_DECIMALS, JETTON_NAME, JETTON_SYMBOL } from '../config/token';

type JettonBalanceItem = {
  balance: string;
  jetton: {
    address: string;
    name?: string;
    symbol?: string;
  };
};

function formatAmount(raw: string, decimals: number): string {
  const neg = raw.startsWith('-');
  const digits = neg ? raw.slice(1) : raw;
  const pad = digits.padStart(decimals + 1, '0');
  const int = pad.slice(0, -decimals);
  const frac = pad.slice(-decimals).replace(/0+$/, '');
  const res = frac ? `${int}.${frac}` : int;
  return neg ? `-${res}` : res;
}

export function Balance() {
  const address = useTonAddress();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const apiUrl = useMemo(() => {
    return `${TONAPI_BASE}/v2/accounts/${address}/jettons`;
  }, [address]);

  useEffect(() => {
    let active = true;
    async function run() {
      setError(null);
      setBalance(null);
      if (!address || !JETTON_MINTER_ADDRESS) return;
      setLoading(true);
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const items: JettonBalanceItem[] = data?.balances ?? [];
        const match = items.find(i => (i.jetton?.address || '').toLowerCase() === JETTON_MINTER_ADDRESS.toLowerCase());
        if (match) {
          setBalance(formatAmount(match.balance, TOKEN_DECIMALS));
        } else {
          setBalance('0');
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load balance');
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => { active = false; };
  }, [address, apiUrl]);

  if (!address) {
    return <div style={{ padding: 16, opacity: 0.8 }}>Подключите кошелёк TON.</div>;
  }

  if (!JETTON_MINTER_ADDRESS) {
    return <div style={{ padding: 16, opacity: 0.8 }}>Адрес токена не настроен. Ожидается деплой Jetton.</div>;
  }

  return (
    <section style={{ padding: 16 }}>
      <div style={{ marginBottom: 8, fontSize: 12, opacity: 0.7 }}>Адрес: {address}</div>
      {loading && <div>Загрузка баланса…</div>}
      {error && <div style={{ color: '#ff6666' }}>Ошибка: {error}</div>}
      {!loading && !error && (
        <div style={{ fontSize: 20 }}>
          Баланс: <strong>{balance}</strong> {JETTON_SYMBOL} ({JETTON_NAME})
        </div>
      )}
    </section>
  );
}

