import React from 'react'
import { Home, MessageCircle, Map, Navigation, Briefcase } from 'lucide-react'

const BottomNav = ({ activeScreen, setActiveScreen }) => {
    const tabs = [
        { id: 'home',      icon: Home,          label: 'Home'      },
        { id: 'chat',      icon: MessageCircle, label: 'AI Agent'  },
        { id: 'itinerary', icon: Map,           label: 'Itinerary' },
        { id: 'map',       icon: Navigation,    label: 'AR Maps'   },
        { id: 'mytrips',   icon: Briefcase,     label: 'My Trips'  },
    ]

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70px',
            background: '#1a2f5a',
            borderTop: '1px solid #3a5a90',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 1000,
            paddingBottom: '4px',
            boxShadow: '0 -4px 24px #00000035',
        }}>
            {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeScreen === tab.id
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveScreen(tab.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '3px',
                            background: isActive ? '#60a8f018' : 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px 16px',
                            borderRadius: '14px',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                        }}
                    >
                        {isActive && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '28px',
                                height: '2px',
                                background: 'linear-gradient(90deg, #60a8f0, #b0d8ff)',
                                borderRadius: '0 0 4px 4px',
                                boxShadow: '0 0 10px #60a8f0',
                            }} />
                        )}
                        <Icon
                            size={21}
                            strokeWidth={isActive ? 2.5 : 1.8}
                            color={isActive ? '#60a8f0' : '#8ab0d8'}
                        />
                        <span style={{
                            fontSize: '10px',
                            fontWeight: isActive ? '700' : '400',
                            color: isActive ? '#b0d8ff' : '#8ab0d8',
                        }}>
              {tab.label}
            </span>
                    </button>
                )
            })}
        </div>
    )
}

export default BottomNav