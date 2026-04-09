export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { selectedCardText } = req.body;

  const resA = await fetch("https://oa.api2d.net/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "你是专业的情感卡牌解读师" },
        { role: "user", content: `请解读这张卡牌：${selectedCardText}` }
      ],
      temperature: 0.7
    })
  });

  const data = await resA.json();
  res.status(200).json(data);
}
