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
            bg: '#1e3a5f',
        },
        {
            id: 'mytrips',
            icon: Upload,
            title: 'Import Ticket',
            desc: 'Add your flight or hotel',
            color: '#8b5cf6',
            bg: '#2d1b5e',
        },
        {
            id: 'itinerary',
            icon: Map,
            title: 'My Itinerary',
            desc: 'View your saved plans',
            color: '#10b981',
            bg: '#0d3b2e',
        },
        {
            id: 'map',
            icon: Navigation,
            title: 'AR Maps',
            desc: 'Navigate your trip',
            color: '#f59e0b',
            bg: '#3b2a0a',
        },
    ]

    return (
        <div style={{
            minHeight: '100%',
            background: 'linear-gradient(180deg, #0d1117 0%, #0a0a0f 100%)',
            padding: '24px 20px',
        }}>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Sparkles size={20} color='#3b82f6' />
                    <span style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '600' }}>
            VoyageAI
          </span>
                </div>
                <h1 style={{
                    fontSize: '26px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '4px'
                }}>
                    Where to next? ✈️
                </h1>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Your AI travel companion
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
                                border: `1px solid ${card.color}30`,
                                borderRadius: '16px',
                                padding: '20px 16px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.border = `1px solid ${card.color}80`
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0px)'
                                e.currentTarget.style.border = `1px solid ${card.color}30`
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: `${card.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Icon size={20} color={card.color} />
                            </div>
                            <div>
                                <p style={{
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '2px'
                                }}>
                                    {card.title}
                                </p>
                                <p style={{ color: '#9ca3af', fontSize: '11px' }}>
                                    {card.desc}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px'
                }}>
                    Quick Search
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setActiveScreen('chat')}
                        style={{
                            flex: 1,
                            background: '#1a1a2e',
                            border: '1px solid #2a2a3e',
                            borderRadius: '12px',
                            padding: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#9ca3af',
                            fontSize: '13px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a3e'}
                    >
                        <Plane size={16} color='#3b82f6' />
                        Search Flights
                    </button>
                    <button
                        onClick={() => setActiveScreen('chat')}
                        style={{
                            flex: 1,
                            background: '#1a1a2e',
                            border: '1px solid #2a2a3e',
                            borderRadius: '12px',
                            padding: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#9ca3af',
                            fontSize: '13px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#8b5cf6'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a3e'}
                    >
                        <Hotel size={16} color='#8b5cf6' />
                        Find Hotels
                    </button>
                </div>
            </div>

            {/* Upcoming Trips */}
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                }}>
                    <h2 style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '600'
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
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px'
                            }}
                        >
                            See all <ChevronRight size={14} />
                        </button>
                    )}
                </div>

                {trips.length === 0 ? (
                    <div style={{
                        background: '#1a1a2e',
                        border: '1px dashed #2a2a3e',
                        borderRadius: '16px',
                        padding: '28px',
                        textAlign: 'center',
                    }}>
                        <Plane size={32} color='#374151' style={{ margin: '0 auto 10px' }} />
                        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
                            No upcoming trips yet
                        </p>
                        <button
                            onClick={() => setActiveScreen('chat')}
                            style={{
                                background: '#3b82f620',
                                border: '1px solid #3b82f640',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                color: '#3b82f6',
                                fontSize: '12px',
                                cursor: 'pointer',
                            }}
                        >
                            Plan a trip with AI
                        </button>
                    </div>
                ) : (
                    trips.slice(0, 2).map((trip, index) => (
                        <div
                            key={index}
                            style={{
                                background: '#1a1a2e',
                                border: '1px solid #2a2a3e',
                                borderRadius: '12px',
                                padding: '14px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: '#1e3a5f',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Plane size={18} color='#3b82f6' />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    {trip.destination || 'Trip'}
                                </p>
                                <p style={{ color: '#6b7280', fontSize: '12px' }}>
                                    {trip.date || 'Date TBD'}
                                </p>
                            </div>
                            <ChevronRight size={16} color='#6b7280' />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default HomeScreen