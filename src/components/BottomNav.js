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
            background: '#0a0a0f',
            borderTop: '1px solid #2a2a3e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 1000,
            paddingBottom: '4px'
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
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            color: isActive ? '#3b82f6' : '#6b7280',
                        }}
                    >
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                        <span style={{
                            fontSize: '10px',
                            fontWeight: isActive ? '600' : '400',
                            color: isActive ? '#3b82f6' : '#6b7280',
                        }}>
              {tab.label}
            </span>
                        {isActive && (
                            <div style={{
                                position: 'absolute',
                                bottom: '0px',
                                width: '20px',
                                height: '2px',
                                background: '#3b82f6',
                                borderRadius: '2px',
                            }} />
                        )}
                    </button>
                )
            })}
        </div>
    )
}

export default BottomNav