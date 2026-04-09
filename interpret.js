import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://oa.api2d.net/v1',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, cards, spreadType } = req.body;

  // 验证参数
  if (!question || question.length < 10 || question.length > 100) {
    return res.status(400).json({ error: '请输入10-100字的问题' });
  }

  if (!cards || !Array.isArray(cards)) {
    return res.status(400).json({ error: '卡牌信息无效' });
  }

  // 构建Prompt
  let prompt = `你是一位温暖的陪伴者，专注于情绪支持和共情。请根据用户的问题和抽取的卡牌，给出温和、非确定性的解读。

用户问题：${question}

抽取的卡牌：
${cards.map((card, index) => 
  `${index + 1}. ${card.name}（关键词：${card.keywords.join('、')}）`
).join('\n')}

解读要求：
1. 开头先共情用户的问题
2. ${spreadType === 'three' ? '按照过去/现在/未来的结构解读三张牌' : '解读单张牌的意义'}
3. 避免使用"你应该"等命令性语言
4. 不做确定性判断，使用"可能""或许"等温和表达
5. 结尾给出温和的小建议和祝福
6.语气温暖、轻松、接地气，有活人感

请开始解读：`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: false,
    });

    return res.status(200).json({
      interpretation: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: '我还在想…再试试吧' });
  }
}