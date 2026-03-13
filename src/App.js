import React, { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import ItineraryScreen from './screens/ItineraryScreen'
import TranslateScreen from './screens/TranslateScreen'
import MyTripsScreen from './screens/MyTripsScreen'
import ExploreScreen from './screens/ExploreScreen'
import GuideScreen from './screens/GuideScreen'
import MeScreen from './screens/MeScreen'
import BottomNav from './components/BottomNav'
import FloatingAIButton from './components/FloatingAIButton'
import './App.css'

function App() {
    const [activeScreen, setActiveScreen] = useState('home')
    const [itineraries, setItineraries] = useState([])
    const [trips, setTrips] = useState([])
    const [language, setLanguage] = useState('en')
    const [chatPrompt, setChatPrompt] = useState('')

    const saveItinerary = (itinerary) => {
        setItineraries(prev => [...prev, itinerary])
    }

    const saveTrip = (trip) => {
        setTrips(prev => [...prev, trip])
    }

    const renderScreen = () => {
        switch (activeScreen) {
            case 'home':
                return <HomeScreen setActiveScreen={setActiveScreen} itineraries={itineraries} trips={trips} />
            case 'chat':
                return <ChatScreen setActiveScreen={setActiveScreen} saveItinerary={saveItinerary} saveTrip={saveTrip} itineraries={itineraries} trips={trips} initialPrompt={chatPrompt} setChatPrompt={setChatPrompt} />
            case 'itinerary':
                return <ItineraryScreen itineraries={itineraries} setActiveScreen={setActiveScreen} />
            case 'translate':
                return <TranslateScreen setActiveScreen={setActiveScreen} />
            case 'mytrips':
                return <MyTripsScreen trips={trips} setActiveScreen={setActiveScreen} />
            case 'explore':
                return <ExploreScreen setActiveScreen={setActiveScreen} />
            case 'guide':
                return <GuideScreen setActiveScreen={setActiveScreen} />
            case 'me':
                return <MeScreen setActiveScreen={setActiveScreen} language={language} setLanguage={setLanguage} />
            default:
                return <HomeScreen setActiveScreen={setActiveScreen} itineraries={itineraries} trips={trips} />
        }
    }

    return (
        <div className="app-container">
            <div className="screen-content">
                {renderScreen()}
            </div>
            <BottomNav
                activeScreen={activeScreen}
                setActiveScreen={setActiveScreen}
            />
            {/* Floating AI button — hidden when already on chat screen */}
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