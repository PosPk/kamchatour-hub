# Booking lifecycle (Telegram prebooking → completion)

## States
- prebook_pending: user submitted prebooking; awaiting operator confirmation
- prebook_rejected: operator rejected
- prebook_confirmed: operator confirmed; trip scheduled
- cancel_requested: user asked to cancel; apply policy
- cancelled: cancelled per policy
- completed: trip completed, voucher used

## Entities
- bookings: core record with identities (user_id or tg_user_id), tour/operator, requested dates, party_size, contact, status, policy snapshot
- booking_events: append-only log of transitions with actor and payload

## API (server-only writes)
- POST /api/booking/prebook
  - body: { tour_id, operator_id?, date_from?, date_to?, party_size?, contact, tg_user_id?, payload? }
  - creates booking (status=prebook_pending), logs event prebook_created
- POST /api/booking/cancel
  - body: { id, reason? }
  - sets status cancel_requested, logs event
  - later system evaluates policy → cancelled or keeps as requested

## Security
- Inserts/updates via service role only (API). Users read/update only own rows (RLS).
- All transitions recorded in booking_events for audit.

## Future
- Operator visibility via custom claims/role mapping
- On-chain deposit mapping (onchain_bookings) and arbitration
- Voucher QR issuance and validation endpoint