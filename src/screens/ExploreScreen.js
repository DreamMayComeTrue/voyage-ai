import React, { useState } from 'react'
import { Search, MapPin, Clock, Star, ChevronRight, X, Navigation } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────
const DESTINATIONS = [
    {
        id: 1, name: '3 Days in Kyoto', city: 'Kyoto', country: 'Japan', flag: '🇯🇵',
        category: 'Culture', days: 3, rating: 4.9, reviews: 2341,
        img: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80',
        tags: ['Temples', 'Cherry Blossom', 'Traditional'],
        desc: 'Explore ancient temples, bamboo forests and traditional tea houses in Japan\'s cultural heart.',
        highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo', 'Gion District', 'Kinkaku-ji'],
        bestTime: 'Mar–May, Oct–Nov',
    },
    {
        id: 2, name: 'Bangkok Food Tour', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭',
        category: 'Food', days: 1, rating: 4.8, reviews: 1876,
        img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80',
        tags: ['Street Food', 'Night Market', 'Local'],
        desc: 'Dive into Bangkok\'s vibrant street food scene from dawn markets to midnight noodle stalls.',
        highlights: ['Or Tor Kor Market', 'Yaowarat Chinatown', 'Chatuchak Weekend Market', 'Thonglor Food Street'],
        bestTime: 'Nov–Feb',
    },
    {
        id: 3, name: 'Bali Rice Terraces', city: 'Ubud', country: 'Indonesia', flag: '🇮🇩',
        category: 'Adventure', days: 4, rating: 4.7, reviews: 3102,
        img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
        tags: ['Nature', 'Hiking', 'Wellness'],
        desc: 'Trek through stunning emerald rice terraces, sacred temples and mystical waterfalls.',
        highlights: ['Tegallalang Rice Terraces', 'Mount Batur Sunrise', 'Tirta Empul Temple', 'Sekumpul Waterfall'],
        bestTime: 'Apr–Oct',
    },
    {
        id: 4, name: 'Seoul City Break', city: 'Seoul', country: 'South Korea', flag: '🇰🇷',
        category: 'Culture', days: 5, rating: 4.8, reviews: 1654,
        img: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&q=80',
        tags: ['K-Pop', 'Shopping', 'History'],
        desc: 'Where ancient palaces meet futuristic skyscrapers, world-class food and K-culture.',
        highlights: ['Gyeongbokgung Palace', 'Myeongdong Shopping', 'Bukchon Hanok Village', 'Han River Park'],
        bestTime: 'Sep–Nov, Mar–May',
    },
    {
        id: 5, name: 'Singapore in 3 Days', city: 'Singapore', country: 'Singapore', flag: '🇸🇬',
        category: 'Food', days: 3, rating: 4.9, reviews: 2087,
        img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80',
        tags: ['Gardens', 'Hawker Food', 'Luxury'],
        desc: 'A perfectly clean, safe and delicious city-state — the ideal first Asia trip.',
        highlights: ['Gardens by the Bay', 'Hawker Centres', 'Marina Bay Sands', 'Sentosa Island'],
        bestTime: 'Feb–Apr',
    },
    {
        id: 6, name: 'Maldives Escape', city: 'Malé Atoll', country: 'Maldives', flag: '🇲🇻',
        category: 'Beaches', days: 7, rating: 5.0, reviews: 987,
        img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
        tags: ['Beach', 'Luxury', 'Snorkelling'],
        desc: 'Crystal lagoons, overwater bungalows and the world\'s most pristine coral reefs.',
        highlights: ['Overwater Villas', 'Snorkelling Reefs', 'Sunset Dolphin Cruise', 'Sandbank Picnic'],
        bestTime: 'Nov–Apr',
    },
    {
        id: 7, name: 'Dubai Wonders', city: 'Dubai', country: 'UAE', flag: '🇦🇪',
        category: 'Adventure', days: 4, rating: 4.7, reviews: 2215,
        img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
        tags: ['Luxury', 'Desert', 'Architecture'],
        desc: 'The world\'s most audacious city — impossible architecture, golden desert and luxury redefined.',
        highlights: ['Burj Khalifa', 'Desert Safari', 'Old Dubai Souks', 'Palm Jumeirah'],
        bestTime: 'Oct–Apr',
    },
    {
        id: 8, name: 'Paris Romance', city: 'Paris', country: 'France', flag: '🇫🇷',
        category: 'Culture', days: 5, rating: 4.8, reviews: 4521,
        img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
        tags: ['Art', 'Romance', 'Food'],
        desc: 'The city of light, love and croissants — art, architecture and café culture at its finest.',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River Cruise'],
        bestTime: 'Apr–Jun, Sep–Oct',
    },
    {
        id: 9, name: 'Langkawi Beaches', city: 'Langkawi', country: 'Malaysia', flag: '🇲🇾',
        category: 'Beaches', days: 3, rating: 4.6, reviews: 1432,
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        tags: ['Beach', 'Duty-Free', 'Mangroves'],
        desc: 'Malaysia\'s island paradise with duty-free shopping, mangrove cruises and pristine beaches.',
        highlights: ['Cenang Beach', 'Sky Bridge', 'Mangrove Tour', 'Sunset Cruise'],
        bestTime: 'Nov–Apr',
    },
    {
        id: 10, name: 'Ho Chi Minh City', city: 'Ho Chi Minh', country: 'Vietnam', flag: '🇻🇳',
        category: 'Food', days: 3, rating: 4.7, reviews: 1876,
        img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80',
        tags: ['Street Food', 'History', 'Coffee'],
        desc: 'A city of endless energy — phenomenal street food, French colonial history and egg coffee.',
        highlights: ['Ben Thanh Market', 'War Remnants Museum', 'Cu Chi Tunnels', 'Banh Mi Everywhere'],
        bestTime: 'Dec–Apr',
    },
]

const NEARBY_RESTAURANTS = [
    {
        id: 1, name: 'Yaowarat Noodle House', cuisine: 'Thai', rating: 4.8, price: '$$',
        distance: '—', open: true, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80',
        tags: ['Noodles', 'Authentic', 'Local Fave'],
    },
    {
        id: 2, name: 'Sakura Ramen', cuisine: 'Japanese', rating: 4.6, price: '$$',
        distance: '—', open: true, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80',
        tags: ['Ramen', 'Cozy', 'Late Night'],
    },
    {
        id: 3, name: 'Spice Garden', cuisine: 'Indian', rating: 4.7, price: '$$$',
        distance: '—', open: false, img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80',
        tags: ['Curry', 'Vegetarian', 'Fine Dining'],
    },
    {
        id: 4, name: 'Le Petit Café', cuisine: 'French', rating: 4.5, price: '$$$',
        distance: '—', open: true, img: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=300&q=80',
        tags: ['Coffee', 'Pastry', 'Brunch'],
    },
    {
        id: 5, name: 'Hawker Brothers', cuisine: 'Malaysian', rating: 4.9, price: '$',
        distance: '—', open: true, img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&q=80',
        tags: ['Nasi Lemak', 'Cheap Eats', 'Local'],
    },
    {
        id: 6, name: 'Seoul Kitchen', cuisine: 'Korean', rating: 4.7, price: '$$',
        distance: '—', open: true, img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&q=80',
        tags: ['BBQ', 'Hotpot', 'Trendy'],
    },
]

const CATEGORIES = ['All', 'Beaches', 'Culture', 'Food', 'Adventure']

// ── Main Screen ───────────────────────────────────────────────────────────
const ExploreScreen = ({ setActiveScreen, setChatPrompt }) => {
    const [search, setSearch]         = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [selectedDest, setSelectedDest]     = useState(null)
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)

    const filtered = DESTINATIONS.filter(d => {
        const q = search.toLowerCase()
        const matchSearch = !q || d.name.toLowerCase().includes(q)
            || d.city.toLowerCase().includes(q)
            || d.country.toLowerCase().includes(q)
            || d.tags.some(t => t.toLowerCase().includes(q))
        const matchCat = activeCategory === 'All' || d.category === activeCategory
        return matchSearch && matchCat
    })

    if (selectedDest) {
        return (
            <DestinationDetail
                dest={selectedDest}
                onBack={() => setSelectedDest(null)}
                onPlanWithAI={() => {
                    if (setChatPrompt) setChatPrompt(`Plan a ${selectedDest.days}-day trip to ${selectedDest.city}`)
                    setActiveScreen('chat')
                }}
            />
        )
    }

    if (selectedRestaurant) {
        return (
            <RestaurantDetail
                restaurant={selectedRestaurant}
                onBack={() => setSelectedRestaurant(null)}
            />
        )
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* Header — same style as MyTrips/Guide */}
            <div style={{ flexShrink: 0 }}>
                <div style={{
                    position: 'relative', height: '130px', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
                }}>
                    {[
                        { top: '-30px', right: '-30px', size: '160px', opacity: 0.08 },
                        { bottom: '-40px', left: '30%', size: '120px', opacity: 0.06 },
                        { top: '10px', left: '-20px', size: '80px', opacity: 0.05 },
                    ].map((c, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: c.top, right: c.right,
                            bottom: c.bottom, left: c.left,
                            width: c.size, height: c.size, borderRadius: '50%',
                            background: `rgba(255,255,255,${c.opacity})`,
                        }} />
                    ))}
                    {/* Same layout as other pages — label at top, title below */}
                    <div style={{
                        position: 'absolute', inset: 0, padding: '20px 20px 16px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    }}>
                        <p style={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600',
                            textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px',
                        }}>VoyageAI</p>
                        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: '900', margin: 0, lineHeight: 1.1 }}>
                            Explore
                        </h1>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', padding: '3px 10px',
                                color: '#fff', fontSize: '11px', fontWeight: '600',
                            }}>
                                {DESTINATIONS.length} destinations
                            </span>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', padding: '3px 10px',
                                color: '#fff', fontSize: '11px', fontWeight: '600',
                            }}>
                                {NEARBY_RESTAURANTS.length} nearby eats
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: '#ffffff', borderBottom: '1px solid #e0ecff',
                    padding: '12px 16px', boxShadow: '0 2px 12px #1e6fd910',
                }}>
                    {/* Search */}
                    <div style={{
                        background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                        borderRadius: '12px', padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
                    }}>
                        <Search size={15} color='#8aaac8' />
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder='Search destinations...'
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

                    {/* Category pills */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                                flexShrink: 0,
                                background: activeCategory === cat ? '#1e6fd9' : '#f0f6ff',
                                border: activeCategory === cat ? 'none' : '1.5px solid #c0d8f0',
                                borderRadius: '20px', padding: '6px 16px', cursor: 'pointer',
                                color: activeCategory === cat ? '#fff' : '#5a7a9f',
                                fontSize: '13px', fontWeight: '700',
                                boxShadow: activeCategory === cat ? '0 4px 10px #1e6fd930' : 'none',
                                transition: 'all 0.15s ease',
                            }}>{cat}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

                {/* Quick Plan banner */}
                {!search && activeCategory === 'All' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                        borderRadius: '18px', padding: '16px 18px', marginBottom: '20px',
                        boxShadow: '0 6px 20px #1e6fd930',
                        display: 'flex', alignItems: 'center', gap: '14px',
                    }}>
                        <span style={{ fontSize: '32px' }}>✨</span>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#fff', fontSize: '15px', fontWeight: '800', marginBottom: '2px' }}>
                                Not sure where to go?
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                                Let AI suggest the perfect trip for you
                            </p>
                        </div>
                        <button onClick={() => {
                            if (setChatPrompt) setChatPrompt('Suggest me a travel destination based on my interests')
                            setActiveScreen('chat')
                        }} style={{
                            background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
                            border: '1.5px solid rgba(255,255,255,0.4)',
                            borderRadius: '12px', padding: '8px 14px',
                            color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                            flexShrink: 0,
                        }}>Ask AI</button>
                    </div>
                )}

                {/* Suggested Outfits by Country */}
                {!search && activeCategory === 'All' && (
                    <div style={{ marginBottom: '22px' }}>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>
                            👗 What to Wear
                        </p>
                        <p style={{ color: '#8aaac8', fontSize: '12px', marginBottom: '12px' }}>
                            Suggested outfits for your next destination
                        </p>
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                            {[
                                {
                                    country: 'Japan', flag: '🇯🇵',
                                    weather: '15–22°C · Spring',
                                    outfit: ['Light jacket or cardigan', 'Comfortable walking shoes', 'Layers — temp varies', 'Modest clothing for temples'],
                                    color: '#fef9c3', accent: '#a16207', icon: '🧥',
                                },
                                {
                                    country: 'Thailand', flag: '🇹🇭',
                                    weather: '28–35°C · Hot & humid',
                                    outfit: ['Light cotton or linen', 'Loose trousers for temples', 'Sandals + backup sneakers', 'Sun hat + sunscreen'],
                                    color: '#fef3c7', accent: '#d97706', icon: '👒',
                                },
                                {
                                    country: 'UAE', flag: '🇦🇪',
                                    weather: '25–38°C · Dry heat',
                                    outfit: ['Cover shoulders & knees in public', 'Breathable modest clothing', 'Closed shoes for malls', 'Light scarf for mosques'],
                                    color: '#fdf2f8', accent: '#9d174d', icon: '🧣',
                                },
                                {
                                    country: 'France', flag: '🇫🇷',
                                    weather: '12–20°C · Mild',
                                    outfit: ['Smart casual — no gym wear', 'Comfortable walking shoes', 'Light trench coat', 'One formal outfit for dining'],
                                    color: '#eff6ff', accent: '#1d4ed8', icon: '🧤',
                                },
                                {
                                    country: 'Indonesia', flag: '🇮🇩',
                                    weather: '26–32°C · Tropical',
                                    outfit: ['Sarong for temple visits', 'Light breathable fabrics', 'Flip flops + sneakers', 'Rain jacket for showers'],
                                    color: '#f0fdf4', accent: '#166534', icon: '🩴',
                                },
                                {
                                    country: 'Korea', flag: '🇰🇷',
                                    weather: '10–18°C · Mild spring',
                                    outfit: ['Trendy casual — Koreans dress up', 'Layered look', 'Comfortable sneakers', 'Light jacket for evenings'],
                                    color: '#fdf4ff', accent: '#7c3aed', icon: '👟',
                                },
                            ].map((o, i) => (
                                <div key={i} style={{
                                    flexShrink: 0, width: '190px',
                                    background: o.color, borderRadius: '16px',
                                    padding: '14px 14px',
                                    border: `1px solid ${o.accent}20`,
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '20px' }}>{o.flag}</span>
                                        <p style={{ color: o.accent, fontSize: '13px', fontWeight: '800' }}>{o.country}</p>
                                        <span style={{ fontSize: '16px', marginLeft: 'auto' }}>{o.icon}</span>
                                    </div>
                                    <p style={{
                                        color: o.accent, fontSize: '10px', fontWeight: '600',
                                        background: `${o.accent}15`, borderRadius: '6px',
                                        padding: '3px 7px', marginBottom: '10px', display: 'inline-block',
                                    }}>
                                        🌡️ {o.weather}
                                    </p>
                                    {o.outfit.map((item, j) => (
                                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', marginBottom: '5px' }}>
                                            <span style={{ color: o.accent, fontSize: '10px', marginTop: '1px', flexShrink: 0 }}>✓</span>
                                            <p style={{ color: '#374151', fontSize: '11px', lineHeight: '1.4' }}>{item}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trending Destinations */}
                <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '800', marginBottom: '14px' }}>
                    🔥 Trending Destinations
                    {filtered.length < DESTINATIONS.length && (
                        <span style={{ color: '#8aaac8', fontSize: '13px', fontWeight: '500', marginLeft: '8px' }}>
                            ({filtered.length} results)
                        </span>
                    )}
                </p>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
                        <p style={{ color: '#0a1628', fontSize: '15px', fontWeight: '700' }}>No results found</p>
                        <p style={{ color: '#8aaac8', fontSize: '13px' }}>Try a different search or category</p>
                    </div>
                ) : (
                    filtered.map(dest => (
                        <DestCard key={dest.id} dest={dest} onPress={() => setSelectedDest(dest)} />
                    ))
                )}

                {/* Nearby Restaurants */}
                <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '800' }}>
                            🍜 Nearby Restaurants
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Navigation size={12} color='#1e6fd9' />
                            <span style={{ color: '#1e6fd9', fontSize: '11px', fontWeight: '600' }}>Near you</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {NEARBY_RESTAURANTS.map(r => (
                            <RestaurantCard key={r.id} restaurant={r} onPress={() => setSelectedRestaurant(r)} />
                        ))}
                    </div>
                </div>

                {/* Plan with AI footer CTA */}
                <div style={{
                    background: '#ffffff', borderRadius: '18px', padding: '18px',
                    marginTop: '20px', marginBottom: '8px',
                    border: '1.5px dashed #c0d8f0',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '28px', marginBottom: '8px' }}>🗺️</p>
                    <p style={{ color: '#0a1628', fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>
                        Ready to plan?
                    </p>
                    <p style={{ color: '#8aaac8', fontSize: '13px', marginBottom: '14px' }}>
                        Tell our AI where you want to go and it will build your perfect itinerary
                    </p>
                    <button onClick={() => setActiveScreen('chat')} style={{
                        background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                        border: 'none', borderRadius: '12px', padding: '12px 28px',
                        color: '#fff', fontSize: '14px', fontWeight: '700',
                        cursor: 'pointer', boxShadow: '0 4px 14px #1e6fd930',
                    }}>
                        ✨ Start Planning
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Destination Card ──────────────────────────────────────────────────────
const DestCard = ({ dest, onPress }) => (
    <div onClick={onPress} style={{
        borderRadius: '20px', overflow: 'hidden', marginBottom: '16px',
        cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        transition: 'transform 0.15s ease',
        position: 'relative', height: '200px',
    }}
         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <img src={dest.img} alt={dest.name}
             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
             onError={e => { e.target.style.display='none'; e.target.parentNode.style.background='linear-gradient(135deg,#1e6fd9,#4a9fe8)' }}
        />
        {/* Gradient overlay */}
        <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.05) 55%)',
        }} />

        {/* Category badge */}
        <div style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
            borderRadius: '20px', padding: '4px 10px',
        }}>
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>
                {{Culture:'🏛️', Food:'🍜', Beaches:'🏖️', Adventure:'🧗'}[dest.category]} {dest.category}
            </span>
        </div>

        {/* Content */}
        <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
            <p style={{ color: '#fff', fontSize: '18px', fontWeight: '900', lineHeight: 1.2, marginBottom: '6px' }}>
                {dest.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Star size={11} color='#f59e0b' fill='#f59e0b' />
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>{dest.rating}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} color='rgba(255,255,255,0.8)' />
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>{dest.days} day{dest.days > 1 ? 's' : ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={11} color='rgba(255,255,255,0.8)' />
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>{dest.city}</span>
                </div>
            </div>
        </div>
    </div>
)

// ── Restaurant Card (horizontal scroll) ──────────────────────────────────
const RestaurantCard = ({ restaurant: r, onPress }) => (
    <div onClick={onPress} style={{
        flexShrink: 0, width: '180px', background: '#ffffff',
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
        border: '1px solid #e0ecff', cursor: 'pointer',
        transition: 'transform 0.15s ease',
    }}
         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{ position: 'relative', height: '100px' }}>
            <img src={r.img} alt={r.name}
                 style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                 onError={e => { e.target.style.display='none'; e.target.parentNode.style.background='#f0f6ff' }}
            />
            <div style={{
                position: 'absolute', top: '8px', right: '8px',
                background: r.open ? '#059669' : '#dc2626',
                borderRadius: '6px', padding: '2px 7px',
            }}>
                <span style={{ color: '#fff', fontSize: '9px', fontWeight: '700' }}>
                    {r.open ? 'OPEN' : 'CLOSED'}
                </span>
            </div>
        </div>
        <div style={{ padding: '10px 12px' }}>
            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '800', marginBottom: '2px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.name}
            </p>
            <p style={{ color: '#5a7a9f', fontSize: '11px', marginBottom: '6px' }}>
                {r.cuisine} · {r.price}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Star size={10} color='#f59e0b' fill='#f59e0b' />
                    <span style={{ color: '#0a1628', fontSize: '11px', fontWeight: '700' }}>{r.rating}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={10} color='#8aaac8' />
                    <span style={{ color: '#8aaac8', fontSize: '11px' }}>{r.distance}</span>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                {r.tags.slice(0, 2).map(t => (
                    <span key={t} style={{
                        background: '#f0f6ff', borderRadius: '5px', padding: '2px 6px',
                        color: '#1e6fd9', fontSize: '9px', fontWeight: '600',
                    }}>{t}</span>
                ))}
            </div>
        </div>
    </div>
)

// ── Restaurant Detail ─────────────────────────────────────────────────────
const MOCK_MENU = {
    'Thai':     [{ item: 'Pad Thai', price: 'RM 12', desc: 'Classic stir-fried noodles' }, { item: 'Tom Yum Soup', price: 'RM 15', desc: 'Spicy lemongrass broth' }, { item: 'Green Curry', price: 'RM 18', desc: 'Creamy coconut curry' }],
    'Japanese': [{ item: 'Tonkotsu Ramen', price: 'RM 22', desc: 'Rich pork bone broth' }, { item: 'Gyoza', price: 'RM 10', desc: 'Pan-fried dumplings' }, { item: 'Karaage', price: 'RM 16', desc: 'Japanese fried chicken' }],
    'Indian':   [{ item: 'Butter Chicken', price: 'RM 25', desc: 'Creamy tomato sauce' }, { item: 'Garlic Naan', price: 'RM 5', desc: 'Freshly baked bread' }, { item: 'Mango Lassi', price: 'RM 8', desc: 'Chilled yoghurt drink' }],
    'French':   [{ item: 'Croissant', price: 'RM 8', desc: 'Buttery flaky pastry' }, { item: 'French Onion Soup', price: 'RM 20', desc: 'Classic with gruyère' }, { item: 'Café au Lait', price: 'RM 10', desc: 'Smooth morning coffee' }],
    'Malaysian':[{ item: 'Nasi Lemak', price: 'RM 8', desc: 'Coconut rice with sambal' }, { item: 'Char Kway Teow', price: 'RM 10', desc: 'Wok-fried flat noodles' }, { item: 'Teh Tarik', price: 'RM 3', desc: 'Pulled milk tea' }],
    'Korean':   [{ item: 'Beef BBQ Set', price: 'RM 45', desc: 'Premium marinated beef' }, { item: 'Kimchi Jjigae', price: 'RM 18', desc: 'Spicy kimchi stew' }, { item: 'Bingsu', price: 'RM 15', desc: 'Shaved ice dessert' }],
}

const RestaurantDetail = ({ restaurant: r, onBack }) => {
    const menu = MOCK_MENU[r.cuisine] || MOCK_MENU['Malaysian']
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* Hero */}
            <div style={{ position: 'relative', height: '180px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={r.img} alt={r.name}
                     style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                     onError={e => { e.target.style.display='none'; e.target.parentNode.style.background='linear-gradient(135deg,#1e6fd9,#4a9fe8)' }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.1) 60%)',
                }} />
                <button onClick={onBack} style={{
                    position: 'absolute', top: '14px', left: '14px',
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                    border: '1.5px solid rgba(255,255,255,0.35)',
                    borderRadius: '10px', width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                    <span style={{ color: '#fff', fontSize: '18px' }}>←</span>
                </button>
                <div style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: r.open ? '#059669' : '#dc2626',
                    borderRadius: '10px', padding: '5px 12px',
                }}>
                    <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>
                        {r.open ? '🟢 Open Now' : '🔴 Closed'}
                    </span>
                </div>
                <div style={{ position: 'absolute', bottom: '14px', left: '16px' }}>
                    <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '900', margin: 0 }}>{r.name}</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginTop: '2px' }}>
                        {r.cuisine} · {r.price} · {r.distance} away
                    </p>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {/* Stats */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    {[
                        { icon: '⭐', val: r.rating, label: 'Rating' },
                        { icon: '📍', val: '—', label: 'Distance' },
                        { icon: '💰', val: r.price, label: 'Price' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            flex: 1, background: '#fff', borderRadius: '12px', padding: '12px 8px',
                            textAlign: 'center', border: '1px solid #e0ecff', boxShadow: '0 2px 8px #1e6fd910',
                        }}>
                            <p style={{ fontSize: '18px', marginBottom: '2px' }}>{s.icon}</p>
                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '800' }}>{s.val}</p>
                            <p style={{ color: '#8aaac8', fontSize: '10px' }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {r.tags.map(t => (
                        <span key={t} style={{
                            background: '#f0f6ff', borderRadius: '8px', padding: '5px 12px',
                            color: '#1e6fd9', fontSize: '12px', fontWeight: '600',
                        }}>{t}</span>
                    ))}
                </div>

                {/* Menu highlights */}
                <div style={{
                    background: '#fff', borderRadius: '16px', padding: '16px',
                    marginBottom: '14px', border: '1px solid #e0ecff',
                    boxShadow: '0 2px 10px #1e6fd910',
                }}>
                    <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                        🍽️ Popular Dishes
                    </p>
                    {menu.map((m, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 0',
                            borderBottom: i < menu.length - 1 ? '1px solid #f0f6ff' : 'none',
                        }}>
                            <div>
                                <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>{m.item}</p>
                                <p style={{ color: '#8aaac8', fontSize: '11px', marginTop: '1px' }}>{m.desc}</p>
                            </div>
                            <span style={{
                                color: '#059669', fontSize: '13px', fontWeight: '800',
                                background: '#f0fdf4', borderRadius: '8px', padding: '3px 10px',
                                flexShrink: 0, marginLeft: '8px',
                            }}>{m.price}</span>
                        </div>
                    ))}
                </div>

                {/* Location info */}
                <div style={{
                    background: '#fff', borderRadius: '16px', padding: '16px',
                    border: '1px solid #e0ecff', boxShadow: '0 2px 10px #1e6fd910',
                    display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: '#f0f6ff', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                    }}>
                        <MapPin size={18} color='#1e6fd9' />
                    </div>
                    <div>
                        <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>Location</p>
                        <p style={{ color: '#5a7a9f', fontSize: '12px' }}>Near your destination · {r.cuisine} cuisine</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Destination Detail ────────────────────────────────────────────────────
const DestinationDetail = ({ dest, onBack, onPlanWithAI }) => (
    <div style={{
        display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 70px)', background: '#f0f6ff',
    }}>
        {/* Hero image */}
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={dest.img} alt={dest.name}
                 style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                 onError={e => { e.target.style.display='none'; e.target.parentNode.style.background='linear-gradient(135deg,#1e6fd9,#4a9fe8)' }}
            />
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.15) 60%)',
            }} />
            <button onClick={onBack} style={{
                position: 'absolute', top: '14px', left: '14px',
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                borderRadius: '10px', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
                <span style={{ color: '#fff', fontSize: '18px', lineHeight: 1 }}>←</span>
            </button>
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px' }}>{dest.flag}</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>{dest.city}, {dest.country}</span>
                </div>
                <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '900', margin: 0, lineHeight: 1.2 }}>
                    {dest.name}
                </h1>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                        borderRadius: '20px', padding: '4px 10px',
                        color: '#fff', fontSize: '11px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                        <Star size={10} color='#f59e0b' fill='#f59e0b' /> {dest.rating} ({dest.reviews.toLocaleString()})
                    </span>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                        borderRadius: '20px', padding: '4px 10px',
                        color: '#fff', fontSize: '11px', fontWeight: '600',
                    }}>
                        🗓️ {dest.days} days
                    </span>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                        borderRadius: '20px', padding: '4px 10px',
                        color: '#fff', fontSize: '11px', fontWeight: '600',
                    }}>
                        🕐 Best: {dest.bestTime}
                    </span>
                </div>
            </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {/* About */}
            <div style={{
                background: '#ffffff', borderRadius: '16px', padding: '16px',
                marginBottom: '14px', border: '1px solid #e0ecff',
                boxShadow: '0 2px 10px #1e6fd910',
            }}>
                <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>About</p>
                <p style={{ color: '#5a7a9f', fontSize: '13px', lineHeight: '1.6' }}>{dest.desc}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {dest.tags.map(t => (
                        <span key={t} style={{
                            background: '#f0f6ff', borderRadius: '8px', padding: '4px 12px',
                            color: '#1e6fd9', fontSize: '12px', fontWeight: '600',
                        }}>{t}</span>
                    ))}
                </div>
            </div>

            {/* Highlights */}
            <div style={{
                background: '#ffffff', borderRadius: '16px', padding: '16px',
                marginBottom: '14px', border: '1px solid #e0ecff',
                boxShadow: '0 2px 10px #1e6fd910',
            }}>
                <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                    📍 Must-See Highlights
                </p>
                {dest.highlights.map((h, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 0',
                        borderBottom: i < dest.highlights.length - 1 ? '1px solid #f0f6ff' : 'none',
                    }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '800' }}>{i + 1}</span>
                        </div>
                        <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '600' }}>{h}</p>
                        <MapPin size={13} color='#c0d8f0' style={{ marginLeft: 'auto', flexShrink: 0 }} />
                    </div>
                ))}
            </div>

            {/* Info chips */}
            <div style={{
                background: '#ffffff', borderRadius: '16px', padding: '16px',
                marginBottom: '16px', border: '1px solid #e0ecff',
                boxShadow: '0 2px 10px #1e6fd910',
                display: 'flex', gap: '10px', flexWrap: 'wrap',
            }}>
                {[
                    { icon: '🗓️', label: `${dest.days} days suggested` },
                    { icon: '🕐', label: `Best: ${dest.bestTime}` },
                    { icon: '✈️', label: `Fly to ${dest.city}` },
                ].map((item, i) => (
                    <div key={i} style={{
                        background: '#f0f6ff', borderRadius: '10px', padding: '8px 12px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                        <span style={{ fontSize: '14px' }}>{item.icon}</span>
                        <span style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600' }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Plan button */}
        <div style={{
            background: '#ffffff', borderTop: '1px solid #e0ecff',
            padding: '16px', flexShrink: 0, boxShadow: '0 -4px 16px #1e6fd910',
        }}>
            <button onClick={onPlanWithAI} style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                border: 'none', borderRadius: '14px', padding: '16px',
                color: '#fff', fontSize: '16px', fontWeight: '800',
                cursor: 'pointer', boxShadow: '0 6px 20px #1e6fd940',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
                ✨ Plan {dest.days}-Day Trip with AI
            </button>
        </div>
    </div>
)

export default ExploreScreen