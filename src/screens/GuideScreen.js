import React, { useState } from 'react'
import { Search, MapPin, Globe, Star, ChevronRight, X, Check, Filter } from 'lucide-react'

// ── Mock guide data ───────────────────────────────────────────────────────
const GUIDES = [
    {
        id: 1, name: 'Somchai', emoji: '🧑‍🍳', specialty: 'Food Tour Specialist',
        languages: ['Thai', 'Chinese', 'English'], city: 'Bangkok', country: 'Thailand',
        rating: 4.9, reviews: 128, price: 40, currency: 'USD',
        tags: ['Food', 'Night Markets', 'Street Food'],
        about: 'Born and raised in Bangkok, I know every hidden gem and street food stall. Let me take you on the ultimate Thai food adventure!',
        available: true,
    },
    {
        id: 2, name: 'Yuki', emoji: '👩‍🦱', specialty: 'Temple & Culture Expert',
        languages: ['Japanese', 'English'], city: 'Kyoto', country: 'Japan',
        rating: 4.8, reviews: 95, price: 55, currency: 'USD',
        tags: ['Temples', 'Culture', 'History'],
        about: 'Former museum curator with 10 years guiding experience in Kyoto. I bring history to life with storytelling and insider knowledge.',
        available: true,
    },
    {
        id: 3, name: 'Made', emoji: '🧑‍🦱', specialty: 'Adventure & Nature Guide',
        languages: ['Indonesian', 'English', 'Dutch'], city: 'Bali', country: 'Indonesia',
        rating: 4.7, reviews: 72, price: 35, currency: 'USD',
        tags: ['Adventure', 'Nature', 'Hiking'],
        about: 'Certified adventure guide and Bali native. From rice terraces to volcano hikes — I make every experience safe and unforgettable.',
        available: true,
    },
    {
        id: 4, name: 'Priya', emoji: '👩', specialty: 'Photography Tours',
        languages: ['Hindi', 'English', 'French'], city: 'Jaipur', country: 'India',
        rating: 4.9, reviews: 156, price: 30, currency: 'USD',
        tags: ['Photography', 'Architecture', 'Culture'],
        about: 'Professional photographer and travel guide. I take you to the most photogenic spots at the best times of day for stunning shots.',
        available: false,
    },
    {
        id: 5, name: 'Ahmad', emoji: '🧔', specialty: 'Desert & Heritage Guide',
        languages: ['Arabic', 'English'], city: 'Dubai', country: 'UAE',
        rating: 4.8, reviews: 203, price: 80, currency: 'USD',
        tags: ['Desert', 'Heritage', 'Luxury'],
        about: 'Emirati local with deep knowledge of Bedouin culture, desert safaris and the hidden historical gems of Dubai beyond the skyscrapers.',
        available: true,
    },
    {
        id: 6, name: 'Sofia', emoji: '👩‍🦰', specialty: 'Art & Architecture',
        languages: ['French', 'English', 'Italian'], city: 'Paris', country: 'France',
        rating: 4.9, reviews: 311, price: 70, currency: 'USD',
        tags: ['Art', 'Architecture', 'Museums'],
        about: 'Art history graduate from the Sorbonne. Skip the queues and get exclusive insights at the Louvre, Musée d\'Orsay and more.',
        available: true,
    },
    {
        id: 7, name: 'Min-jun', emoji: '🧑', specialty: 'K-Culture & Food',
        languages: ['Korean', 'English', 'Chinese'], city: 'Seoul', country: 'South Korea',
        rating: 4.7, reviews: 88, price: 45, currency: 'USD',
        tags: ['K-Pop', 'Food', 'Shopping'],
        about: 'Seoul native and K-culture enthusiast. Discover the best BBQ spots, hidden cafes, Hongdae nightlife and K-pop filming locations.',
        available: true,
    },
    {
        id: 8, name: 'Amirah', emoji: '👩‍🦳', specialty: 'Heritage & Food Guide',
        languages: ['Malay', 'English', 'Mandarin'], city: 'Kuala Lumpur', country: 'Malaysia',
        rating: 4.8, reviews: 142, price: 25, currency: 'USD',
        tags: ['Food', 'Heritage', 'Culture'],
        about: 'KL-born and proud! I\'ll show you the real Malaysia — from Petronas Towers to hidden kopitiam gems and Batu Caves sunrise trips.',
        available: true,
    },
]

const ALL_CITIES = [...new Set(GUIDES.map(g => g.city))]
const ALL_TAGS  = [...new Set(GUIDES.flatMap(g => g.tags))]

// ── Main Screen ───────────────────────────────────────────────────────────
const GuideScreen = () => {
    const [search, setSearch]         = useState('')
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedTag, setSelectedTag]   = useState(null)
    const [selectedGuide, setSelectedGuide] = useState(null)
    const [booked, setBooked]         = useState(null)
    const [showFilter, setShowFilter] = useState(false)

    const filtered = GUIDES.filter(g => {
        const q = search.toLowerCase()
        const matchSearch = !q || g.name.toLowerCase().includes(q)
            || g.city.toLowerCase().includes(q)
            || g.country.toLowerCase().includes(q)
            || g.specialty.toLowerCase().includes(q)
            || g.languages.some(l => l.toLowerCase().includes(q))
        const matchCity = !selectedCity || g.city === selectedCity
        const matchTag  = !selectedTag  || g.tags.includes(selectedTag)
        return matchSearch && matchCity && matchTag
    })

    if (selectedGuide) {
        return (
            <GuideDetail
                guide={selectedGuide}
                booked={booked?.id === selectedGuide.id}
                onBack={() => setSelectedGuide(null)}
                onBook={() => setBooked(selectedGuide)}
            />
        )
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* ── Header ── */}
            <div style={{ flexShrink: 0 }}>
                <div style={{
                    position: 'relative', height: '130px', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)',
                }}>
                    {[
                        { top: '-30px', right: '-30px', size: '160px', opacity: 0.08 },
                        { bottom: '-40px', left: '30%',  size: '120px', opacity: 0.06 },
                        { top: '10px',  left: '-20px',  size: '80px',  opacity: 0.05 },
                    ].map((c, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: c.top, right: c.right,
                            bottom: c.bottom, left: c.left,
                            width: c.size, height: c.size, borderRadius: '50%',
                            background: `rgba(255,255,255,${c.opacity})`,
                        }} />
                    ))}
                    <div style={{
                        position: 'absolute', inset: 0,
                        padding: '20px 20px 16px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    }}>
                        <p style={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '11px',
                            fontWeight: '600', textTransform: 'uppercase',
                            letterSpacing: '1.5px', marginBottom: '4px',
                        }}>✈️ VoyageAI</p>
                        <h1 style={{
                            color: '#ffffff', fontSize: '26px', fontWeight: '900',
                            margin: 0, lineHeight: 1.1,
                        }}>Local Guides</h1>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', marginTop: '3px' }}>
                            Hire expert guides for your destination
                        </p>
                    </div>
                </div>

                {/* Search + Filter */}
                <div style={{
                    background: '#ffffff', borderBottom: '1px solid #e0ecff',
                    padding: '12px 16px', boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: showFilter ? '12px' : 0 }}>
                        <div style={{
                            flex: 1, background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                            borderRadius: '12px', padding: '10px 14px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <Search size={15} color='#8aaac8' />
                            <input
                                value={search} onChange={e => setSearch(e.target.value)}
                                placeholder='Search guides, city, language...'
                                style={{
                                    flex: 1, background: 'transparent', border: 'none',
                                    outline: 'none', fontSize: '13px', color: '#0a1628',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            />
                            {search && (
                                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={14} color='#8aaac8' />
                                </button>
                            )}
                        </div>
                        <button onClick={() => setShowFilter(!showFilter)} style={{
                            background: (selectedCity || selectedTag) ? '#059669' : '#f0f6ff',
                            border: `1.5px solid ${(selectedCity || selectedTag) ? '#059669' : '#c0d8f0'}`,
                            borderRadius: '12px', padding: '0 14px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '5px',
                        }}>
                            <Filter size={15} color={(selectedCity || selectedTag) ? '#ffffff' : '#5a7a9f'} />
                            <span style={{
                                color: (selectedCity || selectedTag) ? '#ffffff' : '#5a7a9f',
                                fontSize: '12px', fontWeight: '600',
                            }}>Filter</span>
                        </button>
                    </div>

                    {/* Filter panel */}
                    {showFilter && (
                        <div>
                            <p style={{ color: '#8aaac8', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>City</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                {ALL_CITIES.map(city => (
                                    <button key={city} onClick={() => setSelectedCity(selectedCity === city ? null : city)} style={{
                                        background: selectedCity === city ? '#059669' : '#f0f6ff',
                                        border: `1px solid ${selectedCity === city ? '#059669' : '#c0d8f0'}`,
                                        borderRadius: '20px', padding: '4px 12px', cursor: 'pointer',
                                        color: selectedCity === city ? '#ffffff' : '#5a7a9f',
                                        fontSize: '12px', fontWeight: '600',
                                    }}>{city}</button>
                                ))}
                            </div>
                            <p style={{ color: '#8aaac8', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>Speciality</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {ALL_TAGS.map(tag => (
                                    <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)} style={{
                                        background: selectedTag === tag ? '#0ea5e9' : '#f0f6ff',
                                        border: `1px solid ${selectedTag === tag ? '#0ea5e9' : '#c0d8f0'}`,
                                        borderRadius: '20px', padding: '4px 12px', cursor: 'pointer',
                                        color: selectedTag === tag ? '#ffffff' : '#5a7a9f',
                                        fontSize: '12px', fontWeight: '600',
                                    }}>{tag}</button>
                                ))}
                            </div>
                            {(selectedCity || selectedTag) && (
                                <button onClick={() => { setSelectedCity(null); setSelectedTag(null) }} style={{
                                    marginTop: '10px', background: 'none', border: 'none',
                                    color: '#dc2626', fontSize: '12px', cursor: 'pointer', padding: 0,
                                }}>
                                    × Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Guide List ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700' }}>No guides found</p>
                        <p style={{ color: '#8aaac8', fontSize: '13px' }}>Try a different city or keyword</p>
                    </div>
                ) : (
                    <>
                        <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>
                            {filtered.length} guide{filtered.length !== 1 ? 's' : ''} available
                        </p>
                        {filtered.map(guide => (
                            <GuideCard
                                key={guide.id}
                                guide={guide}
                                isBooked={booked?.id === guide.id}
                                onPress={() => setSelectedGuide(guide)}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

// ── Guide Card ────────────────────────────────────────────────────────────
const GuideCard = ({ guide, isBooked, onPress }) => (
    <div onClick={onPress} style={{
        background: '#ffffff', borderRadius: '18px',
        marginBottom: '14px', overflow: 'hidden',
        boxShadow: '0 4px 16px #1e6fd912',
        border: `1.5px solid ${isBooked ? '#059669' : '#e0ecff'}`,
        cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    }}
         onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px #1e6fd920' }}
         onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px #1e6fd912' }}
    >
        <div style={{ padding: '16px 16px 12px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                {/* Avatar */}
                <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: '#f0f6ff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '28px', flexShrink: 0,
                    border: '2px solid #e0ecff',
                }}>
                    {guide.emoji}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '800' }}>{guide.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            <Star size={13} color='#f59e0b' fill='#f59e0b' />
                            <span style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>{guide.rating}</span>
                            <span style={{ color: '#8aaac8', fontSize: '12px' }}>({guide.reviews})</span>
                        </div>
                    </div>
                    <p style={{ color: '#059669', fontSize: '13px', fontWeight: '600', marginTop: '1px' }}>
                        {guide.specialty}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px' }}>
                        <Globe size={11} color='#8aaac8' />
                        <p style={{ color: '#5a7a9f', fontSize: '12px' }}>{guide.languages.join(' · ')}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                        <MapPin size={11} color='#8aaac8' />
                        <p style={{ color: '#5a7a9f', fontSize: '12px' }}>{guide.city}, {guide.country}</p>
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                {guide.tags.map(t => (
                    <span key={t} style={{
                        background: '#f0f6ff', borderRadius: '8px', padding: '3px 10px',
                        color: '#1e6fd9', fontSize: '11px', fontWeight: '600',
                    }}>{t}</span>
                ))}
                {!guide.available && (
                    <span style={{
                        background: '#fef2f2', borderRadius: '8px', padding: '3px 10px',
                        color: '#dc2626', fontSize: '11px', fontWeight: '600',
                    }}>Unavailable</span>
                )}
            </div>
        </div>

        {/* Price + CTA */}
        <div style={{
            borderTop: '1px solid #f0f6ff', padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#fafcff',
        }}>
            <div>
                <span style={{ color: '#0a1628', fontSize: '18px', fontWeight: '900' }}>
                    ${guide.price}
                </span>
                <span style={{ color: '#8aaac8', fontSize: '12px' }}>/day</span>
            </div>
            {isBooked ? (
                <div style={{
                    background: '#059669', borderRadius: '12px', padding: '8px 16px',
                    display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                    <Check size={13} color='#ffffff' />
                    <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>Booked!</span>
                </div>
            ) : (
                <div style={{
                    background: guide.available
                        ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                        : '#e5e7eb',
                    borderRadius: '12px', padding: '8px 18px',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    boxShadow: guide.available ? '0 4px 12px #05966930' : 'none',
                }}>
                    <span style={{
                        color: guide.available ? '#ffffff' : '#9ca3af',
                        fontSize: '13px', fontWeight: '700',
                    }}>
                        {guide.available ? 'Book guide' : 'Unavailable'}
                    </span>
                    {guide.available && <ChevronRight size={13} color='#ffffff' />}
                </div>
            )}
        </div>
    </div>
)

// ── Guide Detail ──────────────────────────────────────────────────────────
const GuideDetail = ({ guide, booked, onBack, onBook }) => {
    const [showConfirm, setShowConfirm] = useState(false)
    const [days, setDays] = useState(1)

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* Header */}
            <div style={{
                position: 'relative', height: '140px', overflow: 'hidden', flexShrink: 0,
                background: 'linear-gradient(135deg, #059669, #0ea5e9)',
            }}>
                <button onClick={onBack} style={{
                    position: 'absolute', top: '14px', left: '14px',
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                    border: '1.5px solid rgba(255,255,255,0.35)',
                    borderRadius: '10px', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                    <span style={{ color: '#ffffff', fontSize: '18px' }}>←</span>
                </button>

                <div style={{
                    position: 'absolute', bottom: '16px', left: '20px', right: '20px',
                    display: 'flex', alignItems: 'flex-end', gap: '14px',
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                        border: '2px solid rgba(255,255,255,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px', flexShrink: 0,
                    }}>
                        {guide.emoji}
                    </div>
                    <div>
                        <h1 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '900', margin: 0 }}>{guide.name}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>{guide.specialty}</p>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {/* Stats row */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    {[
                        { icon: '⭐', label: `${guide.rating} Rating` },
                        { icon: '💬', label: `${guide.reviews} Reviews` },
                        { icon: '📍', label: guide.city },
                    ].map((s, i) => (
                        <div key={i} style={{
                            flex: 1, background: '#ffffff', borderRadius: '12px',
                            padding: '10px 8px', textAlign: 'center',
                            border: '1px solid #e0ecff', boxShadow: '0 2px 8px #1e6fd910',
                        }}>
                            <p style={{ fontSize: '18px', marginBottom: '2px' }}>{s.icon}</p>
                            <p style={{ color: '#0a1628', fontSize: '11px', fontWeight: '700' }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* About */}
                <div style={{
                    background: '#ffffff', borderRadius: '16px', padding: '16px',
                    marginBottom: '14px', border: '1px solid #e0ecff',
                    boxShadow: '0 2px 10px #1e6fd910',
                }}>
                    <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>About</p>
                    <p style={{ color: '#5a7a9f', fontSize: '13px', lineHeight: '1.6' }}>{guide.about}</p>
                </div>

                {/* Languages + Tags */}
                <div style={{
                    background: '#ffffff', borderRadius: '16px', padding: '16px',
                    marginBottom: '14px', border: '1px solid #e0ecff',
                    boxShadow: '0 2px 10px #1e6fd910',
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                            🌐 Languages
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {guide.languages.map(l => (
                                <span key={l} style={{
                                    background: '#f0f6ff', borderRadius: '8px', padding: '4px 12px',
                                    color: '#1e6fd9', fontSize: '12px', fontWeight: '600',
                                }}>{l}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                            🎯 Specialities
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {guide.tags.map(t => (
                                <span key={t} style={{
                                    background: '#f0fdf4', borderRadius: '8px', padding: '4px 12px',
                                    color: '#059669', fontSize: '12px', fontWeight: '600',
                                }}>{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking */}
                {!booked && guide.available && (
                    <div style={{
                        background: '#ffffff', borderRadius: '16px', padding: '16px',
                        marginBottom: '14px', border: '1px solid #e0ecff',
                        boxShadow: '0 2px 10px #1e6fd910',
                    }}>
                        <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                            📅 How many days?
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                            <button onClick={() => setDays(d => Math.max(1, d - 1))} style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                                cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#1e6fd9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>−</button>
                            <span style={{ color: '#0a1628', fontSize: '20px', fontWeight: '900', minWidth: '30px', textAlign: 'center' }}>
                                {days}
                            </span>
                            <button onClick={() => setDays(d => d + 1)} style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: '#059669', border: 'none',
                                cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#ffffff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 10px #05966930',
                            }}>+</button>
                            <span style={{ color: '#5a7a9f', fontSize: '13px' }}>
                                day{days > 1 ? 's' : ''} × ${guide.price}/day
                            </span>
                        </div>
                        <div style={{
                            background: '#f0fdf4', borderRadius: '10px', padding: '10px 14px',
                            border: '1px solid #a7f3d0',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#059669', fontSize: '13px', fontWeight: '600' }}>Total</span>
                                <span style={{ color: '#059669', fontSize: '16px', fontWeight: '900' }}>
                                    ${guide.price * days}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {booked && (
                    <div style={{
                        background: '#f0fdf4', border: '1.5px solid #059669',
                        borderRadius: '14px', padding: '16px', marginBottom: '14px',
                        display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Check size={20} color='#ffffff' />
                        </div>
                        <div>
                            <p style={{ color: '#059669', fontSize: '14px', fontWeight: '800' }}>Guide Booked!</p>
                            <p style={{ color: '#5a7a9f', fontSize: '12px' }}>
                                {guide.name} will meet you in {guide.city}. Check your email for details.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Book button */}
            {!booked && guide.available && (
                <div style={{
                    background: '#ffffff', borderTop: '1px solid #e0ecff',
                    padding: '16px', flexShrink: 0, boxShadow: '0 -4px 16px #1e6fd910',
                }}>
                    <button onClick={onBook} style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                        border: 'none', borderRadius: '14px', padding: '16px',
                        color: '#ffffff', fontSize: '16px', fontWeight: '800',
                        cursor: 'pointer', boxShadow: '0 6px 20px #05966940',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        Book {guide.name} · ${guide.price * days}
                    </button>
                    <p style={{ color: '#8aaac8', fontSize: '11px', textAlign: 'center', marginTop: '8px' }}>
                        🔒 Demo mode — no real booking will be made
                    </p>
                </div>
            )}
        </div>
    )
}

export default GuideScreen