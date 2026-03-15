import React from 'react'
import VoyageLogo from '../components/VoyageLogo'
import {
    MessageCircle, Map, Globe, Briefcase,
    Plane, Hotel, ChevronRight,
    Search, BookOpen, User, Navigation,
    Bell, Clock, AlertCircle
} from 'lucide-react'

// ── Destination config: emoji + Unsplash image + packing tips ─────────────
const DESTINATION_CONFIG = {
    NRT: { emoji: '🗼', name: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80', tips: [
            '🚇 Get IC Suica card at airport — works on all trains & shops',
            '👘 Pack layers — Tokyo weather changes quickly',
            '💴 Carry cash — many restaurants & vending machines are cash only',
            '📱 Download Google Translate with Japanese offline pack',
            '🥾 Pack comfortable walking shoes — you will walk a LOT',
            '🌸 Book popular restaurants in advance (especially ramen spots)',
            '🗺️ Download Hyperdia app for train navigation',
            '🧴 Bring toiletries — hotel sizes are very small',
            '🔌 Bring universal power adapter (Japan uses Type A plugs)',
            '🎌 Learn basic phrases: arigatou (thank you), sumimasen (excuse me)',
        ]},
    TYO: { emoji: '🗼', name: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80', tips: [
            '🚇 Get IC Suica card at airport — works on all trains & shops',
            '👘 Pack layers — Tokyo weather changes quickly',
            '💴 Carry cash — many restaurants & vending machines are cash only',
            '📱 Download Google Translate with Japanese offline pack',
            '🥾 Pack comfortable walking shoes — you will walk a LOT',
            '🌸 Book popular restaurants in advance (especially ramen spots)',
            '🗺️ Download Hyperdia app for train navigation',
            '🔌 Bring universal power adapter (Japan uses Type A plugs)',
        ]},
    KIX: { emoji: '🏯', name: 'Osaka', img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&q=80', tips: [
            '🚄 Get ICOCA card for trains and buses',
            '🐙 Must try takoyaki & kushikatsu in Dotonbori',
            '🎡 Get Osaka Amazing Pass for free attractions',
            '🍜 Book Dotonbori restaurants early — gets very crowded',
            '🥾 Wear comfortable shoes for Namba and Shinsaibashi shopping',
            '🌙 Dotonbori is best experienced at night',
            '💴 Carry cash — Osaka is still very cash-based',
            '📦 Leave room in luggage for shopping souvenirs',
        ]},
    SIN: { emoji: '🦁', name: 'Singapore', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80', tips: [
            '🚇 Get EZ-Link card for MRT & buses — cheapest transport',
            '🍜 Eat at hawker centres — best food, cheapest prices',
            '🌿 Visit Gardens by the Bay for free at night (light show at 8pm & 9pm)',
            '❌ No chewing gum allowed — can be fined',
            '🌧️ Carry a small umbrella — sudden rain showers common',
            '👕 Light cotton clothes only — always hot & humid',
            '📱 Grab app for taxis — safer than flagging one',
            '🛒 Mustafa Centre open 24/7 for cheap shopping',
            '🏖️ Sentosa Island — book in advance for peak weekends',
            '💰 Changi Airport is worth 3-4 hours on its own!',
        ]},
    BKK: { emoji: '🐘', name: 'Bangkok', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80', tips: [
            '⛪ Dress modestly at temples — cover shoulders & knees',
            '🚈 BTS Skytrain is fastest — avoid tuk-tuks for long distances',
            '🛍️ Bargain hard at Chatuchak Weekend Market',
            '🧴 Carry hand sanitiser and wet wipes everywhere',
            '🌶️ Street food is amazing — try pad thai, som tum, mango sticky rice',
            '☀️ Apply sunscreen every 2 hours — extreme heat',
            '💊 Bring Imodium just in case — stomach adjustments common',
            '📱 Download Grab app for affordable taxis',
            '🙏 Wai (prayer hands) as greeting shows respect',
            '💵 Exchange money at authorized booths, not airport',
        ]},
    DPS: { emoji: '🌴', name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', tips: [
            '🛺 Book a trusted driver in advance — Bali has no Grab',
            '🌺 Wear a sarong at temples — available to borrow at entrance',
            '💧 Drink only bottled water — never tap water',
            '☀️ Sunscreen is essential — UV is extremely strong',
            '🚗 Rent a scooter only if you have experience — traffic is chaotic',
            '🌙 Seminyak for nightlife, Ubud for culture, Nusa Dua for beach',
            '🍚 Must try nasi goreng, satay, babi guling',
            '📦 Pack light clothing — it is always hot and humid',
            '💰 Bargain at markets but be respectful',
            '🌊 Respect ocean warning flags — currents can be dangerous',
        ]},
    LHR: { emoji: '🎡', name: 'London', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80', tips: [
            '🚇 Get Oyster card or use contactless card for tube',
            '🧥 Pack layers — weather can change 3 times in one day',
            '🏛️ Most museums are FREE — British Museum, National Gallery, V&A',
            '🎭 Book West End shows at TKTS booth for discount tickets',
            '🍺 Tip 10–15% at restaurants (not always expected at pubs)',
            '☂️ Always carry a compact umbrella',
            '📱 Download Citymapper app for navigation',
            '🚶 Walk when possible — London is very walkable',
            '🛒 Primark on Oxford Street for cheap clothes',
            '🕙 Everything closes early on Sundays — plan accordingly',
        ]},
    CDG: { emoji: '🗽', name: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80', tips: [
            '🗼 Book Eiffel Tower tickets online weeks in advance',
            '🎨 Louvre — book online, go early, focus on key works only',
            '🚇 Navigo weekly metro pass saves money',
            '🥐 Breakfast at a local boulangerie — much cheaper than hotels',
            '👜 Beware pickpockets especially at tourist spots',
            '🗣️ Try basic French: bonjour, merci, s\'il vous plaît',
            '🍷 Wine is cheaper than soda at many restaurants',
            '🚶 Many attractions are within walking distance in central Paris',
            '✅ Validate your metro ticket before entering platform',
            '🌙 Paris is most beautiful at night — evening walk along Seine',
        ]},
    DXB: { emoji: '🏙️', name: 'Dubai', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80', tips: [
            '👗 Dress modestly in public areas & malls',
            '🚇 Dubai Metro is clean, cheap and fast',
            '📱 Download Careem or Uber — never take unmetered taxis',
            '🕌 Respect prayer times — some shops close briefly',
            '☀️ June–September is extreme heat — plan indoor activities',
            '🛒 Visit Dubai Mall and Mall of the Emirates for AC relief',
            '🌙 Gold & Spice Souks are best in the evening',
            '🚫 Public displays of affection are illegal',
            '💧 Stay very hydrated — desert climate is dehydrating',
            '📸 Ask permission before photographing locals',
        ]},
    SYD: { emoji: '🦘', name: 'Sydney', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80', tips: [
            '🚇 Get Opal card for all public transport',
            '☀️ SPF 50+ sunscreen is essential — UV is very strong',
            '🏄 Only swim between the red & yellow flags at beaches',
            '🦺 Book Harbour Bridge Climb at least 2 weeks ahead',
            '🌊 Bondi to Coogee coastal walk is free and stunning',
            '🦘 Wildlife parks are mostly outside the city — plan a day trip',
            '🍷 Hunter Valley wine region is 2 hours away',
            '💰 Sydney is expensive — budget AUD 100–150 per day',
            '🌧️ Weather is unpredictable — bring a light jacket',
            '🐨 See koalas at Taronga Zoo',
        ]},
    JFK: { emoji: '🗽', name: 'New York', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80', tips: [
            '🚇 Get MetroCard for subway — unlimited 7-day pass is best value',
            '🍕 Dollar pizza slices are a New York tradition',
            '🎭 Book Broadway shows early — TKTS booth for same-day discounts',
            '💵 Tip 18–20% at restaurants — it is expected',
            '🛺 Use Uber/Lyft over yellow cabs for better pricing',
            '🌆 Top of the Rock for best NYC skyline views',
            '🗽 Statue of Liberty — book Crown access months ahead',
            '🛍️ Sample sales in Garment District for designer bargains',
            '🚶 Central Park is huge — wear comfortable shoes',
            '🌙 Times Square at night is spectacular but crowded',
        ]},
    HKG: { emoji: '🌆', name: 'Hong Kong', img: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&q=80', tips: [
            '🚇 Octopus card works on all transport, taxis & convenience stores',
            '🥟 Dim sum for breakfast is a must-do experience',
            '⛴️ Star Ferry across the harbour — best value HKD 2.5 ride',
            '🌃 Victoria Peak at night for the iconic skyline view',
            '🛒 Ladies Market and Temple Street Night Market for bargains',
            '🌧️ May–September is typhoon season — check warnings',
            '🥾 Lots of walking on hills — wear good shoes',
            '🍜 Wonton noodles and egg tarts are local must-trys',
            '💡 Electricity is 220V with UK-style 3-pin plugs',
            '🌡️ Summer is very hot and humid — light clothes only',
        ]},
    ICN: { emoji: '🇰🇷', name: 'Seoul', img: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80', tips: [
            '🚇 T-Money card for subway, buses, even convenience stores',
            '🧖 Try a jjimjilbang (Korean sauna) — amazing experience',
            '🥘 Korean BBQ dinner is an unmissable experience',
            '💄 K-beauty shopping in Myeongdong & Hongdae',
            '🥾 Seoul has lots of hills and walking — wear comfy shoes',
            '🌸 Cherry blossom season (March–April) is stunning',
            '🍜 Try street food: tteokbokki, hotteok, Korean fried chicken',
            '📸 Gyeongbokgung Palace — rent hanbok for free entry',
            '📱 Download Naver Maps — better than Google in Korea',
            '🥶 Winters are very cold — pack heavy layers if visiting Nov–Feb',
        ]},
    KUL: { emoji: '🌃', name: 'KL', img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80', tips: [
            '📱 Use Grab app for all transport — affordable and reliable',
            '🍜 Jalan Alor for the best street food in KL',
            '🌃 Petronas Towers — book tickets online, go at sunset',
            '🚇 MRT/LRT card for trains — get Touch n Go card',
            '🛍️ Petaling Street for bargain shopping',
            '🌧️ Always carry umbrella — afternoon showers daily',
            '🕌 Dress modestly when visiting mosques & temples',
            '🥵 Extremely hot — light, breathable clothing only',
            '🍲 Try nasi lemak, roti canai, char kway teow',
            '🚗 KLIA Ekspres train to city — much faster than taxi',
        ]},
    default: { emoji: '✈️', name: 'Your Trip', img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=80', tips: [
            '📘 Check passport validity — must have 6 months left',
            '🛡️ Get travel insurance before departure',
            '🏦 Notify your bank of travel dates to avoid card blocks',
            '📱 Download offline maps for your destination',
            '💊 Pack basic medication — paracetamol, antihistamine, Imodium',
            '🔌 Check plug type needed at destination & bring adapter',
            '📸 Back up your phone photos to cloud before leaving',
            '👕 Pack one extra outfit in carry-on for delays',
            '🌐 Get local SIM or international roaming plan',
            '💵 Have some local cash before arrival',
        ]},
}

const getConfig = (trip) => {
    const dest = (trip?.destination || trip?.flight?.destination || '').toUpperCase()
    return DESTINATION_CONFIG[dest] || DESTINATION_CONFIG['default']
}

const getDaysUntil = (dateStr) => {
    if (!dateStr || dateStr === 'TBD') return null
    try {
        const tripDate = new Date(dateStr)
        tripDate.setHours(0,0,0,0)
        const today = new Date(); today.setHours(0,0,0,0)
        const diff = Math.round((tripDate - today) / (1000 * 60 * 60 * 24))
        return diff
    } catch { return null }
}

const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'TBD') return 'Date TBD'
    try {
        return new Date(dateStr).toLocaleDateString('en-MY', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
    } catch { return dateStr }
}

const isUpcoming = (dateStr) => {
    if (!dateStr || dateStr === 'TBD') return true
    try {
        const d = new Date(dateStr); d.setHours(0,0,0,0)
        const t = new Date(); t.setHours(0,0,0,0)
        return d >= t
    } catch { return true }
}

const HomeScreen = ({ setActiveScreen, itineraries, trips }) => {

    // Only show upcoming trips, sorted by soonest first, latest booking first if same date
    const upcomingTrips = trips
        .filter(t => isUpcoming(t.date))
        .sort((a, b) => {
            const da = new Date(a.date || '9999')
            const db = new Date(b.date || '9999')
            if (da - db !== 0) return da - db  // soonest first
            return (b.id || 0) - (a.id || 0)   // newest booking first if same date
        })

    // Show only the most recent/soonest 1 trip on home
    const featuredTrip = upcomingTrips[0] || null

    const cards = [
        { id: 'chat',      icon: MessageCircle, title: 'AI Agent',  desc: 'Plan your trip with AI',    color: '#1e6fd9', iconBg: '#d0e8ff' },
        { id: 'explore',   icon: Search,        title: 'Explore',   desc: 'Trending destinations',     color: '#0ea5e9', iconBg: '#e0f4ff' },
        { id: 'itinerary', icon: Map,           title: 'Itinerary', desc: 'View your saved plans',     color: '#7c3aed', iconBg: '#ede9fe' },
        { id: 'translate', icon: Globe,         title: 'Translate', desc: 'Speak any language',        color: '#059669', iconBg: '#d1fae5' },
        { id: 'mytrips',   icon: Briefcase,         title: 'My Trips',  desc: 'Your bookings & tickets',   color: '#d97706', iconBg: '#fef3c7' },
        { id: 'guide',     icon: BookOpen,      title: 'Guide',     desc: 'How to use VoyageAI',       color: '#db2777', iconBg: '#fce7f3' },
    ]

    return (
        <div style={{ minHeight: '100%', padding: '28px 20px 20px', background: '#f0f6ff' }}>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: '16px',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <VoyageLogo size="md" />
                        <p style={{ color: '#0a1628', fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>
                            Where to next? ✈️
                        </p>
                    </div>
                    <button
                        onClick={() => setActiveScreen('me')}
                        style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: '#ffffff', border: '2px solid #c0d8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 2px 8px #1e6fd915',
                        }}
                    >
                        <User size={18} color='#1e6fd9' />
                    </button>
                </div>

                {/* Search Bar */}
                <div
                    onClick={() => setActiveScreen('explore')}
                    style={{
                        background: '#ffffff', border: '1.5px solid #c0d8f0',
                        borderRadius: '14px', padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        cursor: 'pointer', boxShadow: '0 2px 12px #1e6fd910',
                    }}
                >
                    <Search size={16} color='#8aaac8' />
                    <span style={{ color: '#8aaac8', fontSize: '14px' }}>
                        Search destinations, hotels, flights...
                    </span>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {[
                        { icon: Plane,      label: 'Flights',   color: '#1e6fd9', bg: '#d0e8ff', screen: 'chat' },
                        { icon: Hotel,      label: 'Hotels',    color: '#7c3aed', bg: '#ede9fe', screen: 'chat' },
                        { icon: Navigation, label: 'AR Maps',   color: '#059669', bg: '#d1fae5', screen: 'armap' },
                        { icon: Globe,      label: 'Translate', color: '#d97706', bg: '#fef3c7', screen: 'translate' },
                    ].map((item, i) => {
                        const Icon = item.icon
                        return (
                            <button key={i} onClick={() => setActiveScreen(item.screen)} style={{
                                flex: 1, background: '#ffffff', border: '1.5px solid #c0d8f0',
                                borderRadius: '14px', padding: '12px 6px', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                boxShadow: '0 2px 8px #1e6fd910', transition: 'all 0.2s ease',
                            }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: item.bg, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={18} color={item.color} />
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#0a1628' }}>
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Feature Cards Grid */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>
                    Features
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {cards.map(card => {
                        const Icon = card.icon
                        return (
                            <button key={card.id} onClick={() => setActiveScreen(card.id)} style={{
                                background: '#ffffff', border: '1.5px solid #c0d8f0',
                                borderRadius: '16px', padding: '16px 10px', cursor: 'pointer',
                                textAlign: 'center', transition: 'all 0.2s ease',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                boxShadow: '0 2px 8px #1e6fd910',
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '12px',
                                    background: card.iconBg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={20} color={card.color} />
                                </div>
                                <p style={{ color: '#0a1628', fontSize: '11px', fontWeight: '600', lineHeight: '1.3' }}>
                                    {card.title}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Upcoming Trips */}
            <div>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '14px',
                }}>
                    <h2 style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700' }}>
                        Upcoming Trips
                    </h2>
                    {upcomingTrips.length > 0 && (
                        <button
                            onClick={() => setActiveScreen('mytrips')}
                            style={{
                                background: 'none', border: 'none', color: '#1e6fd9',
                                fontSize: '12px', cursor: 'pointer', fontWeight: '600',
                                display: 'flex', alignItems: 'center', gap: '2px',
                            }}
                        >
                            See all ({upcomingTrips.length}) <ChevronRight size={13} />
                        </button>
                    )}
                </div>

                {!featuredTrip ? (
                    // Empty state
                    <div style={{
                        background: '#ffffff', border: '1.5px dashed #c0d8f0',
                        borderRadius: '18px', padding: '28px 24px',
                        textAlign: 'center', boxShadow: '0 2px 12px #1e6fd910',
                    }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '16px',
                            background: '#d0e8ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 12px',
                        }}>
                            <Plane size={24} color='#1e6fd9' />
                        </div>
                        <p style={{ color: '#5a7a9f', fontSize: '13px', marginBottom: '14px', lineHeight: '1.6' }}>
                            No upcoming trips yet.<br />Let AI plan your next adventure!
                        </p>
                        <button
                            onClick={() => setActiveScreen('chat')}
                            style={{
                                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                border: 'none', borderRadius: '12px', padding: '10px 24px',
                                color: '#ffffff', fontSize: '13px', fontWeight: '700',
                                cursor: 'pointer', boxShadow: '0 4px 16px #1e6fd930',
                            }}
                        >
                            ✨ Plan with AI
                        </button>
                    </div>
                ) : (
                    <UpcomingTripCard
                        trip={featuredTrip}
                        onPress={() => setActiveScreen('mytrips')}
                    />
                )}
            </div>
        </div>
    )
}

// ── Featured Trip Card ─────────────────────────────────────────────────────
const UpcomingTripCard = ({ trip, onPress }) => {
    const config   = getConfig(trip)
    const daysLeft = getDaysUntil(trip.date)
    const isHotel  = trip.type === 'hotel'
    const flight   = trip.flight || {}
    const hotel    = trip.hotel  || {}

    const urgency = daysLeft === null ? null
        : daysLeft <= 3  ? 'critical'   // red — leave soon!
            : daysLeft <= 7  ? 'urgent'     // orange — 1 week
                : daysLeft <= 14 ? 'soon'       // yellow — 2 weeks
                    : 'normal'                       // blue — plenty of time

    const urgencyColor = {
        critical: '#dc2626', urgent: '#ea580c',
        soon: '#d97706', normal: '#1e6fd9', null: '#1e6fd9',
    }[urgency]

    const urgencyBg = {
        critical: '#fef2f2', urgent: '#fff7ed',
        soon: '#fffbeb', normal: '#f0f6ff', null: '#f0f6ff',
    }[urgency]

    const daysLabel = daysLeft === null ? null
        : daysLeft === 0 ? '🚨 TODAY!'
            : daysLeft === 1 ? '⚡ Tomorrow!'
                : daysLeft <= 3  ? `🔴 ${daysLeft} days left!`
                    : daysLeft <= 7  ? `🟠 ${daysLeft} days to go`
                        : `🟢 ${daysLeft} days away`

    return (
        <div
            onClick={onPress}
            style={{
                background: '#ffffff', borderRadius: '20px',
                overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 6px 24px #1e6fd920',
                border: `1.5px solid ${urgencyColor}30`,
            }}
        >
            {/* Destination Image */}
            <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                <img
                    src={config.img}
                    alt={config.name}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        display: 'block',
                    }}
                    onError={e => {
                        // Fallback if image fails
                        e.target.style.display = 'none'
                        e.target.parentNode.style.background = 'linear-gradient(135deg, #1e6fd9, #4a9fe8)'
                    }}
                />
                {/* Overlay gradient */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,22,40,0.7) 0%, transparent 60%)',
                }} />
                {/* Destination name on image */}
                <div style={{
                    position: 'absolute', bottom: '12px', left: '14px',
                }}>
                    <p style={{ color: '#ffffff', fontSize: '22px', fontWeight: '900' }}>
                        {config.emoji} {(trip.destination || config.name).toUpperCase()}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>
                        {isHotel ? hotel.name : `${flight.airline || ''} ${flight.flightNumber || ''}`}
                    </p>
                </div>
                {/* Days badge */}
                {daysLabel && (
                    <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        background: urgencyBg,
                        borderRadius: '20px', padding: '4px 10px',
                        border: `1.5px solid ${urgencyColor}40`,
                    }}>
                        <p style={{ color: urgencyColor, fontSize: '11px', fontWeight: '800' }}>
                            {daysLabel}
                        </p>
                    </div>
                )}
            </div>

            {/* Card Info */}
            <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                        flex: 1, background: '#f0f6ff', borderRadius: '10px', padding: '8px 10px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                        <Clock size={13} color='#1e6fd9' />
                        <div>
                            <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600' }}>DATE</p>
                            <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700' }}>
                                {trip.dateDisplay || formatDate(trip.date)}
                            </p>
                        </div>
                    </div>
                    <div style={{
                        flex: 1, background: '#f0f6ff', borderRadius: '10px', padding: '8px 10px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                        {isHotel ? <Hotel size={13} color='#7c3aed' /> : <Plane size={13} color='#1e6fd9' />}
                        <div>
                            <p style={{ color: '#8aaac8', fontSize: '10px', fontWeight: '600' }}>TYPE</p>
                            <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700' }}>
                                {isHotel ? 'Hotel' : `${flight.origin || 'KUL'} → ${trip.destination || 'NRT'}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reminder section — show within 30 days */}
                {daysLeft !== null && daysLeft <= 30 && daysLeft >= 0 && (
                    <ReminderChecklist
                        tips={config.tips}
                        daysLeft={daysLeft}
                        urgencyColor={urgencyColor}
                        urgencyBg={urgencyBg}
                    />
                )}

                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <p style={{ color: '#8aaac8', fontSize: '11px' }}>
                        Ref: <span style={{ fontFamily: 'monospace', color: '#1e6fd9', fontWeight: '700' }}>
                            {trip.bookingRef || 'N/A'}
                        </span>
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <p style={{ color: '#1e6fd9', fontSize: '12px', fontWeight: '600' }}>
                            View ticket
                        </p>
                        <ChevronRight size={13} color='#1e6fd9' />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Reminder Checklist Component ──────────────────────────────────────────
const ReminderChecklist = ({ tips, daysLeft, urgencyColor, urgencyBg }) => {
    const [expanded, setExpanded] = React.useState(false)
    const shown = expanded ? tips : tips.slice(0, 4)

    const title = daysLeft === 0 ? '🚨 It\'s today! Final checklist:'
        : daysLeft === 1 ? '⚡ Tomorrow! Last-minute checklist:'
            : daysLeft <= 3  ? '🔴 Trip very soon! Checklist:'
                : daysLeft <= 7  ? '🟠 1 week to go! Preparation tips:'
                    : daysLeft <= 14 ? '🟡 2 weeks to go! Start packing:'
                        : '🟢 Upcoming trip tips & reminders:'

    return (
        <div style={{
            background: urgencyBg,
            border: `1.5px solid ${urgencyColor}25`,
            borderRadius: '12px', padding: '12px 14px',
            marginBottom: '12px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Bell size={13} color={urgencyColor} />
                <p style={{ color: urgencyColor, fontSize: '12px', fontWeight: '700', flex: 1 }}>
                    {title}
                </p>
                <span style={{
                    background: urgencyColor + '20', color: urgencyColor,
                    fontSize: '10px', fontWeight: '700',
                    borderRadius: '10px', padding: '2px 8px',
                }}>
                    {tips.length} tips
                </span>
            </div>

            {shown.map((tip, i) => (
                <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start',
                    gap: '8px', marginBottom: '7px',
                }}>
                    <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: urgencyColor + '20',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '1px',
                    }}>
                        <span style={{ color: urgencyColor, fontSize: '9px', fontWeight: '800' }}>✓</span>
                    </div>
                    <p style={{ color: '#374151', fontSize: '12px', lineHeight: '1.5' }}>
                        {tip}
                    </p>
                </div>
            ))}

            {tips.length > 4 && (
                <button
                    onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
                    style={{
                        background: 'none', border: 'none',
                        color: urgencyColor, fontSize: '12px',
                        fontWeight: '700', cursor: 'pointer',
                        padding: '4px 0', marginTop: '2px',
                        display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                >
                    {expanded
                        ? '▲ Show less'
                        : `▼ Show ${tips.length - 4} more tips`
                    }
                </button>
            )}
        </div>
    )
}

export default HomeScreen