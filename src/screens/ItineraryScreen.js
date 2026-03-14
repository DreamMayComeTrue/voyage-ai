import React, { useState } from 'react'
import { MapPin, Clock, ChevronRight, ArrowLeft, Globe, Camera, RotateCcw, Navigation } from 'lucide-react'

// ── Parse AI plain text into structured itinerary ────────────────────────
export const parseItineraryText = (text, title) => {
    if (!text) return null

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const days = []
    let currentDay = null
    let currentSection = null

    // Title-case every word: "kuala lumpur" → "Kuala Lumpur"
    const toTitleCase = (str) =>
        str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

    // Extract destination & build title
    let itineraryTitle = title || 'My Itinerary'
    let destination = ''
    const destMatch = (title || text).match(/(\d+)[- ]day[s]?\s+(?:trip\s+to\s+|itinerary\s+(?:for|to)\s+)?([A-Za-z][A-Za-z\s]{1,20})/i)
    if (destMatch) {
        destination = toTitleCase(destMatch[2].trim())
        // Avoid "Tokyo Trip Trip" — only append Trip if title doesn't already end with it
        const base = `${destMatch[1]}-Day ${destination}`
        itineraryTitle = base.toLowerCase().endsWith('trip') ? base : `${base} Trip`
    } else if (title) {
        // Still title-case whatever was passed in
        itineraryTitle = toTitleCase(title)
    }

    // Helper: is this line a travel tip (not a place)?
    const isTipLine = (s) => {
        const lower = s.toLowerCase()
        const tipStarts = [
            'tip:', 'tips:', 'note:', 'notes:', '💡', '⚠️',
            'travel tip', 'pro tip', 'get a ', 'get the ', 'get your ',
            'download ', 'carry ', 'bring ', 'wear ', 'avoid ',
            'make sure', 'remember', "don't forget", 'always ',
            'total cost', 'budget', 'estimated', 'cost:', 'price:',
            'transportation:', 'transport:', 'how to get', 'public transport',
            'currency', 'exchange', 'weather', 'temperature',
        ]
        return tipStarts.some(p => lower.startsWith(p))
    }

    const isSectionHeader = (s) => {
        const sections = ['morning', 'afternoon', 'evening', 'night', 'lunch', 'dinner', 'breakfast', 'rest', 'end of trip', 'end trip', 'departure']
        const clean = s.toLowerCase().replace(/[*#()\[\]\d\s:APMapm\-–]/g, '')
        return sections.some(sec => clean === sec || clean.startsWith(sec.replace(/\s/g, '')))
    }

    const isDayHeader = (s) => /(?:^|[*#\s])day\s*\d+/i.test(s)

    for (const line of lines) {
        // Strip markdown formatting for matching
        const clean = line.replace(/\*+/g, '').replace(/^#+\s*/, '').trim()
        if (!clean) continue

        // ── Day header ──────────────────────────────────────────────────
        // Matches: "Day 1", "Day 1:", "Day 1 - Arrival", "**Day 1**", "## Day 1"
        const dayMatch = clean.match(/^day\s*(\d+)\s*[-:–]?\s*(.*)$/i)
        if (dayMatch) {
            currentDay = {
                day: parseInt(dayMatch[1]),
                title: dayMatch[2]?.trim() || `Day ${dayMatch[1]}`,
                places: [],
            }
            days.push(currentDay)
            currentSection = null
            continue
        }

        if (!currentDay) continue

        // ── Section header ───────────────────────────────────────────────
        const sectionMatch = clean.match(/^(morning|afternoon|evening|night|lunch|dinner|breakfast|rest|end\s*of\s*trip|end\s*trip|departure)\s*[\(\[]?([^\)\]]*)?[\)\]]?$/i)
        if (sectionMatch && clean.length < 50) {
            currentSection = {
                label: sectionMatch[1].charAt(0).toUpperCase() + sectionMatch[1].slice(1).toLowerCase(),
                timeRange: sectionMatch[2]?.trim() || null,
            }
            continue
        }

        // Skip tip lines
        if (isTipLine(clean)) continue

        // ── Time range first: "9:00 AM - 11:00 AM: Place Name" ──────────
        const timeRangeFirst = clean.match(/^[-•]?\s*(\d{1,2}[:.]\d{2}\s*(?:[AaPp][Mm])?)\s*[-–]\s*(\d{1,2}[:.]\d{2}\s*(?:[AaPp][Mm])?)\s*[:-]?\s*(.+)/)
        if (timeRangeFirst) {
            const name = timeRangeFirst[3].replace(/\*+/g, '').trim()
            if (name.length > 1 && !isTipLine(name)) {
                currentDay.places.push({
                    name,
                    time: `${timeRangeFirst[1].trim()} – ${timeRangeFirst[2].trim()}`,
                    section: currentSection?.label || null,
                    tip: null,
                })
            }
            continue
        }

        // ── Place (time in parens): "Place Name (9:00 - 11:00)" ─────────
        const placeTimeParen = clean.match(/^[-•]?\s*(.+?)\s*\((\d{1,2}[:.]\d{2}\s*(?:[AaPp][Mm])?)\s*[-–]\s*(\d{1,2}[:.]\d{2}\s*(?:[AaPp][Mm])?)\)/)
        if (placeTimeParen) {
            const name = placeTimeParen[1].replace(/\*+/g, '').trim()
            if (name.length > 1 && !isTipLine(name)) {
                currentDay.places.push({
                    name,
                    time: `${placeTimeParen[2].trim()} – ${placeTimeParen[3].trim()}`,
                    section: currentSection?.label || null,
                    tip: null,
                })
            }
            continue
        }

        // ── Bullet line: "- Place Name (time) tip" ──────────────────────
        const bulletMatch = clean.match(/^[-•]\s+(.+)$/)
        if (bulletMatch) {
            const content = bulletMatch[1].trim()
            if (isTipLine(content)) continue

            // Try to extract time range from anywhere in the line
            // e.g. "Senso-ji Temple (9:00AM-10:30AM) Visit oldest temple"
            const timeInLine = content.match(/\((\d{1,2}[:.]\d{2}\s*(?:[AaPp][Mm])?)\s*[-–]\s*(\d{1,2}[:.]\d{2}\s*(?:[AaPp][Mm])?)\)/)

            let name, tip, time

            if (timeInLine) {
                // Remove the time part to get clean name + tip
                const withoutTime = content.replace(timeInLine[0], '').trim()
                // Everything before first non-bracket word is name, rest is tip
                const parts = withoutTime.split(/\s{2,}|\s*[-–]\s*(?=[A-Z])/)
                name = parts[0].replace(/\*+/g, '').replace(/[()]/g, '').trim()
                tip  = parts[1]?.trim() || null
                time = `${timeInLine[1].trim()} – ${timeInLine[2].trim()}`
            } else {
                // No time — bold name or plain name with optional description
                // Handle: "**Place Name** description" or "Place Name description"
                const boldMatch = content.match(/^\*{1,2}([^*]+)\*{1,2}\s*(.*)/)
                if (boldMatch) {
                    name = boldMatch[1].trim()
                    tip  = boldMatch[2]?.trim() || null
                } else {
                    // Plain: first part is name (up to " - " separator or end)
                    const dashSplit = content.match(/^([^-–(]+?)(?:\s*[-–]\s*(.+))?$/)
                    name = dashSplit?.[1]?.trim() || content
                    tip  = dashSplit?.[2]?.trim() || null
                }
                time = currentSection?.timeRange || null
            }

            if (name && name.length > 1 && name.length < 80 && !isTipLine(name) && !isDayHeader(name) && !isSectionHeader(name)) {
                currentDay.places.push({
                    name,
                    tip: tip || null,
                    time,
                    section: currentSection?.label || null,
                })
            }
            continue
        }

        // ── Plain capitalised line (likely a place name) ─────────────────
        const startsCapital = /^[A-Z]/.test(clean)
        const notTooLong = clean.length > 2 && clean.length < 70
        const notASentence = (clean.match(/\s/g) || []).length < 8
        if (startsCapital && notTooLong && notASentence && !isTipLine(clean) && !isDayHeader(clean) && !isSectionHeader(clean)) {
            currentDay.places.push({
                name: clean,
                time: currentSection?.timeRange || null,
                section: currentSection?.label || null,
                tip: null,
            })
        }
    }

    const validDays = days.filter(d => d.places.length > 0)
    if (validDays.length === 0) return null

    return {
        title: itineraryTitle,
        destination,
        days: validDays,
        totalDays: validDays.length,
        rawText: text,
        createdAt: new Date().toISOString(),
    }
}

// ── Section colors ────────────────────────────────────────────────────────
const SECTION_COLORS = {
    Morning:       { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
    Afternoon:     { bg: '#fff7ed', color: '#c2410c', dot: '#f97316' },
    Evening:       { bg: '#f3e8ff', color: '#7c3aed', dot: '#a855f7' },
    Night:         { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
    Lunch:         { bg: '#f0fdf4', color: '#166534', dot: '#22c55e' },
    Dinner:        { bg: '#fff1f2', color: '#9f1239', dot: '#f43f5e' },
    Breakfast:     { bg: '#fffbeb', color: '#92400e', dot: '#f59e0b' },
    Rest:          { bg: '#f8fafc', color: '#64748b', dot: '#94a3b8' },
    'End Of Trip': { bg: '#f0f6ff', color: '#1e6fd9', dot: '#1e6fd9' },
    Activities:    { bg: '#f0f6ff', color: '#1e6fd9', dot: '#1e6fd9' },
    default:       { bg: '#f0f6ff', color: '#1e6fd9', dot: '#1e6fd9' },
}

const getSectionColor = (section) => SECTION_COLORS[section] || SECTION_COLORS.default

// ── Destination image + emoji map ────────────────────────────────────────
const DEST_CONFIG_IT = {
    tokyo:     { img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', emoji: '🗼' },
    japan:     { img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', emoji: '🗼' },
    osaka:     { img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=600&q=80', emoji: '🏯' },
    singapore: { img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80', emoji: '🦁' },
    bangkok:   { img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80', emoji: '🐘' },
    bali:      { img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', emoji: '🌴' },
    london:    { img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', emoji: '🎡' },
    paris:     { img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', emoji: '🗽' },
    dubai:     { img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', emoji: '🏙️' },
    sydney:    { img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80', emoji: '🦘' },
    seoul:     { img: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&q=80', emoji: '🇰🇷' },
    default:   { img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80', emoji: '✈️' },
}

const getDestConfig = (title, dest) => {
    const s = ((title || '') + ' ' + (dest || '')).toLowerCase()
    for (const [key, cfg] of Object.entries(DEST_CONFIG_IT)) {
        if (key !== 'default' && s.includes(key)) return cfg
    }
    return DEST_CONFIG_IT.default
}

// ── Main Screen ───────────────────────────────────────────────────────────
const ItineraryScreen = ({ itineraries, setActiveScreen }) => {
    const [view, setView]           = useState('list')   // 'list' | 'detail'
    const [selectedIdx, setSelectedIdx] = useState(0)
    const [selectedDay, setSelectedDay] = useState(0)

    // Parse all saved itineraries
    const parsed = (itineraries || []).map(it => {
        if (it.days && it.days.length > 0) return it
        return parseItineraryText(it.content || it.rawText || '', it.title || '')
    }).filter(Boolean)

    const openDetail = (idx) => {
        setSelectedIdx(idx)
        setSelectedDay(0)
        setView('detail')
    }

    // ── LIST VIEW ────────────────────────────────────────────────────────
    if (view === 'list') {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column',
                height: 'calc(100vh - 70px)', background: '#f0f6ff',
            }}>
                {/* Header */}
                <div style={{ flexShrink: 0 }}>
                    <div style={{
                        position: 'relative', height: '130px', overflow: 'hidden',
                        background: 'linear-gradient(135deg, #1e6fd9 0%, #4a9fe8 50%, #0ea5e9 100%)',
                    }}>
                        {/* Decorative circles */}
                        {[
                            { top: '-30px', right: '-30px', size: '160px', opacity: 0.08 },
                            { bottom: '-40px', left: '30%',  size: '120px', opacity: 0.06 },
                            { top: '10px',  left: '-20px',  size: '80px',  opacity: 0.05 },
                        ].map((c, i) => (
                            <div key={i} style={{
                                position: 'absolute', ...c,
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
                                color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600',
                                textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px',
                            }}>
                                🗺️ VoyageAI
                            </p>
                            <h1 style={{
                                color: '#ffffff', fontSize: '26px', fontWeight: '900',
                                margin: 0, lineHeight: 1.1,
                            }}>
                                My Itineraries
                            </h1>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                    borderRadius: '20px', padding: '3px 10px',
                                    color: '#ffffff', fontSize: '11px', fontWeight: '600',
                                }}>
                                    {parsed.length} trip plan{parsed.length !== 1 ? 's' : ''} saved
                                </span>
                            </div>
                        </div>
                        {/* Plan new button */}
                        <button onClick={() => setActiveScreen('chat')} style={{
                            position: 'absolute', top: '16px', right: '16px',
                            background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
                            border: '1.5px solid rgba(255,255,255,0.4)',
                            borderRadius: '12px', padding: '8px 14px',
                            color: '#ffffff', fontSize: '12px', fontWeight: '700',
                            cursor: 'pointer',
                        }}>
                            + Plan Trip
                        </button>
                    </div>
                </div>

                {/* List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                    {parsed.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
                        }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '20px',
                                background: '#d0e8ff', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: '32px', marginBottom: '16px',
                            }}>🗺️</div>
                            <p style={{ color: '#0a1628', fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
                                No Itineraries Yet
                            </p>
                            <p style={{ color: '#8aaac8', fontSize: '13px', marginBottom: '24px', lineHeight: '1.6' }}>
                                Ask the AI to plan a trip!<br />Try: "Plan a 3-day trip to Tokyo"
                            </p>
                            <button onClick={() => setActiveScreen('chat')} style={{
                                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                border: 'none', borderRadius: '14px', padding: '14px 28px',
                                color: '#ffffff', fontSize: '15px', fontWeight: '700',
                                cursor: 'pointer', boxShadow: '0 6px 20px #1e6fd940',
                            }}>
                                ✨ Plan with AI
                            </button>
                        </div>
                    ) : (
                        parsed.map((it, idx) => {
                            const cfg = getDestConfig(it.title, it.destination)
                            const totalPlaces = it.days.reduce((s, d) => s + (d.places?.length || 0), 0)
                            const saved = it.createdAt
                                ? new Date(it.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
                                : ''
                            const formatDateNice = (d) => {
                                try { return new Date(d).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' }) }
                                catch { return d }
                            }
                            const dateLabel = it.startDate
                                ? `${formatDateNice(it.startDate)}${it.endDate ? ' – ' + formatDateNice(it.endDate) : ''}`
                                : saved
                            return (
                                <div
                                    key={idx}
                                    onClick={() => openDetail(idx)}
                                    style={{
                                        background: '#ffffff', borderRadius: '20px',
                                        marginBottom: '16px', overflow: 'hidden',
                                        boxShadow: '0 6px 24px #1e6fd918',
                                        border: '1px solid #e0ecff', cursor: 'pointer',
                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                        e.currentTarget.style.boxShadow = '0 10px 32px #1e6fd925'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = '0 6px 24px #1e6fd918'
                                    }}
                                >
                                    {/* Image */}
                                    <div style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
                                        <img src={cfg.img} alt={it.destination}
                                             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                             onError={e => {
                                                 e.target.style.display = 'none'
                                                 e.target.parentNode.style.background = 'linear-gradient(135deg, #1e6fd9, #4a9fe8)'
                                             }}
                                        />
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'linear-gradient(to top, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.1) 60%)',
                                        }} />
                                        {/* Title on image */}
                                        <div style={{ position: 'absolute', bottom: '10px', left: '14px' }}>
                                            <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '900', lineHeight: 1.1 }}>
                                                {cfg.emoji} {it.title}
                                            </p>
                                        </div>
                                        {/* Days badge */}
                                        <div style={{
                                            position: 'absolute', top: '10px', right: '10px',
                                            background: 'rgba(30,111,217,0.85)', backdropFilter: 'blur(4px)',
                                            borderRadius: '10px', padding: '4px 10px',
                                        }}>
                                            <p style={{ color: '#ffffff', fontSize: '11px', fontWeight: '700' }}>
                                                {it.totalDays} days
                                            </p>
                                        </div>
                                    </div>

                                    {/* Info row */}
                                    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {[
                                                    { icon: '📍', label: `${totalPlaces} places` },
                                                    { icon: '📅', label: `${it.totalDays} days` },
                                                    dateLabel ? { icon: '🗓️', label: dateLabel } : null,
                                                ].filter(Boolean).map((item, i) => (
                                                    <span key={i} style={{
                                                        background: '#f0f6ff', borderRadius: '8px',
                                                        padding: '4px 10px',
                                                        color: '#5a7a9f', fontSize: '11px', fontWeight: '600',
                                                        display: 'flex', alignItems: 'center', gap: '4px',
                                                    }}>
                                                        {item.icon} {item.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                            borderRadius: '10px', padding: '8px 14px',
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            boxShadow: '0 4px 10px #1e6fd930',
                                        }}>
                                            <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: '700' }}>
                                                View
                                            </span>
                                            <ChevronRight size={14} color='#ffffff' />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        )
    }

    // ── DETAIL VIEW ──────────────────────────────────────────────────────
    const current = parsed[Math.min(selectedIdx, parsed.length - 1)]
    const currentDayData = current?.days?.[selectedDay]

    // Destination image map
    const DEST_IMAGES = {
        tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
        japan: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
        osaka: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
        singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
        bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
        bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
        paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
        dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
        sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
        seoul: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80',
        default: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80',
    }
    const destKey = (current.destination || '').toLowerCase()
    const headerImg = Object.entries(DEST_IMAGES).find(([k]) => k !== 'default' && destKey.includes(k))?.[1] || DEST_IMAGES.default
    const totalActivities = current.days.reduce((s, d) => s + (d.places?.length || 0), 0)

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* ── Beautiful Gradient Header ── */}
            <div style={{ flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                {/* Background image */}
                <div style={{ position: 'relative', height: '160px' }}>
                    <img src={headerImg} alt={current.destination}
                         style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                         onError={e => { e.target.style.display = 'none' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, rgba(10,22,40,0.4) 0%, rgba(10,22,40,0.78) 100%)',
                    }} />
                    {/* Back button */}
                    <button onClick={() => setView('list')} style={{
                        position: 'absolute', top: '14px', left: '14px',
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                        border: '1.5px solid rgba(255,255,255,0.35)',
                        borderRadius: '10px', width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                    }}>
                        <ArrowLeft size={16} color='#ffffff' />
                    </button>
                    {/* Text on image */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 14px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600',
                            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                            🗺️ My Itinerary
                        </p>
                        <h1 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '900',
                            margin: 0, lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                            {current.title}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', padding: '3px 10px',
                                color: '#ffffff', fontSize: '11px', fontWeight: '600',
                            }}>📅 {current.totalDays} days</span>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', padding: '3px 10px',
                                color: '#ffffff', fontSize: '11px', fontWeight: '600',
                            }}>📍 {totalActivities} places</span>
                        </div>
                    </div>
                </div>

                {/* White pill area below image */}
                <div style={{
                    background: '#ffffff', borderBottom: '1px solid #e0ecff',
                    padding: '12px 16px 0', boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    {/* Action pills */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto' }}>
                        {[
                            { icon: Navigation, label: 'Navigate',   color: '#1e6fd9', bg: '#d0e8ff' },
                            { icon: Globe,      label: 'Translate',  color: '#7c3aed', bg: '#ede9fe' },
                            { icon: Camera,     label: 'Photo tips', color: '#059669', bg: '#d1fae5' },
                            { icon: RotateCcw,  label: 'Replan',     color: '#d97706', bg: '#fef3c7' },
                        ].map((action, i) => {
                            const Icon = action.icon
                            return (
                                <button key={i} onClick={() => {
                                    if (action.label === 'Translate') setActiveScreen('translate')
                                    else setActiveScreen('chat')
                                }} style={{
                                    background: action.bg, border: 'none', borderRadius: '20px',
                                    padding: '7px 14px', cursor: 'pointer', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', gap: '5px',
                                }}>
                                    <Icon size={13} color={action.color} />
                                    <span style={{ color: action.color, fontSize: '12px', fontWeight: '600' }}>
                                        {action.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                    {/* Day tabs */}
                    <div style={{ display: 'flex', gap: '6px', paddingBottom: '14px', overflowX: 'auto' }}>
                        {current.days.map((day, i) => (
                            <button key={i} onClick={() => setSelectedDay(i)} style={{
                                flexShrink: 0,
                                background: selectedDay === i ? '#1e6fd9' : '#f0f6ff',
                                border: selectedDay === i ? 'none' : '1.5px solid #c0d8f0',
                                borderRadius: '20px', padding: '6px 16px', cursor: 'pointer',
                                boxShadow: selectedDay === i ? '0 4px 12px #1e6fd930' : 'none',
                                transition: 'all 0.15s ease',
                            }}>
                                <span style={{
                                    color: selectedDay === i ? '#ffffff' : '#5a7a9f',
                                    fontSize: '13px', fontWeight: '700',
                                }}>
                                    {i + 1}. {day.title || `Day ${day.day}`}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Day Content ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {currentDayData ? (
                    <DayView day={currentDayData} />
                ) : (
                    <p style={{ color: '#8aaac8', textAlign: 'center', padding: '40px' }}>
                        No activities for this day
                    </p>
                )}
            </div>
        </div>
    )
}

// ── Day View ──────────────────────────────────────────────────────────────
const DayView = ({ day }) => {
    // Group places by section
    const grouped = {}
    const order = []
    for (const place of day.places) {
        const key = place.section || 'Activities'
        if (!grouped[key]) { grouped[key] = []; order.push(key) }
        grouped[key].push(place)
    }

    return (
        <div>
            {/* Day header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
            }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px #1e6fd930', flexShrink: 0,
                }}>
                    <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '900' }}>
                        {day.day}
                    </span>
                </div>
                <div>
                    <p style={{ color: '#0a1628', fontSize: '18px', fontWeight: '800' }}>
                        Day {day.day}
                    </p>
                    {day.title && day.title !== `Day ${day.day}` && (
                        <p style={{ color: '#5a7a9f', fontSize: '13px' }}>{day.title}</p>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                    position: 'absolute', left: '17px', top: '24px',
                    width: '2px', bottom: '24px',
                    background: 'linear-gradient(to bottom, #c0d8f0, transparent)',
                }} />

                {order.map((sectionKey, si) => {
                    const sc = getSectionColor(sectionKey)
                    return (
                        <div key={si} style={{ marginBottom: '20px' }}>
                            {/* Section label */}
                            {sectionKey !== 'Activities' && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    marginBottom: '12px', paddingLeft: '36px',
                                }}>
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: sc.dot, flexShrink: 0,
                                    }} />
                                    <span style={{
                                        color: sc.color, fontSize: '12px', fontWeight: '700',
                                        textTransform: 'uppercase', letterSpacing: '0.5px',
                                        background: sc.bg, padding: '2px 10px', borderRadius: '10px',
                                    }}>
                                        {sectionKey}
                                    </span>
                                </div>
                            )}

                            {/* Places */}
                            {grouped[sectionKey].map((place, pi) => (
                                <PlaceCard key={pi} place={place} isLast={pi === grouped[sectionKey].length - 1} />
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ── Place Card ────────────────────────────────────────────────────────────
const PlaceCard = ({ place, isLast }) => {
    return (
        <div style={{
            display: 'flex', gap: '12px', marginBottom: isLast ? '0' : '12px',
            paddingLeft: '4px',
        }}>
            {/* Timeline dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30px', flexShrink: 0 }}>
                <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#ffffff', border: '2.5px solid #1e6fd9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px #1e6fd920', flexShrink: 0,
                    zIndex: 1,
                }}>
                    <MapPin size={12} color='#1e6fd9' />
                </div>
            </div>

            {/* Card */}
            <div style={{
                flex: 1, background: '#ffffff', borderRadius: '14px',
                padding: '14px 16px', marginBottom: '2px',
                boxShadow: '0 2px 12px #1e6fd912',
                border: '1px solid #e0ecff',
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <p style={{ color: '#0a1628', fontSize: '15px', fontWeight: '800', flex: 1, lineHeight: 1.3 }}>
                        {place.name}
                    </p>
                    <MapPin size={16} color='#c0d8f0' style={{ flexShrink: 0, marginLeft: '8px', marginTop: '2px' }} />
                </div>

                {place.time && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                        <Clock size={11} color='#8aaac8' />
                        <span style={{ color: '#8aaac8', fontSize: '12px', fontWeight: '600' }}>
                            {place.time}
                        </span>
                    </div>
                )}

                {place.tip && (
                    <div style={{
                        background: '#f0f6ff', borderRadius: '8px',
                        padding: '7px 10px', marginTop: '10px',
                        display: 'flex', alignItems: 'flex-start', gap: '6px',
                    }}>
                        <span style={{ fontSize: '13px' }}>👑</span>
                        <p style={{ color: '#5a7a9f', fontSize: '12px', lineHeight: '1.4' }}>
                            {place.tip}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ItineraryScreen