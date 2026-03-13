import React, { useState } from 'react'
import { MessageCircle, X, Plane, Globe, Map, AlertCircle } from 'lucide-react'

const FloatingAIButton = ({ setActiveScreen, setChatPrompt }) => {
    const [isOpen, setIsOpen] = useState(false)

    const suggestions = [
        {
            icon: Plane,
            text: 'Find me flights',
            color: '#1e6fd9',
            bg: '#d0e8ff',
            prompt: 'Find me flights'
        },
        {
            icon: Map,
            text: 'Plan my itinerary',
            color: '#7c3aed',
            bg: '#ede9fe',
            prompt: 'Plan my itinerary'
        },
        {
            icon: Globe,
            text: 'Translate this menu',
            color: '#059669',
            bg: '#d1fae5',
            prompt: 'Translate this menu'
        },
        {
            icon: AlertCircle,
            text: 'I lost my passport',
            color: '#dc2626',
            bg: '#fee2e2',
            prompt: 'I lost my passport, what should I do?'
        },
    ]

    const handleSuggestion = (prompt) => {
        setChatPrompt(prompt)
        setActiveScreen('chat')
        setIsOpen(false)
    }

    const handleOpenChat = () => {
        setChatPrompt('')
        setActiveScreen('chat')
        setIsOpen(false)
    }

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.3)',
                        zIndex: 1998,
                        backdropFilter: 'blur(2px)',
                    }}
                />
            )}

            {/* Popup Card */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '20px',
                    width: '260px',
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '20px',
                    zIndex: 1999,
                    boxShadow: '0 8px 40px rgba(30,111,217,0.2)',
                    border: '1px solid #e0ecff',
                    animation: 'slideUp 0.25s ease',
                }}>

                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                    }}>
                        <div>
                            <p style={{
                                color: '#0a1628',
                                fontSize: '16px',
                                fontWeight: '800',
                                marginBottom: '2px',
                            }}>
                                AI Travel Assistant
                            </p>
                            <p style={{
                                color: '#8aaac8',
                                fontSize: '11px',
                            }}>
                                What can I help you with?
                            </p>
                        </div>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#d0e8ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <MessageCircle size={16} color='#1e6fd9' />
                        </div>
                    </div>

                    {/* Suggestion Pills */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginBottom: '14px',
                    }}>
                        {suggestions.map((s, i) => {
                            const Icon = s.icon
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestion(s.prompt)}
                                    style={{
                                        background: s.bg,
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '10px 14px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        textAlign: 'left',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateX(4px)'
                                        e.currentTarget.style.boxShadow = `0 4px 12px ${s.color}25`
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateX(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        background: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Icon size={15} color={s.color} />
                                    </div>
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: '#0a1628',
                                    }}>
                    {s.text}
                  </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Open Full Chat */}
                    <button
                        onClick={handleOpenChat}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
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
                        <MessageCircle size={15} />
                        Open Full Chat
                    </button>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '88px',
                    right: '20px',
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: isOpen
                        ? '#ffffff'
                        : 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    border: isOpen ? '2px solid #c0d8f0' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2000,
                    boxShadow: isOpen
                        ? '0 4px 16px rgba(0,0,0,0.1)'
                        : '0 4px 20px #1e6fd945',
                    transition: 'all 0.25s ease',
                    transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)',
                }}
                onMouseEnter={e => {
                    if (!isOpen) e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                }}
            >
                {isOpen
                    ? <X size={20} color='#1e6fd9' />
                    : <MessageCircle size={22} color='#ffffff' />
                }
            </button>

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
        </>
    )
}

export default FloatingAIButton