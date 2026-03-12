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
            background: '#060d1f',
            borderTop: '1px solid #1e3a5f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 1000,
            paddingBottom: '4px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 -4px 24px #00000040',
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
                            background: isActive ? '#3b82f610' : 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px 16px',
                            borderRadius: '14px',
                            transition: 'all 0.2s ease',
                            color: isActive ? '#3b82f6' : '#64748b',
                            position: 'relative',
                        }}
                    >
                        {isActive && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '24px',
                                height: '2px',
                                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                borderRadius: '0 0 4px 4px',
                                boxShadow: '0 0 8px #3b82f6',
                            }} />
                        )}
                        <Icon
                            size={21}
                            strokeWidth={isActive ? 2.5 : 1.8}
                            color={isActive ? '#3b82f6' : '#64748b'}
                        />
                        <span style={{
                            fontSize: '10px',
                            fontWeight: isActive ? '600' : '400',
                            color: isActive ? '#60a5fa' : '#64748b',
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