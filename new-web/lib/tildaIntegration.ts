export const tildaIntegration = {
  init: () => {
    if (typeof window !== 'undefined') {
      (window as any).Tilda = (window as any).Tilda || {};
    }
  },
  trackEvent: (eventName: string, data: any) => {
    if (typeof window !== 'undefined' && (window as any).Tilda && typeof (window as any).Tilda.trackEvent === 'function') {
      try { (window as any).Tilda.trackEvent(eventName, data); } catch {}
    }
  }
};

