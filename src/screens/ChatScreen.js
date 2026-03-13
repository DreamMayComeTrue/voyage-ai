import React, { useState, useEffect, useRef } from 'react'
import {
    Send, Mic, MicOff, ArrowLeft,
    X, Check, Sparkles, User, Trash2
} from 'lucide-react'
import { sendMessage, detectLanguage, translateText } from '../services/claudeService'
import { searchFlights, searchHotels, getWeather } from '../services/flightService'
import FlightCard from '../components/FlightCard'
import HotelCard from '../components/HotelCard'

// ── Local Storage Helpers ──────────────────────────────────────────────────
const STORAGE_KEY = 'voyageai_conversations'

const loadConversations = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch { return [] }
}

const saveConversations = (convs) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(convs))
    } catch (e) { console.error('Storage error:', e) }
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)
const getCurrentYear = () => new Date().getFullYear()

// ── Date Extraction ────────────────────────────────────────────────────────
const extractDate = (text) => {
    const lower = text.toLowerCase()
    const year = getCurrentYear()
    const today = new Date()

    // Helper: get local date string (fixes UTC offset bug)
    const localDate = (d) => [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0')
    ].join('-')

    // Relative dates (English + Chinese + Malay)
    if (lower.includes('today') || text.includes('今天') || text.includes('今日')) return localDate(today)
    if (lower.includes('tomorrow') || text.includes('明天') || text.includes('明日')) {
        const t = new Date(today); t.setDate(today.getDate() + 1)
        return localDate(t)
    }
    if (lower.includes('next week') || text.includes('下周') || text.includes('下星期')) {
        const t = new Date(today); t.setDate(today.getDate() + 7)
        return localDate(t)
    }

    // Chinese: "3月31日" or "3月31号"
    const chDate = text.match(/(\d{1,2})月(\d{1,2})[日号]/)
    if (chDate) return `${year}-${String(chDate[1]).padStart(2,'0')}-${String(chDate[2]).padStart(2,'0')}`

    // Chinese full: "2026年3月31日"
    const chFull = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})[日号]/)
    if (chFull) return `${chFull[1]}-${String(chFull[2]).padStart(2,'0')}-${String(chFull[3]).padStart(2,'0')}`

    // ISO: 2026-03-21
    const iso = lower.match(/(\d{4})-(\d{2})-(\d{2})/)
    if (iso) return iso[0]

    // Numeric with year: 21/3/2026
    const numFull = lower.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](20\d{2})/)
    if (numFull) return `${numFull[3]}-${String(numFull[2]).padStart(2,'0')}-${String(numFull[1]).padStart(2,'0')}`

    // English + Malay month names
    const months = {
        jan:1, january:1, feb:2, february:2, mar:3, march:3,
        apr:4, april:4, may:5, jun:6, june:6,
        jul:7, july:7, aug:8, august:8, sep:9, september:9,
        oct:10, october:10, nov:11, november:11, dec:12, december:12,
        januari:1, februari:2, mac:3, mei:5, julai:7, ogos:8, oktober:10, disember:12
    }

    for (const [name, num] of Object.entries(months)) {
        if (lower.includes(name)) {
            const before = lower.match(new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s+${name}`))
            if (before) return `${year}-${String(num).padStart(2,'0')}-${String(before[1]).padStart(2,'0')}`
            const after = lower.match(new RegExp(`${name}\\s+(\\d{1,2})(?:st|nd|rd|th)?`))
            if (after) return `${year}-${String(num).padStart(2,'0')}-${String(after[1]).padStart(2,'0')}`
        }
    }

    return null
}

const hasDate = (text) => extractDate(text) !== null

const isPastDate = (text) => {
    const lower = text.toLowerCase()

    // Never block these — always future/present
    if (lower.includes('today') || lower.includes('tomorrow') || lower.includes('next week')) return false
    if (text.includes('今天') || text.includes('明天') || text.includes('下周')) return false
    if (text.includes('今日') || text.includes('明日') || text.includes('下星期')) return false

    // Block explicit past words
    if (lower.includes('yesterday') || text.includes('昨天') || text.includes('昨日')) return true
    if (lower.includes('last week') || text.includes('上周') || text.includes('上星期')) return true

    const date = extractDate(text)
    if (!date) return false

    // Use local date comparison to avoid UTC timezone bug
    const [y, m, d] = date.split('-').map(Number)
    const inputDate = new Date(y, m - 1, d)
    const todayLocal = new Date()
    todayLocal.setHours(0, 0, 0, 0)

    return inputDate < todayLocal
}

const extractCity = (text, keyword) => {
    const lower = text.toLowerCase()
    const words = lower.split(/\s+/)
    const idx = words.findIndex(w => w === keyword)
    return idx !== -1 && words[idx + 1] ? words[idx + 1] : null
}

const extractCityMultilang = (text, englishText) => {
    // Try all language keywords for origin
    const originKeywords = ['from', 'dari', '从', '由']
    const destKeywords   = ['to', 'ke', '到', '去']

    let origin = null
    let destination = null

    for (const kw of originKeywords) {
        const found = extractCity(text, kw) || extractCity(englishText, kw)
        if (found) { origin = found; break }
    }

    for (const kw of destKeywords) {
        const found = extractCity(text, kw) || extractCity(englishText, kw)
        if (found) { destination = found; break }
    }

    return { origin: origin || 'KUL', destination: destination || 'TYO' }
}

// ── Main Component ─────────────────────────────────────────────────────────
const ChatScreen = ({
                        setActiveScreen,
                        saveItinerary,
                        saveTrip,
                        itineraries,
                        trips,
                        initialPrompt,
                        setChatPrompt,
                    }) => {

    const WELCOME = {
        id: generateId(),
        role: 'assistant',
        content: "Hi! I'm VoyageAI ✈️ Your AI travel companion.\n\nI can help you:\n• Search real flights & hotels\n• Plan day-by-day itineraries\n• Check weather forecasts\n• Translate languages\n• Handle travel emergencies\n\nHow can I help you today?",
        type: 'text',
        timestamp: Date.now(),
    }

    // ── State ────────────────────────────────────────────────────────────────
    const [conversations, setConversations] = useState(() => loadConversations())
    const [activeChatId, setActiveChatId] = useState(null)
    const [messages, setMessages] = useState([WELCOME])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [streamingText, setStreamingText] = useState('')
    const [flightResults, setFlightResults] = useState(null)
    const [hotelResults, setHotelResults] = useState(null)
    const [weatherResult, setWeatherResult] = useState(null)
    const [pendingItinerary, setPendingItinerary] = useState(null)
    const [showHistory, setShowHistory] = useState(false)
    const [currentTripDay, setCurrentTripDay] = useState(null)
    const [pendingFlightSearch, setPendingFlightSearch] = useState(null)
    const [pendingHotelSearch, setPendingHotelSearch] = useState(null)
    const [userLanguage, setUserLanguage] = useState('en')

    const messagesEndRef = useRef(null)
    const recognitionRef = useRef(null)

    // ── Effects ──────────────────────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, streamingText, flightResults, hotelResults])

    useEffect(() => {
        if (initialPrompt && initialPrompt.trim() !== '') {
            setInput(initialPrompt)
            if (setChatPrompt) setChatPrompt('')
        }
    }, [initialPrompt])

    useEffect(() => {
        saveConversations(conversations)
    }, [conversations])

    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SR) { console.warn('Speech Recognition not supported'); return }

        navigator.mediaDevices?.getUserMedia({ audio: true })
            .then((stream) => {
                // Stop the stream immediately - we just needed permission
                stream.getTracks().forEach(track => track.stop())

                recognitionRef.current = new SR()
                recognitionRef.current.continuous = false
                recognitionRef.current.interimResults = true
                recognitionRef.current.lang = navigator.language || 'en-US'
                recognitionRef.current.maxAlternatives = 1

                recognitionRef.current.onstart = () => setIsListening(true)

                recognitionRef.current.onresult = (e) => {
                    const t = Array.from(e.results).map(r => r[0].transcript).join('')
                    setInput(t)
                }

                recognitionRef.current.onend = () => setIsListening(false)

                recognitionRef.current.onerror = (e) => {
                    console.error('Speech error:', e.error)
                    setIsListening(false)
                    if (e.error === 'not-allowed') {
                        alert('Microphone permission denied. Please allow microphone access.')
                    }
                }
            })
            .catch(err => console.error('Mic permission error:', err))
    }, [])

    // ── Speech ───────────────────────────────────────────────────────────────
    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Microphone not available. Please use Chrome or Edge browser.')
            return
        }
        if (isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        } else {
            try {
                recognitionRef.current.start()
            } catch (e) {
                recognitionRef.current.stop()
                setTimeout(() => {
                    try { recognitionRef.current.start() }
                    catch (e2) { console.error('Restart error:', e2) }
                }, 300)
            }
        }
    }

    const speakText = (text) => {
        window.speechSynthesis.cancel()
        const u = new window.SpeechSynthesisUtterance(text.replace(/[*_#•]/g, '').trim())
        u.rate = 0.95
        window.speechSynthesis.speak(u)
    }

    // ── Conversation Storage ─────────────────────────────────────────────────
    const startNewChat = () => {
        if (messages.length > 1 && activeChatId) updateConversation(activeChatId, messages)
        const newId = generateId()
        setActiveChatId(newId)
        setMessages([WELCOME])
        setFlightResults(null)
        setHotelResults(null)
        setWeatherResult(null)
        setPendingItinerary(null)
        setPendingFlightSearch(null)
        setPendingHotelSearch(null)
        setCurrentTripDay(null)
        setShowHistory(false)
        setUserLanguage('en')
    }

    const updateConversation = (id, msgs) => {
        const title = msgs.find(m => m.role === 'user')?.content?.slice(0, 40) || 'New Conversation'
        setConversations(prev => {
            const exists = prev.find(c => c.id === id)
            if (exists) return prev.map(c => c.id === id ? { ...c, messages: msgs, updatedAt: Date.now() } : c)
            return [{ id, title, messages: msgs, createdAt: Date.now(), updatedAt: Date.now() }, ...prev]
        })
    }

    const loadConversation = (conv) => {
        setMessages(conv.messages)
        setActiveChatId(conv.id)
        setShowHistory(false)
        setFlightResults(null)
        setHotelResults(null)
    }

    const deleteConversation = (id) => {
        setConversations(prev => prev.filter(c => c.id !== id))
        if (activeChatId === id) startNewChat()
    }

    const clearAllHistory = () => {
        setConversations([])
        localStorage.removeItem(STORAGE_KEY)
        startNewChat()
    }

    const formatMessage = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>')
            .replace(/•/g, '&bull;')
    }

    const detectDayFeedback = (text) => {
        const lower = text.toLowerCase()
        const positive = ['great','good','amazing','wonderful','loved','enjoyed','perfect','excellent','fantastic','awesome','nice','fun']
        const negative = ['bad','terrible','boring','awful','disappointed','not good','didn\'t like','poor','mediocre','waste']
        if (positive.some(w => lower.includes(w))) return 'positive'
        if (negative.some(w => lower.includes(w))) return 'negative'
        return null
    }

    // ── Helper: post AI message ───────────────────────────────────────────────
    const postAIMessage = (content, baseMessages, chatId) => {
        const aiMsg = {
            id: generateId(),
            role: 'assistant',
            content,
            type: 'text',
            timestamp: Date.now(),
        }
        const updated = [...baseMessages, aiMsg]
        setMessages(updated)
        if (chatId) updateConversation(chatId, updated)
        return updated
    }

    // ── Helper: post AI message WITH translation ──────────────────────────────
    const postAIMessageTranslated = async (content, baseMessages, chatId, lang) => {
        const targetLang = lang || userLanguage
        const translated = targetLang !== 'en'
            ? await translateText(content, 'en', targetLang)
            : content
        return postAIMessage(translated, baseMessages, chatId)
    }

    // ── Main Send Handler ─────────────────────────────────────────────────────
    const handleSend = async (textOverride) => {
        const text = (textOverride || input).trim()
        if (!text || isLoading) return

        setInput('')
        setFlightResults(null)
        setHotelResults(null)
        setWeatherResult(null)

        const userMsg = {
            id: generateId(),
            role: 'user',
            content: text,
            type: 'text',
            timestamp: Date.now(),
        }

        const newMessages = [...messages, userMsg]
        setMessages(newMessages)
        setIsLoading(true)
        setStreamingText('')

        const chatId = activeChatId || generateId()
        if (!activeChatId) setActiveChatId(chatId)

        try {
            // ── Detect language and translate to English ──────────────────────
            const detectedLang = await detectLanguage(text)
            setUserLanguage(detectedLang)

            const englishText = detectedLang !== 'en'
                ? await translateText(text, detectedLang, 'en')
                : text

            const lower = englishText.toLowerCase()

            // ── Block past dates ──────────────────────────────────────────────
            const isYesterday = lower.includes('yesterday')
            const isLastWeek  = lower.includes('last week') || lower.includes('last month')

            if (isYesterday || isLastWeek) {
                setIsLoading(false)
                await postAIMessageTranslated(
                    "⚠️ You can't book a flight for a past date! Please choose **today** or a future date. 😄",
                    newMessages, chatId, detectedLang
                )
                return
            }

            // Block past extracted dates (only in flight/hotel context)
            // Skip check if user used relative words like "today" or "tomorrow"
            const hasRelativeDate = lower.includes('today') || lower.includes('tomorrow') ||
                lower.includes('next week') || text.includes('今天') || text.includes('明天')

            if (!hasRelativeDate) {
                const extractedDate = extractDate(text) || extractDate(englishText)
                if (extractedDate && (pendingFlightSearch || flightResults)) {
                    const [y, m, d] = extractedDate.split('-').map(Number)
                    const inputDate = new Date(y, m - 1, d)
                    const todayCheck = new Date(); todayCheck.setHours(0, 0, 0, 0)
                    if (inputDate < todayCheck) {
                        setIsLoading(false)
                        await postAIMessageTranslated(
                            `⚠️ **${extractedDate}** has already passed! Please choose today or a future date.`,
                            newMessages, chatId, detectedLang
                        )
                        return
                    }
                }
            }

            // ── Detect intents ────────────────────────────────────────────────
            const isFlightSearch = lower.includes('flight') || lower.includes('fly') || lower.includes('airfare')
            const isHotelSearch  = lower.includes('hotel') || lower.includes('stay') || lower.includes('accommodation')
            const isWeather      = lower.includes('weather') || lower.includes('rain') || lower.includes('temperature') || lower.includes('forecast')

            const isFlightDateUpdate = (hasDate(text) || hasDate(englishText)) && !isFlightSearch && !isHotelSearch &&
                (pendingFlightSearch !== null || flightResults !== null)
            const isHotelDateUpdate = (hasDate(text) || hasDate(englishText)) && !isFlightSearch && !isHotelSearch &&
                (pendingHotelSearch !== null || hotelResults !== null) && !isFlightDateUpdate

            // ── FLIGHT SEARCH ─────────────────────────────────────────────────
            if (isFlightSearch || isFlightDateUpdate) {
                let origin, destination, date

                if (isFlightDateUpdate) {
                    origin      = pendingFlightSearch?.origin || flightResults?.origin || 'KUL'
                    destination = pendingFlightSearch?.destination || flightResults?.destination || 'TYO'
                    date        = extractDate(text) || extractDate(englishText)
                    setPendingFlightSearch(null)
                } else {
                    // Fresh flight search — extract cities in any language
                    const cities = extractCityMultilang(text, englishText)
                    origin      = cities.origin
                    destination = cities.destination
                    date        = extractDate(text) || extractDate(englishText)
                }

                if (!date) {
                    setPendingFlightSearch({ origin, destination })
                    setIsLoading(false)
                    await postAIMessageTranslated(
                        `✈️ Sure! I found the route **${origin.toUpperCase()} → ${destination.toUpperCase()}**.\n\nWhat **date** would you like to fly? For example:\n*"15 August"* or *"15 August 2026"*`,
                        newMessages, chatId, detectedLang
                    )
                    return
                }

                const flights = await searchFlights(origin, destination, date)
                setFlightResults({ flights, origin, destination, date })
                setIsLoading(false)
                await postAIMessageTranslated(
                    `✈️ Found **${flights.length} flights** from **${origin.toUpperCase()}** to **${destination.toUpperCase()}** on **${date}**! Select one below to book.`,
                    newMessages, chatId, detectedLang
                )
                return
            }

            // ── HOTEL SEARCH ──────────────────────────────────────────────────
            if (isHotelSearch || isHotelDateUpdate) {
                const city = isHotelDateUpdate
                    ? (pendingHotelSearch?.city || hotelResults?.city || 'Tokyo')
                    : (extractCity(text, 'di') ||
                        extractCity(text, 'in') ||
                        extractCity(englishText, 'in') || 'Tokyo')

                if (!hasDate(text) && !hasDate(englishText) && !isHotelDateUpdate) {
                    setPendingHotelSearch({ city })
                    setIsLoading(false)
                    await postAIMessageTranslated(
                        `🏨 Great! Looking for hotels in **${city}**.\n\nWhat are your **check-in and check-out dates**? For example:\n*"15 August to 18 August"*`,
                        newMessages, chatId, detectedLang
                    )
                    return
                }

                if (pendingHotelSearch) setPendingHotelSearch(null)
                const hotels = await searchHotels(city)
                setHotelResults({ hotels, city })
                setIsLoading(false)
                await postAIMessageTranslated(
                    `🏨 Found **${hotels.length} hotels** in **${city}**! Select one below to book.`,
                    newMessages, chatId, detectedLang
                )
                return
            }

            // ── WEATHER ───────────────────────────────────────────────────────
            if (isWeather) {
                const city = extractCity(englishText, 'in') || extractCity(englishText, 'for') || 'Tokyo'
                const weather = await getWeather(city)
                setWeatherResult(weather)
                // fall through to Claude for natural response
            }

            // ── CLAUDE AI CONVERSATION ────────────────────────────────────────
            const feedback = detectDayFeedback(englishText)
            const apiMessages = newMessages
                .filter(m => m.type === 'text')
                .map(m => ({ role: m.role, content: m.content }))

            if (currentTripDay && feedback) {
                apiMessages.push({
                    role: 'user',
                    content: feedback === 'positive'
                        ? `The user had a great Day ${currentTripDay}. Continue with the next day itinerary.`
                        : `The user was disappointed with Day ${currentTripDay}. Please suggest a revised itinerary for the remaining days.`
                })
                setCurrentTripDay(prev => prev + 1)
            }

            let fullResponse = ''
            await sendMessage(apiMessages, (chunk) => {
                fullResponse += chunk
                setStreamingText(fullResponse)
            })
            setStreamingText('')

            // Check if itinerary generated
            if (fullResponse.toLowerCase().includes('day 1') && fullResponse.toLowerCase().includes('day 2')) {
                setCurrentTripDay(1)
                setPendingItinerary({
                    title: text,
                    content: fullResponse,
                    createdAt: new Date().toISOString(),
                    days: [],
                })
            }

            // Check SAVE_ITINERARY command
            if (fullResponse.includes('SAVE_ITINERARY:')) {
                const parts = fullResponse.split('SAVE_ITINERARY:')
                try {
                    const parsed = JSON.parse(parts[1].trim())
                    setPendingItinerary(parsed)
                    const translated = detectedLang !== 'en'
                        ? await translateText(parts[0].trim(), 'en', detectedLang)
                        : parts[0].trim()
                    postAIMessage(translated, newMessages, chatId)
                    setIsLoading(false)
                    return
                } catch { /* fall through */ }
            }

            // Translate response back to user language
            const finalResponse = detectedLang !== 'en'
                ? await translateText(fullResponse, 'en', detectedLang)
                : fullResponse

            postAIMessage(finalResponse, newMessages, chatId)

            if (fullResponse.toLowerCase().includes('how was') && fullResponse.toLowerCase().includes('day')) {
                setCurrentTripDay(prev => prev || 1)
            }

        } catch (error) {
            console.error(error)
            await postAIMessageTranslated(
                '⚠️ Connection error. Please check your API key and internet connection.',
                newMessages, chatId, userLanguage
            )
        } finally {
            setIsLoading(false)
            setStreamingText('')
        }
    }

    const handleSaveItinerary = async () => {
        if (pendingItinerary) {
            saveItinerary(pendingItinerary)
            setPendingItinerary(null)
            const chatId = activeChatId || generateId()
            await postAIMessageTranslated(
                "✅ Itinerary saved! View it anytime in the Itinerary tab. I'll check in with you after Day 1 — enjoy your trip! 🌏",
                messages, chatId, userLanguage
            )
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const quickReplies = [
        { text: '✈️ Find flights',   prompt: 'Find me flights from KL to Tokyo' },
        { text: '🏨 Find hotels',    prompt: 'Find hotels in Tokyo' },
        { text: '🗺️ Plan itinerary', prompt: 'Plan a 3 day trip to Tokyo' },
        { text: '🌤️ Check weather',  prompt: 'What is the weather in Tokyo' },
    ]

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)',
            background: '#f0f6ff', position: 'relative',
        }}>

            {/* ── Header ── */}
            <div style={{
                background: '#ffffff', borderBottom: '1px solid #e0ecff',
                padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: '0 2px 12px #1e6fd910', flexShrink: 0, zIndex: 10,
            }}>
                <button onClick={() => setActiveScreen('home')} style={{
                    background: '#f0f6ff', border: '1px solid #c0d8f0', borderRadius: '10px',
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                }}>
                    <ArrowLeft size={18} color='#1e6fd9' />
                </button>

                <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px #1e6fd930', flexShrink: 0,
                }}>
                    <Sparkles size={18} color='#ffffff' />
                </div>

                <div style={{ flex: 1 }}>
                    <p style={{ color: '#0a1628', fontSize: '15px', fontWeight: '700' }}>
                        VoyageAI Assistant
                    </p>
                    <p style={{ color: '#059669', fontSize: '11px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                        Online {userLanguage !== 'en' && `· ${userLanguage.toUpperCase()}`}
                    </p>
                </div>

                <button onClick={() => setShowHistory(!showHistory)} style={{
                    background: showHistory ? '#d0e8ff' : '#f0f6ff', border: '1px solid #c0d8f0',
                    borderRadius: '10px', padding: '6px 12px', color: '#1e6fd9',
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                }}>
                    History
                </button>

                <button onClick={startNewChat} style={{
                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)', border: 'none',
                    borderRadius: '10px', padding: '6px 12px', color: '#ffffff',
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                }}>
                    + New
                </button>
            </div>

            {/* ── History Panel ── */}
            {showHistory && (
                <div style={{
                    position: 'absolute', top: '68px', right: 0, width: '280px',
                    background: '#ffffff', border: '1px solid #e0ecff',
                    borderRadius: '0 0 0 16px', boxShadow: '0 8px 32px #1e6fd920',
                    zIndex: 100, maxHeight: '60vh', overflowY: 'auto', padding: '12px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700' }}>Chat History</p>
                        {conversations.length > 0 && (
                            <button onClick={clearAllHistory} style={{
                                background: 'none', border: 'none', color: '#dc2626',
                                fontSize: '11px', cursor: 'pointer', fontWeight: '600',
                            }}>Clear All</button>
                        )}
                    </div>
                    {conversations.length === 0 ? (
                        <p style={{ color: '#8aaac8', fontSize: '13px', textAlign: 'center', padding: '16px' }}>
                            No saved conversations yet
                        </p>
                    ) : (
                        conversations.map(conv => (
                            <div key={conv.id} style={{
                                background: activeChatId === conv.id ? '#d0e8ff' : '#f0f6ff',
                                border: '1px solid #c0d8f0', borderRadius: '10px',
                                padding: '10px 12px', marginBottom: '8px',
                                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                            }}>
                                <div style={{ flex: 1 }} onClick={() => loadConversation(conv)}>
                                    <p style={{
                                        color: '#0a1628', fontSize: '12px', fontWeight: '600', marginBottom: '2px',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px',
                                    }}>{conv.title}</p>
                                    <p style={{ color: '#8aaac8', fontSize: '10px' }}>
                                        {new Date(conv.updatedAt).toLocaleDateString('en-MY')}
                                    </p>
                                </div>
                                <button onClick={() => deleteConversation(conv.id)} style={{
                                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#8aaac8',
                                }}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── Messages ── */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
                display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
                {messages.map((msg, index) => (
                    <div key={msg.id || index}>
                        <div style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            alignItems: 'flex-end', gap: '8px',
                        }}>
                            {msg.role === 'assistant' && (
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, marginBottom: '2px',
                                }}>
                                    <Sparkles size={13} color='#ffffff' />
                                </div>
                            )}
                            <div style={{
                                maxWidth: '75%', padding: '12px 14px',
                                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                background: msg.role === 'user' ? 'linear-gradient(135deg, #1e6fd9, #4a9fe8)' : '#ffffff',
                                color: msg.role === 'user' ? '#ffffff' : '#0a1628',
                                fontSize: '14px', lineHeight: '1.5',
                                boxShadow: msg.role === 'user' ? '0 4px 12px #1e6fd930' : '0 2px 12px #1e6fd910',
                                border: msg.role === 'assistant' ? '1px solid #e0ecff' : 'none',
                            }} dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                            {msg.role === 'user' && (
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%', background: '#e0ecff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, marginBottom: '2px',
                                }}>
                                    <User size={14} color='#1e6fd9' />
                                </div>
                            )}
                        </div>
                        {msg.role === 'assistant' && (
                            <div style={{ paddingLeft: '36px', marginTop: '4px' }}>
                                <button onClick={() => speakText(msg.content)} style={{
                                    background: 'none', border: 'none', color: '#8aaac8', fontSize: '11px',
                                    cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '4px',
                                }}>
                                    🔊 Listen
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Streaming */}
                {streamingText && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '8px' }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <Sparkles size={13} color='#ffffff' />
                        </div>
                        <div style={{
                            maxWidth: '75%', padding: '12px 14px', borderRadius: '18px 18px 18px 4px',
                            background: '#ffffff', border: '1px solid #e0ecff',
                            fontSize: '14px', lineHeight: '1.5', color: '#0a1628',
                            boxShadow: '0 2px 12px #1e6fd910',
                        }} dangerouslySetInnerHTML={{ __html: formatMessage(streamingText) }} />
                    </div>
                )}

                {/* Loading dots */}
                {isLoading && !streamingText && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: '8px' }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={13} color='#ffffff' />
                        </div>
                        <div style={{
                            padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
                            background: '#ffffff', border: '1px solid #e0ecff', boxShadow: '0 2px 12px #1e6fd910',
                        }}>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {[0,1,2].map(i => (
                                    <div key={i} style={{
                                        width: '7px', height: '7px', borderRadius: '50%', background: '#1e6fd9',
                                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                                    }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Flight Results */}
                {flightResults && (
                    <div style={{ marginTop: '4px' }}>
                        <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600', marginBottom: '8px', paddingLeft: '36px' }}>
                            ✈️ {flightResults.flights.length} flights · {flightResults.origin?.toUpperCase()} → {flightResults.destination?.toUpperCase()} · {flightResults.date}
                        </p>
                        {flightResults.flights.map((flight, i) => (
                            <FlightCard
                                key={i}
                                flight={flight}
                                onBook={async () => {
                                    saveTrip({ destination: flightResults.destination, date: flightResults.date, flight, type: 'flight' })
                                    const cid = activeChatId || generateId()
                                    await postAIMessageTranslated(
                                        `✅ **${flight.flightNumber}** booked successfully! Check **My Trips** for your e-ticket. Have a great flight! ✈️`,
                                        messages, cid, userLanguage
                                    )
                                    setFlightResults(null)
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Hotel Results */}
                {hotelResults && (
                    <div style={{ marginTop: '4px' }}>
                        <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600', marginBottom: '8px', paddingLeft: '36px' }}>
                            🏨 Hotels in {hotelResults.city}
                        </p>
                        {hotelResults.hotels.map((hotel, i) => (
                            <HotelCard
                                key={i}
                                hotel={hotel}
                                onBook={async () => {
                                    saveTrip({ destination: hotelResults.city, hotel, type: 'hotel' })
                                    const cid = activeChatId || generateId()
                                    await postAIMessageTranslated(
                                        `✅ **${hotel.name}** booked! Check **My Trips** for your confirmation. 🏨`,
                                        messages, cid, userLanguage
                                    )
                                    setHotelResults(null)
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Weather */}
                {weatherResult && (
                    <div style={{
                        marginLeft: '36px', background: '#ffffff', border: '1px solid #e0ecff',
                        borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px #1e6fd910',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '14px', background: '#d0e8ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                            }}>🌤️</div>
                            <div>
                                <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700' }}>{weatherResult.city}</p>
                                <p style={{ color: '#1e6fd9', fontSize: '26px', fontWeight: '800' }}>{weatherResult.temp}°C</p>
                            </div>
                            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                <p style={{ color: '#5a7a9f', fontSize: '12px', textTransform: 'capitalize' }}>{weatherResult.description}</p>
                                <p style={{ color: '#8aaac8', fontSize: '11px' }}>Feels like {weatherResult.feels_like}°C</p>
                                <p style={{ color: '#8aaac8', fontSize: '11px' }}>💧{weatherResult.humidity}% · 💨{weatherResult.wind}km/h</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Itinerary */}
                {pendingItinerary && (
                    <div style={{
                        marginLeft: '36px', background: '#ffffff', border: '1.5px solid #1e6fd9',
                        borderRadius: '16px', padding: '16px', boxShadow: '0 4px 16px #1e6fd920',
                    }}>
                        <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                            💾 Save this itinerary to your Itinerary tab?
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleSaveItinerary} style={{
                                flex: 1, background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                border: 'none', borderRadius: '10px', padding: '10px', color: '#ffffff',
                                fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            }}>
                                <Check size={14} /> Yes, Save It
                            </button>
                            <button onClick={() => setPendingItinerary(null)} style={{
                                flex: 1, background: '#f0f6ff', border: '1px solid #c0d8f0',
                                borderRadius: '10px', padding: '10px', color: '#5a7a9f',
                                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            }}>
                                <X size={14} /> Not Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Quick Replies */}
                {messages.length === 1 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingLeft: '36px', marginTop: '4px' }}>
                        {quickReplies.map((qr, i) => (
                            <button key={i} onClick={() => handleSend(qr.prompt)} style={{
                                background: '#ffffff', border: '1.5px solid #c0d8f0',
                                borderRadius: '20px', padding: '8px 14px', color: '#1e6fd9',
                                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                                boxShadow: '0 2px 8px #1e6fd910', transition: 'all 0.2s ease',
                            }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#d0e8ff'; e.currentTarget.style.borderColor = '#1e6fd9' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#c0d8f0' }}
                            >
                                {qr.text}
                            </button>
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ── Input Bar ── */}
            <div style={{
                background: '#ffffff', borderTop: '1px solid #e0ecff', padding: '12px 16px',
                display: 'flex', alignItems: 'flex-end', gap: '10px',
                flexShrink: 0, boxShadow: '0 -2px 12px #1e6fd910',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <button onClick={toggleListening} title={isListening ? 'Stop listening' : 'Tap to speak'} style={{
                        width: '42px', height: '42px', borderRadius: '50%',
                        background: isListening ? 'linear-gradient(135deg, #dc2626, #ef4444)' : '#f0f6ff',
                        border: isListening ? 'none' : '1.5px solid #c0d8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                        boxShadow: isListening ? '0 0 16px #dc262640' : 'none',
                        transition: 'all 0.2s ease',
                    }}>
                        {isListening ? <MicOff size={18} color='#ffffff' /> : <Mic size={18} color='#1e6fd9' />}
                    </button>
                    {isListening && (
                        <span style={{ fontSize: '9px', color: '#dc2626', fontWeight: '700', animation: 'pulse 1s infinite' }}>
                            ● REC
                        </span>
                    )}
                </div>

                <div style={{
                    flex: 1, background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                    borderRadius: '22px', padding: '10px 16px', display: 'flex', alignItems: 'center',
                }}>
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isListening ? '🎤 Listening...' : 'Ask me anything about travel...'}
                        rows={1}
                        style={{
                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                            fontSize: '14px', color: '#0a1628', resize: 'none',
                            fontFamily: 'Inter, sans-serif', lineHeight: '1.4', maxHeight: '80px',
                        }}
                    />
                </div>

                <button onClick={() => handleSend()} disabled={!input.trim() || isLoading} style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: input.trim() && !isLoading ? 'linear-gradient(135deg, #1e6fd9, #4a9fe8)' : '#e0ecff',
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed', flexShrink: 0,
                    boxShadow: input.trim() && !isLoading ? '0 4px 12px #1e6fd930' : 'none',
                    transition: 'all 0.2s ease',
                }}>
                    <Send size={18} color={input.trim() && !isLoading ? '#ffffff' : '#8aaac8'} />
                </button>
            </div>

            <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
        </div>
    )
}

export default ChatScreen