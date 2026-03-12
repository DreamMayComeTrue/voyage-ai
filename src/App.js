import React, { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import ChatScreen from './screens/ChatScreen'
import ItineraryScreen from './screens/ItineraryScreen'
import MapScreen from './screens/MapScreen'
import MyTripsScreen from './screens/MyTripsScreen'
import BottomNav from './components/BottomNav'
import './App.css'

function App() {
  const [activeScreen, setActiveScreen] = useState('home')
  const [itineraries, setItineraries] = useState([])
  const [trips, setTrips] = useState([])

  const saveItinerary = (itinerary) => {
    setItineraries(prev => [...prev, itinerary])
  }

  const saveTrip = (trip) => {
    setTrips(prev => [...prev, trip])
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
            />
        )
      case 'itinerary':
        return (
            <ItineraryScreen
                itineraries={itineraries}
                setActiveScreen={setActiveScreen}
            />
        )
      case 'map':
        return (
            <MapScreen
                itineraries={itineraries}
                setActiveScreen={setActiveScreen}
            />
        )
      case 'mytrips':
        return (
            <MyTripsScreen
                trips={trips}
                setActiveScreen={setActiveScreen}
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
        <BottomNav
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
        />
      </div>
  )
}

export default App