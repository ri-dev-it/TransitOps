const pool = require('../config/db');
// You can use axios to call OpenAI, Anthropic, or an open-source model
const axios = require('axios'); 

async function handleChat(req, res) {
  const { message } = req.body;
  
  try {
    // 1. Fetch relevant system data based on the query (Simplified)
    const vehicles = await pool.query('SELECT registration_number, status FROM vehicles LIMIT 5');
    
    // 2. Build context string
    const context = `System Data: Vehicles: ${JSON.stringify(vehicles.rows)}. User asked: ${message}`;
    
    // 3. Call your AI model (e.g., OpenAI API)
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are the TransitOps Assistant. Use the provided context to answer questions about the fleet." },
        { role: "user", content: context }
      ]
    }, { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` } });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: "Chat service unavailable" });
  }
}

module.exports = { handleChat };