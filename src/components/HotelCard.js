import React, { useState } from 'react'
import { Star, Wifi, ExternalLink } from 'lucide-react'

const HotelCard = ({ hotel, onBook }) => {
    const [showOptions, setShowOptions] = useState(false)

    return (
        <div style={{
            marginLeft: '36px',
            background: '#ffffff',
            border: '1.5px solid #e0ecff',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '10px',
            boxShadow: '0 2px 12px #1e6fd910',
        }}>

            {/* Hotel Name + Stars */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '8px',
            }}>
                <div>
                    <p style={{
                        color: '#0a1628',
                        fontSize: '14px',
                        fontWeight: '700',
                        marginBottom: '3px',
                    }}>
                        {hotel.name}
                    </p>
                    <p style={{ color: '#8aaac8', fontSize: '11px' }}>
                        📍 {hotel.address}
                    </p>
                </div>
                <div style={{
                    background: '#fef3c7',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                }}>
                    <Star size={11} color='#d97706' fill='#d97706' />
                    <span style={{
                        color: '#d97706',
                        fontSize: '12px',
                        fontWeight: '700',
                    }}>
            {hotel.rating}
          </span>
                </div>
            </div>

            {/* Stars row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                marginBottom: '10px',
            }}>
                {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star key={i} size={12} color='#d97706' fill='#d97706' />
                ))}
            </div>

            {/* Amenities */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '12px',
            }}>
                {hotel.amenities.map((a, i) => (
                    <span key={i} style={{
                        background: '#f0f6ff',
                        border: '1px solid #c0d8f0',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        color: '#5a7a9f',
                        fontSize: '11px',
                        fontWeight: '500',
                    }}>
            {a}
          </span>
                ))}
            </div>

            {/* Price + Book */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: showOptions ? '10px' : '0',
            }}>
                <div>
                    <p style={{
                        color: '#1e6fd9',
                        fontSize: '16px',
                        fontWeight: '800',
                    }}>
                        {hotel.price}
                    </p>
                    <p style={{ color: '#8aaac8', fontSize: '10px' }}>per night</p>
                </div>
                {!showOptions && (
                    <button
                        onClick={() => setShowOptions(true)}
                        style={{
                            background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 16px',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px #1e6fd930',
                        }}
                    >
                        Select
                    </button>
                )}
            </div>

            {showOptions && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={onBook}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                        }}
                    >
                        🏨 Book with VoyageAI
                    </button>
                    <button
                        onClick={() => window.open('https://www.agoda.com', '_blank')}
                        style={{
                            flex: 1,
                            background: '#f0f6ff',
                            border: '1.5px solid #c0d8f0',
                            borderRadius: '10px',
                            padding: '10px',
                            color: '#1e6fd9',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                        }}
                    >
                        <ExternalLink size={12} />
                        Check Agoda
                    </button>
                </div>
            )}
        </div>
    )
}

export default HotelCard