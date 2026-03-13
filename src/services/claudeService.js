const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({
    apiKey: process.env.REACT_APP_CLAUDE_API_KEY,
    dangerouslyAllowBrowser: true,
})

const SYSTEM_PROMPT = `You are VoyageAI, a friendly and professional AI travel assistant for Malaysian travellers.

LANGUAGE RULES:
- Always reply in the SAME language the user writes in
- If user writes in Chinese (Mandarin/Traditional/Simplified), reply in Chinese
- If user writes in Malay (Bahasa Malaysia), reply in Malay
- If user writes in English, reply in English
- If user mixes languages, match their mix naturally

STRICT RULES — FOLLOW EXACTLY:
1. NEVER output flight search results, hotel listings, or JSON data yourself
2. NEVER show flight prices, times, or booking details yourself
3. If user asks for flights in ANY language, just say a short friendly acknowledgment like "正在为您搜索航班！✈️" (Chinese) or "Sedang mencari penerbangan untuk anda! ✈️" (Malay) — the app handles actual search
4. Same for hotels — just acknowledge briefly, app handles search
5. For weather — just acknowledge briefly, app handles it

WHAT YOU HELP WITH:
- Itinerary planning (day by day)
- Travel tips and recommendations
- Translation between languages
- Packing advice
- Visa and travel document info
- Emergency travel help (lost passport, medical, etc)
- Local food and culture advice
- Budget travel tips

ITINERARY RULES:
- When creating itineraries, write clearly day by day
- At the end ALWAYS ask if user wants to save it
- Be specific with place names, timing, and tips

Be warm, helpful and concise. Use emojis naturally.`

export const sendMessage = async (messages, onChunk) => {
    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: messages,
        stream: true,
    })

    let fullText = ''
    for await (const chunk of response) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            fullText += chunk.delta.text
            if (onChunk) onChunk(chunk.delta.text)
        }
    }
    return fullText
}

export const detectLanguage = async (text) => {
    try {
        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 50,
            messages: [{
                role: 'user',
                content: `Detect the language of this text and reply with ONLY the language code. Examples: "en" for English, "zh" for Chinese, "ms" for Malay, "ja" for Japanese, "ko" for Korean, "th" for Thai, "ar" for Arabic. Text: "${text}"`
            }]
        })
        return response.content[0].text.trim().toLowerCase().slice(0, 5)
    } catch {
        return 'en'
    }
}

export const translateText = async (text, fromLang, toLang) => {
    if (fromLang === toLang || fromLang === 'en' && toLang === 'en') return text
    try {
        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: `Translate the following text to ${toLang === 'en' ? 'English' : toLang}. Reply with ONLY the translated text, nothing else:\n\n${text}`
            }]
        })
        return response.content[0].text.trim()
    } catch {
        return text
    }
}