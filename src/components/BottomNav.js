import React from 'react'
import { Home, Search, Briefcase, Globe, User } from 'lucide-react'

const BottomNav = ({ activeScreen, setActiveScreen }) => {
    const tabs = [
        { id: 'home',      icon: Home,      label: 'Home'      },
        { id: 'explore',   icon: Search,    label: 'Explore'   },
        { id: 'mytrips',   icon: Briefcase, label: 'My Trips'  },
        { id: 'translate', icon: Globe,     label: 'Translate' },
        { id: 'me',        icon: User,      label: 'Me'        },
    ]

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70px',
            background: '#ffffff',
            borderTop: '1px solid #c0d8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 1000,
            paddingBottom: '4px',
            boxShadow: '0 -4px 20px #1e6fd910',
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
                            background: isActive ? '#1e6fd910' : 'none',
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
                                background: 'linear-gradient(90deg, #1e6fd9, #4a9fe8)',
                                borderRadius: '0 0 4px 4px',
                                boxShadow: '0 0 8px #1e6fd9',
                            }} />
                        )}
                        <Icon
                            size={21}
                            strokeWidth={isActive ? 2.5 : 1.8}
                            color={isActive ? '#1e6fd9' : '#8aaac8'}
                        />
                        <span style={{
                            fontSize: '10px',
                            fontWeight: isActive ? '700' : '400',
                            color: isActive ? '#1e6fd9' : '#8aaac8',
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