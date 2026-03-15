import React, { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import ItineraryScreen from './screens/ItineraryScreen'
import TranslateScreen from './screens/TranslateScreen'
import MyTripsScreen from './screens/MyTripsScreen'
import ExploreScreen from './screens/ExploreScreen'
import GuideScreen from './screens/GuideScreen'
import MeScreen from './screens/MeScreen'
import ARMapScreen from './screens/ARMapScreen'
import PaymentScreen from './screens/PaymentScreen'
import ETicketScreen from './screens/ETicketScreen'
import BottomNav from './components/BottomNav'
import FloatingAIButton from './components/FloatingAIButton'
import './App.css'

// ── Helper: extract clean trip info from booking data ─────────────────────
const buildTrip = (data) => {
    const isHotel = data?.type === 'hotel'
    const flight  = data?.flight || {}
    const hotel   = data?.hotel  || {}

    // Destination: city name from flight destination or hotel city
    const destination = isHotel
        ? (data?.city || hotel.name?.split(' ').pop() || 'Unknown')
        : (data?.destination || flight.destination || 'Unknown')

    // Date: flight date or today for hotel
    const date = data?.date || new Date().toISOString().split('T')[0]

    // Friendly date display
    const dateDisplay = (() => {
        try {
            return new Date(date).toLocaleDateString('en-MY', {
                day: 'numeric', month: 'short', year: 'numeric'
            })
        } catch { return date }
    })()

    return {
        ...data,
        id:          Date.now(),
        destination,
        date,
        dateDisplay,
        title:       isHotel ? hotel.name : `${flight.origin || 'KUL'} → ${destination}`,
        type:        data?.type || 'flight',
        status:      'confirmed',
        bookingRef:  data?.bookingRef || 'VA000000',
        savedAt:     new Date().toISOString(),
    }
}

function App() {
    const [activeScreen, setActiveScreen] = useState('home')
    const [itineraries, setItineraries]   = useState([])
    const [trips, setTrips]               = useState([])
    const [language, setLanguage]         = useState('en')
    const [currency, setCurrency]         = useState(() => {
        try { return JSON.parse(localStorage.getItem('voyageai_currency') || '"MYR"') } catch { return 'MYR' }
    })
    const [chatPrompt, setChatPrompt]     = useState('')
    const [bookingData, setBookingData]   = useState(null)
    const [ticketData, setTicketData]     = useState(null)
    const [bookedGuides, setBookedGuides] = useState([])  // [{guideId, days, ref, paidAt}]

    const saveItinerary = (itinerary) => {
        setItineraries(prev => [...prev, itinerary])
    }

    const saveTrip = (data) => {
        const trip = buildTrip(data)
        setTrips(prev => [...prev, trip])
        return trip
    }

    // Payment screen — no BottomNav
    if (activeScreen === 'payment') {
        return (
            <div className="app-container">
                <div className="screen-content">
                    <PaymentScreen
                        setActiveScreen={setActiveScreen}
                        bookingData={bookingData}
                        currency={currency}
                        onPaymentComplete={(data) => {
                            if (data?.type === 'guide') {
                                // Guide booking — save to bookedGuides, go back to guide page
                                setBookedGuides(prev => [...prev, {
                                    guideId: data.guide?.id,
                                    days: data.days,
                                    ref: data.bookingRef,
                                    paidAt: data.paidAt,
                                }])
                                setActiveScreen('guide')
                            } else {
                                // Flight/hotel booking — show e-ticket
                                const trip = saveTrip(data)
                                setTicketData({ ...data, ...trip })
                                setActiveScreen('eticket')
                            }
                        }}
                    />
                </div>
            </div>
        )
    }

    // E-ticket screen — no BottomNav
    if (activeScreen === 'eticket') {
        return (
            <div className="app-container">
                <div className="screen-content">
                    <ETicketScreen
                        setActiveScreen={setActiveScreen}
                        ticketData={ticketData}
                    />
                </div>
            </div>
        )
    }

    const renderScreen = () => {
        switch (activeScreen) {
            case 'home':
                return (
                    <HomeScreen
                        setActiveScreen={setActiveScreen}
                        itineraries={itineraries}
                        trips={trips}
                    />
                )
            case 'chat':
                return (
                    <ChatScreen
                        setActiveScreen={setActiveScreen}
                        saveItinerary={saveItinerary}
                        saveTrip={saveTrip}
                        itineraries={itineraries}
                        trips={trips}
                        initialPrompt={chatPrompt}
                        setChatPrompt={setChatPrompt}
                        setBookingData={setBookingData}
                        currency={currency}
                    />
                )
            case 'itinerary':
                return (
                    <ItineraryScreen
                        itineraries={itineraries}
                        setActiveScreen={setActiveScreen}
                    />
                )
            case 'translate':
                return <TranslateScreen setActiveScreen={setActiveScreen} />
            case 'mytrips':
                return (
                    <MyTripsScreen
                        trips={trips}
                        setActiveScreen={setActiveScreen}
                        setTicketData={setTicketData}
                    />
                )
            case 'explore':
                return <ExploreScreen setActiveScreen={setActiveScreen} setChatPrompt={setChatPrompt} />
            case 'guide':
                return <GuideScreen
                    setActiveScreen={setActiveScreen}
                    setBookingData={setBookingData}
                    bookedGuides={bookedGuides}
                />
            case 'armap':
                return (
                    <ARMapScreen
                        trips={trips}
                        itineraries={itineraries}
                        setActiveScreen={setActiveScreen}
                    />
                )
            case 'me':
                return (
                    <MeScreen
                        setActiveScreen={setActiveScreen}
                        language={language}
                        setLanguage={setLanguage}
                        currency={currency}
                        setCurrency={(c) => {
                            setCurrency(c)
                            try { localStorage.setItem('voyageai_currency', JSON.stringify(c)) } catch {}
                        }}
                        trips={trips}
                        itineraries={itineraries}
                    />
                )
            default:
                return (
                    <HomeScreen
                        setActiveScreen={setActiveScreen}
                        itineraries={itineraries}
                        trips={trips}
                    />
                )
        }
    }

    return (
        <div className="app-container">
            <div className="screen-content">
                {renderScreen()}
            </div>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
            {activeScreen !== 'chat' && activeScreen !== 'armap' && (
                <FloatingAIButton
                    setActiveScreen={setActiveScreen}
                    setChatPrompt={setChatPrompt}
                />
            )}
        </div>
    )
}

export default App