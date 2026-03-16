import React, { useState } from 'react'
import { Search, MapPin, Globe, Star, ChevronRight, X, Check, Filter, ArrowLeft } from 'lucide-react'

// ── Guide data with location-appropriate photos ───────────────────────────
const GUIDES = [
    {
        id: 1, name: 'Somchai P.', specialty: 'Food Tour Specialist',
        photo: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80', // Bangkok temple
        languages: ['Thai', 'Chinese', 'English'], city: 'Bangkok', country: 'Thailand', flag: '🇹🇭',
        rating: 4.9, reviews: 128, price: 180, currency: 'RM',
        tags: ['Food', 'Night Markets', 'Street Food'], available: true,
        about: 'Born and raised in Bangkok, I know every hidden gem and street food stall. Let me take you on the ultimate Thai food adventure through Yaowarat, Or Tor Kor and beyond!',
        mockReviews: [
            { name: 'Ahmad R.', flag: '🇲🇾', rating: 5, date: 'Mar 2026', text: 'Somchai took us to places we would never have found on our own. The boat noodles at 6am were life-changing!' },
            { name: 'Jennifer L.', flag: '🇸🇬', rating: 5, date: 'Feb 2026', text: 'Best food tour ever! He speaks perfect English and knows every vendor by name. Absolutely worth every Ringgit.' },
            { name: 'Wei Ming', flag: '🇨🇳', rating: 5, date: 'Jan 2026', text: '非常专业的导游！带我们去了很多当地人才知道的地方，强烈推荐！' },
        ],
    },
    {
        id: 2, name: 'Yuki T.', specialty: 'Temple & Culture Expert',
        photo: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80', // Kyoto temple
        languages: ['Japanese', 'English'], city: 'Kyoto', country: 'Japan', flag: '🇯🇵',
        rating: 4.8, reviews: 95, price: 250, currency: 'RM',
        tags: ['Temples', 'Culture', 'History'], available: true,
        about: 'Former museum curator with 10 years guiding experience in Kyoto. I bring history to life with storytelling and insider knowledge of Japan\'s ancient capital.',
        mockReviews: [
            { name: 'Sarah K.', flag: '🇬🇧', rating: 5, date: 'Mar 2026', text: 'Yuki\'s knowledge of Shinto and Buddhist traditions is incredible. She got us into a private tea ceremony!' },
            { name: 'David C.', flag: '🇺🇸', rating: 5, date: 'Feb 2026', text: 'We saw the real Kyoto, not the tourist one. Arrived at Fushimi Inari before dawn — magical experience.' },
            { name: 'Nurul H.', flag: '🇲🇾', rating: 4, date: 'Jan 2026', text: 'Very knowledgeable and patient. She helped us find halal food options too which was very thoughtful.' },
        ],
    },
    {
        id: 3, name: 'Made S.', specialty: 'Adventure & Nature Guide',
        photo: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', // Bali rice
        languages: ['Indonesian', 'English', 'Dutch'], city: 'Bali', country: 'Indonesia', flag: '🇮🇩',
        rating: 4.7, reviews: 72, price: 150, currency: 'RM',
        tags: ['Adventure', 'Nature', 'Hiking'], available: true,
        about: 'Certified adventure guide and Bali native. From rice terraces to volcano hikes — I make every experience safe and unforgettable. Specialise in off-the-beaten-path routes.',
        mockReviews: [
            { name: 'Emma T.', flag: '🇦🇺', rating: 5, date: 'Mar 2026', text: 'The Batur sunrise hike was unbelievable! Made carried our bags, cooked breakfast at the summit. A true legend.' },
            { name: 'Lars B.', flag: '🇳🇱', rating: 5, date: 'Feb 2026', text: 'Speaks Dutch which was a lovely surprise! Took us through rice terraces most tourists never see.' },
            { name: 'Priya M.', flag: '🇮🇳', rating: 4, date: 'Jan 2026', text: 'Very professional and safety conscious. My family with kids felt completely safe throughout.' },
        ],
    },
    {
        id: 4, name: 'Priya K.', specialty: 'Photography Tours',
        photo: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80', // Jaipur palace
        languages: ['Hindi', 'English', 'French'], city: 'Jaipur', country: 'India', flag: '🇮🇳',
        rating: 4.9, reviews: 156, price: 130, currency: 'RM',
        tags: ['Photography', 'Architecture', 'Culture'], available: false,
        about: 'Professional photographer and travel guide. I take you to the most photogenic spots at the perfect times of day. Your Instagram will never look better!',
        mockReviews: [
            { name: 'Marco V.', flag: '🇮🇹', rating: 5, date: 'Feb 2026', text: 'She knew exactly when the light would be perfect at Amber Fort. Got shots I\'ve been trying to take for years.' },
            { name: 'Zoe W.', flag: '🇨🇦', rating: 5, date: 'Jan 2026', text: 'As a travel blogger, finding good photo guides is hard. Priya is the best I\'ve ever worked with.' },
            { name: 'Hassan A.', flag: '🇸🇦', rating: 5, date: 'Dec 2025', text: 'Truly talented photographer herself. Taught me so much about composition while we toured.' },
        ],
    },
    {
        id: 5, name: 'Ahmad Al-R.', specialty: 'Desert & Heritage Guide',
        photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80', // Dubai skyline
        languages: ['Arabic', 'English'], city: 'Dubai', country: 'UAE', flag: '🇦🇪',
        rating: 4.8, reviews: 203, price: 380, currency: 'RM',
        tags: ['Desert', 'Heritage', 'Luxury'], available: true,
        about: 'Emirati local with deep knowledge of Bedouin culture, desert safaris and the hidden historical gems of Dubai beyond the skyscrapers.',
        mockReviews: [
            { name: 'Robert H.', flag: '🇬🇧', rating: 5, date: 'Mar 2026', text: 'Ahmad showed us a Dubai no tour company ever shows. The old Al Fahidi district felt like stepping back in time.' },
            { name: 'Fatimah Z.', flag: '🇲🇾', rating: 5, date: 'Feb 2026', text: 'Being Muslim, Ahmad was very helpful with prayer times and halal dining. Felt very at home.' },
            { name: 'Kevin P.', flag: '🇺🇸', rating: 5, date: 'Jan 2026', text: 'The private desert camp he arranged was incredible. Stars, falconry, camel riding — truly luxury.' },
        ],
    },
    {
        id: 6, name: 'Sofia M.', specialty: 'Art & Architecture',
        photo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80', // Paris Eiffel
        languages: ['French', 'English', 'Italian'], city: 'Paris', country: 'France', flag: '🇫🇷',
        rating: 4.9, reviews: 311, price: 320, currency: 'RM',
        tags: ['Art', 'Architecture', 'Museums'], available: true,
        about: 'Art history graduate from the Sorbonne with 8 years guiding at the Louvre. Skip the queues and get exclusive insights at Paris\'s greatest museums.',
        mockReviews: [
            { name: 'Tan Wei L.', flag: '🇲🇾', rating: 5, date: 'Mar 2026', text: 'Sofia had us in the Louvre at opening time with a private route. Saw the Mona Lisa without crowds!' },
            { name: 'Isabella R.', flag: '🇧🇷', rating: 5, date: 'Feb 2026', text: 'The best investment of our Paris trip. She brought the paintings to life with amazing stories.' },
            { name: 'Tom A.', flag: '🇦🇺', rating: 4, date: 'Jan 2026', text: 'Incredibly knowledgeable. Sometimes went a bit deep into art history but that\'s why you hire an expert!' },
        ],
    },
    {
        id: 7, name: 'Min-jun K.', specialty: 'K-Culture & Food',
        photo: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80', // Seoul city
        languages: ['Korean', 'English', 'Chinese'], city: 'Seoul', country: 'South Korea', flag: '🇰🇷',
        rating: 4.7, reviews: 88, price: 200, currency: 'RM',
        tags: ['K-Pop', 'Food', 'Shopping'], available: true,
        about: 'Seoul native and K-culture enthusiast. Discover the best BBQ spots, hidden cafes, Hongdae nightlife and filming locations from your favourite K-dramas!',
        mockReviews: [
            { name: 'Rina C.', flag: '🇮🇩', rating: 5, date: 'Mar 2026', text: 'He took us to the actual filming spots of Crash Landing on You! Total K-drama fan dream come true.' },
            { name: 'Li Xiao', flag: '🇨🇳', rating: 5, date: 'Feb 2026', text: '会说中文让我们感觉非常亲切！带我们去了最地道的烤肉店，太好吃了！' },
            { name: 'Melissa T.', flag: '🇵🇭', rating: 5, date: 'Jan 2026', text: 'Min-jun made our Seoul trip unforgettable. He even helped us buy the right skincare products!' },
        ],
    },
    {
        id: 8, name: 'Amirah Y.', specialty: 'Heritage & Food Guide',
        photo: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80', // KL Petronas
        languages: ['Malay', 'English', 'Mandarin'], city: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾',
        rating: 4.8, reviews: 142, price: 120, currency: 'RM',
        tags: ['Food', 'Heritage', 'Culture'], available: true,
        about: 'KL-born and proud! I\'ll show you the real Malaysia — from Petronas Towers to hidden kopitiam gems, Batu Caves sunrise trips and Chow Kit wet market tours.',
        mockReviews: [
            { name: 'James W.', flag: '🇬🇧', rating: 5, date: 'Mar 2026', text: 'Amirah knew every kopitiam owner by name! We ate things we would never have dared try alone.' },
            { name: 'Siti N.', flag: '🇸🇬', rating: 5, date: 'Feb 2026', text: 'Even as a Singaporean I learned so much about Malaysian history and culture. Highly recommended!' },
            { name: 'Chen Fang', flag: '🇨🇳', rating: 5, date: 'Jan 2026', text: '她的普通话很好，非常亲切热情！带我们去了很多本地美食，赞！' },
        ],
    },
]

const ALL_CITIES = [...new Set(GUIDES.map(g => g.city))]
const ALL_TAGS   = [...new Set(GUIDES.flatMap(g => g.tags))]

// ── Main Screen ───────────────────────────────────────────────────────────
const GuideScreen = ({ setActiveScreen, setBookingData, bookedGuides = [], onGuideBooked }) => {
    const [search, setSearch]             = useState('')
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedTag, setSelectedTag]   = useState(null)
    const [selectedGuide, setSelectedGuide] = useState(null)
    const [showFilter, setShowFilter]     = useState(false)

    const filtered = GUIDES.filter(g => {
        const q = search.toLowerCase()
        const matchSearch = !q
            || g.name.toLowerCase().includes(q)
            || g.city.toLowerCase().includes(q)
            || g.country.toLowerCase().includes(q)
            || g.specialty.toLowerCase().includes(q)
            || g.languages.some(l => l.toLowerCase().includes(q))
        const matchCity = !selectedCity || g.city === selectedCity
        const matchTag  = !selectedTag  || g.tags.includes(selectedTag)
        return matchSearch && matchCity && matchTag
    })

    // Split into booked and unbooked
    const bookedIds  = bookedGuides.map(b => b.guideId)
    const booked     = filtered.filter(g => bookedIds.includes(g.id))
    const unbooked   = filtered.filter(g => !bookedIds.includes(g.id))

    if (selectedGuide) {
        return (
            <GuideDetail
                guide={selectedGuide}
                isBooked={bookedIds.includes(selectedGuide.id)}
                bookedInfo={bookedGuides.find(b => b.guideId === selectedGuide.id)}
                onBack={() => setSelectedGuide(null)}
                onBook={(days) => {
                    if (setBookingData) {
                        setBookingData({
                            type: 'guide',
                            guide: selectedGuide,
                            days,
                            price: `RM ${selectedGuide.price}`,
                            totalPrice: `RM ${selectedGuide.price * days}`,
                            city: selectedGuide.city,
                            date: new Date().toISOString().split('T')[0],
                        })
                    }
                    setActiveScreen('payment')
                }}
            />
        )
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* Header */}
            <div style={{ flexShrink: 0 }}>
                <div style={{
                    position: 'relative', height: '130px', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)',
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
                    <div style={{
                        position: 'absolute', inset: 0, padding: '20px 20px 16px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    }}>
                        <p style={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600',
                            textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px',
                        }}>VoyageAI</p>
                        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: '900', margin: 0, lineHeight: 1.1 }}>
                            Local Guides
                        </h1>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', padding: '3px 10px',
                                color: '#fff', fontSize: '11px', fontWeight: '600',
                            }}>
                                {GUIDES.length} guides available
                            </span>
                            {booked.length > 0 && (
                                <span style={{
                                    background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
                                    borderRadius: '20px', padding: '3px 10px',
                                    color: '#fff', fontSize: '11px', fontWeight: '600',
                                }}>
                                    ✅ {booked.length} booked
                                </span>
                            )}
                        </div>
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
                            <Filter size={15} color={(selectedCity || selectedTag) ? '#fff' : '#5a7a9f'} />
                            <span style={{
                                color: (selectedCity || selectedTag) ? '#fff' : '#5a7a9f',
                                fontSize: '12px', fontWeight: '600',
                            }}>Filter</span>
                        </button>
                    </div>
                    {showFilter && (
                        <div>
                            <p style={{ color: '#8aaac8', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>City</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                {ALL_CITIES.map(city => (
                                    <button key={city} onClick={() => setSelectedCity(selectedCity === city ? null : city)} style={{
                                        background: selectedCity === city ? '#059669' : '#f0f6ff',
                                        border: `1px solid ${selectedCity === city ? '#059669' : '#c0d8f0'}`,
                                        borderRadius: '20px', padding: '4px 12px', cursor: 'pointer',
                                        color: selectedCity === city ? '#fff' : '#5a7a9f',
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
                                        color: selectedTag === tag ? '#fff' : '#5a7a9f',
                                        fontSize: '12px', fontWeight: '600',
                                    }}>{tag}</button>
                                ))}
                            </div>
                            {(selectedCity || selectedTag) && (
                                <button onClick={() => { setSelectedCity(null); setSelectedTag(null) }} style={{
                                    marginTop: '10px', background: 'none', border: 'none',
                                    color: '#dc2626', fontSize: '12px', cursor: 'pointer', padding: 0,
                                }}>× Clear all filters</button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Guide List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700' }}>No guides found</p>
                        <p style={{ color: '#8aaac8', fontSize: '13px' }}>Try a different city or keyword</p>
                    </div>
                ) : (
                    <>
                        {/* Booked guides pinned at top */}
                        {booked.length > 0 && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                                    <p style={{ color: '#059669', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Your Booked Guides
                                    </p>
                                </div>
                                {booked.map(g => (
                                    <GuideCard key={g.id} guide={g}
                                               bookedInfo={bookedGuides.find(b => b.guideId === g.id)}
                                               onPress={() => setSelectedGuide(g)} />
                                ))}
                                {/* Divider */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    margin: '16px 0',
                                }}>
                                    <div style={{ flex: 1, height: '1px', background: '#e0ecff' }} />
                                    <span style={{ color: '#8aaac8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Other Guides
                                    </span>
                                    <div style={{ flex: 1, height: '1px', background: '#e0ecff' }} />
                                </div>
                            </>
                        )}

                        {unbooked.length === 0 && booked.length > 0 ? null : (
                            <>
                                {!booked.length && (
                                    <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>
                                        {filtered.length} guide{filtered.length !== 1 ? 's' : ''} available
                                    </p>
                                )}
                                {unbooked.map(g => (
                                    <GuideCard key={g.id} guide={g}
                                               onPress={() => setSelectedGuide(g)} />
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

// ── Guide Card ─────────────────────────────────────────────────────────────
const GuideCard = ({ guide, bookedInfo, onPress }) => {
    const isBooked = !!bookedInfo
    return (
        <div onClick={onPress} style={{
            background: '#ffffff', borderRadius: '18px', marginBottom: '14px',
            overflow: 'hidden', cursor: 'pointer',
            boxShadow: isBooked ? '0 4px 20px #05966920' : '0 4px 16px #1e6fd912',
            border: `1.5px solid ${isBooked ? '#059669' : '#e0ecff'}`,
            transition: 'transform 0.15s ease',
        }}
             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{ padding: '14px 16px 12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {/* Photo */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img src={guide.photo} alt={guide.name}
                             style={{
                                 width: '56px', height: '56px', borderRadius: '16px',
                                 objectFit: 'cover', display: 'block',
                                 border: `2px solid ${isBooked ? '#059669' : '#e0ecff'}`,
                             }}
                             onError={e => {
                                 e.target.style.display = 'none'
                                 e.target.parentNode.style.background = '#f0f6ff'
                                 e.target.parentNode.style.display = 'flex'
                                 e.target.parentNode.style.alignItems = 'center'
                                 e.target.parentNode.style.justifyContent = 'center'
                                 e.target.parentNode.style.fontSize = '24px'
                                 e.target.parentNode.innerHTML = '🧑'
                             }}
                        />
                        {/* Flag */}
                        <span style={{
                            position: 'absolute', bottom: '-4px', right: '-4px',
                            fontSize: '14px', lineHeight: 1,
                        }}>{guide.flag}</span>
                        {isBooked && (
                            <div style={{
                                position: 'absolute', top: '-4px', right: '-4px',
                                width: '18px', height: '18px', borderRadius: '50%',
                                background: '#059669', border: '2px solid #ffffff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Check size={10} color='#ffffff' />
                            </div>
                        )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <p style={{ color: '#0a1628', fontSize: '15px', fontWeight: '800' }}>{guide.name}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                                <Star size={12} color='#f59e0b' fill='#f59e0b' />
                                <span style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700' }}>{guide.rating}</span>
                                <span style={{ color: '#8aaac8', fontSize: '11px' }}>({guide.reviews})</span>
                            </div>
                        </div>
                        <p style={{ color: '#059669', fontSize: '12px', fontWeight: '600', marginTop: '1px' }}>{guide.specialty}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                            <Globe size={10} color='#8aaac8' />
                            <p style={{ color: '#5a7a9f', fontSize: '11px' }}>{guide.languages.join(' · ')}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={10} color='#8aaac8' />
                            <p style={{ color: '#5a7a9f', fontSize: '11px' }}>{guide.city}, {guide.country}</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {guide.tags.map(t => (
                        <span key={t} style={{
                            background: '#f0f6ff', borderRadius: '7px', padding: '3px 9px',
                            color: '#1e6fd9', fontSize: '11px', fontWeight: '600',
                        }}>{t}</span>
                    ))}
                    {!guide.available && !isBooked && (
                        <span style={{
                            background: '#fef2f2', borderRadius: '7px', padding: '3px 9px',
                            color: '#dc2626', fontSize: '11px', fontWeight: '600',
                        }}>Unavailable</span>
                    )}
                </div>
            </div>

            <div style={{
                borderTop: `1px solid ${isBooked ? '#d1fae5' : '#f0f6ff'}`,
                padding: '10px 16px',
                background: isBooked ? '#f0fdf4' : '#fafcff',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div>
                    <span style={{ color: '#0a1628', fontSize: '17px', fontWeight: '900' }}>RM {guide.price}</span>
                    <span style={{ color: '#8aaac8', fontSize: '11px' }}>/day</span>
                </div>
                {isBooked ? (
                    <div style={{
                        background: '#059669', borderRadius: '10px', padding: '6px 14px',
                        display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                        <Check size={12} color='#fff' />
                        <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>
                            Booked · {bookedInfo?.days}d
                        </span>
                    </div>
                ) : (
                    <div style={{
                        background: guide.available ? 'linear-gradient(135deg, #059669, #0ea5e9)' : '#e5e7eb',
                        borderRadius: '10px', padding: '6px 16px',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        boxShadow: guide.available ? '0 4px 10px #05966930' : 'none',
                    }}>
                        <span style={{ color: guide.available ? '#fff' : '#9ca3af', fontSize: '12px', fontWeight: '700' }}>
                            {guide.available ? 'Book guide' : 'Unavailable'}
                        </span>
                        {guide.available && <ChevronRight size={12} color='#fff' />}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Guide Detail ──────────────────────────────────────────────────────────
const GuideDetail = ({ guide, isBooked, bookedInfo, onBack, onBook }) => {
    const [days, setDays]           = useState(bookedInfo?.days || 1)
    const [activeTab, setActiveTab] = useState('about')
    const REVIEWS_KEY = `voyageai_reviews_${guide.id}`
    const SUBMITTED_KEY = `voyageai_reviewed_${guide.id}`

    const [userReviews, setUserReviews] = useState(() => {
        try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]') } catch { return [] }
    })
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [reviewRating, setReviewRating]     = useState(5)
    const [reviewHover, setReviewHover]       = useState(0)
    const [reviewText, setReviewText]         = useState('')
    const [reviewSubmitted, setReviewSubmitted] = useState(() => {
        try { return localStorage.getItem(SUBMITTED_KEY) === 'true' } catch { return false }
    })

    const allReviews = [...userReviews, ...guide.mockReviews]

    const submitReview = () => {
        if (!reviewText.trim()) return
        const newReview = {
            name: 'You',
            flag: '⭐',
            rating: reviewRating,
            date: new Date().toLocaleDateString('en-MY', { month: 'short', year: 'numeric' }),
            text: reviewText.trim(),
            isOwn: true,
        }
        const updated = [newReview, ...userReviews]
        setUserReviews(updated)
        try {
            localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated))
            localStorage.setItem(SUBMITTED_KEY, 'true')
        } catch {}
        setReviewSubmitted(true)
        setShowReviewForm(false)
        setReviewText('')
        setActiveTab('reviews')
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
        }}>
            {/* Header image */}
            <div style={{ position: 'relative', height: '160px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={guide.photo} alt={guide.name}
                     style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                     onError={e => { e.target.style.display='none'; e.target.parentNode.style.background='linear-gradient(135deg,#059669,#0ea5e9)' }}
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
                    <ArrowLeft size={16} color='#ffffff' />
                </button>
                {isBooked && (
                    <div style={{
                        position: 'absolute', top: '14px', right: '14px',
                        background: '#059669', borderRadius: '10px', padding: '5px 12px',
                        display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                        <Check size={12} color='#fff' />
                        <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>Booked</span>
                    </div>
                )}
                <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
                    <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '900', margin: 0 }}>{guide.name}</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', marginTop: '2px' }}>{guide.specialty}</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                            borderRadius: '20px', padding: '3px 10px',
                            color: '#fff', fontSize: '11px', fontWeight: '600',
                            display: 'flex', alignItems: 'center', gap: '3px',
                        }}>
                            <Star size={10} color='#f59e0b' fill='#f59e0b' />
                            {guide.rating} ({guide.reviews + userReviews.length})
                        </span>
                        <span style={{
                            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                            borderRadius: '20px', padding: '3px 10px',
                            color: '#fff', fontSize: '11px', fontWeight: '600',
                        }}>
                            {guide.flag} {guide.city}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                background: '#ffffff', borderBottom: '1px solid #e0ecff',
                display: 'flex', padding: '0 16px', flexShrink: 0,
            }}>
                {['about', 'reviews'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        flex: 1, background: 'none', border: 'none',
                        borderBottom: `2.5px solid ${activeTab === tab ? '#059669' : 'transparent'}`,
                        padding: '12px 0', cursor: 'pointer',
                        color: activeTab === tab ? '#059669' : '#8aaac8',
                        fontSize: '13px', fontWeight: '700',
                        transition: 'all 0.15s ease',
                    }}>
                        {tab === 'reviews' ? `Reviews (${allReviews.length})` : 'About'}
                    </button>
                ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {activeTab === 'about' ? (
                    <>
                        {/* Stats — clicking 💬 Reviews navigates to reviews tab */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                            {[
                                { icon: '⭐', label: `${guide.rating}`, sub: 'Rating', tab: null },
                                { icon: '💬', label: `${allReviews.length}`, sub: 'Reviews', tab: 'reviews' },
                                { icon: '💰', label: `RM ${guide.price}`, sub: 'Per day', tab: null },
                            ].map((s, i) => (
                                <div key={i}
                                     onClick={() => s.tab && setActiveTab(s.tab)}
                                     style={{
                                         flex: 1, background: '#ffffff', borderRadius: '12px',
                                         padding: '12px 8px', textAlign: 'center',
                                         border: `1px solid ${s.tab ? '#c0d8f0' : '#e0ecff'}`,
                                         boxShadow: '0 2px 8px #1e6fd910',
                                         cursor: s.tab ? 'pointer' : 'default',
                                         transition: 'all 0.15s ease',
                                     }}
                                     onMouseEnter={e => { if (s.tab) e.currentTarget.style.borderColor = '#059669' }}
                                     onMouseLeave={e => { if (s.tab) e.currentTarget.style.borderColor = '#c0d8f0' }}
                                >
                                    <p style={{ fontSize: '18px', marginBottom: '2px' }}>{s.icon}</p>
                                    <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '800' }}>{s.label}</p>
                                    <p style={{ color: s.tab ? '#059669' : '#8aaac8', fontSize: '10px', fontWeight: s.tab ? '700' : '400' }}>
                                        {s.sub} {s.tab ? '→' : ''}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* About */}
                        <div style={{
                            background: '#ffffff', borderRadius: '16px', padding: '16px',
                            marginBottom: '14px', border: '1px solid #e0ecff',
                        }}>
                            <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>About</p>
                            <p style={{ color: '#5a7a9f', fontSize: '13px', lineHeight: '1.6' }}>{guide.about}</p>
                        </div>

                        {/* Languages + Tags */}
                        <div style={{
                            background: '#ffffff', borderRadius: '16px', padding: '16px',
                            marginBottom: '14px', border: '1px solid #e0ecff',
                        }}>
                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>🌐 Languages</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                {guide.languages.map(l => (
                                    <span key={l} style={{
                                        background: '#f0f6ff', borderRadius: '8px', padding: '4px 12px',
                                        color: '#1e6fd9', fontSize: '12px', fontWeight: '600',
                                    }}>{l}</span>
                                ))}
                            </div>
                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>🎯 Specialities</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {guide.tags.map(t => (
                                    <span key={t} style={{
                                        background: '#f0fdf4', borderRadius: '8px', padding: '4px 12px',
                                        color: '#059669', fontSize: '12px', fontWeight: '600',
                                    }}>{t}</span>
                                ))}
                            </div>
                        </div>

                        {/* Days picker */}
                        {!isBooked && guide.available && (
                            <div style={{
                                background: '#ffffff', borderRadius: '16px', padding: '16px',
                                marginBottom: '14px', border: '1px solid #e0ecff',
                            }}>
                                <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>📅 How many days?</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                    <button onClick={() => setDays(d => Math.max(1, d - 1))} style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                                        cursor: 'pointer', fontSize: '20px', color: '#1e6fd9',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>−</button>
                                    <span style={{ color: '#0a1628', fontSize: '22px', fontWeight: '900', minWidth: '30px', textAlign: 'center' }}>
                                        {days}
                                    </span>
                                    <button onClick={() => setDays(d => d + 1)} style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: '#059669', border: 'none',
                                        cursor: 'pointer', fontSize: '20px', color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 10px #05966930',
                                    }}>+</button>
                                    <span style={{ color: '#5a7a9f', fontSize: '13px' }}>
                                        day{days > 1 ? 's' : ''} × RM {guide.price}
                                    </span>
                                </div>
                                <div style={{
                                    background: '#f0fdf4', borderRadius: '10px', padding: '10px 14px',
                                    border: '1px solid #a7f3d0',
                                    display: 'flex', justifyContent: 'space-between',
                                }}>
                                    <span style={{ color: '#059669', fontSize: '13px', fontWeight: '600' }}>Total</span>
                                    <span style={{ color: '#059669', fontSize: '17px', fontWeight: '900' }}>
                                        RM {guide.price * days}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Booked confirmation */}
                        {isBooked && (
                            <div style={{
                                background: '#f0fdf4', border: '1.5px solid #059669',
                                borderRadius: '14px', padding: '14px 16px', marginBottom: '14px',
                                display: 'flex', alignItems: 'center', gap: '12px',
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Check size={20} color='#fff' />
                                </div>
                                <div>
                                    <p style={{ color: '#059669', fontSize: '14px', fontWeight: '800' }}>Guide Booked!</p>
                                    <p style={{ color: '#5a7a9f', fontSize: '12px' }}>
                                        {guide.name} · {bookedInfo?.days} day{bookedInfo?.days > 1 ? 's' : ''} · RM {guide.price * (bookedInfo?.days || 1)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* ── Reviews tab ── */
                    <div>
                        {/* Rating summary */}
                        <div style={{
                            background: '#ffffff', borderRadius: '16px', padding: '16px',
                            marginBottom: '14px', border: '1px solid #e0ecff',
                            display: 'flex', alignItems: 'center', gap: '16px',
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#0a1628', fontSize: '36px', fontWeight: '900', lineHeight: 1 }}>{guide.rating}</p>
                                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '4px 0' }}>
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} size={12} color='#f59e0b' fill={i <= Math.round(guide.rating) ? '#f59e0b' : 'none'} />
                                    ))}
                                </div>
                                <p style={{ color: '#8aaac8', fontSize: '11px' }}>{allReviews.length} reviews</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                {[5,4,3].map(stars => {
                                    const pct = stars === 5 ? 75 : stars === 4 ? 20 : 5
                                    return (
                                        <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                            <span style={{ color: '#8aaac8', fontSize: '11px', width: '8px' }}>{stars}</span>
                                            <Star size={9} color='#f59e0b' fill='#f59e0b' />
                                            <div style={{ flex: 1, height: '5px', background: '#f0f6ff', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
                                            </div>
                                            <span style={{ color: '#8aaac8', fontSize: '11px', width: '28px' }}>{pct}%</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Write a review button — only for booked guides */}
                        {isBooked && !reviewSubmitted && !showReviewForm && (
                            <button onClick={() => setShowReviewForm(true)} style={{
                                width: '100%', background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                border: 'none', borderRadius: '12px', padding: '12px',
                                color: '#fff', fontSize: '13px', fontWeight: '700',
                                cursor: 'pointer', marginBottom: '14px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                boxShadow: '0 4px 12px #f59e0b30',
                            }}>
                                ⭐ Rate & Review {guide.name}
                            </button>
                        )}

                        {reviewSubmitted && (
                            <div style={{
                                background: '#fffbeb', border: '1px solid #fcd34d',
                                borderRadius: '12px', padding: '12px 14px', marginBottom: '14px',
                                display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                                <span style={{ fontSize: '16px' }}>⭐</span>
                                <p style={{ color: '#92400e', fontSize: '13px', fontWeight: '600' }}>
                                    Thank you for your review!
                                </p>
                            </div>
                        )}

                        {/* Review form */}
                        {showReviewForm && (
                            <div style={{
                                background: '#ffffff', borderRadius: '16px', padding: '16px',
                                marginBottom: '14px', border: '1.5px solid #f59e0b',
                                boxShadow: '0 4px 16px #f59e0b20',
                            }}>
                                <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
                                    ⭐ Your Review
                                </p>

                                {/* Star rating picker */}
                                <p style={{ color: '#5a7a9f', fontSize: '12px', marginBottom: '8px' }}>Tap to rate:</p>
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                                    {[1,2,3,4,5].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setReviewRating(s)}
                                            onMouseEnter={() => setReviewHover(s)}
                                            onMouseLeave={() => setReviewHover(0)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                        >
                                            <Star
                                                size={28}
                                                color='#f59e0b'
                                                fill={(reviewHover || reviewRating) >= s ? '#f59e0b' : 'none'}
                                            />
                                        </button>
                                    ))}
                                    <span style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700', alignSelf: 'center', marginLeft: '4px' }}>
                                        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][reviewHover || reviewRating]}
                                    </span>
                                </div>

                                {/* Comment */}
                                <p style={{ color: '#5a7a9f', fontSize: '12px', marginBottom: '6px' }}>Share your experience (optional):</p>
                                <textarea
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                    placeholder={`How was your experience with ${guide.name}?`}
                                    rows={3}
                                    style={{
                                        width: '100%', border: '1.5px solid #c0d8f0',
                                        borderRadius: '10px', padding: '10px 12px',
                                        fontSize: '13px', color: '#0a1628', outline: 'none',
                                        fontFamily: 'Inter, sans-serif', resize: 'none',
                                        background: '#f8fbff', boxSizing: 'border-box',
                                        lineHeight: '1.5',
                                    }}
                                />

                                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                    <button onClick={submitReview} style={{
                                        flex: 1, background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                        border: 'none', borderRadius: '10px', padding: '11px',
                                        color: '#fff', fontSize: '13px', fontWeight: '700',
                                        cursor: 'pointer', boxShadow: '0 4px 10px #f59e0b30',
                                    }}>
                                        Submit Review
                                    </button>
                                    <button onClick={() => setShowReviewForm(false)} style={{
                                        background: '#f0f6ff', border: '1px solid #c0d8f0',
                                        borderRadius: '10px', padding: '11px 16px',
                                        color: '#5a7a9f', fontSize: '13px', cursor: 'pointer',
                                    }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* All reviews */}
                        {allReviews.map((r, i) => (
                            <div key={i} style={{
                                background: r.isOwn ? '#fffbeb' : '#ffffff',
                                borderRadius: '14px', padding: '14px 16px',
                                marginBottom: '10px',
                                border: `1px solid ${r.isOwn ? '#fcd34d' : '#e0ecff'}`,
                                boxShadow: '0 2px 8px #1e6fd910',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            background: r.isOwn ? 'linear-gradient(135deg, #f59e0b, #f97316)' : 'linear-gradient(135deg, #059669, #0ea5e9)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '14px',
                                        }}>{r.flag}</div>
                                        <div>
                                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '700' }}>
                                                {r.name} {r.isOwn && <span style={{ color: '#f59e0b', fontSize: '11px' }}>(You)</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} size={10} color='#f59e0b' fill={s <= r.rating ? '#f59e0b' : 'none'} />
                                        ))}
                                        <span style={{ color: '#8aaac8', fontSize: '10px', marginLeft: '4px' }}>{r.date}</span>
                                    </div>
                                </div>
                                <p style={{ color: '#5a7a9f', fontSize: '12px', lineHeight: '1.5' }}>{r.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Book button */}
            {!isBooked && guide.available && (
                <div style={{
                    background: '#ffffff', borderTop: '1px solid #e0ecff',
                    padding: '16px', flexShrink: 0, boxShadow: '0 -4px 16px #1e6fd910',
                }}>
                    <button onClick={() => onBook(days)} style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                        border: 'none', borderRadius: '14px', padding: '16px',
                        color: '#fff', fontSize: '16px', fontWeight: '800',
                        cursor: 'pointer', boxShadow: '0 6px 20px #05966940',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        Book {guide.name} · RM {guide.price * days}
                    </button>
                    <p style={{ color: '#8aaac8', fontSize: '11px', textAlign: 'center', marginTop: '8px' }}>
                        🔒 Secure payment — you will be redirected to checkout
                    </p>
                </div>
            )}

            {/* Rate button for booked guides — shown in footer */}
            {isBooked && !reviewSubmitted && !showReviewForm && activeTab === 'about' && (
                <div style={{
                    background: '#ffffff', borderTop: '1px solid #e0ecff',
                    padding: '16px', flexShrink: 0, boxShadow: '0 -4px 16px #1e6fd910',
                    display: 'flex', gap: '10px',
                }}>
                    <button onClick={() => { setActiveTab('reviews'); setShowReviewForm(true) }} style={{
                        flex: 1, background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                        border: 'none', borderRadius: '14px', padding: '14px',
                        color: '#fff', fontSize: '14px', fontWeight: '700',
                        cursor: 'pointer', boxShadow: '0 4px 14px #f59e0b30',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}>
                        ⭐ Rate & Review
                    </button>
                </div>
            )}
        </div>
    )
}

export default GuideScreen