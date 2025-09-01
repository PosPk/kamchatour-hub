export type Network = 'solana-devnet' | 'solana-mainnet';

export type BookingStatus = 'CREATED'|'CONFIRMED'|'COMPLETED'|'DISPUTED'|'REFUNDED'|'CANCELLED';

export interface OnchainInitPayload {
  bookingId: string;
  operatorId: string;
  commission: number; // minor units
  penalty: number;    // minor units
  network: Network;
}

export interface OnchainInitResult {
  pda: string;
  tx: string; // base64/hex txn for signing
}

export async function onchainInitDeposit(_payload: OnchainInitPayload): Promise<OnchainInitResult> {
  // TODO: integrate contract client (Anchor)
  return { pda: 'PDA_PLACEHOLDER', tx: 'TX_PLACEHOLDER' };
}

export async function onchainConfirm(_bookingId: string): Promise<{ ok: boolean }>{
  return { ok: true };
}

export async function onchainComplete(_bookingId: string): Promise<{ ok: boolean }>{
  return { ok: true };
}

export async function onchainDispute(_bookingId: string, _evidenceCid: string): Promise<{ ok: boolean }>{
  return { ok: true };
}

