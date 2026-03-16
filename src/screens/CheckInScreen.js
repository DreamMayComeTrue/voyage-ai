import React, { useState, useMemo } from 'react'
import { ArrowLeft, Check, Plane, Clock, AlertCircle } from 'lucide-react'

// ── Seat map config ───────────────────────────────────────────────────────
const ROWS = 30
const COLS = ['A','B','C','D','E','F']
const EXIT_ROWS  = [11, 12]
const FRONT_ROWS = [1, 2, 3, 4, 5]

// Pre-taken seats (mock unavailable)
const TAKEN = new Set([
    '2A','2B','3C','5D','5F','7A','8B','9C','10D','10E',
    '13A','14B','15C','16D','17E','18F','20A','21B','22C',
    '24D','25E','26F','27A','28B','29C','4A','4B','6C','6D',
    '23A','23B','19E','19F','11D','12E',
])

// Better distinct colours
const COLORS = {
    available: { bg: '#1e3a5f', border: '#2d5280', text: '#7eb3e8' },
    window:    { bg: '#0c4a6e', border: '#0369a1', text: '#7dd3fc' },  // Sky blue
    aisle:     { bg: '#3b1d6e', border: '#6d28d9', text: '#c4b5fd' },  // Purple
    exit:      { bg: '#713f12', border: '#d97706', text: '#fcd34d' },  // Amber
    front:     { bg: '#0f3460', border: '#0ea5e9', text: '#38bdf8' },  // Bright blue
    taken:     { bg: '#1f2937', border: '#374151', text: '#4b5563' },  // Dark grey
    selected:  { bg: '#059669', border: '#10b981', text: '#ffffff' },  // Green
    preselect: { bg: '#1e6fd9', border: '#4a9fe8', text: '#ffffff' },  // Blue (original purchased seat)
}

const getSeatType = (row, col) => {
    if (EXIT_ROWS.includes(row)) return 'exit'
    if (FRONT_ROWS.includes(row)) return 'front'
    if (col === 'A' || col === 'F') return 'window'
    if (col === 'C' || col === 'D') return 'aisle'
    return 'available'
}

const CHECKIN_KEY = 'voyageai_checkedin'
const loadCheckedIn = () => { try { return JSON.parse(localStorage.getItem(CHECKIN_KEY) || '{}') } catch { return {} } }
const saveCheckedIn = (d) => { try { localStorage.setItem(CHECKIN_KEY, JSON.stringify(d)) } catch {} }

const CheckInScreen = ({ setActiveScreen, ticketData }) => {
    const flight   = ticketData?.flight || {}
    const ref      = ticketData?.bookingRef || 'VA000000'
    const addons   = ticketData?.addons
    const paxList  = [
        { name: ticketData?.passengerName || 'Passenger', passport: ticketData?.passportNumber },
        ...(ticketData?.extraPassengers || []).map(p => ({ name: p.name, passport: p.passportNumber })),
    ]
    const paxCount = paxList.length

    // Get pre-purchased seats from ETicket
    const purchasedSeats = useMemo(() => {
        if (!ticketData?.generateSeats) {
            // Re-generate same seats as ETicket using same logic
            const seatPref = addons?.seat?.id || 'none'
            const rowNum = (() => {
                let seed = ref.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
                return (seed % 25) + 5
            })()
            const cols = ['A','B','C','D','E','F']
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
        }
        return ticketData.generateSeats
    }, [ref])

    const [step,        setStep]        = useState('choice')  // choice | map | done
    const [activePax,   setActivePax]   = useState(0)
    const [selectedSeats, setSelectedSeats] = useState(
        Object.fromEntries(purchasedSeats.map((s, i) => [i, s]))
    )
    const [changingSeats, setChangingSeats] = useState(false)

    const takenSet = useMemo(() => {
        const s = new Set(TAKEN)
        // Remove pre-purchased seats from taken so they show as pre-selected
        purchasedSeats.forEach(seat => s.delete(seat))
        return s
    }, [purchasedSeats])

    const isSelectedByPax   = (seatId, paxIdx) => selectedSeats[paxIdx] === seatId
    const isSelectedByOther = (seatId, paxIdx) =>
        Object.entries(selectedSeats).some(([k, v]) => v === seatId && parseInt(k) !== paxIdx)
    const isPurchased = (seatId) => purchasedSeats.includes(seatId)

    const handleSeatPress = (seatId) => {
        if (takenSet.has(seatId) || isSelectedByOther(seatId, activePax)) return
        setSelectedSeats(prev => ({
            ...prev,
            [activePax]: prev[activePax] === seatId ? undefined : seatId,
        }))
    }

    const allSeated = paxList.every((_, i) => selectedSeats[i])

    const handleConfirmCheckIn = () => {
        const checkedIn = loadCheckedIn()
        checkedIn[ref] = {
            seats: selectedSeats,
            paxList,
            checkedInAt: new Date().toISOString(),
        }
        saveCheckedIn(checkedIn)
        setStep('done')
    }

    const formatTime = (dateStr) => {
        if (!dateStr) return 'TBD'
        try { return new Date(dateStr).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true }) }
        catch { return dateStr }
    }

    // ── Choice screen ─────────────────────────────────────────────────────
    if (step === 'choice') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f6ff' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a5f, #1e6fd9)',
                    padding: '16px', flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => setActiveScreen('eticket')} style={{
                            background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
                            borderRadius: '10px', width: '34px', height: '34px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}>
                            <ArrowLeft size={16} color='#fff' />
                        </button>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>Online Check-in</p>
                            <p style={{ color: '#fff', fontSize: '15px', fontWeight: '800' }}>
                                {flight.airline} {flight.flightNumber} · {flight.origin} → {flight.destination}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
                    {/* Purchased seats summary */}
                    <div style={{
                        background: '#fff', borderRadius: '18px', padding: '18px',
                        marginBottom: '20px', border: '1px solid #e0ecff',
                        boxShadow: '0 4px 14px #1e6fd910',
                    }}>
                        <p style={{ color: '#8aaac8', fontSize: '11px', fontWeight: '700',
                            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                            Your Purchased Seats
                        </p>
                        {paxList.map((pax, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 0',
                                borderBottom: i < paxList.length - 1 ? '1px solid #f0f6ff' : 'none',
                            }}>
                                <div>
                                    <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>{pax.name}</p>
                                    <p style={{ color: '#8aaac8', fontSize: '11px' }}>Passenger {i + 1}</p>
                                </div>
                                <div style={{
                                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                    borderRadius: '8px', padding: '5px 14px', textAlign: 'center',
                                    boxShadow: '0 2px 8px #1e6fd930',
                                }}>
                                    <p style={{ color: '#fff', fontSize: '16px', fontWeight: '900', fontFamily: 'monospace' }}>
                                        {purchasedSeats[i]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '800', marginBottom: '6px' }}>
                        Would you like to change your seats?
                    </p>
                    <p style={{ color: '#5a7a9f', fontSize: '13px', marginBottom: '24px', lineHeight: '1.5' }}>
                        Your seats from purchase are already reserved. You can keep them or pick new ones from the seat map.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button onClick={() => { setChangingSeats(false); handleConfirmCheckIn() }} style={{
                            background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                            border: 'none', borderRadius: '14px', padding: '16px',
                            color: '#fff', fontSize: '15px', fontWeight: '800',
                            cursor: 'pointer', boxShadow: '0 6px 20px #05966940',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}>
                            ✅ Keep My Seats & Check In
                        </button>
                        <button onClick={() => { setChangingSeats(true); setStep('map') }} style={{
                            background: '#fff', border: '1.5px solid #1e6fd9',
                            borderRadius: '14px', padding: '16px',
                            color: '#1e6fd9', fontSize: '15px', fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}>
                            🪑 Choose Different Seats
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Seat map screen ───────────────────────────────────────────────────
    if (step === 'map') {
        const seatW = 34, seatH = 28, gap = 4, aisleW = 22
        const totalW = 6 * seatW + 5 * gap + aisleW + 28 // 28 for row num

        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a1628' }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a5f, #1e6fd9)',
                    padding: '12px 16px', flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: paxCount > 1 ? '10px' : '0' }}>
                        <button onClick={() => setStep('choice')} style={{
                            background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
                            borderRadius: '10px', width: '34px', height: '34px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}>
                            <ArrowLeft size={16} color='#fff' />
                        </button>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#fff', fontSize: '14px', fontWeight: '800' }}>
                                Choose Your Seat
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>
                                {flight.airline} · {flight.origin} → {flight.destination}
                            </p>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 10px',
                        }}>
                            <p style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>
                                {formatTime(flight.departureTime)}
                            </p>
                        </div>
                    </div>

                    {paxCount > 1 && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {paxList.map((pax, i) => (
                                <button key={i} onClick={() => setActivePax(i)} style={{
                                    flex: 1, background: activePax === i ? '#fff' : 'rgba(255,255,255,0.1)',
                                    border: 'none', borderRadius: '8px', padding: '6px 4px', cursor: 'pointer',
                                }}>
                                    <p style={{ color: activePax === i ? '#1e6fd9' : 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '700' }}>
                                        {pax.name?.split(' ')[0]}
                                    </p>
                                    <p style={{ color: activePax === i ? '#5a7a9f' : 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                                        {selectedSeats[i] ? `✅ ${selectedSeats[i]}` : 'Pick seat'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div style={{
                    background: '#0f1f38', padding: '8px 16px', flexShrink: 0,
                    display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap',
                }}>
                    {[
                        { color: COLORS.window,   label: 'Window',    dot: '#0369a1' },
                        { color: COLORS.aisle,    label: 'Aisle',     dot: '#6d28d9' },
                        { color: COLORS.exit,     label: 'Exit Row',  dot: '#d97706' },
                        { color: COLORS.front,    label: 'Front',     dot: '#0ea5e9' },
                        { color: COLORS.preselect,label: 'Your seat', dot: '#1e6fd9' },
                        { color: COLORS.selected, label: 'Selected',  dot: '#059669' },
                        { color: COLORS.taken,    label: 'Taken',     dot: '#374151' },
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '12px', height: '10px', borderRadius: '3px', background: item.dot }} />
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Seat map — centred */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '12px 0 16px',
                    }}>
                        {/* Plane nose */}
                        <Plane size={22} color='rgba(255,255,255,0.25)'
                               style={{ transform: 'rotate(90deg)', marginBottom: '8px' }} />

                        {/* Column headers */}
                        <div style={{ display: 'flex', gap: `${gap}px`, marginBottom: '4px', paddingLeft: '28px' }}>
                            {COLS.map((col, i) => (
                                <React.Fragment key={col}>
                                    {i === 3 && <div style={{ width: `${aisleW}px` }} />}
                                    <div style={{ width: `${seatW}px`, textAlign: 'center' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: '700' }}>{col}</p>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Rows */}
                        {Array.from({ length: ROWS }, (_, i) => i + 1).map(row => (
                            <div key={row} style={{ display: 'flex', gap: `${gap}px`, marginBottom: `${gap}px`, alignItems: 'center' }}>
                                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', width: '24px', textAlign: 'right', flexShrink: 0 }}>
                                    {row}
                                </p>
                                {COLS.map((col, ci) => {
                                    const seatId = `${row}${col}`
                                    const taken   = takenSet.has(seatId)
                                    const selCurr = isSelectedByPax(seatId, activePax)
                                    const selOther= isSelectedByOther(seatId, activePax)
                                    const presel  = isPurchased(seatId) && !selCurr && !selOther
                                    const type    = getSeatType(row, col)

                                    const colors = selCurr  ? COLORS.selected
                                        : selOther           ? COLORS.taken
                                            : taken              ? COLORS.taken
                                                : presel             ? COLORS.preselect
                                                    : COLORS[type]

                                    return (
                                        <React.Fragment key={col}>
                                            {ci === 3 && <div style={{ width: `${aisleW}px` }} />}
                                            <button
                                                onClick={() => !taken && !selOther && handleSeatPress(seatId)}
                                                style={{
                                                    width: `${seatW}px`, height: `${seatH}px`,
                                                    background: colors.bg,
                                                    border: `1.5px solid ${colors.border}`,
                                                    borderRadius: '5px 5px 3px 3px',
                                                    cursor: (taken || selOther) ? 'not-allowed' : 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.1s ease',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {selCurr  && <Check size={10} color='#fff' />}
                                                {presel   && <span style={{ fontSize: '7px', color: '#fff', fontWeight: '900' }}>●</span>}
                                                {selOther && <span style={{ fontSize: '8px', color: colors.text }}>✕</span>}
                                            </button>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom confirm */}
                <div style={{
                    background: '#0f1f38', borderTop: '1px solid rgba(255,255,255,0.08)',
                    padding: '14px 16px', flexShrink: 0,
                }}>
                    {paxCount > 1 && (
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textAlign: 'center', marginBottom: '10px' }}>
                            {Object.values(selectedSeats).filter(Boolean).length}/{paxCount} seats selected
                        </p>
                    )}
                    <button
                        onClick={() => allSeated && handleConfirmCheckIn()}
                        style={{
                            width: '100%',
                            background: allSeated
                                ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                                : 'rgba(255,255,255,0.08)',
                            border: 'none', borderRadius: '14px', padding: '15px',
                            color: allSeated ? '#fff' : 'rgba(255,255,255,0.3)',
                            fontSize: '15px', fontWeight: '800',
                            cursor: allSeated ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {allSeated ? `✅ Confirm Seats & Check In` : 'Select all seats first'}
                    </button>
                </div>
            </div>
        )
    }

    // ── Done screen ───────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f6ff' }}>
            <div style={{
                background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                padding: '40px 20px 30px', textAlign: 'center', flexShrink: 0,
            }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px',
                }}>
                    <Check size={32} color='#fff' />
                </div>
                <p style={{ color: '#fff', fontSize: '22px', fontWeight: '900', marginBottom: '4px' }}>
                    Check-in Complete!
                </p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                    {paxCount} passenger{paxCount > 1 ? 's' : ''} checked in · {ref}
                </p>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {paxList.map((pax, i) => (
                    <div key={i} style={{
                        background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                        borderRadius: '16px', padding: '16px', marginBottom: '12px',
                        boxShadow: '0 6px 20px #1e6fd940',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                                    Passenger {i + 1}
                                </p>
                                <p style={{ color: '#fff', fontSize: '15px', fontWeight: '800' }}>{pax.name}</p>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Passport: {pax.passport}</p>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '10px', padding: '8px 14px', textAlign: 'center',
                                border: '1.5px solid rgba(255,255,255,0.3)',
                            }}>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>Seat</p>
                                <p style={{ color: '#fff', fontSize: '22px', fontWeight: '900', lineHeight: 1, fontFamily: 'monospace' }}>
                                    {selectedSeats[i]}
                                </p>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.3)', paddingTop: '8px', marginTop: '4px', display: 'flex', gap: '12px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: '600' }}>✅ Checked In</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{flight.airline} {flight.flightNumber}</p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Terminal {flight.terminal || 'T1'} · Gate {flight.gate || 'G10'}</p>
                        </div>
                    </div>
                ))}

                <div style={{
                    background: '#fef9c3', borderRadius: '14px', padding: '14px 16px',
                    border: '1px solid #fde047', marginBottom: '16px',
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}>
                    <AlertCircle size={18} color='#a16207' style={{ flexShrink: 0, marginTop: '1px' }} />
                    <div>
                        <p style={{ color: '#a16207', fontSize: '12px', fontWeight: '700', marginBottom: '3px' }}>Before you go</p>
                        <p style={{ color: '#92400e', fontSize: '11px', lineHeight: '1.5' }}>
                            Arrive at {flight.terminal || 'T1'} at least 2 hours before {formatTime(flight.departureTime)}.
                            Gate {flight.gate || 'G10'} closes 45 minutes before departure.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', borderTop: '1px solid #e0ecff', padding: '16px', flexShrink: 0 }}>
                <button onClick={() => setActiveScreen('mytrips')} style={{
                    width: '100%', background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    border: 'none', borderRadius: '14px', padding: '15px',
                    color: '#fff', fontSize: '15px', fontWeight: '800',
                    cursor: 'pointer', boxShadow: '0 6px 20px #1e6fd940',
                }}>
                    Back to My Trips
                </button>
            </div>
        </div>
    )
}

export default CheckInScreen