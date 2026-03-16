import React, { useMemo } from 'react'
import { ArrowLeft, Plane, Download, Share2, Home, CheckCircle, Star } from 'lucide-react'

// ── QR Code Generator (pure JS, no library needed) ───────────────────────
// Simple QR-like visual using the booking ref as seed
const QRCode = ({ value, size = 140 }) => {
    const grid = useMemo(() => {
        // Generate a deterministic 21x21 grid from the value string
        const cells = 21
        const matrix = []
        let seed = 0
        for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) & 0xffffffff

        const rand = () => {
            seed = (seed ^ (seed << 13)) & 0xffffffff
            seed = (seed ^ (seed >> 7))  & 0xffffffff
            seed = (seed ^ (seed << 5))  & 0xffffffff
            return Math.abs(seed) / 0x7fffffff
        }

        for (let r = 0; r < cells; r++) {
            matrix[r] = []
            for (let c = 0; c < cells; c++) {
                // Fixed finder patterns (top-left, top-right, bottom-left corners)
                const inFinder = (
                    (r < 8 && c < 8) ||           // top-left
                    (r < 8 && c >= cells - 8) ||   // top-right
                    (r >= cells - 8 && c < 8)      // bottom-left
                )
                if (inFinder) {
                    // Draw finder pattern squares
                    const tl = r <= 6 && c <= 6
                    const tr = r <= 6 && c >= cells - 7
                    const bl = r >= cells - 7 && c <= 6

                    const inOuter = (r === 0 || r === 6 || c === 0 || c === 6) && tl
                        || (r === 0 || r === 6 || c === cells-1 || c === cells-7) && tr
                        || (r === cells-1 || r === cells-7 || c === 0 || c === 6) && bl

                    const inInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) && tl
                        || (r >= 2 && r <= 4 && c >= cells-5 && c <= cells-3) && tr
                        || (r >= cells-5 && r <= cells-3 && c >= 2 && c <= 4) && bl

                    matrix[r][c] = inOuter || inInner ? 1 : 0
                } else {
                    matrix[r][c] = rand() > 0.5 ? 1 : 0
                }
            }
        }
        return matrix
    }, [value])

    const cellSize = size / 21

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
             style={{ display: 'block' }}>
            <rect width={size} height={size} fill='white' />
            {grid.map((row, r) =>
                row.map((cell, c) =>
                    cell === 1 ? (
                        <rect
                            key={`${r}-${c}`}
                            x={c * cellSize}
                            y={r * cellSize}
                            width={cellSize}
                            height={cellSize}
                            fill='#0a1628'
                        />
                    ) : null
                )
            )}
        </svg>
    )
}

// ── Main Component ────────────────────────────────────────────────────────
const ETicketScreen = ({ setActiveScreen, ticketData }) => {

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

    const isHotel  = ticketData?.type === 'hotel'
    const flight   = ticketData?.flight || {}
    const hotel    = ticketData?.hotel  || {}
    const ref      = ticketData?.bookingRef    || 'VA000000'
    const name     = ticketData?.passengerName || 'Passenger'
    const passport = ticketData?.passportNumber || 'N/A'
    const email    = ticketData?.passengerEmail || ''
    const date     = ticketData?.date || ''
    const paidAt   = ticketData?.paidAt
        ? formatDate(ticketData.paidAt)
        : formatDate(new Date().toISOString())

    const totalPrice = ticketData?.price
        || (isHotel
            ? `MYR ${(parseInt((hotel.price || 'MYR 380').replace(/[^0-9]/g,'')) + 55).toLocaleString()}`
            : `MYR ${(parseInt((flight.price || 'MYR 580').replace(/[^0-9]/g,'')) + 55).toLocaleString()}`)

    // Check if already checked in — read from localStorage
    const checkedInData = useMemo(() => {
        try {
            const all = JSON.parse(localStorage.getItem('voyageai_checkedin') || '{}')
            return all[ref] || null
        } catch { return null }
    }, [ref])

    const isCheckedIn = !!checkedInData

    // Seat numbers — use checked-in seats if available, else generate from purchase
    const generateSeats = useMemo(() => {
        // If user already checked in, use those seats
        if (checkedInData?.seats) {
            const seats = checkedInData.seats
            const paxCount = (ticketData?.extraPassengers?.length || 0) + 1
            return Array.from({ length: paxCount }, (_, i) => seats[i] || seats[0])
        }

        // Otherwise generate from booking (same deterministic logic as CheckInScreen)
        const addons   = ticketData?.addons
        const paxCount = (ticketData?.extraPassengers?.length || 0) + 1
        const seatPref = addons?.seat?.id || 'none'
        const seed     = ref.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
        const rowNum   = (seed % 25) + 5  // deterministic row, same as CheckInScreen
        const cols     = ['A','B','C','D','E','F']

        if (seatPref === 'together' || seatPref === 'none') {
            return Array.from({ length: paxCount }, (_, i) => `${rowNum}${cols[Math.min(i, 5)]}`)
        } else if (seatPref === 'window') {
            return Array.from({ length: paxCount }, (_, i) => `${rowNum + i}${i % 2 === 0 ? 'A' : 'F'}`)
        } else if (seatPref === 'aisle') {
            return Array.from({ length: paxCount }, (_, i) => `${rowNum + i}${i % 2 === 0 ? 'C' : 'D'}`)
        } else if (seatPref === 'extra') {
            return Array.from({ length: paxCount }, (_, i) => `12${cols[i % 6]}`)
        } else if (seatPref === 'front') {
            return Array.from({ length: paxCount }, (_, i) => `${5 + i}B`)
        }
        return Array.from({ length: paxCount }, (_, i) => `${rowNum}${cols[i % 6]}`)
    }, [ref, checkedInData])

    // Grid info differs for flight vs hotel
    const infoGrid = isHotel ? [
        { label: 'Hotel',      value: hotel.name || 'Hotel' },
        { label: 'Location',   value: hotel.address || ticketData?.city || 'N/A' },
        { label: 'Rating',     value: `${'⭐'.repeat(hotel.stars || 4)}` },
        { label: 'Check-in',   value: date || 'Upon arrival' },
        { label: 'Status',     value: 'Confirmed' },
        { label: 'Amount Paid',value: totalPrice },
    ] : [
        { label: 'Terminal',   value: flight.terminal || 'T1' },
        { label: 'Gate',       value: flight.gate     || 'G10' },
        { label: 'Seat',       value: generateSeats[0] },
        { label: 'Class',      value: 'Economy' },
        { label: 'Booking Status', value: flight.status   || 'Confirmed' },
        { label: 'Amount Paid',value: totalPrice },
    ]

    const shareText = isHotel
        ? `Hotel: ${hotel.name} | ${ticketData?.city} | Ref: ${ref}`
        : `Flight ${flight.flightNumber} | ${flight.origin} → ${flight.destination} | Ref: ${ref}`

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
                        {isHotel ? 'Hotel Voucher' : 'E-Ticket'}
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
                        {isHotel ? 'Hotel Booked!' : 'Booking Confirmed!'}
                    </p>
                    {email && (
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', marginTop: '4px' }}>
                            Confirmation sent to {email}
                        </p>
                    )}
                </div>

                {/* Ticket / Voucher Card */}
                <div style={{
                    background: '#ffffff', borderRadius: '20px', overflow: 'hidden',
                    boxShadow: '0 8px 32px #1e6fd920', border: '1px solid #e0ecff',
                    marginBottom: '16px',
                }}>
                    {/* Card Header — blue gradient */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                        padding: '20px',
                    }}>
                        {/* Booking ref row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '600' }}>
                                    BOOKING REFERENCE
                                </p>
                                <p style={{ color: '#ffffff', fontSize: '22px', fontWeight: '900',
                                    letterSpacing: '2px', fontFamily: 'monospace' }}>
                                    {ref}
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                borderRadius: '12px', padding: '8px 12px', textAlign: 'center',
                            }}>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>
                                    {isHotel ? 'HOTEL' : 'AIRLINE'}
                                </p>
                                <p style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>
                                    {isHotel ? (hotel.name?.split(' ').slice(0,2).join(' ') || 'Hotel') : (flight.airline || 'AirAsia')}
                                </p>
                                {!isHotel && (
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                                        {flight.flightNumber || 'AK500'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Flight route OR hotel info */}
                        <div style={{ marginTop: '20px' }}>
                            {isHotel ? (
                                <div style={{
                                    background: 'rgba(255,255,255,0.12)',
                                    borderRadius: '12px', padding: '12px',
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                }}>
                                    <span style={{ fontSize: '28px' }}>🏨</span>
                                    <div>
                                        <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: '800' }}>
                                            {hotel.name || 'Hotel'}
                                        </p>
                                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>
                                            📍 {hotel.address || ticketData?.city || 'N/A'}
                                        </p>
                                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', marginTop: '2px' }}>
                                            {'⭐'.repeat(hotel.stars || 4)} · {hotel.price || 'MYR 380'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                        <p style={{ color: '#ffffff', fontSize: '26px', fontWeight: '900',
                                            lineHeight: 1, fontFamily: 'monospace' }}>
                                            {flight.origin || 'KUL'}
                                        </p>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>
                                            {formatTime(flight.departureTime)}
                                        </p>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                        <Plane size={18} color='#ffffff' />
                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.4)', marginTop: '4px' }} />
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', marginTop: '4px' }}>
                                            {formatDate(date)}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                                        <p style={{ color: '#ffffff', fontSize: '26px', fontWeight: '900',
                                            lineHeight: 1, fontFamily: 'monospace' }}>
                                            {flight.destination || 'NRT'}
                                        </p>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>
                                            {formatTime(flight.arrivalTime)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tear line */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '22px', height: '22px', borderRadius: '50%',
                            background: '#f0f6ff', marginLeft: '-11px', flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, borderTop: '2px dashed #c0d8f0', margin: '0 4px' }} />
                        <div style={{
                            width: '22px', height: '22px', borderRadius: '50%',
                            background: '#f0f6ff', marginRight: '-11px', flexShrink: 0,
                        }} />
                    </div>

                    {/* Ticket Body */}
                    <div style={{ padding: '20px' }}>

                        {/* Multi-passenger: one section per pax */}
                        {!isHotel && ticketData?.extraPassengers?.length > 0 ? (
                            <>
                                {[
                                    { name: ticketData.passengerName, passportNumber: ticketData.passportNumber },
                                    ...ticketData.extraPassengers
                                ].map((p, i) => (
                                    <div key={i}>
                                        {/* Divider between passengers */}
                                        {i > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0' }}>
                                                <div style={{ flex: 1, height: '1px', background: '#e0ecff' }} />
                                                <span style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    Passenger {i + 1}
                                                </span>
                                                <div style={{ flex: 1, height: '1px', background: '#e0ecff' }} />
                                            </div>
                                        )}

                                        {/* Passenger header */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            marginBottom: '12px',
                                        }}>
                                            <div>
                                                <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600',
                                                    textTransform: 'uppercase', marginBottom: '2px' }}>
                                                    Passenger {i + 1}
                                                </p>
                                                <p style={{ color: '#0a1628', fontSize: '15px', fontWeight: '800' }}>{p.name}</p>
                                                <p style={{ color: '#5a7a9f', fontSize: '12px' }}>Passport: {p.passportNumber}</p>
                                            </div>
                                            <div style={{
                                                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                                borderRadius: '10px', padding: '8px 14px', textAlign: 'center',
                                                boxShadow: '0 4px 10px #1e6fd930',
                                            }}>
                                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>Seat</p>
                                                <p style={{ color: '#fff', fontSize: '18px', fontWeight: '900', lineHeight: 1, fontFamily: 'monospace' }}>
                                                    {generateSeats[i] || generateSeats[0]}
                                                </p>
                                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', marginTop: '2px' }}>Economy</p>
                                            </div>
                                        </div>

                                        {/* Per-pax grid: terminal, gate, class only */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {[
                                                { label: 'Terminal', value: flight.terminal || 'T1' },
                                                { label: 'Gate',     value: flight.gate     || 'G10' },
                                                { label: 'Class',    value: 'Economy' },
                                            ].map((item, j) => (
                                                <div key={j} style={{ background: '#f0f6ff', borderRadius: '10px', padding: '10px 12px' }}>
                                                    <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                                                        {item.label}
                                                    </p>
                                                    <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700', marginTop: '2px' }}>
                                                        {item.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Separator before shared booking info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0' }}>
                                    <div style={{ flex: 1, height: '1px', background: '#e0ecff' }} />
                                    <span style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Booking Summary
                                    </span>
                                    <div style={{ flex: 1, height: '1px', background: '#e0ecff' }} />
                                </div>

                                {/* Shared: Booking Status + Amount Paid */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    gap: '8px', marginBottom: '20px',
                                }}>
                                    <div style={{ background: '#f0f6ff', borderRadius: '10px', padding: '10px 12px' }}>
                                        <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Booking Status</p>
                                        <p style={{ color: '#059669', fontSize: '12px', fontWeight: '700', marginTop: '2px' }}>✅ Confirmed</p>
                                    </div>
                                    <div style={{ background: '#f0f6ff', borderRadius: '10px', padding: '10px 12px' }}>
                                        <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>Amount Paid</p>
                                        <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700', marginTop: '2px' }}>{totalPrice}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Single passenger */}
                                <div style={{ marginBottom: '16px' }}>
                                    <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600',
                                        textTransform: 'uppercase', marginBottom: '4px' }}>
                                        {isHotel ? 'Guest' : 'Passenger'}
                                    </p>
                                    <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700' }}>{name}</p>
                                    <p style={{ color: '#5a7a9f', fontSize: '12px' }}>
                                        {isHotel ? 'Guest ID' : 'Passport'}: {passport}
                                    </p>
                                </div>

                                {/* Info Grid */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    gap: '10px', marginBottom: '20px',
                                }}>
                                    {infoGrid.map((item, i) => (
                                        <div key={i} style={{ background: '#f0f6ff', borderRadius: '10px', padding: '10px 12px' }}>
                                            <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                                                {item.label}
                                            </p>
                                            <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700', marginTop: '2px' }}>
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Add-ons section — flight only */}
                        {!isHotel && ticketData?.addons && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{
                                    color: '#8aaac8', fontSize: '10px', fontWeight: '600',
                                    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px',
                                }}>Flight Add-ons</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                    {/* Meal */}
                                    {ticketData.addons.meal?.id !== 'standard' && ticketData.addons.meal?.id !== 'none' && (
                                        <AddonRow
                                            emoji={ticketData.addons.meal.emoji}
                                            label={ticketData.addons.meal.label}
                                            price={ticketData.addons.meal.price * (ticketData.addons.passengers || 1)}
                                        />
                                    )}
                                    {ticketData.addons.meal?.id === 'standard' && (
                                        <AddonRow emoji='🍱' label='Standard Meal' price={0} />
                                    )}
                                    {ticketData.addons.meal?.id === 'halal' && (
                                        <AddonRow emoji='☪️' label='Halal Meal' price={0} />
                                    )}
                                    {/* Baggage */}
                                    {ticketData.addons.baggage?.id !== 'none' && (
                                        <AddonRow
                                            emoji='🧳'
                                            label={`${ticketData.addons.baggage.label} Baggage`}
                                            price={ticketData.addons.baggage.price * (ticketData.addons.passengers || 1)}
                                        />
                                    )}
                                    {ticketData.addons.baggage?.id === 'none' && (
                                        <AddonRow emoji='🎒' label='Cabin Bag Only (7kg)' price={0} />
                                    )}
                                    {/* Seat */}
                                    {ticketData.addons.seat && (
                                        <AddonRow
                                            emoji={ticketData.addons.seat.emoji}
                                            label={ticketData.addons.seat.label}
                                            price={ticketData.addons.seat.price * (ticketData.addons.passengers || 1)}
                                        />
                                    )}
                                    {/* Extras */}
                                    {ticketData.addons.extras?.map((e, i) => (
                                        <AddonRow key={i} emoji={e.emoji} label={e.label} price={e.price} />
                                    ))}
                                    {/* Total add-ons */}
                                    {ticketData.addons.total > 0 && (
                                        <div style={{
                                            borderTop: '1px solid #e0ecff', paddingTop: '8px', marginTop: '2px',
                                            display: 'flex', justifyContent: 'space-between',
                                        }}>
                                            <span style={{ color: '#5a7a9f', fontSize: '11px', fontWeight: '700' }}>
                                                Add-ons total
                                            </span>
                                            <span style={{ color: '#1e6fd9', fontSize: '12px', fontWeight: '800' }}>
                                                +MYR {ticketData.addons.total}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* QR Code */}
                        <div style={{
                            background: '#f8faff', borderRadius: '16px',
                            padding: '20px', textAlign: 'center',
                            border: '1px solid #e0ecff',
                        }}>
                            <p style={{ color: '#5a7a9f', fontSize: '11px', fontWeight: '600',
                                marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Scan to Verify
                            </p>

                            {/* QR Code — white background with border */}
                            <div style={{
                                display: 'inline-block',
                                background: '#ffffff',
                                border: '3px solid #0a1628',
                                borderRadius: '12px',
                                padding: '10px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}>
                                <QRCode value={ref + name + (isHotel ? hotel.name : flight.flightNumber)} size={130} />
                            </div>

                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '800',
                                fontFamily: 'monospace', letterSpacing: '3px', marginTop: '12px' }}>
                                {ref}
                            </p>
                            <p style={{ color: '#8aaac8', fontSize: '10px', marginTop: '4px' }}>
                                {isHotel ? 'Show this at hotel check-in' : 'Show this at the check-in counter'}
                            </p>
                        </div>

                        <p style={{ color: '#8aaac8', fontSize: '10px', textAlign: 'center', marginTop: '14px' }}>
                            Booked on {paidAt} via VoyageAI
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                    <button
                        onClick={() => alert('In a real app, this would save a PDF to your device!')}
                        style={{
                            flex: 1, background: '#ffffff',
                            border: '1.5px solid #1e6fd9', borderRadius: '12px',
                            padding: '12px', color: '#1e6fd9',
                            fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                    >
                        <Download size={15} /> Save PDF
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: 'VoyageAI Booking', text: shareText })
                            } else {
                                navigator.clipboard?.writeText(`Booking Ref: ${ref}\n${shareText}`)
                                    .then(() => alert('Booking details copied to clipboard!'))
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

                {/* Check-in button — flights only */}
                {!isHotel && (
                    isCheckedIn ? (
                        <div style={{
                            width: '100%',
                            background: '#f0fdf4',
                            border: '1.5px solid #059669',
                            borderRadius: '14px', padding: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            marginBottom: '12px',
                        }}>
                            <CheckCircle size={16} color='#059669' />
                            <span style={{ color: '#059669', fontSize: '15px', fontWeight: '700' }}>
                                Online Check-in Complete
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={() => setActiveScreen('checkin')}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                                border: 'none', borderRadius: '14px', padding: '14px',
                                color: '#ffffff', fontSize: '15px', fontWeight: '700',
                                cursor: 'pointer', boxShadow: '0 6px 20px #05966940',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                marginBottom: '12px',
                            }}
                        >
                            ✅ Online Check-in & Select Seat
                        </button>
                    )
                )}

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

// ── Addon row for e-ticket ────────────────────────────────────────────────
const AddonRow = ({ emoji, label, price }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#f8faff', borderRadius: '8px', padding: '7px 10px',
        border: '1px solid #e0ecff',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ fontSize: '14px' }}>{emoji}</span>
            <span style={{ color: '#0a1628', fontSize: '11px', fontWeight: '600' }}>{label}</span>
        </div>
        <span style={{ color: price > 0 ? '#1e6fd9' : '#059669', fontSize: '11px', fontWeight: '700' }}>
            {price > 0 ? `+MYR ${price}` : 'Free'}
        </span>
    </div>
)

export default ETicketScreen