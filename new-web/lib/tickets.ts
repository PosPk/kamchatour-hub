export interface TicketIssueResponse {
  token: string;
  bookingId: string;
  expiresAt: number;
}

export interface TicketValidationResponse {
  valid: boolean;
  reason?: string;
  bookingId?: string;
  expiresAt?: number;
}

export async function issueTicket(bookingId: string): Promise<TicketIssueResponse> {
  const r = await fetch(`/api/transfer/ticket?bookingId=${encodeURIComponent(bookingId)}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'Failed to issue ticket');
  return j as TicketIssueResponse;
}

export async function validateTicket(token: string): Promise<TicketValidationResponse> {
  const r = await fetch(`/api/transfer/validate?token=${encodeURIComponent(token)}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error || 'Failed to validate ticket');
  return j as TicketValidationResponse;
}

