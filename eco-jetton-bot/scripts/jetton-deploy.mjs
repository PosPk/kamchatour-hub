import 'dotenv/config';
import TonWeb from 'tonweb';
import { mnemonicToWalletKey } from '@ton/crypto';

const TON_NETWORK = (process.env.TON_NETWORK || 'testnet').toLowerCase();
const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY || '';
const TON_API_ENDPOINT = process.env.TON_API_ENDPOINT || '';
const PORT = Number(process.env.PORT || 8080);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const JETTON_CONTENT_URL = process.env.JETTON_CONTENT_URL || `${APP_URL}/jetton.json`;

function getTonWeb() {
  const endpoint = TON_API_ENDPOINT || (TON_NETWORK === 'mainnet'
    ? 'https://toncenter.com/api/v2/jsonRPC'
    : 'https://testnet.toncenter.com/api/v2/jsonRPC');
  // @ts-ignore provider options
  const provider = new TonWeb.HttpProvider(endpoint, TONCENTER_API_KEY ? { apiKey: TONCENTER_API_KEY } : undefined);
  return new TonWeb(provider);
}

function makeSnakeCell(bytes) {
  const root = new TonWeb.boc.Cell();
  let current = root;
  let i = 0;
  while (i < bytes.length) {
    const chunk = bytes.slice(i, Math.min(bytes.length, i + 127));
    // @ts-ignore writeBytes is available on BitString
    current.bits.writeBytes(chunk);
    i += chunk.length;
    if (i < bytes.length) {
      const next = new TonWeb.boc.Cell();
      current.refs.push(next);
      current = next;
    }
  }
  return root;
}

function makeOffchainContent(url) {
  const cell = new TonWeb.boc.Cell();
  cell.bits.writeUint(0, 8); // offchain
  const bytes = new TextEncoder().encode(url);
  cell.refs.push(makeSnakeCell(bytes));
  return cell;
}

async function main() {
  if (!JETTON_CONTENT_URL) {
    console.error('Set JETTON_CONTENT_URL to a public JSON with metadata');
    process.exit(1);
  }
  const mnemonic = (process.env.TON_WALLET_MNEMONIC || '').trim().split(/\s+/).filter(Boolean);
  if (mnemonic.length < 12) {
    console.error('Set TON_WALLET_MNEMONIC');
    process.exit(1);
  }
  const tonweb = getTonWeb();
  const keyPair = await mnemonicToWalletKey(mnemonic);
  // @ts-ignore
  const WalletClass = (tonweb).wallet?.all?.v3R2 || (tonweb).wallet?.v3R2 || (tonweb).wallet.create;
  // @ts-ignore
  const wallet = WalletClass?.create ? WalletClass.create({ publicKey: keyPair.publicKey, wc: 0 }) : new WalletClass(tonweb.provider, { publicKey: keyPair.publicKey, wc: 0 });
  const adminAddress = await wallet.getAddress();

  // @ts-ignore
  const JettonMinter = (TonWeb).token?.jetton?.JettonMinter;
  if (!JettonMinter) throw new Error('JettonMinter not found');

  const content = makeOffchainContent(JETTON_CONTENT_URL);
  const minter = new JettonMinter(tonweb.provider, { adminAddress, content });
  const minterAddress = await minter.getAddress();
  console.log('Minter address:', minterAddress.toString(true, true, true));

  const seqno = await wallet.methods.seqno().call();
  await wallet.methods
    .transfer({
      secretKey: keyPair.secretKey,
      toAddress: minterAddress,
      amount: TonWeb.utils.toNano('0.05'),
      seqno,
      payload: await minter.createInitExternalMessage(),
      sendMode: 3,
    })
    .send();

  console.log('Deploy sent. Fund minter and mint using jetton-mint.mjs');
}

main().catch((e) => { console.error(e); process.exit(1); });

