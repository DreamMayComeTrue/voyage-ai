import React from 'react'
import VoyageLogo from '../components/VoyageLogo'
import {
    MessageCircle, Upload, Map, Globe,
    Plane, Hotel, ChevronRight,
    Search, BookOpen, User, Navigation
} from 'lucide-react'

const HomeScreen = ({ setActiveScreen, itineraries, trips }) => {
    const cards = [
        {
            id: 'chat',
            icon: MessageCircle,
            title: 'AI Agent',
            desc: 'Plan your trip with AI',
            color: '#1e6fd9',
            bg: '#ffffff',
            border: '#c0d8f0',
            iconBg: '#d0e8ff',
        },
        {
            id: 'explore',
            icon: Search,
            title: 'Explore',
            desc: 'Trending destinations',
            color: '#0ea5e9',
            bg: '#ffffff',
            border: '#c0d8f0',
            iconBg: '#e0f4ff',
        },
        {
            id: 'itinerary',
            icon: Map,
            title: 'Itinerary',
            desc: 'View your saved plans',
            color: '#7c3aed',
            bg: '#ffffff',
            border: '#c0d8f0',
            iconBg: '#ede9fe',
        },
        {
            id: 'translate',
            icon: Globe,
            title: 'Translate',
            desc: 'Speak any language',
            color: '#059669',
            bg: '#ffffff',
            border: '#c0d8f0',
            iconBg: '#d1fae5',
        },
        {
            id: 'mytrips',
            icon: Plane,
            title: 'My Trips',
            desc: 'Your bookings & tickets',
            color: '#d97706',
            bg: '#ffffff',
            border: '#c0d8f0',
            iconBg: '#fef3c7',
        },
        {
            id: 'guide',
            icon: BookOpen,
            title: 'Guide',
            desc: 'How to use VoyageAI',
            color: '#db2777',
            bg: '#ffffff',
            border: '#c0d8f0',
            iconBg: '#fce7f3',
        },
    ]

    return (
        <div style={{
            minHeight: '100%',
            padding: '28px 20px 20px',
            background: '#f0f6ff',
        }}>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <VoyageLogo size="md" />
                        <p style={{
                            color: '#0a1628',
                            fontSize: '18px',
                            fontWeight: '800',
                            lineHeight: '1.2',
                            marginTop: '4px',
                        }}>
                            Where to next? ✈️
                        </p>
                    </div>
                    <button
                        onClick={() => setActiveScreen('me')}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            border: '2px solid #c0d8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px #1e6fd915',
                        }}
                    >
                        <User size={18} color='#1e6fd9' />
                    </button>
                </div>

                {/* Search Bar */}
                <div
                    onClick={() => setActiveScreen('explore')}
                    style={{
                        background: '#ffffff',
                        border: '1.5px solid #c0d8f0',
                        borderRadius: '14px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 12px #1e6fd910',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#1e6fd9'
                        e.currentTarget.style.boxShadow = '0 4px 16px #1e6fd920'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#c0d8f0'
                        e.currentTarget.style.boxShadow = '0 2px 12px #1e6fd910'
                    }}
                >
                    <Search size={16} color='#8aaac8' />
                    <span style={{ color: '#8aaac8', fontSize: '14px' }}>
            Search destinations, hotels, flights...
          </span>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {[
                        { icon: Plane,  label: 'Flights', color: '#1e6fd9', bg: '#d0e8ff' },
                        { icon: Hotel,  label: 'Hotels',  color: '#7c3aed', bg: '#ede9fe' },
                        { icon: Navigation, label: 'AR Maps', color: '#059669', bg: '#d1fae5' },
                        { icon: Globe,  label: 'Translate', color: '#d97706', bg: '#fef3c7' },
                    ].map((item, i) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveScreen(i === 0 || i === 1 ? 'chat' : i === 2 ? 'itinerary' : 'translate')}
                                style={{
                                    flex: 1,
                                    background: '#ffffff',
                                    border: '1.5px solid #c0d8f0',
                                    borderRadius: '14px',
                                    padding: '12px 6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 8px #1e6fd910',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = item.color
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = `0 6px 16px ${item.color}20`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#c0d8f0'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 2px 8px #1e6fd910'
                                }}
                            >
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: item.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Icon size={18} color={item.color} />
                                </div>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#0a1628',
                                }}>
                  {item.label}
                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Feature Cards Grid */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                    color: '#0a1628',
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '14px',
                }}>
                    Features
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                }}>
                    {cards.map(card => {
                        const Icon = card.icon
                        return (
                            <button
                                key={card.id}
                                onClick={() => setActiveScreen(card.id)}
                                style={{
                                    background: '#ffffff',
                                    border: '1.5px solid #c0d8f0',
                                    borderRadius: '16px',
                                    padding: '16px 10px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 2px 8px #1e6fd910',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.borderColor = card.color
                                    e.currentTarget.style.boxShadow = `0 6px 20px ${card.color}20`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.borderColor = '#c0d8f0'
                                    e.currentTarget.style.boxShadow = '0 2px 8px #1e6fd910'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: card.iconBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Icon size={20} color={card.color} />
                                </div>
                                <p style={{
                                    color: '#0a1628',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    lineHeight: '1.3',
                                }}>
                                    {card.title}
                                </p>
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
                        color: '#0a1628',
                        fontSize: '16px',
                        fontWeight: '700',
                    }}>
                        Upcoming Trips
                    </h2>
                    {trips.length > 0 && (
                        <button
                            onClick={() => setActiveScreen('mytrips')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#1e6fd9',
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
                        background: '#ffffff',
                        border: '1.5px dashed #c0d8f0',
                        borderRadius: '18px',
                        padding: '28px 24px',
                        textAlign: 'center',
                        boxShadow: '0 2px 12px #1e6fd910',
                    }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '16px',
                            background: '#d0e8ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px',
                        }}>
                            <Plane size={24} color='#1e6fd9' />
                        </div>
                        <p style={{
                            color: '#5a7a9f',
                            fontSize: '13px',
                            marginBottom: '14px',
                            lineHeight: '1.6',
                        }}>
                            No upcoming trips yet.
                            <br />Let AI plan your next adventure!
                        </p>
                        <button
                            onClick={() => setActiveScreen('chat')}
                            style={{
                                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '10px 24px',
                                color: '#ffffff',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px #1e6fd930',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-1px)'
                                e.currentTarget.style.boxShadow = '0 6px 20px #1e6fd940'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 16px #1e6fd930'
                            }}
                        >
                            ✨ Plan with AI
                        </button>
                    </div>
                ) : (
                    trips.slice(0, 2).map((trip, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveScreen('mytrips')}
                            style={{
                                background: '#ffffff',
                                border: '1.5px solid #c0d8f0',
                                borderRadius: '14px',
                                padding: '14px 16px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px #1e6fd910',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#1e6fd9'
                                e.currentTarget.style.boxShadow = '0 4px 16px #1e6fd920'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#c0d8f0'
                                e.currentTarget.style.boxShadow = '0 2px 8px #1e6fd910'
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px #1e6fd930',
                                flexShrink: 0,
                            }}>
                                <Plane size={18} color='#ffffff' />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    color: '#0a1628',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '2px',
                                }}>
                                    {trip.destination || 'Trip'}
                                </p>
                                <p style={{ color: '#5a7a9f', fontSize: '12px' }}>
                                    {trip.date || 'Date TBD'}
                                </p>
                            </div>
                            <ChevronRight size={16} color='#8aaac8' />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default HomeScreen