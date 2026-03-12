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
            color: '#3b82f6',
            bg: 'linear-gradient(135deg, #0d1f3c 0%, #1e3a5f 100%)',
            border: '#1e3a5f',
            glow: '#3b82f6',
        },
        {
            id: 'mytrips',
            icon: Upload,
            title: 'Import Ticket',
            desc: 'Add your flight or hotel',
            color: '#818cf8',
            bg: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 100%)',
            border: '#2d1b69',
            glow: '#818cf8',
        },
        {
            id: 'itinerary',
            icon: Map,
            title: 'My Itinerary',
            desc: 'View your saved plans',
            color: '#34d399',
            bg: 'linear-gradient(135deg, #0a2a1f 0%, #064e3b 100%)',
            border: '#065f46',
            glow: '#34d399',
        },
        {
            id: 'map',
            icon: Navigation,
            title: 'AR Maps',
            desc: 'Navigate your trip',
            color: '#fbbf24',
            bg: 'linear-gradient(135deg, #1f1500 0%, #3d2a00 100%)',
            border: '#4d3200',
            glow: '#fbbf24',
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
                    marginBottom: '10px'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 12px #3b82f640',
                    }}>
                        <Sparkles size={16} color='#ffffff' />
                    </div>
                    <span style={{
                        color: '#60a5fa',
                        fontSize: '13px',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
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
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '400',
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
                                boxShadow: '0 4px 24px #00000030',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-3px)'
                                e.currentTarget.style.boxShadow = `0 8px 32px ${card.glow}25`
                                e.currentTarget.style.borderColor = `${card.glow}60`
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0px)'
                                e.currentTarget.style.boxShadow = '0 4px 24px #00000030'
                                e.currentTarget.style.borderColor = card.border
                            }}
                        >
                            <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '13px',
                                background: `${card.color}18`,
                                border: `1px solid ${card.color}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 0 12px ${card.color}15`,
                            }}>
                                <Icon size={20} color={card.color} />
                            </div>
                            <div>
                                <p style={{
                                    color: '#f1f5f9',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '3px',
                                }}>
                                    {card.title}
                                </p>
                                <p style={{
                                    color: '#64748b',
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
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                }}>
                    Quick Search
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {[
                        { icon: Plane,  label: 'Search Flights', color: '#3b82f6' },
                        { icon: Hotel,  label: 'Find Hotels',    color: '#818cf8' },
                    ].map((item, i) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveScreen('chat')}
                                style={{
                                    flex: 1,
                                    background: '#0d1f3c',
                                    border: '1px solid #1e3a5f',
                                    borderRadius: '14px',
                                    padding: '14px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#94a3b8',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = item.color
                                    e.currentTarget.style.color = '#ffffff'
                                    e.currentTarget.style.background = `${item.color}10`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#1e3a5f'
                                    e.currentTarget.style.color = '#94a3b8'
                                    e.currentTarget.style.background = '#0d1f3c'
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
                        color: '#94a3b8',
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.08em',
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
                                color: '#3b82f6',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                fontWeight: '500',
                            }}
                        >
                            See all <ChevronRight size={13} />
                        </button>
                    )}
                </div>

                {trips.length === 0 ? (
                    <div style={{
                        background: '#0d1f3c',
                        border: '1px dashed #1e3a5f',
                        borderRadius: '18px',
                        padding: '32px 24px',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '16px',
                            background: '#1e3a5f30',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 14px',
                        }}>
                            <Plane size={24} color='#1e3a5f' />
                        </div>
                        <p style={{
                            color: '#64748b',
                            fontSize: '13px',
                            marginBottom: '14px',
                            lineHeight: '1.5',
                        }}>
                            No upcoming trips yet.{' '}
                            <br />Let AI plan your next adventure!
                        </p>
                        <button
                            onClick={() => setActiveScreen('chat')}
                            style={{
                                background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                color: '#ffffff',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 0 20px #3b82f630',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 28px #3b82f650'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px #3b82f630'}
                        >
                            ✨ Plan with AI
                        </button>
                    </div>
                ) : (
                    trips.slice(0, 2).map((trip, index) => (
                        <div
                            key={index}
                            style={{
                                background: '#0d1f3c',
                                border: '1px solid #1e3a5f',
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
                                e.currentTarget.style.borderColor = '#3b82f6'
                                e.currentTarget.style.boxShadow = '0 0 16px #3b82f620'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#1e3a5f'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 12px #3b82f630',
                                flexShrink: 0,
                            }}>
                                <Plane size={18} color='#ffffff' />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    color: '#f1f5f9',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '2px',
                                }}>
                                    {trip.destination || 'Trip'}
                                </p>
                                <p style={{ color: '#64748b', fontSize: '12px' }}>
                                    {trip.date || 'Date TBD'}
                                </p>
                            </div>
                            <ChevronRight size={16} color='#1e3a5f' />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default HomeScreen