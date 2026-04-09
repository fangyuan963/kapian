export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { selectedCardText } = req.body;

    // 调用你的中转 API（KEY 从环境变量走，绝对安全）
    const response = await fetch('https://oa.api2d.net/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位温柔专业的情感卡牌解读师，语言简洁、治愈、不玄学。'
          },
          {
            role: 'user',
            content: `请帮我解读这张情感卡牌：${selectedCardText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('API 错误:', error);
    return res.status(500).json({ error: 'API 调用失败' });
  }
}