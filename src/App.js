import React, { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import ItineraryScreen from './screens/ItineraryScreen'
import TranslateScreen from './screens/TranslateScreen'
import MyTripsScreen from './screens/MyTripsScreen'
import ExploreScreen from './screens/ExploreScreen'
import GuideScreen from './screens/GuideScreen'
import MeScreen from './screens/MeScreen'
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

    // Normalise destination to uppercase IATA or title case city
    const rawDest = isHotel
        ? (data?.city || hotel.address?.split(',')[0] || 'Unknown')
        : (data?.destination || flight.destination || 'Unknown')
    const destination = rawDest.charAt(0).toUpperCase() + rawDest.slice(1).toLowerCase()

    // Date: use check-in date for hotels, flight date for flights
    // Never fall back to today — use null so "TBD" shows instead
    const date = data?.checkIn || data?.date || null

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
    const [chatPrompt, setChatPrompt]     = useState('')
    const [bookingData, setBookingData]   = useState(null)
    const [ticketData, setTicketData]     = useState(null)

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
                        onPaymentComplete={(data) => {
                            const trip = saveTrip(data)
                            setTicketData({ ...data, ...trip })
                            setActiveScreen('eticket')
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
                return <ExploreScreen setActiveScreen={setActiveScreen} />
            case 'guide':
                return <GuideScreen setActiveScreen={setActiveScreen} />
            case 'me':
                return (
                    <MeScreen
                        setActiveScreen={setActiveScreen}
                        language={language}
                        setLanguage={setLanguage}
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
            {activeScreen !== 'chat' && (
                <FloatingAIButton
                    setActiveScreen={setActiveScreen}
                    setChatPrompt={setChatPrompt}
                />
            )}
        </div>
    )
}

export default App