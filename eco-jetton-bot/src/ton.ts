import TonWeb from 'tonweb';
import { deductBalance, insertClaim, completeClaim, failClaim } from './storage.js';

const JETTON_MASTER_ADDRESS = process.env.JETTON_MASTER_ADDRESS || '';

// Placeholder TON logic: in production, use wallet contract with keys, create jetton transfer
// For MVP, we validate inputs and simulate success without actually broadcasting unless configured.

export async function requestJettonPayout(userId: number, tonAddress: string, amount: number): Promise<{ ok: boolean; message: string }> {
  if (!JETTON_MASTER_ADDRESS) {
    return { ok: false, message: 'JETTON_MASTER_ADDRESS не задан' };
  }
  try {
    // Basic TON address validation
    const Address = TonWeb.utils.Address;
    // Will throw if invalid
    const _ = new Address(tonAddress);
  } catch (e) {
    return { ok: false, message: 'Неверный TON адрес' };
  }

  if (!deductBalance(userId, amount)) {
    return { ok: false, message: 'Недостаточно баллов' };
  }

  const claimId = insertClaim(userId, amount);

  const enableOnchain = (process.env.ENABLE_ONCHAIN || 'false').toLowerCase() === 'true';
  if (!enableOnchain) {
    const fakeHash = 'simulated_tx_' + Date.now();
    completeClaim(claimId, fakeHash);
    return { ok: true, message: `Выплата (симуляция). TX: ${fakeHash}` };
  }

  try {
    // TODO: Implement real jetton transfer using TonWeb and wallet keys from TON_WALLET_MNEMONIC
    // For now continue with simulation until keys and minter are configured
    const fakeHash = 'simulated_tx_' + Date.now();
    completeClaim(claimId, fakeHash);
    return { ok: true, message: `Выплата на чейн (временная симуляция). TX: ${fakeHash}` };
  } catch (err) {
    failClaim(claimId);
    return { ok: false, message: 'Не удалось выполнить перевод' };
  }
}

