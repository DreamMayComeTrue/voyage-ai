import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, Copy, Check, ArrowLeftRight, Trash2, X } from 'lucide-react'
import { transcribeAudio, translateText } from '../services/claudeService'

// ── Supported languages ────────────────────────────────────────────────────
const LANGUAGES = [
    { code: 'en',    label: 'English',            flag: '🇬🇧' },
    { code: 'zh',    label: '中文 (Chinese)',       flag: '🇨🇳' },
    { code: 'ms',    label: 'Bahasa Melayu',       flag: '🇲🇾' },
    { code: 'ja',    label: '日本語 (Japanese)',    flag: '🇯🇵' },
    { code: 'ko',    label: '한국어 (Korean)',      flag: '🇰🇷' },
    { code: 'th',    label: 'ภาษาไทย (Thai)',      flag: '🇹🇭' },
    { code: 'fr',    label: 'Français',            flag: '🇫🇷' },
    { code: 'es',    label: 'Español',             flag: '🇪🇸' },
    { code: 'de',    label: 'Deutsch',             flag: '🇩🇪' },
    { code: 'ar',    label: 'العربية (Arabic)',     flag: '🇸🇦' },
    { code: 'hi',    label: 'हिन्दी (Hindi)',       flag: '🇮🇳' },
    { code: 'id',    label: 'Bahasa Indonesia',    flag: '🇮🇩' },
    { code: 'vi',    label: 'Tiếng Việt',          flag: '🇻🇳' },
    { code: 'pt',    label: 'Português',           flag: '🇵🇹' },
    { code: 'ru',    label: 'Русский',             flag: '🇷🇺' },
]

const getLang = (code) => LANGUAGES.find(l => l.code === code) || LANGUAGES[0]

// ── Travel phrase packs ────────────────────────────────────────────────────
const PHRASE_PACKS = {
    ja: [
        { en: 'Where is the train station?',     phrase: '駅はどこですか？' },
        { en: 'How much does this cost?',         phrase: 'これはいくらですか？' },
        { en: 'I need a doctor.',                 phrase: '医者が必要です。' },
        { en: 'Do you have vegetarian food?',     phrase: 'ベジタリアン料理はありますか？' },
        { en: 'Please call a taxi.',              phrase: 'タクシーを呼んでください。' },
        { en: 'Where is the toilet?',             phrase: 'トイレはどこですか？' },
    ],
    zh: [
        { en: 'Where is the train station?',     phrase: '火车站在哪里？' },
        { en: 'How much does this cost?',         phrase: '这个多少钱？' },
        { en: 'I need a doctor.',                 phrase: '我需要医生。' },
        { en: 'Do you have vegetarian food?',     phrase: '有素食吗？' },
        { en: 'Please call a taxi.',              phrase: '请帮我叫出租车。' },
        { en: 'Where is the toilet?',             phrase: '厕所在哪里？' },
    ],
    th: [
        { en: 'Where is the train station?',     phrase: 'สถานีรถไฟอยู่ที่ไหน?' },
        { en: 'How much does this cost?',         phrase: 'อันนี้ราคาเท่าไหร่?' },
        { en: 'I need a doctor.',                 phrase: 'ฉันต้องการหมอ' },
        { en: 'Do you have vegetarian food?',     phrase: 'มีอาหารมังสวิรัติไหม?' },
        { en: 'Please call a taxi.',              phrase: 'กรุณาเรียกแท็กซี่' },
        { en: 'Where is the toilet?',             phrase: 'ห้องน้ำอยู่ที่ไหน?' },
    ],
    ko: [
        { en: 'Where is the train station?',     phrase: '기차역이 어디에 있나요?' },
        { en: 'How much does this cost?',         phrase: '이게 얼마예요?' },
        { en: 'I need a doctor.',                 phrase: '의사가 필요해요.' },
        { en: 'Do you have vegetarian food?',     phrase: '채식 음식이 있나요?' },
        { en: 'Please call a taxi.',              phrase: '택시를 불러주세요.' },
        { en: 'Where is the toilet?',             phrase: '화장실이 어디에 있나요?' },
    ],
    default: [
        { en: 'Where is the train station?',     phrase: 'Where is the train station?' },
        { en: 'How much does this cost?',         phrase: 'How much does this cost?' },
        { en: 'I need a doctor.',                 phrase: 'I need a doctor.' },
        { en: 'Do you have vegetarian food?',     phrase: 'Do you have vegetarian food?' },
        { en: 'Please call a taxi.',              phrase: 'Please call a taxi.' },
        { en: 'Where is the toilet?',             phrase: 'Where is the toilet?' },
    ],
}

const getPhrases = (code) => PHRASE_PACKS[code] || PHRASE_PACKS.default

// ── Speak text aloud — Groq TTS with speechSynthesis fallback ─────────────
// ── Lang code → BCP-47 locale map for speechSynthesis ────────────────────
const LANG_LOCALE = {
    en: 'en-US', zh: 'zh-CN', ms: 'ms-MY', ja: 'ja-JP',
    ko: 'ko-KR', th: 'th-TH', fr: 'fr-FR', es: 'es-ES',
    de: 'de-DE', ar: 'ar-SA', hi: 'hi-IN', id: 'id-ID',
    vi: 'vi-VN', pt: 'pt-PT', ru: 'ru-RU',
}

// ── Speak with correct language voice ────────────────────────────────────
const speak = (text, langCode = 'en') => {
    if (!window.speechSynthesis || !text?.trim()) return
    window.speechSynthesis.cancel()

    const locale = LANG_LOCALE[langCode] || langCode
    const u = new window.SpeechSynthesisUtterance(text.replace(/[*_#•]/g, '').trim())
    u.lang = locale
    u.rate = 0.9

    const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices()
        // Try exact locale match first, then language prefix match
        const voice = voices.find(v => v.lang === locale)
            || voices.find(v => v.lang.startsWith(langCode))
        if (voice) u.voice = voice
        window.speechSynthesis.speak(u)
    }

    // Voices may not be loaded yet on first call
    if (window.speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak()
    } else {
        window.speechSynthesis.onvoiceschanged = () => {
            setVoiceAndSpeak()
            window.speechSynthesis.onvoiceschanged = null
        }
    }
}

// ── Main Component ─────────────────────────────────────────────────────────
const TranslateScreen = () => {
    const [fromLang, setFromLang]       = useState('en')
    const [toLang, setToLang]           = useState('ja')
    const [inputText, setInputText]     = useState('')
    const [outputText, setOutputText]   = useState('')
    const [isTranslating, setIsTranslating] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [history, setHistory]         = useState([])
    const [copied, setCopied]           = useState(null)
    const [showLangPicker, setShowLangPicker] = useState(null)
    const [activeTab, setActiveTab]     = useState('translate')
    const [error, setError]             = useState('')

    const mediaRecorderRef = useRef(null)
    const textareaRef      = useRef(null)

    const fromLangObj = getLang(fromLang)
    const toLangObj   = getLang(toLang)

    // Auto-translate when input changes (debounced)
    useEffect(() => {
        if (!inputText.trim()) { setOutputText(''); return }
        const timer = setTimeout(() => handleTranslate(), 800)
        return () => clearTimeout(timer)
    }, [inputText, fromLang, toLang])

    // ── Translate ────────────────────────────────────────────────────────
    const handleTranslate = async () => {
        if (!inputText.trim()) return
        setIsTranslating(true)
        setError('')
        try {
            const result = await translateText(inputText, fromLang, toLang)
            setOutputText(result)
            // Add to history
            setHistory(prev => [{
                id: Date.now(),
                from: fromLang, to: toLang,
                input: inputText, output: result,
                time: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }),
            }, ...prev.slice(0, 19)])
        } catch (e) {
            setError('Translation failed. Please check your connection.')
        } finally {
            setIsTranslating(false)
        }
    }

    // ── Swap languages ────────────────────────────────────────────────────
    const handleSwap = () => {
        const prevFrom = fromLang, prevTo = toLang
        const prevInput = inputText, prevOutput = outputText
        setFromLang(prevTo)
        setToLang(prevFrom)
        setInputText(prevOutput)
        setOutputText(prevInput)
    }

    // ── Record mic — exact same pattern as ChatScreen ─────────────────────
    const toggleRecording = async () => {
        // Already recording — stop it
        if (isRecording) {
            if (mediaRecorderRef.current?.state === 'recording') {
                mediaRecorderRef.current.stop()
            }
            setIsRecording(false)
            return
        }

        try {
            setError('')
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
                : MediaRecorder.isTypeSupported('audio/ogg') ? 'audio/ogg'
                    : 'audio/mp4'

            const recorder = new MediaRecorder(stream, { mimeType })
            mediaRecorderRef.current = recorder
            const chunks = []

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data)
            }

            recorder.onstop = async () => {
                stream.getTracks().forEach(t => t.stop())
                setIsRecording(false)
                if (chunks.length === 0) return

                const audioBlob = new Blob(chunks, { type: mimeType })
                setIsTranslating(true)
                setInputText('🎤 Transcribing...')
                try {
                    const transcript = await transcribeAudio(audioBlob)
                    if (transcript) {
                        setInputText(transcript)
                        const result = await translateText(transcript, fromLang, toLang)
                        setOutputText(result)
                        setHistory(prev => [{
                            id: Date.now(), from: fromLang, to: toLang,
                            input: transcript, output: result,
                            time: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }),
                        }, ...prev.slice(0, 19)])
                    } else {
                        setInputText('')
                        setError('Could not hear clearly. Please try again.')
                    }
                } catch {
                    setInputText('')
                    setError('Transcription failed. Please try again.')
                } finally {
                    setIsTranslating(false)
                }
            }

            recorder.start() // No timeslice — fastest, same as ChatScreen
            setIsRecording(true)

            // Auto-stop after 10 seconds
            setTimeout(() => {
                if (recorder.state === 'recording') recorder.stop()
            }, 10000)

        } catch {
            setError('Microphone access denied. Please allow mic permission.')
            setIsRecording(false)
        }
    }

    // ── Copy ─────────────────────────────────────────────────────────────
    const handleCopy = (text, side) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(side)
            setTimeout(() => setCopied(null), 2000)
        })
    }

    const phrases = getPhrases(toLang)

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* ── Header ── */}
            <div style={{ flexShrink: 0 }}>
                <div style={{
                    position: 'relative', height: '130px', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4a9fe8 100%)',
                }}>
                    {[
                        { top: '-30px', right: '-30px', size: '160px', opacity: 0.08 },
                        { bottom: '-40px', left: '30%',  size: '120px', opacity: 0.06 },
                        { top: '10px',  left: '-20px',  size: '80px',  opacity: 0.05 },
                    ].map((c, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: c.top, right: c.right,
                            bottom: c.bottom, left: c.left,
                            width: c.size, height: c.size, borderRadius: '50%',
                            background: `rgba(255,255,255,${c.opacity})`,
                        }} />
                    ))}
                    <div style={{
                        position: 'absolute', inset: 0,
                        padding: '20px 20px 16px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    }}>
                        <p style={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '11px',
                            fontWeight: '600', textTransform: 'uppercase',
                            letterSpacing: '1.5px', marginBottom: '4px',
                        }}>
                            ✈️ VoyageAI
                        </p>
                        <h1 style={{
                            color: '#ffffff', fontSize: '26px', fontWeight: '900',
                            margin: 0, lineHeight: 1.1,
                        }}>
                            Translate
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>
                            Speak or type in any language
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    background: '#ffffff', borderBottom: '1px solid #e0ecff',
                    padding: '12px 16px', display: 'flex', gap: '8px',
                    boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    {[
                        { key: 'translate', label: '🔤 Translate' },
                        { key: 'phrases',   label: '💬 Travel Phrases' },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            flex: 1,
                            background: activeTab === tab.key
                                ? 'linear-gradient(135deg, #7c3aed, #4a9fe8)'
                                : '#f0f6ff',
                            border: activeTab === tab.key ? 'none' : '1.5px solid #c0d8f0',
                            borderRadius: '12px', padding: '9px',
                            color: activeTab === tab.key ? '#ffffff' : '#5a7a9f',
                            fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                            boxShadow: activeTab === tab.key ? '0 4px 12px #7c3aed30' : 'none',
                            transition: 'all 0.15s ease',
                        }}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

                {/* Error banner */}
                {error && (
                    <div style={{
                        background: '#fef2f2', border: '1px solid #fecaca',
                        borderRadius: '10px', padding: '10px 14px',
                        marginBottom: '12px', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <p style={{ color: '#dc2626', fontSize: '12px' }}>⚠️ {error}</p>
                        <button onClick={() => setError('')} style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626',
                        }}>
                            <X size={14} />
                        </button>
                    </div>
                )}

                {activeTab === 'translate' ? (
                    <>
                        {/* Language selector row */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            marginBottom: '14px',
                        }}>
                            {/* From language */}
                            <button onClick={() => setShowLangPicker(showLangPicker === 'from' ? null : 'from')} style={{
                                flex: 1, background: '#ffffff',
                                border: `2px solid ${showLangPicker === 'from' ? '#7c3aed' : '#c0d8f0'}`,
                                borderRadius: '14px', padding: '10px 14px',
                                cursor: 'pointer', textAlign: 'left',
                                boxShadow: '0 2px 8px #1e6fd910',
                                transition: 'all 0.15s ease',
                            }}>
                                <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600', marginBottom: '2px' }}>FROM</p>
                                <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700' }}>
                                    {fromLangObj.flag} {fromLangObj.label.split(' ')[0]}
                                </p>
                            </button>

                            {/* Swap button */}
                            <button onClick={handleSwap} style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #7c3aed, #4a9fe8)',
                                border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 12px #7c3aed30', flexShrink: 0,
                                transition: 'transform 0.2s ease',
                            }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'rotate(180deg)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}
                            >
                                <ArrowLeftRight size={16} color='#ffffff' />
                            </button>

                            {/* To language */}
                            <button onClick={() => setShowLangPicker(showLangPicker === 'to' ? null : 'to')} style={{
                                flex: 1, background: '#ffffff',
                                border: `2px solid ${showLangPicker === 'to' ? '#7c3aed' : '#c0d8f0'}`,
                                borderRadius: '14px', padding: '10px 14px',
                                cursor: 'pointer', textAlign: 'left',
                                boxShadow: '0 2px 8px #1e6fd910',
                                transition: 'all 0.15s ease',
                            }}>
                                <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600', marginBottom: '2px' }}>TO</p>
                                <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700' }}>
                                    {toLangObj.flag} {toLangObj.label.split(' ')[0]}
                                </p>
                            </button>
                        </div>

                        {/* Language picker dropdown */}
                        {showLangPicker && (
                            <div style={{
                                background: '#ffffff', borderRadius: '16px',
                                border: '1.5px solid #c0d8f0', marginBottom: '14px',
                                boxShadow: '0 8px 24px #1e6fd920', overflow: 'hidden',
                            }}>
                                <div style={{
                                    padding: '10px 14px', borderBottom: '1px solid #e0ecff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>
                                        Select {showLangPicker === 'from' ? 'source' : 'target'} language
                                    </p>
                                    <button onClick={() => setShowLangPicker(null)} style={{
                                        background: 'none', border: 'none', cursor: 'pointer', color: '#8aaac8',
                                    }}>
                                        <X size={16} />
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e0ecff' }}>
                                    {LANGUAGES.map(lang => {
                                        const isSelected = showLangPicker === 'from' ? fromLang === lang.code : toLang === lang.code
                                        return (
                                            <button key={lang.code} onClick={() => {
                                                if (showLangPicker === 'from') setFromLang(lang.code)
                                                else setToLang(lang.code)
                                                setShowLangPicker(null)
                                            }} style={{
                                                background: isSelected ? '#ede9fe' : '#ffffff',
                                                border: 'none', padding: '12px 14px',
                                                cursor: 'pointer', textAlign: 'left',
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                            }}>
                                                <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                                                <span style={{
                                                    color: isSelected ? '#7c3aed' : '#0a1628',
                                                    fontSize: '12px', fontWeight: isSelected ? '700' : '500',
                                                }}>
                                                    {lang.label.split(' ')[0]}
                                                </span>
                                                {isSelected && <span style={{ marginLeft: 'auto', color: '#7c3aed', fontSize: '14px' }}>✓</span>}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Input box — FROM */}
                        <div style={{
                            background: '#ffffff', borderRadius: '16px',
                            border: '1.5px solid #c0d8f0', marginBottom: '10px',
                            boxShadow: '0 2px 12px #1e6fd910',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 14px 0',
                            }}>
                                <span style={{ color: '#7c3aed', fontSize: '12px', fontWeight: '700' }}>
                                    {fromLangObj.flag} {fromLangObj.label}
                                </span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {inputText && (
                                        <>
                                            <button onClick={() => speak(inputText, fromLang)} style={{
                                                background: '#f0f6ff', border: 'none', borderRadius: '8px',
                                                width: '28px', height: '28px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Volume2 size={13} color='#7c3aed' />
                                            </button>
                                            <button onClick={() => handleCopy(inputText, 'input')} style={{
                                                background: '#f0f6ff', border: 'none', borderRadius: '8px',
                                                width: '28px', height: '28px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                {copied === 'input' ? <Check size={13} color='#059669' /> : <Copy size={13} color='#7c3aed' />}
                                            </button>
                                            <button onClick={() => { setInputText(''); setOutputText('') }} style={{
                                                background: '#f0f6ff', border: 'none', borderRadius: '8px',
                                                width: '28px', height: '28px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <X size={13} color='#8aaac8' />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder={`Type in ${fromLangObj.label}...`}
                                rows={3}
                                style={{
                                    width: '100%', border: 'none', outline: 'none',
                                    padding: '10px 14px 14px', fontSize: '15px',
                                    color: '#0a1628', background: 'transparent',
                                    resize: 'none', fontFamily: 'Inter, sans-serif',
                                    lineHeight: '1.5', boxSizing: 'border-box',
                                }}
                            />
                            {/* Single mic button — FROM side only */}
                            <div style={{
                                padding: '0 14px 12px',
                                display: 'flex', justifyContent: 'flex-end',
                            }}>
                                <button
                                    onClick={toggleRecording}
                                    style={{
                                        background: isRecording
                                            ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                                            : 'linear-gradient(135deg, #7c3aed, #4a9fe8)',
                                        border: 'none', borderRadius: '20px',
                                        padding: '8px 16px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        boxShadow: isRecording
                                            ? '0 4px 12px #dc262630'
                                            : '0 4px 12px #7c3aed30',
                                    }}
                                >
                                    {isRecording
                                        ? <><MicOff size={13} color='#fff' /><span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>● Stop</span></>
                                        : <><Mic size={13} color='#fff' /><span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>Speak</span></>
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Output box — TO */}
                        <div style={{
                            background: isTranslating ? '#f8f0ff' : '#ffffff',
                            borderRadius: '16px',
                            border: `1.5px solid ${isTranslating ? '#c4b5fd' : '#c0d8f0'}`,
                            marginBottom: '14px',
                            boxShadow: '0 2px 12px #1e6fd910',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 14px 0',
                            }}>
                                <span style={{ color: '#1e6fd9', fontSize: '12px', fontWeight: '700' }}>
                                    {toLangObj.flag} {toLangObj.label}
                                </span>
                                {outputText && (
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => speak(outputText, toLang)} style={{
                                            background: '#f0f6ff', border: 'none', borderRadius: '8px',
                                            width: '28px', height: '28px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Volume2 size={13} color='#1e6fd9' />
                                        </button>
                                        <button onClick={() => handleCopy(outputText, 'output')} style={{
                                            background: '#f0f6ff', border: 'none', borderRadius: '8px',
                                            width: '28px', height: '28px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {copied === 'output' ? <Check size={13} color='#059669' /> : <Copy size={13} color='#1e6fd9' />}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '10px 14px 14px', minHeight: '80px' }}>
                                {isTranslating ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {[0, 1, 2].map(i => (
                                                <div key={i} style={{
                                                    width: '6px', height: '6px', borderRadius: '50%',
                                                    background: '#7c3aed',
                                                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                                                }} />
                                            ))}
                                        </div>
                                        <span style={{ color: '#7c3aed', fontSize: '13px' }}>Translating...</span>
                                    </div>
                                ) : outputText ? (
                                    <p style={{ color: '#0a1628', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                                        {outputText}
                                    </p>
                                ) : (
                                    <p style={{ color: '#c0d8f0', fontSize: '14px', lineHeight: '1.6' }}>
                                        Translation will appear here...
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Conversation history */}
                        {history.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between', marginBottom: '10px',
                                }}>
                                    <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>
                                        Recent Translations
                                    </p>
                                    <button onClick={() => setHistory([])} style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#8aaac8', fontSize: '12px',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                    }}>
                                        <Trash2 size={12} /> Clear
                                    </button>
                                </div>
                                {history.slice(0, 5).map(item => (
                                    <div key={item.id}
                                         onClick={() => { setFromLang(item.from); setToLang(item.to); setInputText(item.input); setOutputText(item.output) }}
                                         style={{
                                             background: '#ffffff', borderRadius: '12px',
                                             padding: '12px 14px', marginBottom: '8px',
                                             border: '1px solid #e0ecff', cursor: 'pointer',
                                             boxShadow: '0 2px 8px #1e6fd910',
                                         }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '12px' }}>{getLang(item.from).flag}</span>
                                            <ArrowLeftRight size={10} color='#8aaac8' />
                                            <span style={{ fontSize: '12px' }}>{getLang(item.to).flag}</span>
                                            <span style={{ color: '#8aaac8', fontSize: '11px', marginLeft: 'auto' }}>{item.time}</span>
                                        </div>
                                        <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>
                                            {item.input.length > 50 ? item.input.slice(0, 50) + '...' : item.input}
                                        </p>
                                        <p style={{ color: '#5a7a9f', fontSize: '12px' }}>
                                            {item.output.length > 50 ? item.output.slice(0, 50) + '...' : item.output}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    /* ── Travel Phrases tab ── */
                    <div>
                        <div style={{
                            background: '#ffffff', borderRadius: '14px',
                            padding: '12px 14px', marginBottom: '14px',
                            border: '1px solid #e0ecff',
                            display: 'flex', alignItems: 'center', gap: '10px',
                        }}>
                            <span style={{ fontSize: '20px' }}>{toLangObj.flag}</span>
                            <div>
                                <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>
                                    Phrases in {toLangObj.label}
                                </p>
                                <p style={{ color: '#8aaac8', fontSize: '11px' }}>
                                    Tap any phrase to hear it · Tap mic to speak
                                </p>
                            </div>
                        </div>

                        {phrases.map((p, i) => (
                            <div key={i} style={{
                                background: '#ffffff', borderRadius: '14px',
                                padding: '14px 16px', marginBottom: '10px',
                                border: '1px solid #e0ecff',
                                boxShadow: '0 2px 8px #1e6fd910',
                            }}>
                                <p style={{ color: '#8aaac8', fontSize: '11px', marginBottom: '4px' }}>
                                    {p.en}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <p style={{
                                        color: '#0a1628', fontSize: '16px', fontWeight: '700',
                                        flex: 1, lineHeight: 1.4,
                                    }}>
                                        {p.phrase}
                                    </p>
                                    <button onClick={() => speak(p.phrase, toLang)} style={{
                                        background: 'linear-gradient(135deg, #7c3aed, #4a9fe8)',
                                        border: 'none', borderRadius: '10px',
                                        width: '36px', height: '36px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 10px #7c3aed30', flexShrink: 0,
                                    }}>
                                        <Volume2 size={15} color='#ffffff' />
                                    </button>
                                    <button onClick={() => handleCopy(p.phrase, `phrase-${i}`)} style={{
                                        background: '#f0f6ff', border: '1px solid #c0d8f0',
                                        borderRadius: '10px', width: '36px', height: '36px',
                                        cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        {copied === `phrase-${i}` ? <Check size={14} color='#059669' /> : <Copy size={14} color='#7c3aed' />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    )
}

export default TranslateScreen