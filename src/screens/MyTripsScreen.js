import React, { useState, useMemo } from 'react'
import { Plane, Hotel, Calendar, MapPin, ChevronRight, Search, Ticket, Clock, Star, Check } from 'lucide-react'

// ── Shared destination config (same as HomeScreen) ────────────────────────
const DEST_CONFIG = {
    NRT: { emoji: '🗼', name: 'Tokyo',     img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
    TYO: { emoji: '🗼', name: 'Tokyo',     img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
    KIX: { emoji: '🏯', name: 'Osaka',     img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&q=80' },
    SIN: { emoji: '🦁', name: 'Singapore', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80' },
    BKK: { emoji: '🐘', name: 'Bangkok',   img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80' },
    DPS: { emoji: '🌴', name: 'Bali',      img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
    LHR: { emoji: '🎡', name: 'London',    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80' },
    CDG: { emoji: '🗽', name: 'Paris',     img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
    DXB: { emoji: '🏙️', name: 'Dubai',    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
    SYD: { emoji: '🦘', name: 'Sydney',    img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80' },
    JFK: { emoji: '🗽', name: 'New York',  img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
    HKG: { emoji: '🌆', name: 'Hong Kong', img: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&q=80' },
    ICN: { emoji: '🇰🇷', name: 'Seoul',   img: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80' },
    KUL: { emoji: '🌃', name: 'KL',        img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80' },
    default: { emoji: '✈️', name: 'Trip',  img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=80' },
}

const CITY_MAP = {
    'tokyo': 'NRT', 'japan': 'NRT', 'osaka': 'KIX',
    'singapore': 'SIN', 'bangkok': 'BKK', 'thailand': 'BKK',
    'bali': 'DPS', 'denpasar': 'DPS', 'london': 'LHR',
    'paris': 'CDG', 'dubai': 'DXB', 'sydney': 'SYD',
    'new york': 'JFK', 'hong kong': 'HKG', 'seoul': 'ICN',
    'kuala lumpur': 'KUL', 'kl': 'KUL',
}

const getConfig = (trip) => {
    const dest = (trip?.destination || trip?.city || trip?.flight?.destination || '').toLowerCase()
    const iata = dest.toUpperCase()
    if (DEST_CONFIG[iata]) return DEST_CONFIG[iata]
    for (const [city, code] of Object.entries(CITY_MAP)) {
        if (dest.includes(city)) return DEST_CONFIG[code]
    }
    return DEST_CONFIG['default']
}

const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'TBD') return 'TBD'
    try {
        return new Date(dateStr).toLocaleDateString('en-MY', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
    } catch { return dateStr }
}

const getDaysUntil = (dateStr) => {
    if (!dateStr || dateStr === 'TBD') return null
    try {
        const d = new Date(dateStr); d.setHours(0,0,0,0)
        const t = new Date(); t.setHours(0,0,0,0)
        return Math.round((d - t) / 86400000)
    } catch { return null }
}

const isUpcoming = (dateStr) => {
    const d = getDaysUntil(dateStr)
    return d === null || d >= 0
}

const MyTripsScreen = ({ trips, setActiveScreen, setTicketData }) => {
    const [activeTab, setActiveTab] = useState('upcoming')
    const [search, setSearch]       = useState('')

    const checkedInMap = useMemo(() => {
        try { return JSON.parse(localStorage.getItem('voyageai_checkedin') || '{}') } catch { return {} }
    }, [])

    const upcoming = trips.filter(t => isUpcoming(t.date))
    const past     = trips.filter(t => !isUpcoming(t.date))

    const displayed = (activeTab === 'upcoming' ? upcoming : past)
        .filter(t => {
            if (!search.trim()) return true
            const q = search.toLowerCase()
            return (
                t.destination?.toLowerCase().includes(q) ||
                t.title?.toLowerCase().includes(q) ||
                t.bookingRef?.toLowerCase().includes(q) ||
                t.hotel?.name?.toLowerCase().includes(q)
            )
        })
        .sort((a, b) => {
            if (activeTab === 'upcoming') return new Date(a.date || '9999') - new Date(b.date || '9999')
            return new Date(b.date || '0') - new Date(a.date || '0')
        })

    const viewTicket = (trip) => {
        if (setTicketData) setTicketData(trip)
        setActiveScreen('eticket')
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* ── Beautiful Header ── */}
            <div style={{ flexShrink: 0 }}>
                {/* Gradient image banner */}
                <div style={{
                    position: 'relative', height: '130px', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1e6fd9 0%, #4a9fe8 50%, #0ea5e9 100%)',
                }}>
                    {/* Decorative circles */}
                    <div style={{
                        position: 'absolute', top: '-30px', right: '-30px',
                        width: '160px', height: '160px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-40px', left: '30%',
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                    }} />
                    <div style={{
                        position: 'absolute', top: '10px', left: '-20px',
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                    }} />

                    {/* Text content */}
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
                            VoyageAI
                        </p>
                        <h1 style={{
                            color: '#ffffff', fontSize: '26px', fontWeight: '900',
                            margin: 0, lineHeight: 1.1,
                            textShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}>
                            My Trips
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', padding: '3px 10px',
                                color: '#ffffff', fontSize: '11px', fontWeight: '600',
                            }}>
                                {trips.length} booking{trips.length !== 1 ? 's' : ''}
                            </span>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', padding: '3px 10px',
                                color: '#ffffff', fontSize: '11px', fontWeight: '600',
                            }}>
                                {upcoming.length} upcoming
                            </span>
                        </div>
                    </div>

                    {/* Buttons top-right */}
                    <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => setActiveScreen('import')} style={{
                            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                            border: '1.5px solid rgba(255,255,255,0.35)',
                            borderRadius: '12px', padding: '8px 12px',
                            color: '#ffffff', fontSize: '12px', fontWeight: '700',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                        }}>
                            📥 Import
                        </button>
                        <button onClick={() => setActiveScreen('chat')} style={{
                            background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
                            border: '1.5px solid rgba(255,255,255,0.4)',
                            borderRadius: '12px', padding: '8px 14px',
                            color: '#ffffff', fontSize: '12px', fontWeight: '700',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                        }}>
                            + Book Trip
                        </button>
                    </div>
                </div>

                {/* Search + Tabs panel */}
                <div style={{
                    background: '#ffffff', borderBottom: '1px solid #e0ecff',
                    padding: '14px 16px',
                    boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    {/* Search */}
                    <div style={{
                        background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                        borderRadius: '12px', padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginBottom: '12px',
                    }}>
                        <Search size={16} color='#8aaac8' />
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder='Search destination or booking ref...'
                            style={{
                                flex: 1, background: 'transparent', border: 'none',
                                outline: 'none', fontSize: '13px', color: '#0a1628',
                                fontFamily: 'Inter, sans-serif',
                            }}
                        />
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[
                            { key: 'upcoming', label: 'Upcoming', count: upcoming.length, icon: '🗓️' },
                            { key: 'past',     label: 'Past',     count: past.length,     icon: '📁' },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                flex: 1,
                                background: activeTab === tab.key
                                    ? 'linear-gradient(135deg, #1e6fd9, #4a9fe8)'
                                    : '#f0f6ff',
                                border: activeTab === tab.key ? 'none' : '1.5px solid #c0d8f0',
                                borderRadius: '12px', padding: '10px 12px',
                                color: activeTab === tab.key ? '#ffffff' : '#5a7a9f',
                                fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                boxShadow: activeTab === tab.key ? '0 4px 12px #1e6fd930' : 'none',
                                transition: 'all 0.15s ease',
                            }}>
                                <span>{tab.icon}</span>
                                {tab.label}
                                <span style={{
                                    background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#e0ecff',
                                    color: activeTab === tab.key ? '#ffffff' : '#1e6fd9',
                                    borderRadius: '20px', padding: '1px 8px',
                                    fontSize: '11px', fontWeight: '800',
                                }}>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trip List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {displayed.length === 0 ? (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', padding: '60px 20px', textAlign: 'center',
                    }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '20px',
                            background: '#d0e8ff', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '32px', marginBottom: '16px',
                        }}>
                            {activeTab === 'upcoming' ? '✈️' : '🗺️'}
                        </div>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                            {search ? 'No results found' : activeTab === 'upcoming' ? 'No upcoming trips' : 'No past trips'}
                        </p>
                        <p style={{ color: '#8aaac8', fontSize: '13px', marginBottom: '20px' }}>
                            {search ? 'Try a different search term' : 'Book your next adventure with VoyageAI!'}
                        </p>
                        {!search && (
                            <button onClick={() => setActiveScreen('chat')} style={{
                                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                border: 'none', borderRadius: '12px', padding: '12px 24px',
                                color: '#ffffff', fontSize: '14px', fontWeight: '700',
                                cursor: 'pointer', boxShadow: '0 4px 12px #1e6fd930',
                            }}>
                                ✈️ Plan with AI
                            </button>
                        )}
                    </div>
                ) : (
                    displayed.map((trip, i) => (
                        <TripCard
                            key={trip.id || i}
                            trip={trip}
                            config={getConfig(trip)}
                            isCheckedIn={!!(trip.bookingRef && checkedInMap[trip.bookingRef])}
                            onViewTicket={() => viewTicket(trip)}
                            onCheckIn={() => { viewTicket(trip); setActiveScreen('checkin') }}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

// ── Trip Card with image header ───────────────────────────────────────────
const TripCard = ({ trip, config, onViewTicket, onCheckIn, isCheckedIn }) => {
    const isHotel  = trip.type === 'hotel'
    const flight   = trip.flight || {}
    const hotel    = trip.hotel  || {}
    const upcoming = isUpcoming(trip.date)
    const daysLeft = getDaysUntil(trip.date)

    const daysLabel = daysLeft === null ? null
        : daysLeft === 0  ? '🚨 TODAY'
            : daysLeft === 1  ? '⚡ Tomorrow'
                : daysLeft < 0    ? `${Math.abs(daysLeft)}d ago`
                    : `${daysLeft} days`

    const badgeColor = daysLeft === null ? '#1e6fd9'
        : daysLeft <= 0  ? '#dc2626'
            : daysLeft <= 3  ? '#dc2626'
                : daysLeft <= 7  ? '#ea580c'
                    : '#059669'

    const formatTime = (dateStr) => {
        if (!dateStr || dateStr === 'TBD') return 'TBD'
        try {
            return new Date(dateStr).toLocaleTimeString('en-MY', {
                hour: '2-digit', minute: '2-digit', hour12: true,
            })
        } catch { return dateStr }
    }

    return (
        <div style={{
            background: '#ffffff', borderRadius: '20px',
            marginBottom: '16px', overflow: 'hidden',
            boxShadow: '0 6px 24px #1e6fd918',
            border: '1px solid #e0ecff',
        }}>
            {/* ── Image Header ── */}
            <div style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
                <img
                    src={config.img}
                    alt={config.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => {
                        e.target.style.display = 'none'
                        e.target.parentNode.style.background = upcoming
                            ? 'linear-gradient(135deg, #1e6fd9, #4a9fe8)'
                            : 'linear-gradient(135deg, #64748b, #94a3b8)'
                    }}
                />
                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.1) 60%)',
                }} />

                {/* Destination name */}
                <div style={{ position: 'absolute', bottom: '10px', left: '14px' }}>
                    <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '900', lineHeight: 1 }}>
                        {config.emoji} {(trip.destination || config.name).toUpperCase()}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '3px' }}>
                        {isHotel ? hotel.name : `${flight.airline || ''} ${flight.flightNumber || ''}`}
                    </p>
                </div>

                {/* Status + Days badge */}
                <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px',
                }}>
                    <div style={{
                        background: upcoming ? 'rgba(5,150,105,0.9)' : 'rgba(100,116,139,0.9)',
                        borderRadius: '8px', padding: '3px 10px',
                        backdropFilter: 'blur(4px)',
                    }}>
                        <p style={{ color: '#ffffff', fontSize: '10px', fontWeight: '700' }}>
                            {upcoming ? '🟢 Upcoming' : '✅ Completed'}
                        </p>
                    </div>
                    {daysLabel && (
                        <div style={{
                            background: 'rgba(0,0,0,0.6)',
                            borderRadius: '8px', padding: '3px 10px',
                            backdropFilter: 'blur(4px)',
                            border: `1px solid ${badgeColor}60`,
                        }}>
                            <p style={{ color: badgeColor === '#059669' ? '#6ee7b7' : '#fca5a5', fontSize: '11px', fontWeight: '800' }}>
                                {daysLabel}
                            </p>
                        </div>
                    )}
                </div>

                {/* Type icon top-left */}
                <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px',
                }}>
                    {isHotel ? '🏨' : '✈️'}
                </div>
            </div>

            {/* ── Card Body ── */}
            <div style={{ padding: '14px 16px' }}>
                {/* Date + Ref */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                        flex: 1, background: '#f0f6ff', borderRadius: '10px', padding: '9px 12px',
                        display: 'flex', alignItems: 'center', gap: '7px',
                    }}>
                        <Calendar size={13} color='#1e6fd9' />
                        <div>
                            <p style={{ color: '#8aaac8', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase' }}>
                                {isHotel ? 'CHECK-IN' : 'DATE'}
                            </p>
                            <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700' }}>
                                {trip.dateDisplay || formatDate(trip.date) || 'TBD'}
                            </p>
                        </div>
                    </div>
                    <div style={{
                        flex: 1, background: '#f0f6ff', borderRadius: '10px', padding: '9px 12px',
                        display: 'flex', alignItems: 'center', gap: '7px',
                    }}>
                        <Ticket size={13} color='#1e6fd9' />
                        <div>
                            <p style={{ color: '#8aaac8', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase' }}>REF</p>
                            <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700', fontFamily: 'monospace' }}>
                                {trip.bookingRef || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Flight route OR Hotel address */}
                {isHotel ? (
                    <div style={{
                        background: '#f0f6ff', borderRadius: '10px', padding: '9px 12px',
                        marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        <MapPin size={13} color='#7c3aed' />
                        <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '600', flex: 1 }}>
                            {hotel.address || trip.city || 'Hotel'}
                        </p>
                        <p style={{ color: '#7c3aed', fontSize: '12px', fontWeight: '700' }}>
                            {hotel.price || ''}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        background: '#f0f6ff', borderRadius: '10px', padding: '9px 14px',
                        marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '800', fontFamily: 'monospace' }}>
                            {flight.origin || trip.origin || 'KUL'}
                        </p>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ flex: 1, height: '1px', background: '#c0d8f0' }} />
                            <Plane size={12} color='#1e6fd9' />
                            <div style={{ flex: 1, height: '1px', background: '#c0d8f0' }} />
                        </div>
                        <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '800', fontFamily: 'monospace' }}>
                            {flight.destination || trip.destination || 'NRT'}
                        </p>
                    </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={onViewTicket} style={{
                        flex: 1,
                        background: upcoming ? 'linear-gradient(135deg, #1e6fd9, #4a9fe8)' : '#f0f6ff',
                        border: upcoming ? 'none' : '1.5px solid #c0d8f0',
                        borderRadius: '10px', padding: '11px',
                        color: upcoming ? '#ffffff' : '#5a7a9f',
                        fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: upcoming ? '0 4px 12px #1e6fd930' : 'none',
                    }}>
                        <Ticket size={14} />
                        {isHotel ? 'Voucher' : 'E-Ticket'}
                        <ChevronRight size={14} />
                    </button>

                    {/* Check-in button — flights only, upcoming only */}
                    {!isHotel && upcoming && (
                        isCheckedIn ? (
                            <div style={{
                                flex: 1, background: '#f0fdf4',
                                border: '1.5px solid #059669',
                                borderRadius: '10px', padding: '11px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            }}>
                                <Check size={14} color='#059669' />
                                <span style={{ color: '#059669', fontSize: '13px', fontWeight: '700' }}>Checked In</span>
                            </div>
                        ) : (
                            <button onClick={onCheckIn} style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                                border: 'none', borderRadius: '10px', padding: '11px',
                                color: '#ffffff', fontSize: '13px', fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                boxShadow: '0 4px 12px #05966930',
                            }}>
                                ✅ Check-in
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyTripsScreen