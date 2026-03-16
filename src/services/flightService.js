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

const getLocalDateStr = () => {
    const today = new Date()
    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
    ].join('-')
}

const isElectron = () => {
    return typeof window !== 'undefined' &&
        window.process &&
        window.process.type === 'renderer'
}

export const searchFlights = async (origin, destination, date) => {
    try {
        const originCode = getAirportCode(origin)
        const destCode   = getAirportCode(destination)
        const todayStr   = getLocalDateStr()
        const isToday    = date === todayStr

        console.log(`Searching: ${originCode} → ${destCode} on ${date} | today: ${todayStr} | isToday: ${isToday}`)

        // Free plan only supports real-time flights (no flight_date param)
        // Only try for today since it shows currently active/scheduled flights
        if (isToday && AVIATIONSTACK_KEY) {
            try {
                // Free plan endpoint: filter by dep + arr only, no date param
                const apiUrl = `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=${originCode}&arr_iata=${destCode}&flight_status=scheduled&limit=5`

                // Use proxy for browser, direct for Electron
                const url = isElectron()
                    ? apiUrl
                    : `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`

                console.log('API URL:', url)
                const response = await fetch(url)
                const data = await response.json()
                console.log('API response:', JSON.stringify(data).slice(0, 300))

                if (data.data && data.data.length > 0) {
                    console.log(`✅ Got ${data.data.length} real flights!`)
                    return data.data.map(flight => ({
                        airline:       flight.airline?.name || 'Unknown Airline',
                        flightNumber:  flight.flight?.iata || 'N/A',
                        origin:        flight.departure?.iata || originCode,
                        destination:   flight.arrival?.iata || destCode,
                        departureTime: flight.departure?.scheduled || flight.departure?.estimated || `${date}T08:00:00+08:00`,
                        arrivalTime:   flight.arrival?.scheduled   || flight.arrival?.estimated   || `${date}T16:00:00+09:00`,
                        status:        flight.flight_status || 'scheduled',
                        terminal:      flight.departure?.terminal || 'TBD',
                        gate:          flight.departure?.gate || 'TBD',
                        price:         `MYR ${Math.floor(Math.random() * 800) + 400}`,
                        isRealData:    true,
                    }))
                }

                if (data.error) {
                    console.warn('API error:', data.error?.info || data.error)
                }
            } catch (apiErr) {
                console.warn('API call failed, using mock:', apiErr.message)
            }
        }

        console.log('Using mock data')
        return getMockFlights(originCode, destCode, date)

    } catch (error) {
        console.error('searchFlights error:', error)
        return getMockFlights(getAirportCode(origin), getAirportCode(destination), date)
    }
}

const getMockFlights = (origin, destination, date) => {
    const now = new Date()
    const todayStr = getLocalDateStr()
    const isToday = date === todayStr

    // For today's flights, only show times that are in the future (at least 3 hours from now)
    const currentHour = now.getHours() + now.getMinutes() / 60
    const minHour = isToday ? currentHour + 3 : 0 // need 3h buffer for check-in

    const airlines = [
        { name: 'AirAsia X',         code: 'D7', terminal: 'T2' },
        { name: 'Malaysia Airlines', code: 'MH', terminal: 'T1' },
        { name: 'Batik Air',         code: 'OD', terminal: 'T2' },
    ]

    // All possible departure slots throughout the day
    const allSlots = [
        { dep: '06:00', arr: '14:30', price: 520  },
        { dep: '08:00', arr: '16:30', price: 580  },
        { dep: '10:30', arr: '19:00', price: 650  },
        { dep: '13:30', arr: '22:00', price: 790  },
        { dep: '16:00', arr: '00:30', price: 720  },
        { dep: '19:30', arr: '04:00', price: 870  },
        { dep: '22:10', arr: '06:15', price: 1050 },
        { dep: '23:55', arr: '08:20', price: 980  },
    ]

    // Filter to slots that are in the future (or all if not today)
    const validSlots = isToday
        ? allSlots.filter(s => {
            const [h, m] = s.dep.split(':').map(Number)
            return (h + m / 60) > minHour
        })
        : allSlots

    // Pick 3 evenly spread slots, or fewer if not enough valid ones
    const picked = validSlots.length >= 3
        ? [
            validSlots[0],
            validSlots[Math.floor(validSlots.length / 2)],
            validSlots[validSlots.length - 1],
        ]
        : validSlots.length > 0
            ? validSlots
            : allSlots.slice(0, 3) // fallback: future date, show first 3

    return airlines.slice(0, picked.length).map((airline, i) => {
        const slot = picked[i]
        const gate = `G${10 + i * 5}`
        return {
            airline:       airline.name,
            flightNumber:  `${airline.code}${500 + i * 111}`,
            origin,
            destination,
            departureTime: `${date}T${slot.dep}:00+08:00`,
            arrivalTime:   `${date}T${slot.arr}:00+09:00`,
            price:         `MYR ${slot.price}`,
            status:        'Scheduled',
            terminal:      airline.terminal,
            gate,
            isRealData:    false,
        }
    })
}

export const searchHotels = async (city) => {
    return [
        {
            name:      `Grand Hyatt ${city}`,
            stars:     5,
            price:     'MYR 680/night',
            rating:    4.8,
            address:   `City Center, ${city}`,
            amenities: ['Free WiFi', 'Pool', 'Gym', 'Spa'],
        },
        {
            name:      `Marriott ${city}`,
            stars:     5,
            price:     'MYR 520/night',
            rating:    4.7,
            address:   `Business District, ${city}`,
            amenities: ['Free WiFi', 'Pool', 'Restaurant'],
        },
        {
            name:      `Hilton ${city}`,
            stars:     4,
            price:     'MYR 380/night',
            rating:    4.5,
            address:   `Tourist Area, ${city}`,
            amenities: ['Free WiFi', 'Breakfast', 'Gym'],
        },
    ]
}

export const getWeather = async (city) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_KEY}&units=metric&cnt=5`
        const response = await fetch(url)
        const data = await response.json()
        if (data.list && data.list.length > 0) {
            const f = data.list[0]
            return {
                city:        data.city?.name || city,
                temp:        Math.round(f.main?.temp),
                feels_like:  Math.round(f.main?.feels_like),
                description: f.weather?.[0]?.description || 'Clear',
                humidity:    f.main?.humidity,
                wind:        f.wind?.speed,
                icon:        f.weather?.[0]?.icon,
            }
        }
        return getMockWeather(city)
    } catch {
        return getMockWeather(city)
    }
}

const getMockWeather = (city) => ({
    city, temp: 28, feels_like: 32,
    description: 'Partly cloudy', humidity: 75, wind: 12, icon: '02d',
})