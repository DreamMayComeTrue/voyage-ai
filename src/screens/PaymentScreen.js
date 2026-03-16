import React, { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Lock, Check, Plane, Star, Plus, Trash2, User, ChevronDown, ChevronUp, Hotel } from 'lucide-react'

// ── LocalStorage helpers ──────────────────────────────────────────────────
const STORAGE_PASSENGERS = 'voyageai_fav_passengers'
const STORAGE_CARDS      = 'voyageai_fav_cards'

const loadFavs = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
const saveFavs = (key, data) => {
    try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

// Mask card number for display: **** **** **** 4242
const maskCard = (num) => {
    const digits = num.replace(/\s/g, '')
    if (digits.length < 4) return num
    return '**** **** **** ' + digits.slice(-4)
}

// Card brand detection
const cardBrand = (num) => {
    const d = num.replace(/\s/g, '')
    if (d.startsWith('4'))   return { name: 'Visa',       color: '#1a1f71', bg: '#e8eaf6' }
    if (d.startsWith('5'))   return { name: 'Mastercard', color: '#eb001b', bg: '#fce4ec' }
    if (d.startsWith('37'))  return { name: 'Amex',       color: '#007b5e', bg: '#e0f2f1' }
    return { name: 'Card', color: '#1e6fd9', bg: '#e3f2fd' }
}

const CURRENCY_SYMBOLS = {
    MYR: 'MYR', USD: 'USD', SGD: 'SGD',
    JPY: 'JPY', EUR: 'EUR', GBP: 'GBP', AUD: 'AUD',
}

const CURRENCY_RATES = {
    MYR: 1, USD: 0.22, SGD: 0.30, JPY: 33, EUR: 0.20, GBP: 0.17, AUD: 0.34,
}

const PAYMENT_KEY = 'voyageai_payment_form'
const loadPaymentForm = () => { try { return JSON.parse(sessionStorage.getItem(PAYMENT_KEY) || 'null') } catch { return null } }
const savePaymentForm = (f) => { try { sessionStorage.setItem(PAYMENT_KEY, JSON.stringify(f)) } catch {} }

const PaymentScreen = ({ setActiveScreen, bookingData, onPaymentComplete, currency = 'MYR' }) => {
    const [step, setStep] = useState('details')
    const savedForm = loadPaymentForm()
    const [form, setForm] = useState(savedForm || {
        name: '', email: '', cardNumber: '',
        expiry: '', cvv: '', passportNumber: '',
    })
    const [errors, setErrors]         = useState({})
    const [favPassengers, setFavPassengers] = useState(() => loadFavs(STORAGE_PASSENGERS))
    const [favCards, setFavCards]     = useState(() => loadFavs(STORAGE_CARDS))
    const [showPassPicker, setShowPassPicker] = useState(false)
    const [showCardPicker, setShowCardPicker] = useState(false)
    const [savePassenger, setSavePassenger]   = useState(false)
    const [saveCard, setSaveCard]             = useState(false)
    const [passengerLabel, setPassengerLabel] = useState('')
    const [cardLabel, setCardLabel]           = useState('')

    // Auto-save form to sessionStorage so back navigation restores it
    useEffect(() => { savePaymentForm(form) }, [form])
    // Extra passengers (for flights with 2+ passengers)
    const [extraPassengers, setExtraPassengers] = useState(() =>
        Array.from({ length: Math.max(0, (bookingData?.addons?.passengers || 1) - 1) },
            (_, i) => ({ id: i + 2, name: '', passportNumber: '' }))
    )

    const isHotel   = bookingData?.type === 'hotel'
    const isGuide   = bookingData?.type === 'guide'
    const guide     = bookingData?.guide || {}
    const flight    = bookingData?.flight || {}
    const hotel     = bookingData?.hotel  || {}
    const date      = bookingData?.date   || ''
    const checkIn   = bookingData?.checkIn  || null
    const checkOut  = bookingData?.checkOut || null

    // Number of passengers from addons (flights only)
    const passengerCount = (!isHotel && !isGuide) ? (bookingData?.addons?.passengers || 1) : 1

    // Calculate number of nights for hotel
    const nights = (() => {
        if (!isHotel || !checkIn || !checkOut) return 1
        try {
            const d1 = new Date(checkIn);  d1.setHours(0,0,0,0)
            const d2 = new Date(checkOut); d2.setHours(0,0,0,0)
            const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
            return diff > 0 ? diff : 1
        } catch { return 1 }
    })()

    // Base price per night/flight
    const pricePerUnit = isHotel
        ? (hotel.price || 'MYR 380').split('/')[0].trim()
        : (flight.price || 'MYR 580')

    const priceNum = parseInt((pricePerUnit || '0').replace(/[^0-9]/g, '')) || 0

    // Hotel: pricePerNight × nights | Flight: pricePerSeat × passengers | Guide: pre-calculated
    const baseTotal = isGuide
        ? parseInt((bookingData?.totalPrice || '0').replace(/[^0-9]/g, '')) || (guide.price * (bookingData?.days || 1))
        : isHotel ? priceNum * nights : priceNum * passengerCount
    const addonsTotal = bookingData?.addons?.total || 0
    const convertPrice = (amountMYR) => {
        const rate = CURRENCY_RATES[currency] || 1
        const sym  = CURRENCY_SYMBOLS[currency] || 'MYR'
        return `${sym} ${Math.round(amountMYR * rate).toLocaleString()}`
    }

    const price      = convertPrice(baseTotal)
    const totalPrice = convertPrice(baseTotal + (isGuide ? 30 : 55) + addonsTotal)

    // Format date for display
    const formatDateShort = (d) => {
        if (!d) return ''
        try { return new Date(d).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' }) }
        catch { return d }
    }

    const formatTime = (dateStr) => {
        if (!dateStr || dateStr === 'TBD') return 'TBD'
        try {
            return new Date(dateStr).toLocaleTimeString('en-MY', {
                hour: '2-digit', minute: '2-digit', hour12: true,
            })
        } catch { return dateStr }
    }

    const formatCard  = (v) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
    const formatExpiry = (v) => {
        const d = v.replace(/\D/g,'').slice(0,4)
        return d.length >= 3 ? d.slice(0,2)+'/'+d.slice(2) : d
    }

    // ── Validate ────────────────────────────────────────────────────────────
    const validate = () => {
        const e = {}
        if (!form.name.trim())                             e.name = 'Full name required'
        if (!form.email.includes('@'))                     e.email = 'Valid email required'
        if (form.cardNumber.replace(/\s/g,'').length < 16) e.cardNumber = '16-digit card number required'
        if (form.expiry.length < 5)                        e.expiry = 'MM/YY required'
        if (form.cvv.length < 3)                           e.cvv = 'CVV required'
        if (!form.passportNumber.trim())                   e.passportNumber = 'Passport number required'
        // Validate extra passengers
        extraPassengers.forEach((p, i) => {
            if (!p.name.trim())          e[`ep_name_${i}`]     = `Passenger ${i + 2} name required`
            if (!p.passportNumber.trim()) e[`ep_passport_${i}`] = `Passenger ${i + 2} passport required`
        })
        setErrors(e)
        return Object.keys(e).length === 0
    }

    // ── Save favourites then pay ────────────────────────────────────────────
    const handlePay = () => {
        if (!validate()) return

        // Save passenger if checked
        if (savePassenger && form.name && form.email) {
            const label = passengerLabel.trim() || form.name
            const newPass = {
                id: Date.now(),
                label,
                name: form.name,
                email: form.email,
                passportNumber: form.passportNumber,
            }
            const updated = [...favPassengers.filter(p => p.label !== label), newPass]
            setFavPassengers(updated)
            saveFavs(STORAGE_PASSENGERS, updated)
        }

        // Save extra passengers if checked
        let updatedFavPassengers = [...favPassengers]
        extraPassengers.forEach((ep) => {
            if (ep._save && ep.name) {
                const newPass = { id: Date.now() + Math.random(), label: ep.name, name: ep.name, email: '', passportNumber: ep.passportNumber }
                updatedFavPassengers = [...updatedFavPassengers.filter(p => p.label !== ep.name), newPass]
            }
        })
        if (updatedFavPassengers.length !== favPassengers.length) {
            setFavPassengers(updatedFavPassengers)
            saveFavs(STORAGE_PASSENGERS, updatedFavPassengers)
        }

        // Save card if checked (never save CVV — security)
        if (saveCard && form.cardNumber) {
            const brand = cardBrand(form.cardNumber)
            const label = cardLabel.trim() || `${brand.name} ${maskCard(form.cardNumber)}`
            const newCard = {
                id: Date.now(),
                label,
                cardNumber: form.cardNumber,
                expiry: form.expiry,
                brand: brand.name,
            }
            const updated = [...favCards.filter(c => c.label !== label), newCard]
            setFavCards(updated)
            saveFavs(STORAGE_CARDS, updated)
        }

        setStep('processing')
        setTimeout(() => {
            setStep('done')
            const bookingRef = 'VA' + Math.random().toString(36).slice(2,8).toUpperCase()
            setTimeout(() => {
                // Clear sessionStorage — booking complete
                try {
                    sessionStorage.removeItem('voyageai_addons_state')
                    sessionStorage.removeItem(PAYMENT_KEY)
                } catch {}
                onPaymentComplete({
                    ...bookingData,
                    passengerName:   form.name,
                    passengerEmail:  form.email,
                    passportNumber:  form.passportNumber,
                    extraPassengers: extraPassengers.length > 0 ? extraPassengers : undefined,
                    bookingRef,
                    paidAt: new Date().toISOString(),
                    price : totalPrice,
                })
            }, 1200)
        }, 2500)
    }

    const deleteFavPassenger = (id) => {
        const updated = favPassengers.filter(p => p.id !== id)
        setFavPassengers(updated)
        saveFavs(STORAGE_PASSENGERS, updated)
    }

    const deleteFavCard = (id) => {
        const updated = favCards.filter(c => c.id !== id)
        setFavCards(updated)
        saveFavs(STORAGE_CARDS, updated)
    }

    // ── Input style ─────────────────────────────────────────────────────────
    const inp = (field) => ({
        width: '100%', background: '#f0f6ff',
        border: `1.5px solid ${errors[field] ? '#dc2626' : '#c0d8f0'}`,
        borderRadius: '10px', padding: '11px 14px',
        fontSize: '14px', color: '#0a1628', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
    })
    const lbl = (text) => (
        <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>{text}</p>
    )
    const errMsg = (field) => errors[field] && (
        <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px' }}>{errors[field]}</p>
    )

    // ── Processing screen ───────────────────────────────────────────────────
    if (step === 'processing') return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: 'calc(100vh - 70px)',
            background: '#f0f6ff', gap: '20px',
        }}>
            <div style={{
                width: '70px', height: '70px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px #1e6fd940',
                animation: 'pulse 1.5s ease-in-out infinite',
            }}>
                <CreditCard size={32} color='#ffffff' />
            </div>
            <p style={{ color: '#0a1628', fontSize: '18px', fontWeight: '700' }}>Processing Payment...</p>
            <p style={{ color: '#5a7a9f', fontSize: '14px' }}>Please do not close this window</p>
            <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
        </div>
    )

    // ── Done screen ─────────────────────────────────────────────────────────
    if (step === 'done') return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: 'calc(100vh - 70px)',
            background: '#f0f6ff', gap: '20px',
        }}>
            <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px #05966940',
            }}>
                <Check size={40} color='#ffffff' />
            </div>
            <p style={{ color: '#059669', fontSize: '22px', fontWeight: '800' }}>Payment Successful!</p>
            <p style={{ color: '#5a7a9f', fontSize: '14px' }}>Preparing your e-ticket...</p>
        </div>
    )

    // ── Main form ───────────────────────────────────────────────────────────
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
                <button onClick={() => setActiveScreen(
                    bookingData?.type === 'flight' ? 'addons' : 'chat'
                )} style={{
                    background: '#f0f6ff', border: '1px solid #c0d8f0', borderRadius: '10px',
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                }}>
                    <ArrowLeft size={18} color='#1e6fd9' />
                </button>
                <div>
                    <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700' }}>Secure Payment</p>
                    <p style={{ color: '#5a7a9f', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={10} /> 256-bit SSL encrypted
                    </p>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

                {/* Booking Summary */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    borderRadius: '18px', padding: '16px', marginBottom: '16px',
                    boxShadow: '0 8px 24px #1e6fd940',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: isHotel ? 0 : '12px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                        }}>
                            {isGuide ? '🧑‍🦯' : isHotel ? '🏨' : '✈️'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700' }}>
                                {isGuide ? guide.name : isHotel ? hotel.name : flight.airline}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                                {isGuide
                                    ? `${guide.specialty} · ${guide.city} · ${bookingData?.days} day${bookingData?.days > 1 ? 's' : ''}`
                                    : isHotel
                                        ? (checkIn && checkOut
                                            ? `${formatDateShort(checkIn)} → ${formatDateShort(checkOut)} · ${nights} night${nights > 1 ? 's' : ''}`
                                            : hotel.address)
                                        : `${flight.flightNumber} · ${date}`}
                            </p>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '6px 12px',
                        }}>
                            <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: '800' }}>{price}</p>
                        </div>
                    </div>
                    {!isHotel && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '800', lineHeight: 1 }}>
                                    {formatTime(flight.departureTime)}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                                    {flight.origin || 'KUL'}
                                </p>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.4)' }} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '800', lineHeight: 1 }}>
                                    {formatTime(flight.arrivalTime)}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                                    {flight.destination || 'NRT'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── PASSENGER SECTION ── */}
                <div style={{
                    background: '#ffffff', borderRadius: '16px', padding: '16px',
                    marginBottom: '14px', border: '1px solid #e0ecff',
                    boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    {/* Section title + pick favourite */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700' }}>
                            👤 Passenger Details
                        </p>
                        {favPassengers.length > 0 && (
                            <button
                                onClick={() => setShowPassPicker(!showPassPicker)}
                                style={{
                                    background: showPassPicker ? '#d0e8ff' : '#f0f6ff',
                                    border: '1.5px solid #c0d8f0', borderRadius: '8px',
                                    padding: '5px 10px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    color: '#1e6fd9', fontSize: '12px', fontWeight: '600',
                                }}
                            >
                                <Star size={12} fill={showPassPicker ? '#1e6fd9' : 'none'} />
                                Saved ({favPassengers.length})
                                {showPassPicker ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                        )}
                    </div>

                    {/* Saved passengers picker */}
                    {showPassPicker && (
                        <div style={{
                            background: '#f0f6ff', borderRadius: '12px',
                            padding: '10px', marginBottom: '14px',
                            border: '1px solid #c0d8f0',
                        }}>
                            <p style={{ color: '#5a7a9f', fontSize: '11px', fontWeight: '600',
                                marginBottom: '8px', textTransform: 'uppercase' }}>
                                Select a saved passenger
                            </p>
                            {favPassengers.map(p => (
                                <div key={p.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    background: '#ffffff', borderRadius: '10px',
                                    padding: '10px 12px', marginBottom: '6px',
                                    border: '1px solid #e0ecff', cursor: 'pointer',
                                }}
                                     onClick={() => {
                                         setForm(f => ({
                                             ...f,
                                             name: p.name,
                                             email: p.email,
                                             passportNumber: p.passportNumber || '',
                                         }))
                                         setShowPassPicker(false)
                                     }}
                                >
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <User size={14} color='#ffffff' />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>
                                            {p.label}
                                        </p>
                                        <p style={{ color: '#8aaac8', fontSize: '11px',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {p.email} · {p.passportNumber || 'No passport'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteFavPassenger(p.id) }}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            padding: '4px', color: '#dc2626', flexShrink: 0,
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Passenger form */}
                    <div style={{ marginBottom: '12px' }}>
                        {lbl('Full Name (as in passport)')}
                        <input style={inp('name')} placeholder='e.g. Ahmad bin Abdullah'
                               value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                        {errMsg('name')}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        {lbl('Email Address')}
                        <input style={inp('email')} placeholder='your@email.com' type='email'
                               value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                        {errMsg('email')}
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                        {lbl('Passport Number')}
                        <input style={inp('passportNumber')} placeholder='e.g. A12345678'
                               value={form.passportNumber}
                               onChange={e => setForm(f => ({...f, passportNumber: e.target.value.toUpperCase()}))} />
                        {errMsg('passportNumber')}
                    </div>

                    {/* Save passenger toggle */}
                    <div style={{
                        background: '#f0f6ff', borderRadius: '10px',
                        padding: '10px 12px', border: '1px solid #c0d8f0',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                                onClick={() => setSavePassenger(!savePassenger)}
                                style={{
                                    width: '20px', height: '20px', borderRadius: '6px',
                                    background: savePassenger ? '#1e6fd9' : '#ffffff',
                                    border: `2px solid ${savePassenger ? '#1e6fd9' : '#c0d8f0'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', flexShrink: 0,
                                }}
                            >
                                {savePassenger && <Check size={12} color='#ffffff' />}
                            </button>
                            <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '600' }}>
                                Save as favourite passenger
                            </p>
                            <Star size={13} color={savePassenger ? '#f59e0b' : '#8aaac8'}
                                  fill={savePassenger ? '#f59e0b' : 'none'} />
                        </div>
                        {savePassenger && (
                            <div style={{ marginTop: '10px' }}>
                                {lbl('Label (e.g. "Myself", "My Wife")')}
                                <input
                                    style={{...inp(''), border: '1.5px solid #c0d8f0'}}
                                    placeholder='Give this passenger a name...'
                                    value={passengerLabel}
                                    onChange={e => setPassengerLabel(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── EXTRA PASSENGERS (flights with 2+ pax) ── */}
                {extraPassengers.map((ep, i) => (
                    <div key={ep.id} style={{
                        background: '#ffffff', borderRadius: '16px', padding: '16px',
                        marginBottom: '14px', border: '1.5px solid #c0d8f0',
                        boxShadow: '0 2px 12px #1e6fd910',
                    }}>
                        {/* Header with saved passenger picker */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700' }}>
                                👤 Passenger {i + 2} Details
                            </p>
                            {favPassengers.length > 0 && (
                                <button
                                    onClick={() => setExtraPassengers(prev => prev.map((p, idx) =>
                                        idx === i ? { ...p, _showPicker: !p._showPicker } : p
                                    ))}
                                    style={{
                                        background: ep._showPicker ? '#d0e8ff' : '#f0f6ff',
                                        border: '1.5px solid #c0d8f0', borderRadius: '8px',
                                        padding: '5px 10px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        color: '#1e6fd9', fontSize: '12px', fontWeight: '600',
                                    }}
                                >
                                    <Star size={12} fill={ep._showPicker ? '#1e6fd9' : 'none'} />
                                    Saved ({favPassengers.length})
                                </button>
                            )}
                        </div>

                        {/* Saved passengers picker for this extra pax */}
                        {ep._showPicker && (
                            <div style={{
                                background: '#f0f6ff', borderRadius: '12px',
                                padding: '10px', marginBottom: '14px', border: '1px solid #c0d8f0',
                            }}>
                                {favPassengers.map(p => (
                                    <div key={p.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        background: '#fff', borderRadius: '10px', padding: '10px 12px',
                                        marginBottom: '6px', border: '1px solid #e0ecff', cursor: 'pointer',
                                    }}
                                         onClick={() => setExtraPassengers(prev => prev.map((ep2, idx) =>
                                             idx === i ? { ...ep2, name: p.name, passportNumber: p.passportNumber || '', _showPicker: false } : ep2
                                         ))}
                                    >
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <User size={14} color='#fff' />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>{p.label}</p>
                                            <p style={{ color: '#8aaac8', fontSize: '11px' }}>{p.email} · {p.passportNumber || 'No passport'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ marginBottom: '12px' }}>
                            {lbl(`Full Name — Passenger ${i + 2}`)}
                            <input
                                style={{ ...inp(`ep_name_${i}`), border: `1.5px solid ${errors[`ep_name_${i}`] ? '#ef4444' : '#c0d8f0'}` }}
                                placeholder='e.g. Siti binti Abdullah'
                                value={ep.name}
                                onChange={e => setExtraPassengers(prev => prev.map((p, idx) =>
                                    idx === i ? { ...p, name: e.target.value } : p
                                ))}
                            />
                            {errors[`ep_name_${i}`] && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors[`ep_name_${i}`]}</p>}
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            {lbl(`Passport Number — Passenger ${i + 2}`)}
                            <input
                                style={{ ...inp(`ep_passport_${i}`), border: `1.5px solid ${errors[`ep_passport_${i}`] ? '#ef4444' : '#c0d8f0'}` }}
                                placeholder='e.g. A87654321'
                                value={ep.passportNumber}
                                onChange={e => setExtraPassengers(prev => prev.map((p, idx) =>
                                    idx === i ? { ...p, passportNumber: e.target.value.toUpperCase() } : p
                                ))}
                            />
                            {errors[`ep_passport_${i}`] && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{errors[`ep_passport_${i}`]}</p>}
                        </div>

                        {/* Save this extra passenger as favourite */}
                        <div style={{ background: '#f0f6ff', borderRadius: '10px', padding: '10px 12px', border: '1px solid #c0d8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => setExtraPassengers(prev => prev.map((p, idx) =>
                                        idx === i ? { ...p, _save: !p._save } : p
                                    ))}
                                    style={{
                                        width: '20px', height: '20px', borderRadius: '6px',
                                        background: ep._save ? '#1e6fd9' : '#ffffff',
                                        border: `2px solid ${ep._save ? '#1e6fd9' : '#c0d8f0'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', flexShrink: 0,
                                    }}
                                >
                                    {ep._save && <Check size={12} color='#ffffff' />}
                                </button>
                                <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '600' }}>
                                    Save Passenger {i + 2} as favourite
                                </p>
                                <Star size={13} color={ep._save ? '#f59e0b' : '#8aaac8'} fill={ep._save ? '#f59e0b' : 'none'} />
                            </div>
                        </div>
                    </div>
                ))}
                <div style={{
                    background: '#ffffff', borderRadius: '16px', padding: '16px',
                    marginBottom: '14px', border: '1px solid #e0ecff',
                    boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700' }}>
                            💳 Payment Details
                        </p>
                        {favCards.length > 0 && (
                            <button
                                onClick={() => setShowCardPicker(!showCardPicker)}
                                style={{
                                    background: showCardPicker ? '#d0e8ff' : '#f0f6ff',
                                    border: '1.5px solid #c0d8f0', borderRadius: '8px',
                                    padding: '5px 10px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    color: '#1e6fd9', fontSize: '12px', fontWeight: '600',
                                }}
                            >
                                <Star size={12} fill={showCardPicker ? '#1e6fd9' : 'none'} />
                                Saved ({favCards.length})
                                {showCardPicker ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                        )}
                    </div>

                    {/* Saved cards picker */}
                    {showCardPicker && (
                        <div style={{
                            background: '#f0f6ff', borderRadius: '12px',
                            padding: '10px', marginBottom: '14px',
                            border: '1px solid #c0d8f0',
                        }}>
                            <p style={{ color: '#5a7a9f', fontSize: '11px', fontWeight: '600',
                                marginBottom: '8px', textTransform: 'uppercase' }}>
                                Select a saved card
                            </p>
                            {favCards.map(card => {
                                const brand = cardBrand(card.cardNumber)
                                return (
                                    <div key={card.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        background: '#ffffff', borderRadius: '10px',
                                        padding: '10px 12px', marginBottom: '6px',
                                        border: '1px solid #e0ecff', cursor: 'pointer',
                                    }}
                                         onClick={() => {
                                             setForm(f => ({
                                                 ...f,
                                                 cardNumber: card.cardNumber,
                                                 expiry: card.expiry,
                                                 cvv: '', // always re-enter CVV for security
                                             }))
                                             setShowCardPicker(false)
                                         }}
                                    >
                                        <div style={{
                                            width: '40px', height: '26px', borderRadius: '6px',
                                            background: brand.bg, border: `1px solid ${brand.color}30`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            <p style={{ color: brand.color, fontSize: '9px', fontWeight: '800' }}>
                                                {brand.name.toUpperCase()}
                                            </p>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>
                                                {card.label}
                                            </p>
                                            <p style={{ color: '#8aaac8', fontSize: '11px' }}>
                                                {maskCard(card.cardNumber)} · Exp {card.expiry}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteFavCard(card.id) }}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                padding: '4px', color: '#dc2626', flexShrink: 0,
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Demo hint */}
                    <div style={{
                        background: '#f0f9ff', border: '1px solid #bae6fd',
                        borderRadius: '10px', padding: '10px 12px', marginBottom: '14px',
                    }}>
                        <p style={{ color: '#0369a1', fontSize: '12px' }}>
                            💡 Demo mode — use any numbers. Try: <strong>4242 4242 4242 4242</strong>
                        </p>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        {lbl('Card Number')}
                        <input style={inp('cardNumber')} placeholder='1234 5678 9012 3456'
                               value={form.cardNumber}
                               onChange={e => setForm(f => ({...f, cardNumber: formatCard(e.target.value)}))} />
                        {errMsg('cardNumber')}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                        <div style={{ flex: 1 }}>
                            {lbl('Expiry Date')}
                            <input style={inp('expiry')} placeholder='MM/YY' value={form.expiry}
                                   onChange={e => setForm(f => ({...f, expiry: formatExpiry(e.target.value)}))} />
                            {errMsg('expiry')}
                        </div>
                        <div style={{ flex: 1 }}>
                            {lbl('CVV')}
                            <input style={inp('cvv')} placeholder='123' maxLength={4} value={form.cvv}
                                   onChange={e => setForm(f => ({...f, cvv: e.target.value.replace(/\D/g,'').slice(0,4)}))} />
                            {errMsg('cvv')}
                        </div>
                    </div>

                    {/* Save card toggle */}
                    <div style={{
                        background: '#f0f6ff', borderRadius: '10px',
                        padding: '10px 12px', border: '1px solid #c0d8f0',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                                onClick={() => setSaveCard(!saveCard)}
                                style={{
                                    width: '20px', height: '20px', borderRadius: '6px',
                                    background: saveCard ? '#1e6fd9' : '#ffffff',
                                    border: `2px solid ${saveCard ? '#1e6fd9' : '#c0d8f0'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', flexShrink: 0,
                                }}
                            >
                                {saveCard && <Check size={12} color='#ffffff' />}
                            </button>
                            <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '600' }}>
                                Save card for future payments
                            </p>
                            <Star size={13} color={saveCard ? '#f59e0b' : '#8aaac8'}
                                  fill={saveCard ? '#f59e0b' : 'none'} />
                        </div>
                        <p style={{ color: '#8aaac8', fontSize: '10px', marginTop: '4px', marginLeft: '30px' }}>
                            CVV is never saved for your security
                        </p>
                        {saveCard && (
                            <div style={{ marginTop: '10px' }}>
                                {lbl('Card label (e.g. "My Maybank", "Work Card")')}
                                <input
                                    style={{...inp(''), border: '1.5px solid #c0d8f0'}}
                                    placeholder='Give this card a name...'
                                    value={cardLabel}
                                    onChange={e => setCardLabel(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Summary */}
                <div style={{
                    background: '#ffffff', borderRadius: '16px', padding: '16px',
                    marginBottom: '16px', border: '1px solid #e0ecff',
                    boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                        🧾 Price Summary
                    </p>
                    {[
                        isGuide
                            ? { label: `Guide fee (${bookingData?.days}d × RM ${guide.price})`, value: price }
                            : isHotel
                                ? { label: `Room (${nights} night${nights > 1 ? 's' : ''} × ${pricePerUnit})`, value: price }
                                : { label: `Flight (${passengerCount} pax × ${pricePerUnit})`, value: price },
                        ...(addonsTotal > 0 ? [{ label: '✈️ Flight Add-ons', value: `MYR ${addonsTotal}` }] : []),
                        { label: 'Taxes & fees', value: isGuide ? 'RM 20' : 'MYR 45' },
                        { label: 'Service fee',   value: 'MYR 10' },
                    ].map((row, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <p style={{ color: '#5a7a9f', fontSize: '13px' }}>{row.label}</p>
                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '600' }}>{row.value}</p>
                        </div>
                    ))}
                    <div style={{ height: '1px', background: '#e0ecff', margin: '10px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ color: '#0a1628', fontSize: '15px', fontWeight: '700' }}>Total</p>
                        <p style={{ color: '#1e6fd9', fontSize: '16px', fontWeight: '800' }}>{totalPrice}</p>
                    </div>
                </div>
            </div>

            {/* Pay Button */}
            <div style={{
                background: '#ffffff', borderTop: '1px solid #e0ecff',
                padding: '16px', flexShrink: 0, boxShadow: '0 -4px 16px #1e6fd910',
            }}>
                <button onClick={handlePay} style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    border: 'none', borderRadius: '14px', padding: '16px',
                    color: '#ffffff', fontSize: '16px', fontWeight: '800',
                    cursor: 'pointer', boxShadow: '0 6px 20px #1e6fd940',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                    <Lock size={16} /> Pay {totalPrice} Securely
                </button>
                <p style={{ color: '#8aaac8', fontSize: '11px', textAlign: 'center', marginTop: '8px' }}>
                    🔒 This is a demo — no real payment will be charged
                </p>
            </div>
        </div>
    )
}

export default PaymentScreen