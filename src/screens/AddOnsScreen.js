import React, { useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Plus, Minus, ShoppingBag } from 'lucide-react'

// ── Meal options ──────────────────────────────────────────────────────────
const MEALS = [
    { id: 'standard',   label: 'Standard Meal',      desc: 'Chicken rice or pasta',         price: 0,   emoji: '🍱', tag: 'Included' },
    { id: 'vegetarian', label: 'Vegetarian Meal',     desc: 'Plant-based, no meat or fish',  price: 12,  emoji: '🥗', tag: null },
    { id: 'vegan',      label: 'Vegan Meal',          desc: 'No animal products at all',     price: 12,  emoji: '🌱', tag: null },
    { id: 'halal',      label: 'Halal Meal',          desc: 'Certified halal preparation',   price: 0,   emoji: '☪️',  tag: 'Free' },
    { id: 'kids',       label: 'Kids Meal',           desc: 'For passengers under 12',       price: 8,   emoji: '🧒', tag: null },
    { id: 'seafood',    label: 'Seafood Meal',        desc: 'Fresh fish & seafood dishes',   price: 18,  emoji: '🦐', tag: 'Popular' },
    { id: 'asian',      label: 'Asian Vegetarian',    desc: 'No onion, garlic or eggs',      price: 12,  emoji: '🍛', tag: null },
    { id: 'diabetic',   label: 'Diabetic Meal',       desc: 'Low sugar, low carb',           price: 12,  emoji: '🩺', tag: null },
    { id: 'none',       label: 'No Meal',             desc: 'Skip in-flight meal service',   price: 0,   emoji: '🚫', tag: null },
]

// ── Baggage tiers ─────────────────────────────────────────────────────────
const BAGGAGE = [
    { id: 'none',   label: 'No Checked Baggage', kg: 0,   price: 0,   desc: 'Cabin bag (7kg) only' },
    { id: '20kg',   label: '20 kg',              kg: 20,  price: 55,  desc: 'Good for a week trip' },
    { id: '25kg',   label: '25 kg',              kg: 25,  price: 70,  desc: 'Recommended for 2 weeks' },
    { id: '30kg',   label: '30 kg',              kg: 30,  price: 90,  desc: 'For long trips & shoppers' },
    { id: '40kg',   label: '40 kg',              kg: 40,  price: 120, desc: 'Heavy luggage or equipment' },
]

// ── Seat options ──────────────────────────────────────────────────────────
const SEATS = [
    { id: 'none',      label: 'No Preference',    desc: 'Assigned at check-in',              price: 0,  emoji: '🪑' },
    { id: 'window',    label: 'Window Seat',       desc: 'Great views, lean against wall',    price: 15, emoji: '🪟' },
    { id: 'aisle',     label: 'Aisle Seat',        desc: 'Easy access, stretch your legs',    price: 15, emoji: '🚶' },
    { id: 'together',  label: 'Sit Together',      desc: 'Adjacent seats for your group',     price: 20, emoji: '👨‍👩‍👧' },
    { id: 'extra',     label: 'Extra Legroom',     desc: 'Exit row, extra space',             price: 45, emoji: '↔️' },
    { id: 'front',     label: 'Front of Cabin',    desc: 'First to board & exit',             price: 25, emoji: '⬆️' },
]

// ── Extras ────────────────────────────────────────────────────────────────
const EXTRAS = [
    { id: 'priority', label: 'Priority Boarding',  desc: 'Board before general passengers', price: 20, emoji: '⚡' },
    { id: 'lounge',   label: 'Airport Lounge',     desc: '3-hour access, food & Wi-Fi included', price: 85, emoji: '🛋️' },
    { id: 'wifi',     label: 'In-flight Wi-Fi',    desc: 'Full flight internet access',     price: 30, emoji: '📶' },
    { id: 'blanket',  label: 'Comfort Kit',        desc: 'Pillow, blanket & eye mask',      price: 18, emoji: '🛏️' },
    { id: 'insurance',label: 'Travel Insurance',   desc: 'Trip cancellation & medical cover', price: 38, emoji: '🛡️' },
]

const ADDONS_KEY = 'voyageai_addons_state'
const loadAddons = () => { try { return JSON.parse(sessionStorage.getItem(ADDONS_KEY) || 'null') } catch { return null } }
const saveAddons = (s) => { try { sessionStorage.setItem(ADDONS_KEY, JSON.stringify(s)) } catch {} }

const AddOnsScreen = ({ setActiveScreen, bookingData, setBookingData, currency = 'MYR' }) => {
    const saved = loadAddons()
    const [selectedMeal,    setSelectedMeal]    = useState(saved?.meal    || 'standard')
    const [selectedBaggage, setSelectedBaggage] = useState(saved?.baggage || 'none')
    const [selectedSeat,    setSelectedSeat]    = useState(saved?.seat    || 'none')
    const [selectedExtras,  setSelectedExtras]  = useState(saved?.extras  || [])
    const [passengers,      setPassengers]      = useState(saved?.passengers || bookingData?.addons?.passengers || 1)
    const [activeSection,   setActiveSection]   = useState('meal')

    const flight = bookingData?.flight || {}

    const mealObj    = MEALS.find(m => m.id === selectedMeal)
    const baggageObj = BAGGAGE.find(b => b.id === selectedBaggage)
    const seatObj    = SEATS.find(s => s.id === selectedSeat)
    const extrasTotal = selectedExtras.reduce((sum, id) => {
        const e = EXTRAS.find(x => x.id === id)
        return sum + (e?.price || 0)
    }, 0)

    const addonsTotal = (
        (mealObj?.price || 0) * passengers +
        (baggageObj?.price || 0) * passengers +
        (seatObj?.price || 0) * passengers +
        extrasTotal
    )

    const toggleExtra = (id) => {
        const updated = selectedExtras.includes(id)
            ? selectedExtras.filter(x => x !== id)
            : [...selectedExtras, id]
        setSelectedExtras(updated)
        saveAddons({ meal: selectedMeal, baggage: selectedBaggage, seat: selectedSeat, extras: updated, passengers })
    }

    const handleSetMeal    = (v) => { setSelectedMeal(v);    saveAddons({ meal: v,             baggage: selectedBaggage, seat: selectedSeat, extras: selectedExtras, passengers }) }
    const handleSetBaggage = (v) => { setSelectedBaggage(v); saveAddons({ meal: selectedMeal,  baggage: v,              seat: selectedSeat, extras: selectedExtras, passengers }) }
    const handleSetSeat    = (v) => { setSelectedSeat(v);    saveAddons({ meal: selectedMeal,  baggage: selectedBaggage, seat: v,           extras: selectedExtras, passengers }) }
    const handleSetPass    = (v) => { setPassengers(v);      saveAddons({ meal: selectedMeal,  baggage: selectedBaggage, seat: selectedSeat, extras: selectedExtras, passengers: v }) }

    const handleContinue = () => {
        // Keep sessionStorage intact — user might go back from payment
        // It will be cleared by App.js after successful payment
        setBookingData({
            ...bookingData,
            addons: {
                meal:    mealObj,
                baggage: baggageObj,
                seat:    seatObj,
                extras:  EXTRAS.filter(e => selectedExtras.includes(e.id)),
                total:   addonsTotal,
                passengers,
            },
        })
        setActiveScreen('payment')
    }

    const SECTIONS = [
        { key: 'meal',    label: '🍱 Meal',     summary: mealObj?.emoji + ' ' + mealObj?.label },
        { key: 'baggage', label: '🧳 Baggage',  summary: baggageObj?.id === 'none' ? 'Cabin only' : baggageObj?.label },
        { key: 'seat',    label: '🪑 Seat',     summary: seatObj?.id === 'none' ? 'No pref' : seatObj?.label },
        { key: 'extras',  label: '⚡ Extras',   summary: selectedExtras.length > 0 ? `${selectedExtras.length} selected` : 'None' },
    ]

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: '100vh', background: '#f0f6ff',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                padding: '14px 16px', flexShrink: 0,
                boxShadow: '0 2px 12px #1e6fd930',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <button onClick={() => setActiveScreen('chat')} style={{
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                        border: '1.5px solid rgba(255,255,255,0.3)',
                        borderRadius: '10px', width: '34px', height: '34px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                        <ArrowLeft size={16} color='#fff' />
                    </button>
                    <div style={{ flex: 1 }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Step 1 of 2 — Customise Flight
                        </p>
                        <p style={{ color: '#fff', fontSize: '16px', fontWeight: '800' }}>
                            {flight.airline || 'Flight'} · {flight.flightNumber || ''}
                        </p>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '6px 12px',
                        textAlign: 'center',
                    }}>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: '600' }}>ADD-ONS</p>
                        <p style={{ color: '#fff', fontSize: '14px', fontWeight: '900' }}>
                            {addonsTotal > 0 ? `+MYR ${addonsTotal}` : 'Free'}
                        </p>
                    </div>
                </div>

                {/* Section tabs */}
                <div style={{ display: 'flex', gap: '6px' }}>
                    {SECTIONS.map(s => (
                        <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
                            flex: 1, background: activeSection === s.key ? '#fff' : 'rgba(255,255,255,0.15)',
                            border: 'none', borderRadius: '10px', padding: '6px 4px',
                            cursor: 'pointer', transition: 'all 0.15s ease',
                        }}>
                            <p style={{
                                color: activeSection === s.key ? '#1e6fd9' : '#fff',
                                fontSize: '10px', fontWeight: '700',
                            }}>{s.label}</p>
                            <p style={{
                                color: activeSection === s.key ? '#5a7a9f' : 'rgba(255,255,255,0.7)',
                                fontSize: '9px', marginTop: '1px',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>{s.summary}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>

                {/* Passenger count */}
                <div style={{
                    background: '#fff', borderRadius: '14px', padding: '12px 16px',
                    marginBottom: '14px', border: '1px solid #e0ecff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 2px 8px #1e6fd910',
                }}>
                    <div>
                        <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>👥 Passengers</p>
                        <p style={{ color: '#8aaac8', fontSize: '11px' }}>Add-ons priced per person</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => handleSetPass(Math.max(1, passengers - 1))} style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}><Minus size={13} color='#1e6fd9' /></button>
                        <span style={{ color: '#0a1628', fontSize: '16px', fontWeight: '900', minWidth: '20px', textAlign: 'center' }}>
                            {passengers}
                        </span>
                        <button onClick={() => handleSetPass(Math.min(9, passengers + 1))} style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: '#1e6fd9', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px #1e6fd930',
                        }}><Plus size={13} color='#fff' /></button>
                    </div>
                </div>

                {/* ── Meal section ── */}
                {activeSection === 'meal' && (
                    <div>
                        <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Choose your meal preference
                        </p>
                        {MEALS.map(meal => (
                            <OptionCard
                                key={meal.id}
                                selected={selectedMeal === meal.id}
                                onSelect={() => handleSetMeal(meal.id)}
                                emoji={meal.emoji}
                                label={meal.label}
                                desc={meal.desc}
                                price={meal.price}
                                tag={meal.tag}
                                passengers={passengers}
                            />
                        ))}
                    </div>
                )}

                {/* ── Baggage section ── */}
                {activeSection === 'baggage' && (
                    <div>
                        <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Checked baggage allowance
                        </p>
                        {/* Visual weight bar */}
                        <div style={{
                            background: '#fff', borderRadius: '14px', padding: '14px 16px',
                            marginBottom: '12px', border: '1px solid #e0ecff',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700' }}>🧳 Selected: {baggageObj?.label}</p>
                                <p style={{ color: '#1e6fd9', fontSize: '12px', fontWeight: '700' }}>{baggageObj?.kg}kg</p>
                            </div>
                            <div style={{ height: '6px', background: '#f0f6ff', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: '3px',
                                    background: 'linear-gradient(90deg, #1e6fd9, #4a9fe8)',
                                    width: `${(baggageObj?.kg / 40) * 100}%`,
                                    transition: 'width 0.3s ease',
                                }} />
                            </div>
                        </div>
                        {BAGGAGE.map(bag => (
                            <OptionCard
                                key={bag.id}
                                selected={selectedBaggage === bag.id}
                                onSelect={() => handleSetBaggage(bag.id)}
                                emoji={bag.id === 'none' ? '🎒' : '🧳'}
                                label={bag.label}
                                desc={bag.desc}
                                price={bag.price}
                                passengers={passengers}
                            />
                        ))}
                    </div>
                )}

                {/* ── Seat section ── */}
                {activeSection === 'seat' && (
                    <div>
                        <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Seat preference
                        </p>
                        {/* Seat map visual */}
                        <div style={{
                            background: '#fff', borderRadius: '14px', padding: '14px',
                            marginBottom: '12px', border: '1px solid #e0ecff',
                        }}>
                            <p style={{ color: '#8aaac8', fontSize: '11px', fontWeight: '600', textAlign: 'center', marginBottom: '10px' }}>
                                ✈️ Cabin preview
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {/* Left block A-B-C */}
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {['A','B','C'].map(col => (
                                        <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
                                            <p style={{ color: '#8aaac8', fontSize: '9px', fontWeight: '700' }}>{col}</p>
                                            {[1,2,3,4].map(row => {
                                                const isHighlighted =
                                                    (selectedSeat === 'window'   && col === 'A' && row === 2) ||
                                                    (selectedSeat === 'aisle'    && col === 'C' && row === 2) ||
                                                    (selectedSeat === 'together' && row === 2) ||
                                                    (selectedSeat === 'extra'    && row === 1) ||
                                                    (selectedSeat === 'front'    && row === 1 && col === 'B')
                                                return (
                                                    <div key={row} style={{
                                                        width: '22px', height: '26px', borderRadius: '4px 4px 2px 2px',
                                                        background: isHighlighted ? '#1e6fd9' : row === 1 ? '#e0f2fe' : '#f0f6ff',
                                                        border: `1px solid ${isHighlighted ? '#1e6fd9' : '#c0d8f0'}`,
                                                        transition: 'all 0.2s ease',
                                                    }} />
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                                {/* Aisle */}
                                <div style={{ width: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <p style={{ color: '#c0d8f0', fontSize: '8px', textAlign: 'center', marginTop: '16px' }}>│<br/>│<br/>│<br/>│</p>
                                </div>
                                {/* Right block D-E-F */}
                                {['D','E','F'].map(col => (
                                    <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
                                        <p style={{ color: '#8aaac8', fontSize: '9px', fontWeight: '700' }}>{col}</p>
                                        {[1,2,3,4].map(row => {
                                            const isHighlighted =
                                                (selectedSeat === 'window'   && col === 'F' && row === 2) ||
                                                (selectedSeat === 'aisle'    && col === 'D' && row === 2) ||
                                                (selectedSeat === 'together' && row === 2) ||
                                                (selectedSeat === 'extra'    && row === 1) ||
                                                (selectedSeat === 'front'    && row === 1 && col === 'E')
                                            return (
                                                <div key={row} style={{
                                                    width: '22px', height: '26px', borderRadius: '4px 4px 2px 2px',
                                                    background: isHighlighted ? '#1e6fd9' : row === 1 ? '#e0f2fe' : '#f0f6ff',
                                                    border: `1px solid ${isHighlighted ? '#1e6fd9' : '#c0d8f0'}`,
                                                    transition: 'all 0.2s ease',
                                                }} />
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                            {/* Legend */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#1e6fd9' }} />
                                    <span style={{ color: '#8aaac8', fontSize: '9px' }}>Selected</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#e0f2fe', border: '1px solid #c0d8f0' }} />
                                    <span style={{ color: '#8aaac8', fontSize: '9px' }}>Exit row</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f0f6ff', border: '1px solid #c0d8f0' }} />
                                    <span style={{ color: '#8aaac8', fontSize: '9px' }}>Available</span>
                                </div>
                            </div>
                        </div>
                        {SEATS.map(seat => (
                            <OptionCard
                                key={seat.id}
                                selected={selectedSeat === seat.id}
                                onSelect={() => handleSetSeat(seat.id)}
                                emoji={seat.emoji}
                                label={seat.label}
                                desc={seat.desc}
                                price={seat.price}
                                passengers={passengers}
                            />
                        ))}
                    </div>
                )}

                {/* ── Extras section ── */}
                {activeSection === 'extras' && (
                    <div>
                        <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Optional extras — select any
                        </p>
                        {EXTRAS.map(extra => (
                            <OptionCard
                                key={extra.id}
                                selected={selectedExtras.includes(extra.id)}
                                onSelect={() => toggleExtra(extra.id)}
                                emoji={extra.emoji}
                                label={extra.label}
                                desc={extra.desc}
                                price={extra.price}
                                multiSelect
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Summary + Continue button */}
            <div style={{
                background: '#fff', borderTop: '1px solid #e0ecff',
                padding: '14px 16px', flexShrink: 0,
                boxShadow: '0 -4px 16px #1e6fd910',
            }}>
                {/* Mini summary row */}
                {addonsTotal > 0 && (
                    <div style={{
                        display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px',
                    }}>
                        {selectedMeal !== 'standard' && selectedMeal !== 'none' && (
                            <SummaryPill label={`${mealObj?.emoji} ${mealObj?.label}`} price={mealObj?.price * passengers} />
                        )}
                        {selectedBaggage !== 'none' && (
                            <SummaryPill label={`🧳 ${baggageObj?.label}`} price={baggageObj?.price * passengers} />
                        )}
                        {selectedSeat !== 'none' && (
                            <SummaryPill label={`${seatObj?.emoji} ${seatObj?.label}`} price={seatObj?.price * passengers} />
                        )}
                        {selectedExtras.map(id => {
                            const e = EXTRAS.find(x => x.id === id)
                            return <SummaryPill key={id} label={`${e?.emoji} ${e?.label}`} price={e?.price} />
                        })}
                    </div>
                )}

                <button onClick={handleContinue} style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    border: 'none', borderRadius: '14px', padding: '15px',
                    color: '#fff', fontSize: '15px', fontWeight: '800',
                    cursor: 'pointer', boxShadow: '0 6px 20px #1e6fd940',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                    <ShoppingBag size={16} color='#fff' />
                    Continue to Payment
                    {addonsTotal > 0 && (
                        <span style={{
                            background: 'rgba(255,255,255,0.25)', borderRadius: '8px', padding: '2px 8px',
                            fontSize: '13px',
                        }}>+MYR {addonsTotal}</span>
                    )}
                </button>
                <p style={{ color: '#8aaac8', fontSize: '11px', textAlign: 'center', marginTop: '8px' }}>
                    Add-ons will be included in your total at checkout
                </p>
            </div>
        </div>
    )
}

// ── Option Card ───────────────────────────────────────────────────────────
const OptionCard = ({ selected, onSelect, emoji, label, desc, price, tag, passengers = 1, multiSelect }) => (
    <div onClick={onSelect} style={{
        background: selected ? '#f0f6ff' : '#fff', borderRadius: '14px', padding: '13px 14px',
        marginBottom: '8px', cursor: 'pointer',
        border: `1.5px solid ${selected ? '#1e6fd9' : '#e0ecff'}`,
        boxShadow: selected ? '0 4px 16px #1e6fd920' : '0 2px 8px #1e6fd908',
        display: 'flex', alignItems: 'center', gap: '12px',
        transition: 'all 0.15s ease',
    }}>
        <div style={{
            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
            background: selected ? '#1e6fd920' : '#f8faff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            border: `1px solid ${selected ? '#1e6fd940' : '#e0ecff'}`,
        }}>{emoji}</div>
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>{label}</p>
                {tag && (
                    <span style={{
                        background: tag === 'Included' || tag === 'Free' ? '#f0fdf4' : '#fef3c7',
                        color: tag === 'Included' || tag === 'Free' ? '#059669' : '#d97706',
                        borderRadius: '6px', padding: '1px 7px', fontSize: '10px', fontWeight: '700',
                    }}>{tag}</span>
                )}
            </div>
            <p style={{ color: '#8aaac8', fontSize: '11px', marginTop: '1px' }}>{desc}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {price > 0 ? (
                <>
                    <p style={{ color: selected ? '#1e6fd9' : '#0a1628', fontSize: '13px', fontWeight: '800' }}>
                        +MYR {price}
                    </p>
                    {passengers > 1 && !multiSelect && (
                        <p style={{ color: '#8aaac8', fontSize: '10px' }}>×{passengers} = MYR {price * passengers}</p>
                    )}
                </>
            ) : (
                <p style={{ color: '#059669', fontSize: '12px', fontWeight: '700' }}>Free</p>
            )}
            <div style={{
                width: multiSelect ? '18px' : '18px', height: '18px',
                borderRadius: multiSelect ? '4px' : '50%',
                background: selected ? '#1e6fd9' : 'transparent',
                border: `2px solid ${selected ? '#1e6fd9' : '#c0d8f0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '4px', marginLeft: 'auto',
            }}>
                {selected && <Check size={10} color='#fff' />}
            </div>
        </div>
    </div>
)

// ── Summary pill ──────────────────────────────────────────────────────────
const SummaryPill = ({ label, price }) => (
    <div style={{
        background: '#f0f6ff', borderRadius: '8px', padding: '4px 10px',
        border: '1px solid #c0d8f0',
        display: 'flex', alignItems: 'center', gap: '5px',
    }}>
        <span style={{ color: '#0a1628', fontSize: '11px', fontWeight: '600' }}>{label}</span>
        {price > 0 && <span style={{ color: '#1e6fd9', fontSize: '11px', fontWeight: '700' }}>+MYR {price}</span>}
    </div>
)

export default AddOnsScreen