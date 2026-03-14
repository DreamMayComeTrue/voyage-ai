import React, { useState } from 'react'
import { Check, X, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react'

const SECTION_COLORS = {
    Morning:    { bg: '#fef9c3', color: '#a16207' },
    Afternoon:  { bg: '#fff7ed', color: '#c2410c' },
    Evening:    { bg: '#f3e8ff', color: '#7c3aed' },
    Night:      { bg: '#eff6ff', color: '#1d4ed8' },
    Activities: { bg: '#f0f6ff', color: '#1e6fd9' },
    default:    { bg: '#f0f6ff', color: '#1e6fd9' },
}
const sc = (s) => SECTION_COLORS[s] || SECTION_COLORS.default

const ItineraryPreviewCard = ({ itinerary, onSave, onDismiss }) => {
    const [activeDay, setActiveDay] = useState(0)
    const [showAll, setShowAll] = useState(false)

    if (!itinerary?.days?.length) return null

    const day = itinerary.days[activeDay]
    const allPlaces = day?.places || []
    const PREVIEW = 3
    const visible = showAll ? allPlaces : allPlaces.slice(0, PREVIEW)
    const hasMore = allPlaces.length > PREVIEW
    const totalPlaces = itinerary.days.reduce((s, d) => s + (d.places?.length || 0), 0)

    // Group by section
    const grouped = {}
    const order = []
    for (const p of visible) {
        const k = p.section || 'Activities'
        if (!grouped[k]) { grouped[k] = []; order.push(k) }
        grouped[k].push(p)
    }

    return (
        <div style={{
            marginLeft: '36px',
            marginBottom: '8px',
            borderRadius: '20px',
            border: '1.5px solid #c0d8f0',
            boxShadow: '0 6px 24px #1e6fd920',
            background: '#ffffff',
            // NO overflow:hidden — that was clipping content
        }}>
            {/* Blue header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                borderRadius: '18px 18px 0 0',
                padding: '14px 16px',
            }}>
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '16px' }}>🗺️</span>
                        <p style={{ color: '#fff', fontSize: '15px', fontWeight: '800' }}>
                            {itinerary.title || 'Your Itinerary'}
                        </p>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>
                        {itinerary.totalDays} day{itinerary.totalDays > 1 ? 's' : ''} · {totalPlaces} places
                    </p>
                </div>

                {/* Day tabs */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {itinerary.days.map((d, i) => (
                        <button key={i} onClick={() => { setActiveDay(i); setShowAll(false) }} style={{
                            background: activeDay === i ? '#ffffff' : 'rgba(255,255,255,0.2)',
                            border: 'none', borderRadius: '20px', padding: '5px 14px',
                            cursor: 'pointer',
                            color: activeDay === i ? '#1e6fd9' : 'rgba(255,255,255,0.9)',
                            fontSize: '12px', fontWeight: '700',
                        }}>
                            Day {d.day}
                        </button>
                    ))}
                </div>
            </div>

            {/* White content area — no height restriction */}
            <div style={{ padding: '16px' }}>

                {day?.title && day.title !== `Day ${day.day}` && (
                    <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600', marginBottom: '14px' }}>
                        📅 {day.title}
                    </p>
                )}

                {/* Places list */}
                {order.length > 0 ? order.map((sectionKey, si) => {
                    const sColor = sc(sectionKey)
                    return (
                        <div key={si} style={{ marginBottom: '12px' }}>
                            {sectionKey !== 'Activities' && (
                                <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
                                    <span style={{
                                        background: sColor.bg, color: sColor.color,
                                        fontSize: '10px', fontWeight: '700',
                                        padding: '2px 10px', borderRadius: '10px',
                                        textTransform: 'uppercase',
                                    }}>
                                        {sectionKey}
                                    </span>
                                </div>
                            )}

                            {grouped[sectionKey].map((place, pi) => (
                                <div key={pi} style={{
                                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                                    marginBottom: '10px',
                                }}>
                                    {/* Dot */}
                                    <div style={{
                                        width: '26px', height: '26px', borderRadius: '50%',
                                        background: '#fff', border: '2px solid #1e6fd9',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, marginTop: '2px',
                                    }}>
                                        <MapPin size={11} color='#1e6fd9' />
                                    </div>

                                    {/* Card */}
                                    <div style={{
                                        flex: 1, background: '#f8fbff',
                                        borderRadius: '12px', padding: '10px 12px',
                                        border: '1px solid #e8f0ff',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '800', lineHeight: 1.3, flex: 1 }}>
                                                {place.name}
                                            </p>
                                            <MapPin size={12} color='#c0d8f0' style={{ flexShrink: 0, marginTop: '2px' }} />
                                        </div>

                                        {place.time && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px' }}>
                                                <Clock size={10} color='#8aaac8' />
                                                <span style={{ color: '#8aaac8', fontSize: '11px', fontWeight: '600' }}>
                                                    {place.time}
                                                </span>
                                            </div>
                                        )}

                                        {place.tip && (
                                            <div style={{
                                                background: '#e8f4ff', borderRadius: '8px',
                                                padding: '6px 10px', marginTop: '8px',
                                                display: 'flex', gap: '5px',
                                            }}>
                                                <span style={{ fontSize: '11px' }}>💡</span>
                                                <p style={{ color: '#5a7a9f', fontSize: '11px', lineHeight: 1.4 }}>
                                                    {place.tip}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }) : (
                    <p style={{ color: '#8aaac8', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
                        No activities found for this day
                    </p>
                )}

                {/* Show more/less */}
                {hasMore && (
                    <button onClick={() => setShowAll(!showAll)} style={{
                        width: '100%', background: '#f0f6ff',
                        border: '1.5px solid #c0d8f0', borderRadius: '10px',
                        padding: '9px', marginTop: '4px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        color: '#1e6fd9', fontSize: '12px', fontWeight: '700',
                    }}>
                        {showAll
                            ? <><ChevronUp size={13}/> Show less</>
                            : <><ChevronDown size={13}/> Show {allPlaces.length - PREVIEW} more places</>
                        }
                    </button>
                )}
            </div>

            {/* Save / Dismiss */}
            <div style={{
                padding: '12px 16px',
                borderTop: '1px solid #e0ecff',
                background: '#fafcff',
                borderRadius: '0 0 18px 18px',
                display: 'flex', gap: '10px',
            }}>
                <button onClick={onSave} style={{
                    flex: 1, background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                    border: 'none', borderRadius: '10px', padding: '12px',
                    color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    boxShadow: '0 4px 12px #1e6fd930',
                }}>
                    <Check size={14}/> Save to Itinerary
                </button>
                <button onClick={onDismiss} style={{
                    background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                    borderRadius: '10px', padding: '12px 16px',
                    color: '#5a7a9f', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                    <X size={14}/> Not Now
                </button>
            </div>
        </div>
    )
}

export default ItineraryPreviewCard