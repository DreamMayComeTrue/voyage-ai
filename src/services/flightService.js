const AVIATIONSTACK_KEY = process.env.REACT_APP_AVIATIONSTACK_KEY
const OPENWEATHER_KEY = process.env.REACT_APP_OPENWEATHER_KEY

const AIRPORT_CODES = {
    'kuala lumpur': 'KUL', 'kl': 'KUL', 'malaysia': 'KUL',
    'tokyo': 'NRT', 'japan': 'NRT', 'narita': 'NRT',
    'singapore': 'SIN',
    'bangkok': 'BKK', 'thailand': 'BKK',
    'bali': 'DPS', 'denpasar': 'DPS',
    'london': 'LHR',
    'paris': 'CDG',
    'dubai': 'DXB',
    'sydney': 'SYD',
    'new york': 'JFK', 'newyork': 'JFK',
    'hong kong': 'HKG', 'hongkong': 'HKG',
    'seoul': 'ICN',
    'beijing': 'PEK',
    'shanghai': 'PVG',
    'jakarta': 'CGK',
    'manila': 'MNL',
    'taipei': 'TPE',
    'osaka': 'KIX',
    'melbourne': 'MEL',
    'amsterdam': 'AMS',
    'frankfurt': 'FRA',
    'rome': 'FCO',
    'barcelona': 'BCN',
    'istanbul': 'IST',
    'cairo': 'CAI',
    'mumbai': 'BOM',
    'delhi': 'DEL',
}

export const getAirportCode = (city) => {
    if (!city) return 'KUL'
    const lower = city.toLowerCase().trim()
    return AIRPORT_CODES[lower] || city.toUpperCase().slice(0, 3)
}

// Helper: get today's date in local timezone
const getLocalDateStr = () => {
    const today = new Date()
    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
    ].join('-')
}

// Helper: detect if running inside Electron
const isElectron = () => {
    return window && window.process && window.process.type === 'renderer'
}

export const searchFlights = async (origin, destination, date) => {
    try {
        const originCode = getAirportCode(origin)
        const destCode   = getAirportCode(destination)
        const todayStr   = getLocalDateStr()
        const isToday    = date === todayStr

        console.log(`Searching flights: ${originCode} → ${destCode} on ${date} (today: ${todayStr}, isToday: ${isToday})`)

        if (isToday && AVIATIONSTACK_KEY) {
            // Direct call — works in Electron (no CORS)
            // Use proxy only for browser
            let url
            if (isElectron()) {
                url = `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=${originCode}&arr_iata=${destCode}&flight_date=${date}&limit=5`
            } else {
                url = `https://api.allorigins.win/raw?url=${encodeURIComponent(`http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=${originCode}&arr_iata=${destCode}&flight_date=${date}&limit=5`)}`
            }

            console.log('Calling Aviationstack URL:', url)

            const response = await fetch(url)
            const data = await response.json()

            console.log('Aviationstack response:', JSON.stringify(data).slice(0, 500))

            if (data.data && data.data.length > 0) {
                console.log(`Got ${data.data.length} real flights!`)
                return data.data.map(flight => ({
                    airline:       flight.airline?.name || 'Unknown Airline',
                    flightNumber:  flight.flight?.iata || 'N/A',
                    origin:        flight.departure?.iata || originCode,
                    destination:   flight.arrival?.iata || destCode,
                    departureTime: flight.departure?.scheduled || flight.departure?.estimated || 'TBD',
                    arrivalTime:   flight.arrival?.scheduled || flight.arrival?.estimated || 'TBD',
                    status:        flight.flight_status || 'scheduled',
                    terminal:      flight.departure?.terminal || 'TBD',
                    gate:          flight.departure?.gate || 'TBD',
                    price:         `MYR ${Math.floor(Math.random() * 800) + 400}`,
                    isRealData:    true,
                }))
            } else {
                console.log('API returned empty, error:', data.error)
            }
        }

        // Future dates or API failed → use mock
        console.log('Using mock data for:', originCode, '→', destCode, date)
        return getMockFlights(originCode, destCode, date)

    } catch (error) {
        console.error('Flight search error:', error)
        return getMockFlights(getAirportCode(origin), getAirportCode(destination), date)
    }
}

const getMockFlights = (origin, destination, date) => {
    const airlines = [
        { name: 'AirAsia', code: 'AK' },
        { name: 'Malaysia Airlines', code: 'MH' },
        { name: 'Batik Air', code: 'OD' },
    ]

    const depTimes = ['08:00', '13:30', '22:10']
    const arrTimes = ['16:30', '22:00', '06:15']

    return airlines.map((airline, i) => ({
        airline:       airline.name,
        flightNumber:  `${airline.code}${500 + i * 111}`,
        origin,
        destination,
        departureTime: `${date}T${depTimes[i]}:00+08:00`,
        arrivalTime:   `${date}T${arrTimes[i]}:00+09:00`,
        price:         `MYR ${580 + i * 210}`,
        status:        'Scheduled',
        terminal:      `T${i + 1}`,
        gate:          `G${10 + i * 5}`,
        isRealData:    false,
    }))
}

export const searchHotels = async (city, checkIn, checkOut) => {
    const hotels = [
        {
            name: `Grand Hyatt ${city}`,
            stars: 5,
            price: 'MYR 680/night',
            rating: 4.8,
            address: `City Center, ${city}`,
            amenities: ['Free WiFi', 'Pool', 'Gym', 'Spa'],
        },
        {
            name: `Marriott ${city}`,
            stars: 5,
            price: 'MYR 520/night',
            rating: 4.7,
            address: `Business District, ${city}`,
            amenities: ['Free WiFi', 'Pool', 'Restaurant'],
        },
        {
            name: `Hilton ${city}`,
            stars: 4,
            price: 'MYR 380/night',
            rating: 4.5,
            address: `Tourist Area, ${city}`,
            amenities: ['Free WiFi', 'Breakfast', 'Gym'],
        },
    ]
    return hotels
}

export const getWeather = async (city) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_KEY}&units=metric&cnt=5`
        const response = await fetch(url)
        const data = await response.json()

        if (data.list && data.list.length > 0) {
            const forecast = data.list[0]
            return {
                city:        data.city?.name || city,
                temp:        Math.round(forecast.main?.temp),
                feels_like:  Math.round(forecast.main?.feels_like),
                description: forecast.weather?.[0]?.description || 'Clear',
                humidity:    forecast.main?.humidity,
                wind:        forecast.wind?.speed,
                icon:        forecast.weather?.[0]?.icon,
            }
        }
        return getMockWeather(city)
    } catch (error) {
        return getMockWeather(city)
    }
}

const getMockWeather = (city) => ({
    city,
    temp: 28,
    feels_like: 32,
    description: 'Partly cloudy',
    humidity: 75,
    wind: 12,
    icon: '02d',
})