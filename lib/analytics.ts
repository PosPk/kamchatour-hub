type EventName =
  | 'feed_view'
  | 'search'
  | 'filter_apply'
  | 'view_item'
  | 'view_item_detail'
  | 'begin_checkout'
  | 'purchase'
  | 'review_submit';

export interface AnalyticsEvent {
  name: EventName;
  params?: Record<string, unknown>;
  ts?: number;
}

const queue: AnalyticsEvent[] = [];

export function track(name: EventName, params?: Record<string, unknown>) {
  const evt: AnalyticsEvent = { name, params, ts: Date.now() };
  queue.push(evt);
  if (queue.length > 200) queue.shift();
  // TODO: send to backend/analytics provider
  if (process.env.NODE_ENV !== 'production') console.log('[analytics]', evt);
}

export function getBufferedEvents(): AnalyticsEvent[] {
  return [...queue];
}

