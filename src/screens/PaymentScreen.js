import React, { useState } from 'react'
import { ArrowLeft, CreditCard, Lock, Check, Plane } from 'lucide-react'

const PaymentScreen = ({ setActiveScreen, bookingData, onPaymentComplete }) => {
    const [step, setStep] = useState('details')
    const [form, setForm] = useState({
        name: '', email: '', cardNumber: '',
        expiry: '', cvv: '', passportNumber: '',
    })
    const [errors, setErrors] = useState({})

    const isHotel = bookingData?.type === 'hotel'
    const flight  = bookingData?.flight || {}
    const hotel   = bookingData?.hotel  || {}
    const date    = bookingData?.date   || ''
    const price   = isHotel ? hotel.price?.split('/')[0] || 'MYR 380' : flight.price || 'MYR 580'
    const itemName = isHotel ? hotel.name : `${flight.airline} ${flight.flightNumber}`

    const formatTime = (dateStr) => {
        if (!dateStr || dateStr === 'TBD') return 'TBD'
        try {
            return new Date(dateStr).toLocaleTimeString('en-MY', {
                hour: '2-digit', minute: '2-digit', hour12: true,
            })
        } catch { return dateStr }
    }

    const formatCard = (val) => val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
    const formatExpiry = (val) => {
        const d = val.replace(/\D/g,'').slice(0,4)
        return d.length >= 3 ? d.slice(0,2)+'/'+d.slice(2) : d
    }

    const validate = () => {
        const e = {}
        if (!form.name.trim())                      e.name = 'Full name required'
        if (!form.email.includes('@'))              e.email = 'Valid email required'
        if (form.cardNumber.replace(/\s/g,'').length < 16) e.cardNumber = '16-digit card number required'
        if (form.expiry.length < 5)                 e.expiry = 'MM/YY required'
        if (form.cvv.length < 3)                    e.cvv = 'CVV required'
        if (!form.passportNumber.trim())            e.passportNumber = 'Passport number required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handlePay = () => {
        if (!validate()) return
        setStep('processing')
        setTimeout(() => {
            setStep('done')
            const bookingRef = 'VA' + Math.random().toString(36).slice(2,8).toUpperCase()
            setTimeout(() => {
                onPaymentComplete({
                    ...bookingData,
                    passengerName: form.name,
                    passengerEmail: form.email,
                    passportNumber: form.passportNumber,
                    bookingRef,
                    paidAt: new Date().toISOString(),
                    price,
                })
            }, 1200)
        }, 2500)
    }

    const inp = (field) => ({
        width: '100%',
        background: '#f0f6ff',
        border: `1.5px solid ${errors[field] ? '#dc2626' : '#c0d8f0'}`,
        borderRadius: '10px',
        padding: '11px 14px',
        fontSize: '14px',
        color: '#0a1628',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
    })

    const label = (text) => (
        <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
            {text}
        </p>
    )

    const errMsg = (field) => errors[field] && (
        <p style={{ color: '#dc2626', fontSize: '11px', marginTop: '4px' }}>{errors[field]}</p>
    )

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
            <p style={{ color: '#0a1628', fontSize: '18px', fontWeight: '700' }}>
                Processing Payment...
            </p>
            <p style={{ color: '#5a7a9f', fontSize: '14px' }}>
                Please do not close this window
            </p>
            <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }`}</style>
        </div>
    )

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
            <p style={{ color: '#059669', fontSize: '22px', fontWeight: '800' }}>
                Payment Successful!
            </p>
            <p style={{ color: '#5a7a9f', fontSize: '14px' }}>
                Preparing your e-ticket...
            </p>
        </div>
    )

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
                <button onClick={() => setActiveScreen('chat')} style={{
                    background: '#f0f6ff', border: '1px solid #c0d8f0',
                    borderRadius: '10px', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                    <ArrowLeft size={18} color='#1e6fd9' />
                </button>
                <div>
                    <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700' }}>
                        Secure Payment
                    </p>
                    <p style={{ color: '#5a7a9f', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={10} /> 256-bit SSL encrypted
                    </p>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

                {/* Booking Summary Card */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    borderRadius: '18px', padding: '16px', marginBottom: '16px',
                    boxShadow: '0 8px 24px #1e6fd940',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px',
                        }}>
                            {isHotel ? '🏨' : '✈️'}
                        </div>
                        <div>
                            <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700' }}>
                                {isHotel ? hotel.name : flight.airline}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                                {isHotel ? `${hotel.address}` : `${flight.flightNumber} · ${date}`}
                            </p>
                        </div>
                        <div style={{
                            marginLeft: 'auto', background: 'rgba(255,255,255,0.2)',
                            borderRadius: '10px', padding: '6px 12px',
                        }}>
                            <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: '800' }}>
                                {price}
                            </p>
                        </div>
                    </div>
                    {isHotel ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {(hotel.amenities || []).map((a, i) => (
                                <span key={i} style={{
                                    background: 'rgba(255,255,255,0.15)', borderRadius: '6px',
                                    padding: '3px 8px', color: '#ffffff', fontSize: '11px',
                                }}>
                    {a}
                </span>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#ffffff', fontSize: '20px', fontWeight: '800', lineHeight: 1 }}>
                                    {formatTime(flight.departureTime)}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                    {flight.origin || 'KUL'}
                                </p>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.4)', position: 'relative' }}>
                                    <Plane size={14} color='#ffffff' style={{
                                        position: 'absolute', top: '-7px',
                                        left: '50%', transform: 'translateX(-50%)',
                                    }} />
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#ffffff', fontSize: '20px', fontWeight: '800', lineHeight: 1 }}>
                                    {formatTime(flight.arrivalTime)}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                                    {flight.destination || 'NRT'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Passenger Info */}
                <div style={{
                    background: '#ffffff', borderRadius: '16px', padding: '16px',
                    marginBottom: '14px', border: '1px solid #e0ecff',
                    boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>
                        👤 Passenger Details
                    </p>
                    <div style={{ marginBottom: '12px' }}>
                        {label('Full Name (as in passport)')}
                        <input
                            style={inp('name')}
                            placeholder='e.g. Ahmad bin Abdullah'
                            value={form.name}
                            onChange={e => setForm(f => ({...f, name: e.target.value}))}
                        />
                        {errMsg('name')}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        {label('Email Address')}
                        <input
                            style={inp('email')}
                            placeholder='your@email.com'
                            type='email'
                            value={form.email}
                            onChange={e => setForm(f => ({...f, email: e.target.value}))}
                        />
                        {errMsg('email')}
                    </div>
                    <div>
                        {label('Passport Number')}
                        <input
                            style={inp('passportNumber')}
                            placeholder='e.g. A12345678'
                            value={form.passportNumber}
                            onChange={e => setForm(f => ({...f, passportNumber: e.target.value.toUpperCase()}))}
                        />
                        {errMsg('passportNumber')}
                    </div>
                </div>

                {/* Payment Info */}
                <div style={{
                    background: '#ffffff', borderRadius: '16px', padding: '16px',
                    marginBottom: '14px', border: '1px solid #e0ecff',
                    boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>
                        💳 Payment Details
                    </p>

                    {/* Demo card hint */}
                    <div style={{
                        background: '#f0f9ff', border: '1px solid #bae6fd',
                        borderRadius: '10px', padding: '10px 12px', marginBottom: '14px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        <p style={{ color: '#0369a1', fontSize: '12px' }}>
                            💡 Demo mode — use any numbers. Try: <strong>4242 4242 4242 4242</strong>
                        </p>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        {label('Card Number')}
                        <input
                            style={inp('cardNumber')}
                            placeholder='1234 5678 9012 3456'
                            value={form.cardNumber}
                            onChange={e => setForm(f => ({...f, cardNumber: formatCard(e.target.value)}))}
                        />
                        {errMsg('cardNumber')}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            {label('Expiry Date')}
                            <input
                                style={inp('expiry')}
                                placeholder='MM/YY'
                                value={form.expiry}
                                onChange={e => setForm(f => ({...f, expiry: formatExpiry(e.target.value)}))}
                            />
                            {errMsg('expiry')}
                        </div>
                        <div style={{ flex: 1 }}>
                            {label('CVV')}
                            <input
                                style={inp('cvv')}
                                placeholder='123'
                                maxLength={4}
                                value={form.cvv}
                                onChange={e => setForm(f => ({...f, cvv: e.target.value.replace(/\D/g,'').slice(0,4)}))}
                            />
                            {errMsg('cvv')}
                        </div>
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
                        { label: 'Base fare', value: price },
                        { label: 'Taxes & fees', value: 'MYR 45' },
                        { label: 'Service fee', value: 'MYR 10' },
                    ].map((row, i) => (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between',
                            marginBottom: '8px',
                        }}>
                            <p style={{ color: '#5a7a9f', fontSize: '13px' }}>{row.label}</p>
                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '600' }}>{row.value}</p>
                        </div>
                    ))}
                    <div style={{ height: '1px', background: '#e0ecff', margin: '10px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ color: '#0a1628', fontSize: '15px', fontWeight: '700' }}>Total</p>
                        <p style={{ color: '#1e6fd9', fontSize: '16px', fontWeight: '800' }}>
                            {price?.replace('MYR ', '') ?
                                `MYR ${(parseInt(price.replace('MYR ','')) + 55).toLocaleString()}`
                                : price}
                        </p>
                    </div>
                </div>
            </div>

            {/* Pay Button */}
            <div style={{
                background: '#ffffff', borderTop: '1px solid #e0ecff',
                padding: '16px', flexShrink: 0,
                boxShadow: '0 -4px 16px #1e6fd910',
            }}>
                <button onClick={handlePay} style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    border: 'none', borderRadius: '14px', padding: '16px',
                    color: '#ffffff', fontSize: '16px', fontWeight: '800',
                    cursor: 'pointer', boxShadow: '0 6px 20px #1e6fd940',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                    <Lock size={16} />
                    Pay {price?.replace('MYR ', '') ?
                    `MYR ${(parseInt(price.replace('MYR ','')) + 55).toLocaleString()}`
                    : price} Securely
                </button>
                <p style={{
                    color: '#8aaac8', fontSize: '11px', textAlign: 'center', marginTop: '8px',
                }}>
                    🔒 This is a demo — no real payment will be charged
                </p>
            </div>
        </div>
    )
}

export default PaymentScreen