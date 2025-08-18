import 'dotenv/config';
import TonWeb from 'tonweb';
import { mnemonicToWalletKey } from '@ton/crypto';

const TON_NETWORK = (process.env.TON_NETWORK || 'testnet').toLowerCase();
const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY || '';
const TON_API_ENDPOINT = process.env.TON_API_ENDPOINT || '';
const JETTON_MASTER_ADDRESS = process.env.JETTON_MASTER_ADDRESS || '';

function getTonWeb() {
  const endpoint = TON_API_ENDPOINT || (TON_NETWORK === 'mainnet'
    ? 'https://toncenter.com/api/v2/jsonRPC'
    : 'https://testnet.toncenter.com/api/v2/jsonRPC');
  // @ts-ignore provider options
  const provider = new TonWeb.HttpProvider(endpoint, TONCENTER_API_KEY ? { apiKey: TONCENTER_API_KEY } : undefined);
  return new TonWeb(provider);
}

async function main() {
  if (!JETTON_MASTER_ADDRESS) {
    console.error('Set JETTON_MASTER_ADDRESS');
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
  const minter = new JettonMinter(tonweb.provider, { address: new TonWeb.utils.Address(JETTON_MASTER_ADDRESS) });

  const recipient = process.argv[2];
  const amount = process.argv[3];
  if (!recipient || !amount) {
    console.error('Usage: node scripts/jetton-mint.mjs <recipient_owner_address> <amount_in_jettons>');
    process.exit(1);
  }
  const amountBN = new TonWeb.utils.BN(TonWeb.utils.toNano(amount));
  const seqno = await wallet.methods.seqno().call();
  await wallet.methods
    .transfer({
      secretKey: keyPair.secretKey,
      toAddress: await minter.getAddress(),
      amount: TonWeb.utils.toNano('0.1'),
      seqno,
      payload: await minter.createMintBody({
        amount: amountBN,
        destination: new TonWeb.utils.Address(recipient),
      }),
      sendMode: 3,
    })
    .send();
  console.log('Mint message sent');
}

main().catch((e) => { console.error(e); process.exit(1); });

