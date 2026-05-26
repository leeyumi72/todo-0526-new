export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' });
  }

  const { text } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
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
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  if (!upstream.ok) {
    return res.status(upstream.status).json({ error: 'Anthropic API error' });
  }

  const data = await upstream.json();
  const raw = data.content?.[0]?.text?.trim() || '';
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return res.status(200).json(null);

  try {
    return res.status(200).json(JSON.parse(match[0]));
  } catch {
    return res.status(200).json(null);
  }
}
