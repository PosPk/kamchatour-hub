export type AiProvider = 'deepseek' | 'openai' | 'groq' | 'anthropic' | 'gemini' | 'ensemble';

export function selectProvider(task: string, payload: any): AiProvider {
  const has = {
    deepseek: !!process.env.DEEPSEEK_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    gemini: !!(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY),
  };
  const t = String(task || '').toLowerCase();

  if (t === 'recommend') {
    const available = [has.deepseek, has.openai, has.groq, has.anthropic, has.gemini].filter(Boolean).length;
    return available >= 2 ? 'ensemble' : (has.deepseek ? 'deepseek' : has.openai ? 'openai' : has.groq ? 'groq' : has.anthropic ? 'anthropic' : 'gemini');
  }
  if (t === 'extract') {
    return has.gemini ? 'gemini' : (has.deepseek ? 'deepseek' : 'openai');
  }
  if (t === 'categorize') {
    return has.groq ? 'groq' : (has.deepseek ? 'deepseek' : 'openai');
  }
  // chat and default
  return has.openai ? 'openai' : (has.deepseek ? 'deepseek' : has.groq ? 'groq' : has.anthropic ? 'anthropic' : 'gemini');
}

export function shouldUseEnsemble(task: string, payload: any): boolean {
  const t = String(task || '').toLowerCase();
  if (t === 'recommend') return true;
  return false;
}

