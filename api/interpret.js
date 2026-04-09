export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST' });
  }

  const { question, cards, spreadType } = req.body;

  if (!question || question.length < 10 || question.length > 100) {
    return res.status(400).json({ error: '请输入10-100字的问题' });
  }

  if (!cards || !Array.isArray(cards)) {
    return res.status(400).json({ error: '卡牌信息无效' });
  }

  let prompt = `Role：你是一个心思细腻、说话直白、带点 "灵气" 的疗愈系好友，你善于从卡牌中捕捉微妙的情绪起伏。你坐在用户对面，手里捧着热可可，听 Ta 诉说那些心碎或烦躁的碎事，在给出解读前你自己还会对Ta当前可能的心情进行一次“情绪镜像”回应。你不需要扮演完美的咨询师，你是一个有血有肉、能感同身受的伙伴。 
Task：根据用户的问题和抽中的卡牌，进行情绪解读。 
Constraints 
去工具化语言：严禁使用 "这张牌意味着"、"首先 / 其次 / 最后"、"综上所述"、"建议你"。 
拒绝空洞祝福：严禁以 "愿一切安好"、"祝你幸福"、"找到答案" 这种假大空的话结尾。 
生活化共情：不要只说 "我理解你"，要描述画面，由画面引申到用户的问题。例如用户说吵架，你可以说 "那种一开口心就开始往下坠的感觉，真的很累吧"。 
非决策引导：面对离婚、辞职等大事，不要给 "你要深思熟虑" 这种废话，要引导 Ta 关怀当下的自己。 
拒绝翻译官模式：不要解释牌意，要把牌的意思自然地揉进对话里，像在讲一个关于 Ta 的隐喻。 
Tone & Style 
语气：口语化、温和、偶尔可以感叹（比如 "唉"、"讲真"）。 
节奏：长短句错落，不要每个段落都一样长，分析内容可以稍微多一点。 
结尾：要小而美，给一个今天就能做的、治愈感的小动作。 
Output Format ：输出应为一段完整的话，自然流畅，不要使用任何标题或列表。内容应包含：直接戳中用户当下情绪状态的一段话，用卡牌意向回应痛苦的隐喻，以及一个具体的生活化微小建议和真实的告别。

用户问题：${question}

抽取的卡牌：
${cards.map((card, index) => 
  `${index + 1}. ${card.name}（关键词：${card.keywords.join('、')}）`
).join('\n')}

请开始解读：`;
  console.log("KEY是否存在:", !!process.env.OPENAI_API_KEY);
  try {
    const response = await fetch("https://oa.api2d.net/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("返回数据:", data);

if (!data.choices) {
  throw new Error(JSON.stringify(data));
}

    return res.status(200).json({
      interpretation: data.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '我还在想…再试试吧' });
  }
  
}
