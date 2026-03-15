import React, { useState } from 'react'
import {
    User, Globe, Bell, Shield, HelpCircle,
    ChevronRight, Check, Moon, Sun, Plane,
    Star, Map, MessageCircle, LogOut, Edit3, Camera
} from 'lucide-react'
import VoyageLogo from '../components/VoyageLogo'

const LANGUAGES = [
    { code: 'en', label: 'English',          flag: '🇬🇧' },
    { code: 'zh', label: '中文 (Chinese)',     flag: '🇨🇳' },
    { code: 'ms', label: 'Bahasa Melayu',    flag: '🇲🇾' },
    { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'ko', label: '한국어 (Korean)',   flag: '🇰🇷' },
    { code: 'th', label: 'ภาษาไทย (Thai)',   flag: '🇹🇭' },
    { code: 'ar', label: 'العربية (Arabic)',  flag: '🇸🇦' },
]

const CURRENCIES = [
    { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'USD', label: 'US Dollar',         symbol: '$'  },
    { code: 'SGD', label: 'Singapore Dollar',  symbol: 'S$' },
    { code: 'JPY', label: 'Japanese Yen',      symbol: '¥'  },
    { code: 'EUR', label: 'Euro',              symbol: '€'  },
    { code: 'GBP', label: 'British Pound',     symbol: '£'  },
    { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
]

const TRAVEL_STYLES = ['Backpacker', 'Budget', 'Mid-range', 'Luxury', 'Business']
const INTERESTS     = ['Food', 'Culture', 'Adventure', 'Beaches', 'Shopping', 'Nature', 'History', 'Nightlife', 'Photography', 'Wellness']

const loadPref  = (key, def) => { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def } catch { return def } }
const savePref  = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

const MeScreen = ({ setActiveScreen, language, setLanguage, currency = 'MYR', setCurrency, trips = [], itineraries = [] }) => {
    // Profile
    const [name,  setName]  = useState(() => loadPref('voyageai_name',  'Traveller'))
    const [email, setEmail] = useState(() => loadPref('voyageai_email', ''))
    const [editingProfile, setEditingProfile] = useState(false)
    const [tempName,  setTempName]  = useState('')
    const [tempEmail, setTempEmail] = useState('')

    // Preferences (currency comes from props now — shared across app)
    const [travelStyle,   setTravelStyle]   = useState(() => loadPref('voyageai_style',         'Mid-range'))
    const [interests,     setInterests]     = useState(() => loadPref('voyageai_interests',      ['Food', 'Culture']))
    const [darkMode,      setDarkMode]      = useState(() => loadPref('voyageai_dark',           false))
    const [notifications, setNotifications] = useState(() => loadPref('voyageai_notifs',         true))
    const [flightAlerts,  setFlightAlerts]  = useState(() => loadPref('voyageai_flight_alerts',  true))

    // Confirm dialog state
    const [showConfirm, setShowConfirm]   = useState(false)

    // UI
    const [showLangPicker,  setShowLangPicker]  = useState(false)
    const [showCurrPicker,  setShowCurrPicker]  = useState(false)
    const [showStylePicker, setShowStylePicker] = useState(false)
    const [showInterests,   setShowInterests]   = useState(false)

    const currLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]
    const currCurr = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]

    const saveProfile = () => {
        const n = tempName.trim() || name
        const e = tempEmail.trim() || email
        setName(n); savePref('voyageai_name', n)
        setEmail(e); savePref('voyageai_email', e)
        setEditingProfile(false)
    }

    const toggleInterest = (i) => {
        const updated = interests.includes(i)
            ? interests.filter(x => x !== i)
            : [...interests, i]
        setInterests(updated)
        savePref('voyageai_interests', updated)
    }

    const toggle = (setter, key, val) => {
        setter(!val)
        savePref(key, !val)
    }

    const handleClearConversations = () => {
        try {
            localStorage.removeItem('voyageai_conversations')
        } catch {}
        setShowConfirm(false)
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#f0f6ff',
            overflowY: 'auto', position: 'relative',
        }}>
            {/* ── Confirm Dialog ── */}
            {showConfirm && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 999,
                    background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '24px',
                }}>
                    <div style={{
                        background: '#ffffff', borderRadius: '20px',
                        padding: '24px', width: '100%', maxWidth: '320px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: '#fef2f2', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 14px', fontSize: '22px',
                        }}>🗑️</div>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>
                            Clear Conversations?
                        </p>
                        <p style={{ color: '#5a7a9f', fontSize: '13px', textAlign: 'center', lineHeight: '1.5', marginBottom: '20px' }}>
                            This will permanently delete all your chat history. This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowConfirm(false)} style={{
                                flex: 1, background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                                borderRadius: '12px', padding: '12px',
                                color: '#5a7a9f', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                            }}>Cancel</button>
                            <button onClick={handleClearConversations} style={{
                                flex: 1, background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                                border: 'none', borderRadius: '12px', padding: '12px',
                                color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                boxShadow: '0 4px 12px #dc262630',
                            }}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {/* ── Header ── */}
            <div style={{ flexShrink: 0 }}>
                <div style={{
                    position: 'relative', height: '130px', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1e6fd9 0%, #7c3aed 100%)',
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
                        position: 'absolute', inset: 0, padding: '20px 20px 16px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    }}>
                        <p style={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600',
                            textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px',
                        }}>VoyageAI</p>
                        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: '900', margin: 0 ,lineHeight:1.1}}>My Profile</h1>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', padding: '3px 10px',
                                color: '#fff', fontSize: '11px', fontWeight: '600',
                            }}>✈️ {trips.length} trips</span>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                                borderRadius: '20px', padding: '3px 10px',
                                color: '#fff', fontSize: '11px', fontWeight: '600',
                            }}>🗺️ {itineraries.length} itineraries</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '16px', paddingBottom: '32px' }}>

                {/* ── Profile Card ── */}
                <div style={{
                    background: '#fff', borderRadius: '20px', padding: '20px',
                    marginBottom: '16px', border: '1px solid #e0ecff',
                    boxShadow: '0 4px 16px #1e6fd910',
                }}>
                    {!editingProfile ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Avatar */}
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1e6fd9, #7c3aed)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, boxShadow: '0 4px 14px #1e6fd930',
                            }}>
                                <span style={{ color: '#fff', fontSize: '26px', fontWeight: '900' }}>
                                    {name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: '#0a1628', fontSize: '18px', fontWeight: '800', marginBottom: '2px' }}>
                                    {name}
                                </p>
                                <p style={{ color: '#8aaac8', fontSize: '13px' }}>
                                    {email || 'Tap Edit to add email'}
                                </p>
                                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                    <span style={{
                                        background: '#f0f6ff', borderRadius: '8px', padding: '3px 10px',
                                        color: '#1e6fd9', fontSize: '11px', fontWeight: '600',
                                    }}>{travelStyle}</span>
                                    <span style={{
                                        background: '#f0fdf4', borderRadius: '8px', padding: '3px 10px',
                                        color: '#059669', fontSize: '11px', fontWeight: '600',
                                    }}>{currLang.flag} {currLang.label.split(' ')[0]}</span>
                                </div>
                            </div>
                            <button onClick={() => { setTempName(name); setTempEmail(email); setEditingProfile(true) }} style={{
                                background: '#f0f6ff', border: '1px solid #c0d8f0',
                                borderRadius: '10px', padding: '8px 12px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '5px',
                            }}>
                                <Edit3 size={14} color='#1e6fd9' />
                                <span style={{ color: '#1e6fd9', fontSize: '12px', fontWeight: '600' }}>Edit</span>
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p style={{ color: '#0a1628', fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>
                                ✏️ Edit Profile
                            </p>
                            <div style={{ marginBottom: '10px' }}>
                                <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>Name</p>
                                <input
                                    value={tempName} onChange={e => setTempName(e.target.value)}
                                    placeholder='Your name'
                                    style={{
                                        width: '100%', background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                                        borderRadius: '10px', padding: '10px 14px', fontSize: '14px',
                                        color: '#0a1628', outline: 'none', boxSizing: 'border-box',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <p style={{ color: '#5a7a9f', fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>Email</p>
                                <input
                                    value={tempEmail} onChange={e => setTempEmail(e.target.value)}
                                    placeholder='your@email.com' type='email'
                                    style={{
                                        width: '100%', background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                                        borderRadius: '10px', padding: '10px 14px', fontSize: '14px',
                                        color: '#0a1628', outline: 'none', boxSizing: 'border-box',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={saveProfile} style={{
                                    flex: 1, background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                    border: 'none', borderRadius: '10px', padding: '10px',
                                    color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                }}>Save</button>
                                <button onClick={() => setEditingProfile(false)} style={{
                                    background: '#f0f6ff', border: '1px solid #c0d8f0',
                                    borderRadius: '10px', padding: '10px 16px',
                                    color: '#5a7a9f', fontSize: '13px', cursor: 'pointer',
                                }}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Stats Row ── */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    {[
                        { icon: '✈️', val: trips.length,        label: 'Trips Booked' },
                        { icon: '🗺️', val: itineraries.length,  label: 'Itineraries' },
                        { icon: '🌍', val: new Set(trips.map(t => t.destination || '')).size, label: 'Destinations' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            flex: 1, background: '#fff', borderRadius: '14px',
                            padding: '14px 10px', textAlign: 'center',
                            border: '1px solid #e0ecff', boxShadow: '0 2px 8px #1e6fd910',
                        }}>
                            <p style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</p>
                            <p style={{ color: '#0a1628', fontSize: '20px', fontWeight: '900', lineHeight: 1 }}>{s.val}</p>
                            <p style={{ color: '#8aaac8', fontSize: '10px', marginTop: '3px' }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Preferences ── */}
                <SectionHeader title='🌐 Language & Region' />
                <SettingsCard>
                    <SettingsRow
                        label='App Language'
                        value={`${currLang.flag} ${currLang.label.split(' ')[0]}`}
                        onPress={() => { setShowLangPicker(!showLangPicker); setShowCurrPicker(false) }}
                    />
                    {showLangPicker && (
                        <PickerGrid
                            items={LANGUAGES.map(l => ({ value: l.code, label: l.label.split(' ')[0], prefix: l.flag }))}
                            selected={language}
                            onSelect={code => { setLanguage(code); savePref('voyageai_lang', code); setShowLangPicker(false) }}
                        />
                    )}
                    <Divider />
                    <SettingsRow
                        label='Currency'
                        value={`${currCurr.symbol} ${currCurr.code}`}
                        onPress={() => { setShowCurrPicker(!showCurrPicker); setShowLangPicker(false) }}
                    />
                    {showCurrPicker && (
                        <PickerGrid
                            items={CURRENCIES.map(c => ({ value: c.code, label: c.code, prefix: c.symbol }))}
                            selected={currency}
                            onSelect={code => { setCurrency(code); setShowCurrPicker(false) }}
                        />
                    )}
                </SettingsCard>

                <SectionHeader title='🎒 Travel Preferences' />
                <SettingsCard>
                    <SettingsRow
                        label='Travel Style'
                        value={travelStyle}
                        onPress={() => { setShowStylePicker(!showStylePicker); setShowInterests(false) }}
                    />
                    {showStylePicker && (
                        <PickerGrid
                            items={TRAVEL_STYLES.map(s => ({ value: s, label: s, prefix: { Backpacker:'🎒', Budget:'💰', 'Mid-range':'🌟', Luxury:'💎', Business:'💼' }[s] }))}
                            selected={travelStyle}
                            onSelect={s => { setTravelStyle(s); savePref('voyageai_style', s); setShowStylePicker(false) }}
                        />
                    )}
                    <Divider />
                    <div style={{ padding: '12px 0 4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <p style={{ color: '#0a1628', fontSize: '13px', fontWeight: '600' }}>Interests</p>
                            <button onClick={() => setShowInterests(!showInterests)} style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#1e6fd9', fontSize: '12px', fontWeight: '600',
                                display: 'flex', alignItems: 'center', gap: '3px',
                            }}>
                                {showInterests ? '▲ Done' : '▼ Edit'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {(showInterests ? INTERESTS : interests).map(interest => {
                                const selected = interests.includes(interest)
                                return (
                                    <button key={interest} onClick={() => showInterests && toggleInterest(interest)} style={{
                                        background: selected ? '#1e6fd9' : '#f0f6ff',
                                        border: selected ? 'none' : '1px solid #c0d8f0',
                                        borderRadius: '20px', padding: '5px 12px', cursor: showInterests ? 'pointer' : 'default',
                                        color: selected ? '#fff' : '#5a7a9f',
                                        fontSize: '12px', fontWeight: '600',
                                    }}>{interest}</button>
                                )
                            })}
                        </div>
                    </div>
                </SettingsCard>

                <SectionHeader title='🔔 Notifications' />
                <SettingsCard>
                    <ToggleRow
                        label='Trip Reminders'
                        desc='Get reminded before your upcoming trips'
                        value={notifications}
                        onToggle={() => toggle(setNotifications, 'voyageai_notifs', notifications)}
                    />
                    <Divider />
                    <ToggleRow
                        label='Flight Price Alerts'
                        desc='Know when prices drop for saved routes'
                        value={flightAlerts}
                        onToggle={() => toggle(setFlightAlerts, 'voyageai_flight_alerts', flightAlerts)}
                    />
                </SettingsCard>

                <SectionHeader title='⚙️ App Settings' />
                <SettingsCard>
                    <ToggleRow
                        label='Dark Mode'
                        desc='Coming soon'
                        value={darkMode}
                        onToggle={() => toggle(setDarkMode, 'voyageai_dark', darkMode)}
                        disabled
                    />
                    <Divider />
                    <SettingsRow label='App Version' value='v1.0.0 (Hackathon)' />
                    <Divider />
                    <SettingsRow label='Clear Conversations' value='' onPress={() => setShowConfirm(true)} danger />
                </SettingsCard>

                <SectionHeader title='ℹ️ About' />
                <SettingsCard>
                    <SettingsRow label='VoyageAI' value='Made with ❤️ by our team' />
                    <Divider />
                    <SettingsRow label='AI Powered by' value='Claude (Anthropic)' />
                    <Divider />
                    <SettingsRow label='Speech by' value='Groq Whisper' />
                </SettingsCard>

            </div>
        </div>
    )
}

// ── Reusable sub-components ───────────────────────────────────────────────
const SectionHeader = ({ title }) => (
    <p style={{
        color: '#5a7a9f', fontSize: '12px', fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: '0.5px',
        marginBottom: '8px', marginTop: '4px', paddingLeft: '4px',
    }}>{title}</p>
)

const SettingsCard = ({ children }) => (
    <div style={{
        background: '#fff', borderRadius: '16px', padding: '4px 16px',
        marginBottom: '16px', border: '1px solid #e0ecff',
        boxShadow: '0 2px 10px #1e6fd910',
    }}>
        {children}
    </div>
)

const Divider = () => (
    <div style={{ height: '1px', background: '#f0f6ff', margin: '0 -4px' }} />
)

const SettingsRow = ({ label, value, onPress, danger }) => (
    <div
        onClick={onPress}
        style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0', cursor: onPress ? 'pointer' : 'default',
        }}
    >
        <p style={{ color: danger ? '#dc2626' : '#0a1628', fontSize: '13px', fontWeight: '600' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {value && <p style={{ color: '#8aaac8', fontSize: '12px' }}>{value}</p>}
            {onPress && <ChevronRight size={14} color={danger ? '#dc2626' : '#8aaac8'} />}
        </div>
    </div>
)

const ToggleRow = ({ label, desc, value, onToggle, disabled }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
        <div style={{ flex: 1 }}>
            <p style={{ color: disabled ? '#c0d8f0' : '#0a1628', fontSize: '13px', fontWeight: '600' }}>{label}</p>
            {desc && <p style={{ color: '#8aaac8', fontSize: '11px', marginTop: '1px' }}>{desc}</p>}
        </div>
        <div
            onClick={disabled ? undefined : onToggle}
            style={{
                width: '44px', height: '24px', borderRadius: '12px',
                background: value && !disabled ? '#1e6fd9' : '#e0ecff',
                position: 'relative', cursor: disabled ? 'default' : 'pointer',
                transition: 'background 0.2s ease', flexShrink: 0,
                boxShadow: value && !disabled ? '0 2px 8px #1e6fd930' : 'none',
            }}
        >
            <div style={{
                position: 'absolute', top: '3px',
                left: value && !disabled ? '23px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease',
            }} />
        </div>
    </div>
)

const PickerGrid = ({ items, selected, onSelect }) => (
    <div style={{
        background: '#f0f6ff', borderRadius: '12px', padding: '10px',
        marginBottom: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap',
    }}>
        {items.map(item => (
            <button key={item.value} onClick={() => onSelect(item.value)} style={{
                background: selected === item.value ? '#1e6fd9' : '#fff',
                border: selected === item.value ? 'none' : '1px solid #c0d8f0',
                borderRadius: '10px', padding: '6px 12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '5px',
            }}>
                <span style={{ fontSize: '13px' }}>{item.prefix}</span>
                <span style={{
                    color: selected === item.value ? '#fff' : '#0a1628',
                    fontSize: '12px', fontWeight: '600',
                }}>{item.label}</span>
                {selected === item.value && <Check size={11} color='#fff' />}
            </button>
        ))}
    </div>
)

export default MeScreen