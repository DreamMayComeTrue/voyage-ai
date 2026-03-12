import React from 'react'
import {
    MessageCircle, Upload, Map, Navigation,
    Plane, Hotel, ChevronRight, Sparkles
} from 'lucide-react'

const HomeScreen = ({ setActiveScreen, itineraries, trips }) => {
    const cards = [
        {
            id: 'chat',
            icon: MessageCircle,
            title: 'Chat with AI',
            desc: 'Plan your trip with VoyageAI',
            color: '#60a8f0',
            bg: 'linear-gradient(135deg, #1e3a6a 0%, #3a5a90 100%)',
            border: '#3a5a90',
            glow: '#60a8f0',
        },
        {
            id: 'mytrips',
            icon: Upload,
            title: 'Import Ticket',
            desc: 'Add your flight or hotel',
            color: '#90c8ff',
            bg: 'linear-gradient(135deg, #1e3c6e 0%, #3a5e95 100%)',
            border: '#3a5e95',
            glow: '#90c8ff',
        },
        {
            id: 'itinerary',
            icon: Map,
            title: 'My Itinerary',
            desc: 'View your saved plans',
            color: '#b0d8ff',
            bg: 'linear-gradient(135deg, #1c3868 0%, #385888 100%)',
            border: '#385888',
            glow: '#b0d8ff',
        },
        {
            id: 'map',
            icon: Navigation,
            title: 'AR Maps',
            desc: 'Navigate your trip',
            color: '#78b8f8',
            bg: 'linear-gradient(135deg, #1a3665 0%, #365685 100%)',
            border: '#365685',
            glow: '#78b8f8',
        },
    ]

    return (
        <div style={{
            minHeight: '100%',
            padding: '28px 20px 20px',
        }}>

            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                }}>
                    <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '11px',
                        background: 'linear-gradient(135deg, #3a5a90, #60a8f0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 16px #60a8f050',
                    }}>
                        <Sparkles size={17} color='#ffffff' />
                    </div>
                    <span style={{
                        color: '#b0d8ff',
                        fontSize: '13px',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                    }}>
            VOYAGEAI
          </span>
                </div>

                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: '#ffffff',
                    marginBottom: '6px',
                    lineHeight: '1.2',
                }}>
                    Where to next? ✈️
                </h1>
                <p style={{
                    color: '#8ab0d8',
                    fontSize: '14px',
                }}>
                    Your AI-powered travel companion
                </p>
            </div>

            {/* Feature Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '28px',
            }}>
                {cards.map(card => {
                    const Icon = card.icon
                    return (
                        <button
                            key={card.id}
                            onClick={() => setActiveScreen(card.id)}
                            style={{
                                background: card.bg,
                                border: `1px solid ${card.border}`,
                                borderRadius: '18px',
                                padding: '20px 16px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.25s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                boxShadow: '0 4px 20px #00000025',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-3px)'
                                e.currentTarget.style.boxShadow = `0 8px 32px ${card.glow}35`
                                e.currentTarget.style.borderColor = `${card.glow}90`
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0px)'
                                e.currentTarget.style.boxShadow = '0 4px 20px #00000025'
                                e.currentTarget.style.borderColor = card.border
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '13px',
                                background: `${card.color}25`,
                                border: `1px solid ${card.color}50`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 0 14px ${card.color}20`,
                            }}>
                                <Icon size={20} color={card.color} />
                            </div>
                            <div>
                                <p style={{
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '3px',
                                }}>
                                    {card.title}
                                </p>
                                <p style={{
                                    color: '#8ab0d8',
                                    fontSize: '11px',
                                    lineHeight: '1.4',
                                }}>
                                    {card.desc}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Quick Search */}
            <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                    color: '#b0d0f0',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                }}>
                    Quick Search
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {[
                        { icon: Plane, label: 'Search Flights', color: '#60a8f0' },
                        { icon: Hotel, label: 'Find Hotels',    color: '#90c8ff' },
                    ].map((item, i) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveScreen('chat')}
                                style={{
                                    flex: 1,
                                    background: '#1e3a6a',
                                    border: '1px solid #3a5a90',
                                    borderRadius: '14px',
                                    padding: '14px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#b0d0f0',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = item.color
                                    e.currentTarget.style.color = '#ffffff'
                                    e.currentTarget.style.background = `${item.color}18`
                                    e.currentTarget.style.boxShadow = `0 0 16px ${item.color}25`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#3a5a90'
                                    e.currentTarget.style.color = '#b0d0f0'
                                    e.currentTarget.style.background = '#1e3a6a'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <Icon size={16} color={item.color} />
                                {item.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Upcoming Trips */}
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                }}>
                    <h2 style={{
                        color: '#b0d0f0',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}>
                        Upcoming Trips
                    </h2>
                    {trips.length > 0 && (
                        <button
                            onClick={() => setActiveScreen('mytrips')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#60a8f0',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                fontWeight: '600',
                            }}
                        >
                            See all <ChevronRight size={13} />
                        </button>
                    )}
                </div>

                {trips.length === 0 ? (
                    <div style={{
                        background: '#1e3a6a',
                        border: '1px dashed #3a5a90',
                        borderRadius: '18px',
                        padding: '32px 24px',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: '#3a5a9040',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 14px',
                            boxShadow: '0 0 20px #60a8f010',
                        }}>
                            <Plane size={26} color='#4a7ab0' />
                        </div>
                        <p style={{
                            color: '#8ab0d8',
                            fontSize: '13px',
                            marginBottom: '16px',
                            lineHeight: '1.6',
                        }}>
                            No upcoming trips yet.
                            <br />Let AI plan your next adventure!
                        </p>
                        <button
                            onClick={() => setActiveScreen('chat')}
                            style={{
                                background: 'linear-gradient(135deg, #3a5a90, #60a8f0)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '11px 24px',
                                color: '#ffffff',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 0 24px #60a8f035',
                                transition: 'all 0.2s ease',
                                letterSpacing: '0.02em',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 0 32px #60a8f055'
                                e.currentTarget.style.transform = 'translateY(-1px)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = '0 0 24px #60a8f035'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            ✨ Plan with AI
                        </button>
                    </div>
                ) : (
                    trips.slice(0, 2).map((trip, index) => (
                        <div
                            key={index}
                            style={{
                                background: '#1e3a6a',
                                border: '1px solid #3a5a90',
                                borderRadius: '14px',
                                padding: '14px 16px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#60a8f0'
                                e.currentTarget.style.boxShadow = '0 0 16px #60a8f020'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#3a5a90'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #3a5a90, #60a8f0)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 14px #60a8f035',
                                flexShrink: 0,
                            }}>
                                <Plane size={18} color='#ffffff' />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '2px',
                                }}>
                                    {trip.destination || 'Trip'}
                                </p>
                                <p style={{ color: '#8ab0d8', fontSize: '12px' }}>
                                    {trip.date || 'Date TBD'}
                                </p>
                            </div>
                            <ChevronRight size={16} color='#4a7ab0' />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default HomeScreen