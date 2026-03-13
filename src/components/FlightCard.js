import React, { useState } from 'react'
import { Plane, Clock, ExternalLink } from 'lucide-react'

const FlightCard = ({ flight, onBook }) => {
    const [showOptions, setShowOptions] = useState(false)

    const formatTime = (dateStr) => {
        if (!dateStr || dateStr === 'TBD') return 'TBD'
        try {
            return new Date(dateStr).toLocaleTimeString('en-MY', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
        } catch { return dateStr }
    }

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === 'TBD') return ''
        try {
            return new Date(dateStr).toLocaleDateString('en-MY', {
                day: 'numeric',
                month: 'short',
            })
        } catch { return '' }
    }

    return (
        <div style={{
            marginLeft: '36px',
            background: '#ffffff',
            border: '1.5px solid #e0ecff',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '10px',
            boxShadow: '0 2px 12px #1e6fd910',
            transition: 'all 0.2s ease',
        }}>

            {/* Airline + Flight Number */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#d0e8ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Plane size={16} color='#1e6fd9' />
                    </div>
                    <div>
                        <p style={{
                            color: '#0a1628',
                            fontSize: '13px',
                            fontWeight: '700',
                        }}>
                            {flight.airline}
                        </p>
                        <p style={{ color: '#8aaac8', fontSize: '11px' }}>
                            {flight.flightNumber}
                        </p>
                    </div>
                </div>
                {flight.price && (
                    <div style={{
                        background: '#d0e8ff',
                        borderRadius: '8px',
                        padding: '4px 10px',
                    }}>
                        <p style={{
                            color: '#1e6fd9',
                            fontSize: '13px',
                            fontWeight: '700',
                        }}>
                            {flight.price}
                        </p>
                    </div>
                )}
            </div>

            {/* Route + Times */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
            }}>
                <div style={{ textAlign: 'center', minWidth: '50px' }}>
                    <p style={{
                        color: '#0a1628',
                        fontSize: '18px',
                        fontWeight: '800',
                        lineHeight: '1',
                    }}>
                        {formatTime(flight.departureTime)}
                    </p>
                    <p style={{ color: '#8aaac8', fontSize: '11px' }}>
                        {flight.origin}
                    </p>
                </div>

                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}>
                        <div style={{ flex: 1, height: '1px', background: '#c0d8f0' }} />
                        <Plane size={12} color='#1e6fd9' />
                        <div style={{ flex: 1, height: '1px', background: '#c0d8f0' }} />
                    </div>
                    <p style={{
                        color: '#8aaac8',
                        fontSize: '10px',
                        marginTop: '2px',
                    }}>
                        {formatDate(flight.departureTime)}
                    </p>
                </div>

                <div style={{ textAlign: 'center', minWidth: '50px' }}>
                    <p style={{
                        color: '#0a1628',
                        fontSize: '18px',
                        fontWeight: '800',
                        lineHeight: '1',
                    }}>
                        {formatTime(flight.arrivalTime)}
                    </p>
                    <p style={{ color: '#8aaac8', fontSize: '11px' }}>
                        {flight.destination}
                    </p>
                </div>
            </div>

            {/* Terminal + Gate */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '12px',
            }}>
                {[
                    { label: 'Terminal', value: flight.terminal },
                    { label: 'Gate', value: flight.gate },
                    { label: 'Status', value: flight.status },
                ].map((item, i) => (
                    <div key={i} style={{
                        flex: 1,
                        background: '#f0f6ff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        textAlign: 'center',
                    }}>
                        <p style={{ color: '#8aaac8', fontSize: '10px' }}>{item.label}</p>
                        <p style={{
                            color: '#0a1628',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                        }}>
                            {item.value || 'TBD'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Book Buttons */}
            {!showOptions ? (
                <button
                    onClick={() => setShowOptions(true)}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px #1e6fd930',
                    }}
                >
                    Select This Flight
                </button>
            ) : (
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
                        ✈️ Book with VoyageAI
                    </button>
                    <button
                        onClick={() => window.open('https://www.airasia.com', '_blank')}
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
                        Check Airline
                    </button>
                </div>
            )}
        </div>
    )
}

export default FlightCard