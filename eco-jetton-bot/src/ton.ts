import TonWeb from 'tonweb';
import { mnemonicToWalletKey } from '@ton/crypto';
import { deductBalance, insertClaim, completeClaim, failClaim } from './storage.js';

const JETTON_MASTER_ADDRESS = process.env.JETTON_MASTER_ADDRESS || '';
const TON_NETWORK = (process.env.TON_NETWORK || 'testnet').toLowerCase();
const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY || '';
const TON_API_ENDPOINT = process.env.TON_API_ENDPOINT || '';
const JETTON_DECIMALS = Number(process.env.JETTON_DECIMALS || '9');

function getTonWeb(): TonWeb {
  const endpoint = TON_API_ENDPOINT || (TON_NETWORK === 'mainnet'
    ? 'https://toncenter.com/api/v2/jsonRPC'
    : 'https://testnet.toncenter.com/api/v2/jsonRPC');
  // Note: TonWeb types might not include provider options in this version
  // @ts-ignore provider options
  const provider = new TonWeb.HttpProvider(endpoint, TONCENTER_API_KEY ? { apiKey: TONCENTER_API_KEY } : undefined);
  return new TonWeb(provider);
}

function toNano(amount: string) {
  return TonWeb.utils.toNano(amount);
}

function toJettonUnits(amount: number) {
  // scale by decimals
  const factor = 10n ** BigInt(JETTON_DECIMALS);
  const scaled = BigInt(Math.trunc(amount)) * factor + BigInt(Math.round((amount % 1) * Number(factor)));
  // Create BN from bigint
  // @ts-ignore BN constructor accepts string
  return new TonWeb.utils.BN(scaled.toString());
}

async function sendJetton(tonAddress: string, amount: number): Promise<string> {
  const mnemonicString = process.env.TON_WALLET_MNEMONIC || '';
  const mnemonic = mnemonicString.trim().split(/\s+/).filter(Boolean);
  if (mnemonic.length < 12) throw new Error('TON_WALLET_MNEMONIC not set');

  const tonweb = getTonWeb();
  // Derive keys
  const keyPair = await mnemonicToWalletKey(mnemonic);
  // @ts-ignore use any to access wallet factory
  const WalletClass = (tonweb as any).wallet?.all?.v3R2 || (tonweb as any).wallet?.v3R2 || (tonweb as any).wallet.create;
  // @ts-ignore
  const wallet = WalletClass?.create ? WalletClass.create({ publicKey: keyPair.publicKey, wc: 0 }) : new WalletClass(tonweb.provider, { publicKey: keyPair.publicKey, wc: 0 });

  const adminAddress = await wallet.getAddress();

  // Jetton minter + wallets
  // @ts-ignore TonWeb any
  const JettonMinter = (TonWeb as any).token?.jetton?.JettonMinter;
  // @ts-ignore TonWeb any
  const JettonWallet = (TonWeb as any).token?.jetton?.JettonWallet;
  if (!JettonMinter || !JettonWallet) throw new Error('TonWeb jetton module not available');

  const minter = new JettonMinter(tonweb.provider, { address: new TonWeb.utils.Address(JETTON_MASTER_ADDRESS) });
  const ownerJettonWalletAddr = await minter.getJettonWalletAddress(adminAddress);
  const recipientOwnerAddr = new TonWeb.utils.Address(tonAddress);
  const recipientJettonWalletAddr = await minter.getJettonWalletAddress(recipientOwnerAddr);

  const ownerJettonWallet = new JettonWallet(tonweb.provider, { address: ownerJettonWalletAddr });
  const transferBody = await ownerJettonWallet.createTransferBody({
    queryId: Date.now(),
    amount: toJettonUnits(amount),
    toAddress: recipientOwnerAddr,
    responseAddress: adminAddress,
    forwardAmount: toNano('0.02'),
    forwardPayload: new Uint8Array([]),
  });

  const seqno = await wallet.methods.seqno().call();
  // Pay fees to jetton wallet contract
  await wallet.methods
    .transfer({
      secretKey: keyPair.secretKey,
      toAddress: ownerJettonWalletAddr,
      amount: toNano('0.1'),
      seqno,
      payload: transferBody,
      sendMode: 3,
    })
    .send();

  // No tx hash readily available; return a timestamp marker
  return `sent_${Date.now()}`;
}

// In production, we validate inputs and, if enabled, broadcast a jetton transfer.
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
    const txId = await sendJetton(tonAddress, amount);
    completeClaim(claimId, txId);
    return { ok: true, message: `Выплата отправлена. TX: ${txId}` };
  } catch (err) {
    console.error(err);
    failClaim(claimId);
    return { ok: false, message: 'Не удалось выполнить перевод' };
  }
}

