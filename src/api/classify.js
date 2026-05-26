export async function classifyTodo(text, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 128,
        system: '할 일 텍스트를 분석해서 JSON만 반환하세요. 다른 말 없이 순수 JSON만.',
        messages: [{
          role: 'user',
          content: `분류: "${text}"\n{"category":"업무|개인|건강|학습|쇼핑|기타","priority":"높음|보통|낮음","tags":["태그1"]}  (tags 최대 2개, 없으면 [])`,
        }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim() || '';
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}
