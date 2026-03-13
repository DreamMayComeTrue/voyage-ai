import React, { useRef } from 'react'
import { ArrowLeft, Plane, Download, Share2, Home, CheckCircle } from 'lucide-react'

const ETicketScreen = ({ setActiveScreen, ticketData }) => {
    const ticketRef = useRef(null)

    const formatTime = (dateStr) => {
        if (!dateStr || dateStr === 'TBD') return 'TBD'
        try {
            return new Date(dateStr).toLocaleTimeString('en-MY', {
                hour: '2-digit', minute: '2-digit', hour12: true,
            })
        } catch { return dateStr }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        try {
            return new Date(dateStr).toLocaleDateString('en-MY', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
            })
        } catch { return dateStr }
    }

    const flight  = ticketData?.flight || {}
    const ref     = ticketData?.bookingRef || 'VA000000'
    const name    = ticketData?.passengerName || 'Passenger'
    const passport= ticketData?.passportNumber || 'N/A'
    const email   = ticketData?.passengerEmail || ''
    const price   = ticketData?.price || flight.price || 'MYR 580'
    const date    = ticketData?.date  || ''
    const paidAt  = ticketData?.paidAt ? formatDate(ticketData.paidAt) : formatDate(new Date().toISOString())

    // Generate a simple barcode-like pattern from booking ref
    const barcodeData = ref.split('').map(c => c.charCodeAt(0))

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* Header */}
            <div style={{
                background: '#ffffff', borderBottom: '1px solid #e0ecff',
                padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: '0 2px 12px #1e6fd910', flexShrink: 0,
            }}>
                <button onClick={() => setActiveScreen('mytrips')} style={{
                    background: '#f0f6ff', border: '1px solid #c0d8f0',
                    borderRadius: '10px', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                    <ArrowLeft size={18} color='#1e6fd9' />
                </button>
                <div style={{ flex: 1 }}>
                    <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700' }}>
                        E-Ticket
                    </p>
                    <p style={{ color: '#059669', fontSize: '11px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={10} /> Booking Confirmed
                    </p>
                </div>
                <button onClick={() => setActiveScreen('home')} style={{
                    background: '#f0f6ff', border: '1px solid #c0d8f0',
                    borderRadius: '10px', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                    <Home size={16} color='#1e6fd9' />
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

                {/* Success Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    borderRadius: '16px', padding: '16px',
                    marginBottom: '16px', textAlign: 'center',
                    boxShadow: '0 6px 20px #05966940',
                }}>
                    <CheckCircle size={36} color='#ffffff' style={{ marginBottom: '8px' }} />
                    <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '800' }}>
                        Booking Confirmed!
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginTop: '4px' }}>
                        A copy has been sent to {email}
                    </p>
                </div>

                {/* Ticket Card */}
                <div ref={ticketRef} style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px #1e6fd920',
                    border: '1px solid #e0ecff',
                    marginBottom: '16px',
                }}>
                    {/* Ticket Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                        padding: '20px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600' }}>
                                    BOOKING REFERENCE
                                </p>
                                <p style={{ color: '#ffffff', fontSize: '24px', fontWeight: '900',
                                    letterSpacing: '2px', fontFamily: 'monospace' }}>
                                    {ref}
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                borderRadius: '12px', padding: '8px 12px', textAlign: 'center',
                            }}>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>AIRLINE</p>
                                <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>
                                    {flight.airline || 'AirAsia'}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                                    {flight.flightNumber || 'AK500'}
                                </p>
                            </div>
                        </div>

                        {/* Route */}
                        <div style={{
                            display: 'flex', alignItems: 'center', marginTop: '20px', gap: '8px',
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#ffffff', fontSize: '28px', fontWeight: '900',
                                    lineHeight: 1, fontFamily: 'monospace' }}>
                                    {flight.origin || 'KUL'}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>
                                    {formatTime(flight.departureTime)}
                                </p>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <Plane size={20} color='#ffffff' />
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.4)', marginTop: '4px' }} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#ffffff', fontSize: '28px', fontWeight: '900',
                                    lineHeight: 1, fontFamily: 'monospace' }}>
                                    {flight.destination || 'NRT'}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>
                                    {formatTime(flight.arrivalTime)}
                                </p>
                            </div>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>
                            {formatDate(date) || formatDate(new Date().toISOString())}
                        </p>
                    </div>

                    {/* Tear line */}
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: '#f0f6ff', flexShrink: 0,
                            marginLeft: '-12px',
                            border: '1px solid #e0ecff',
                        }} />
                        <div style={{
                            flex: 1,
                            borderTop: '2px dashed #c0d8f0',
                            margin: '0 8px',
                        }} />
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: '#f0f6ff', flexShrink: 0,
                            marginRight: '-12px',
                            border: '1px solid #e0ecff',
                        }} />
                    </div>

                    {/* Ticket Body */}
                    <div style={{ padding: '20px' }}>
                        {/* Passenger */}
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ color: '#8aaac8', fontSize: '11px', fontWeight: '600',
                                textTransform: 'uppercase', marginBottom: '4px' }}>
                                Passenger
                            </p>
                            <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700' }}>
                                {name}
                            </p>
                            <p style={{ color: '#5a7a9f', fontSize: '12px' }}>
                                Passport: {passport}
                            </p>
                        </div>

                        {/* Grid info */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            gap: '12px', marginBottom: '16px',
                        }}>
                            {[
                                { label: 'Terminal', value: flight.terminal || 'T1' },
                                { label: 'Gate', value: flight.gate || 'G10' },
                                { label: 'Seat', value: `${Math.floor(Math.random()*30)+1}${['A','B','C','D','E','F'][Math.floor(Math.random()*6)]}` },
                                { label: 'Class', value: 'Economy' },
                                { label: 'Status', value: flight.status || 'Confirmed' },
                                { label: 'Amount Paid', value: price?.replace('MYR ', '') ? `MYR ${parseInt(price.replace('MYR ',''))+55}` : price },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    background: '#f0f6ff', borderRadius: '10px', padding: '10px 12px',
                                }}>
                                    <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600',
                                        textTransform: 'uppercase' }}>
                                        {item.label}
                                    </p>
                                    <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700',
                                        marginTop: '2px', textTransform: 'capitalize' }}>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Barcode */}
                        <div style={{
                            background: '#f8faff', borderRadius: '12px',
                            padding: '16px', textAlign: 'center',
                            border: '1px solid #e0ecff',
                        }}>
                            {/* Visual barcode using divs */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '8px' }}>
                                {Array.from({length: 40}).map((_, i) => (
                                    <div key={i} style={{
                                        width: i % 3 === 0 ? '3px' : '1.5px',
                                        height: i % 5 === 0 ? '40px' : '30px',
                                        background: '#0a1628',
                                        borderRadius: '1px',
                                    }} />
                                ))}
                            </div>
                            <p style={{ color: '#5a7a9f', fontSize: '12px',
                                fontFamily: 'monospace', letterSpacing: '3px' }}>
                                {ref}
                            </p>
                            <p style={{ color: '#8aaac8', fontSize: '10px', marginTop: '4px' }}>
                                Show this at the check-in counter
                            </p>
                        </div>

                        <p style={{ color: '#8aaac8', fontSize: '10px', textAlign: 'center', marginTop: '12px' }}>
                            Booked on {paidAt} via VoyageAI
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button
                        onClick={() => alert('In a real app, this would download a PDF ticket!')}
                        style={{
                            flex: 1, background: '#ffffff',
                            border: '1.5px solid #1e6fd9', borderRadius: '12px',
                            padding: '12px', color: '#1e6fd9',
                            fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                    >
                        <Download size={15} /> Download PDF
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'My Flight Ticket',
                                    text: `Flight ${flight.flightNumber} | ${flight.origin} → ${flight.destination} | Ref: ${ref}`,
                                })
                            } else {
                                navigator.clipboard?.writeText(`Booking Ref: ${ref}`)
                                    .then(() => alert('Booking reference copied!'))
                            }
                        }}
                        style={{
                            flex: 1, background: '#ffffff',
                            border: '1.5px solid #c0d8f0', borderRadius: '12px',
                            padding: '12px', color: '#5a7a9f',
                            fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                    >
                        <Share2 size={15} /> Share
                    </button>
                </div>

                {/* Back to Home */}
                <button
                    onClick={() => setActiveScreen('home')}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                        border: 'none', borderRadius: '14px', padding: '14px',
                        color: '#ffffff', fontSize: '15px', fontWeight: '700',
                        cursor: 'pointer', boxShadow: '0 6px 20px #1e6fd940',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        marginBottom: '16px',
                    }}
                >
                    <Home size={16} /> Back to Home
                </button>
            </div>
        </div>
    )
}

export default ETicketScreen