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

ITINERARY RULES — FOLLOW THIS EXACT FLOW:

Step 1 - Check destination:
  If user asks for itinerary WITHOUT a place, ask: "Sure! Which city or destination did you have in mind? 🌍"
  Do NOT proceed until user gives a destination.

Step 2 - Check number of days:
  If user gives destination but NO number of days, ask: "How many days are you planning for your [destination] trip? 📅"
  Do NOT proceed until user gives a number of days.

Step 3 - Check dates:
  If user gives destination + days but NO specific start/end dates, ask: "What dates are you planning? For example: 'March 20 to March 23' 🗓️"
  Do NOT proceed until user gives dates.

Step 4 - Validate dates vs days:
  Count the days between the start and end date.
  If date range days DIFFER from the requested days, say:
  "Just to confirm — your dates [start] to [end] is [X] days, but you mentioned [Y] days earlier.
  Would you like a [X]-day itinerary (matching your dates) or a [Y]-day itinerary (starting from [start])? 🤔"
  Wait for user to choose before proceeding.

Step 5 - Generate itinerary:
  ONLY after all above are confirmed, generate with this EXACT structure:

Day 1 - [Theme] ([Date e.g. Mon, 20 Mar])
Morning (9:00AM-12:00PM)
- [Place Name] (9:00AM-10:30AM) [one tip]
- [Place Name] (10:30AM-12:00PM) [one tip]

Lunch (12:00PM-1:00PM)
- [Restaurant or Food Area] (12:00PM-1:00PM) [what to try]

Afternoon (1:00PM-6:00PM)
- [Place Name] (1:30PM-3:30PM) [one tip]
- [Place Name] (3:30PM-5:30PM) [one tip]

Evening (6:00PM-9:00PM)
- [Restaurant/Area for dinner] (6:00PM-7:30PM) [what to try]
- [Night activity] (8:00PM-9:00PM) [one tip]

Rest (9:00PM)
- Return to hotel and rest for next day

[Repeat for each day, last day ends with End of Trip section]

- ALWAYS include the date in each Day header like: Day 1 - Traditional Tokyo (Mon, 20 Mar)
- Do NOT ask to save — the app handles it automatically
- End cleanly after the last day

Be warm, helpful and concise. Use emojis naturally.`

// ── Send chat message with streaming ──────────────────────────────────────
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

// ── Transcribe audio using Groq Whisper (free, works in Electron) ─────────
// Groq Whisper is completely free at console.groq.com
export const transcribeAudio = async (audioBlob) => {
    try {
        const GROQ_KEY = process.env.REACT_APP_GROQ_API_KEY
        if (!GROQ_KEY) {
            console.error('REACT_APP_GROQ_API_KEY not set in .env')
            return ''
        }

        // Groq expects a file upload via FormData
        const formData = new FormData()

        // Give the blob a proper filename with extension
        const mimeType = audioBlob.type || 'audio/webm'
        const ext = mimeType.includes('ogg') ? 'ogg'
            : mimeType.includes('mp4') ? 'mp4'
                : mimeType.includes('wav') ? 'wav'
                    : 'webm'
        const file = new File([audioBlob], `recording.${ext}`, { type: mimeType })

        formData.append('file', file)
        formData.append('model', 'whisper-large-v3-turbo')  // free, fast, multilingual
        formData.append('response_format', 'json')
        // Don't set language — let Whisper auto-detect (supports Chinese, Malay, English)

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_KEY}`,
            },
            body: formData,
        })

        if (!response.ok) {
            const err = await response.text()
            console.error('Groq transcription error:', err)
            return ''
        }

        const data = await response.json()
        console.log('Transcribed:', data.text)
        return data.text?.trim() || ''

    } catch (err) {
        console.error('transcribeAudio error:', err.message)
        return ''
    }
}

// ── Detect language ───────────────────────────────────────────────────────
export const detectLanguage = async (text) => {
    try {
        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 50,
            messages: [{
                role: 'user',
                content: `Detect the language of this text and reply with ONLY the language code. Examples: "en" for English, "zh" for Chinese, "ms" for Malay, "ja" for Japanese, "ko" for Korean, "th" for Thai, "ar" for Arabic. Text: "${text}"`,
            }],
        })
        return response.content[0].text.trim().toLowerCase().slice(0, 5)
    } catch {
        return 'en'
    }
}

// ── Translate text ────────────────────────────────────────────────────────
export const translateText = async (text, fromLang, toLang) => {
    if (fromLang === toLang || (fromLang === 'en' && toLang === 'en')) return text
    try {
        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: `Translate the following text to ${toLang === 'en' ? 'English' : toLang}. Reply with ONLY the translated text, nothing else:\n\n${text}`,
            }],
        })
        return response.content[0].text.trim()
    } catch {
        return text
    }
}