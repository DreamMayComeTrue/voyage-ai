import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, Layers, X, ChevronRight, Plane, Hotel, Map, Compass } from 'lucide-react'

// ── Destination coordinates ───────────────────────────────────────────────
const DEST_COORDS = {
    // IATA codes
    NRT: { lat: 35.6762, lng: 139.6503, name: 'Tokyo', emoji: '🗼' },
    TYO: { lat: 35.6762, lng: 139.6503, name: 'Tokyo', emoji: '🗼' },
    KIX: { lat: 34.6937, lng: 135.5023, name: 'Osaka', emoji: '🏯' },
    SIN: { lat: 1.3521,  lng: 103.8198, name: 'Singapore', emoji: '🦁' },
    BKK: { lat: 13.7563, lng: 100.5018, name: 'Bangkok', emoji: '🐘' },
    DPS: { lat: -8.3405, lng: 115.0920, name: 'Bali', emoji: '🌴' },
    LHR: { lat: 51.5074, lng: -0.1278,  name: 'London', emoji: '🎡' },
    CDG: { lat: 48.8566, lng: 2.3522,   name: 'Paris', emoji: '🗽' },
    DXB: { lat: 25.2048, lng: 55.2708,  name: 'Dubai', emoji: '🏙️' },
    SYD: { lat: -33.8688,lng: 151.2093, name: 'Sydney', emoji: '🦘' },
    JFK: { lat: 40.7128, lng: -74.0060, name: 'New York', emoji: '🗽' },
    HKG: { lat: 22.3193, lng: 114.1694, name: 'Hong Kong', emoji: '🌆' },
    ICN: { lat: 37.5665, lng: 126.9780, name: 'Seoul', emoji: '🇰🇷' },
    KUL: { lat: 3.1390,  lng: 101.6869, name: 'Kuala Lumpur', emoji: '🌃' },
    // City names
    tokyo:        { lat: 35.6762, lng: 139.6503, name: 'Tokyo', emoji: '🗼' },
    osaka:        { lat: 34.6937, lng: 135.5023, name: 'Osaka', emoji: '🏯' },
    singapore:    { lat: 1.3521,  lng: 103.8198, name: 'Singapore', emoji: '🦁' },
    bangkok:      { lat: 13.7563, lng: 100.5018, name: 'Bangkok', emoji: '🐘' },
    bali:         { lat: -8.3405, lng: 115.0920, name: 'Bali', emoji: '🌴' },
    london:       { lat: 51.5074, lng: -0.1278,  name: 'London', emoji: '🎡' },
    paris:        { lat: 48.8566, lng: 2.3522,   name: 'Paris', emoji: '🗽' },
    dubai:        { lat: 25.2048, lng: 55.2708,  name: 'Dubai', emoji: '🏙️' },
    sydney:       { lat: -33.8688,lng: 151.2093, name: 'Sydney', emoji: '🦘' },
    seoul:        { lat: 37.5665, lng: 126.9780, name: 'Seoul', emoji: '🇰🇷' },
    'kuala lumpur':{ lat: 3.1390, lng: 101.6869, name: 'Kuala Lumpur', emoji: '🌃' },
    'hong kong':  { lat: 22.3193, lng: 114.1694, name: 'Hong Kong', emoji: '🌆' },
    'new york':   { lat: 40.7128, lng: -74.0060, name: 'New York', emoji: '🗽' },
    jaipur:       { lat: 26.9124, lng: 75.7873,  name: 'Jaipur', emoji: '🏰' },
    'ho chi minh':{ lat: 10.8231, lng: 106.6297, name: 'Ho Chi Minh', emoji: '🇻🇳' },
    langkawi:     { lat: 6.3500,  lng: 99.8000,  name: 'Langkawi', emoji: '🏖️' },
    kyoto:        { lat: 35.0116, lng: 135.7681, name: 'Kyoto', emoji: '⛩️' },
    ubud:         { lat: -8.5069, lng: 115.2625, name: 'Ubud', emoji: '🌿' },
}

const getCoords = (destination) => {
    if (!destination) return null
    const key = destination.toLowerCase().trim()
    // Try direct city name match
    if (DEST_COORDS[key]) return DEST_COORDS[key]
    // Try IATA code
    if (DEST_COORDS[destination.toUpperCase()]) return DEST_COORDS[destination.toUpperCase()]
    // Partial match
    for (const [k, v] of Object.entries(DEST_COORDS)) {
        if (key.includes(k) || k.includes(key)) return v
    }
    return null
}

// ── Known tourist place coordinates ──────────────────────────────────────
const PLACE_COORDS = {
    // Tokyo
    'senso-ji temple':{ lat:35.7148,lng:139.7967 }, 'senso-ji':{ lat:35.7148,lng:139.7967 },
    'asakusa':{ lat:35.7148,lng:139.7967 }, 'shibuya crossing':{ lat:35.6595,lng:139.7004 },
    'shibuya':{ lat:35.6595,lng:139.7004 }, 'shinjuku':{ lat:35.6938,lng:139.7034 },
    'meiji shrine':{ lat:35.6764,lng:139.6993 }, 'harajuku':{ lat:35.6702,lng:139.7026 },
    'akihabara':{ lat:35.7022,lng:139.7744 }, 'tsukiji market':{ lat:35.6654,lng:139.7707 },
    'tokyo tower':{ lat:35.6586,lng:139.7454 }, 'tokyo skytree':{ lat:35.7101,lng:139.8107 },
    'ueno park':{ lat:35.7147,lng:139.7733 }, 'teamlab':{ lat:35.6262,lng:139.7745 },
    'odaiba':{ lat:35.6242,lng:139.7756 }, 'roppongi':{ lat:35.6628,lng:139.7320 },
    'ginza':{ lat:35.6717,lng:139.7649 }, 'nakameguro':{ lat:35.6441,lng:139.6989 },
    // Kyoto
    'fushimi inari':{ lat:34.9671,lng:135.7727 }, 'fushimi inari shrine':{ lat:34.9671,lng:135.7727 },
    'arashiyama':{ lat:35.0094,lng:135.6762 }, 'bamboo grove':{ lat:35.0170,lng:135.6721 },
    'kinkaku-ji':{ lat:35.0394,lng:135.7292 }, 'golden pavilion':{ lat:35.0394,lng:135.7292 },
    'gion district':{ lat:35.0038,lng:135.7757 }, 'gion':{ lat:35.0038,lng:135.7757 },
    'nishiki market':{ lat:35.0048,lng:135.7655 }, 'kiyomizu-dera':{ lat:34.9948,lng:135.7851 },
    // Bangkok
    'grand palace':{ lat:13.7500,lng:100.4913 }, 'wat pho':{ lat:13.7465,lng:100.4927 },
    'wat arun':{ lat:13.7437,lng:100.4888 }, 'chatuchak':{ lat:13.7999,lng:100.5499 },
    'khao san road':{ lat:13.7589,lng:100.4977 }, 'lumphini park':{ lat:13.7317,lng:100.5418 },
    'sukhumvit':{ lat:13.7305,lng:100.5702 }, 'asiatique':{ lat:13.7101,lng:100.5077 },
    // Singapore
    'gardens by the bay':{ lat:1.2816,lng:103.8636 }, 'marina bay sands':{ lat:1.2838,lng:103.8592 },
    'marina bay':{ lat:1.2838,lng:103.8592 }, 'sentosa':{ lat:1.2494,lng:103.8303 },
    'chinatown':{ lat:1.2838,lng:103.8443 }, 'little india':{ lat:1.3066,lng:103.8518 },
    'orchard road':{ lat:1.3048,lng:103.8318 }, 'clarke quay':{ lat:1.2906,lng:103.8467 },
    'merlion':{ lat:1.2868,lng:103.8545 },
    // Bali
    'tanah lot':{ lat:-8.6212,lng:115.0868 }, 'uluwatu':{ lat:-8.8292,lng:115.0849 },
    'ubud market':{ lat:-8.5069,lng:115.2625 }, 'tegallalang':{ lat:-8.4320,lng:115.2785 },
    'mount batur':{ lat:-8.2424,lng:115.3756 }, 'seminyak':{ lat:-8.6878,lng:115.1609 },
    'kuta':{ lat:-8.7183,lng:115.1686 }, 'tirta empul':{ lat:-8.4153,lng:115.3161 },
    // Dubai
    'burj khalifa':{ lat:25.1972,lng:55.2744 }, 'dubai mall':{ lat:25.1972,lng:55.2797 },
    'palm jumeirah':{ lat:25.1124,lng:55.1390 }, 'dubai creek':{ lat:25.2627,lng:55.3045 },
    'gold souk':{ lat:25.2857,lng:55.3050 }, 'desert safari':{ lat:24.8830,lng:55.5010 },
    'burj al arab':{ lat:25.1412,lng:55.1853 },
    // Paris
    'eiffel tower':{ lat:48.8584,lng:2.2945 }, 'louvre':{ lat:48.8606,lng:2.3376 },
    'louvre museum':{ lat:48.8606,lng:2.3376 }, 'notre dame':{ lat:48.8530,lng:2.3499 },
    'montmartre':{ lat:48.8867,lng:2.3431 }, 'champs-élysées':{ lat:48.8698,lng:2.3078 },
    'versailles':{ lat:48.8049,lng:2.1204 },
    // Seoul
    'gyeongbokgung':{ lat:37.5796,lng:126.9770 }, 'gyeongbokgung palace':{ lat:37.5796,lng:126.9770 },
    'bukchon hanok':{ lat:37.5823,lng:126.9850 }, 'myeongdong':{ lat:37.5636,lng:126.9854 },
    'hongdae':{ lat:37.5563,lng:126.9228 }, 'gangnam':{ lat:37.4979,lng:127.0276 },
    'n seoul tower':{ lat:37.5512,lng:126.9882 }, 'insadong':{ lat:37.5742,lng:126.9856 },
    'han river':{ lat:37.5170,lng:126.9969 },
    // London
    'big ben':{ lat:51.5007,lng:-0.1246 }, 'buckingham palace':{ lat:51.5014,lng:-0.1419 },
    'tower of london':{ lat:51.5081,lng:-0.0759 }, 'tower bridge':{ lat:51.5055,lng:-0.0754 },
    'british museum':{ lat:51.5194,lng:-0.1270 }, 'trafalgar square':{ lat:51.5080,lng:-0.1281 },
    'london eye':{ lat:51.5033,lng:-0.1195 }, 'covent garden':{ lat:51.5117,lng:-0.1240 },
    // KL
    'petronas towers':{ lat:3.1579,lng:101.7116 }, 'petronas twin towers':{ lat:3.1579,lng:101.7116 },
    'batu caves':{ lat:3.2379,lng:101.6840 }, 'bukit bintang':{ lat:3.1466,lng:101.7100 },
    'merdeka square':{ lat:3.1486,lng:101.6944 },
    // Sydney
    'opera house':{ lat:-33.8568,lng:151.2153 }, 'sydney opera house':{ lat:-33.8568,lng:151.2153 },
    'harbour bridge':{ lat:-33.8523,lng:151.2108 }, 'bondi beach':{ lat:-33.8915,lng:151.2767 },
    'darling harbour':{ lat:-33.8726,lng:151.1993 }, 'the rocks':{ lat:-33.8596,lng:151.2090 },
    // Hong Kong
    'victoria peak':{ lat:22.2759,lng:114.1455 }, 'the peak':{ lat:22.2759,lng:114.1455 },
    'tsim sha tsui':{ lat:22.2988,lng:114.1722 }, 'ocean park':{ lat:22.2470,lng:114.1717 },
    'avenue of stars':{ lat:22.2933,lng:114.1745 },
}

const getPlaceCoords = (placeName, cityCoords) => {
    if (!placeName) return null
    const key = placeName.toLowerCase().replace(/[*_#•🎤]/g, '').replace(/\s+/g, ' ').trim()
    if (PLACE_COORDS[key]) return PLACE_COORDS[key]
    for (const [k, v] of Object.entries(PLACE_COORDS)) {
        if (key.includes(k) || k.includes(key)) return v
    }
    // Fallback: jitter around city center so pins don't stack
    if (cityCoords) {
        const seed = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
        return {
            lat: cityCoords.lat + (((seed * 13) % 100) - 50) * 0.003,
            lng: cityCoords.lng + (((seed * 17) % 100) - 50) * 0.003,
        }
    }
    return null
}

// Day colours — one per day
const DAY_COLORS = ['#1e6fd9','#059669','#f59e0b','#7c3aed','#ef4444','#0ea5e9','#ec4899','#14b8a6']
const getDayColor = (i) => DAY_COLORS[i % DAY_COLORS.length]
const HOME = { lat: 3.1390, lng: 101.6869, name: 'Kuala Lumpur', emoji: '🏠' }

// ── Main Screen ───────────────────────────────────────────────────────────
const ARMapScreen = ({ trips = [], itineraries = [], setActiveScreen }) => {
    const mapRef      = useRef(null)
    const leafletRef  = useRef(null) // Leaflet map instance
    const [mapLoaded, setMapLoaded]   = useState(false)
    const [mapError,  setMapError]    = useState(false)
    const [activeLayer, setActiveLayer] = useState('trips') // 'trips' | 'itinerary' | 'explore'
    const [selectedPin, setSelectedPin] = useState(null)
    const [mapStyle, setMapStyle]     = useState('street') // 'street' | 'satellite' | 'dark'
    const [drilldown, setDrilldown]   = useState(null) // itinerary currently drilled into

    // Build pin data from trips
    const tripPins = trips
        .map(t => {
            const coords = getCoords(t.destination) || getCoords(t.flight?.destination)
            if (!coords) return null
            return {
                ...coords,
                type: 'trip',
                label: t.destination || coords.name,
                detail: t.type === 'hotel' ? (t.hotel?.name || 'Hotel') : (t.flight?.airline || 'Flight'),
                date: t.dateDisplay || t.date,
                bookingRef: t.bookingRef,
                tripType: t.type,
            }
        }).filter(Boolean)

    // Build pin data from itineraries
    const itinPins = itineraries
        .map(it => {
            const dest = it.destination || it.title
            const coords = getCoords(dest)
            if (!coords) return null
            return {
                ...coords,
                type: 'itinerary',
                label: coords.name,
                detail: it.title,
                days: it.totalDays || it.days?.length,
                itineraryData: it, // full itinerary for drilldown
            }
        }).filter(Boolean)

    // Popular destinations as explore pins
    const explorePins = [
        { ...DEST_COORDS.tokyo,    type: 'explore', label: 'Tokyo',       detail: '🗼 Culture & Food' },
        { ...DEST_COORDS.singapore,type: 'explore', label: 'Singapore',   detail: '🦁 Gardens & Hawker' },
        { ...DEST_COORDS.bangkok,  type: 'explore', label: 'Bangkok',     detail: '🐘 Temples & Street Food' },
        { ...DEST_COORDS.bali,     type: 'explore', label: 'Bali',        detail: '🌴 Nature & Temples' },
        { ...DEST_COORDS.dubai,    type: 'explore', label: 'Dubai',       detail: '🏙️ Luxury & Desert' },
        { ...DEST_COORDS.paris,    type: 'explore', label: 'Paris',       detail: '🗽 Art & Romance' },
        { ...DEST_COORDS.london,   type: 'explore', label: 'London',      detail: '🎡 History & Culture' },
        { ...DEST_COORDS.seoul,    type: 'explore', label: 'Seoul',       detail: '🇰🇷 K-Culture & Food' },
        { ...DEST_COORDS.sydney,   type: 'explore', label: 'Sydney',      detail: '🦘 Beaches & Nature' },
        { ...DEST_COORDS['hong kong'], type: 'explore', label: 'Hong Kong', detail: '🌆 City & Dim Sum' },
    ]

    const activePins = activeLayer === 'trips' ? tripPins
        : activeLayer === 'itinerary' ? itinPins
            : explorePins

    // Load Leaflet and init map
    useEffect(() => {
        if (mapLoaded || mapError) return

        // Load Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link')
            link.id   = 'leaflet-css'
            link.rel  = 'stylesheet'
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            document.head.appendChild(link)
        }

        // Load Leaflet JS
        if (window.L) {
            initMap()
            return
        }
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => { setMapLoaded(true); initMap() }
        script.onerror = () => setMapError(true)
        document.head.appendChild(script)
        if (window.L) { setMapLoaded(true); initMap() }
    }, [])

    const getTileUrl = (style) => {
        if (style === 'satellite') return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        if (style === 'dark') return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }

    const initMap = () => {
        if (!mapRef.current || !window.L) return
        if (leafletRef.current) return // already inited

        const L = window.L
        const map = L.map(mapRef.current, {
            center: [20, 100],
            zoom: 3,
            zoomControl: false,
        })

        L.tileLayer(getTileUrl('street'), {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map)

        // Add zoom control top-right
        L.control.zoom({ position: 'topright' }).addTo(map)

        leafletRef.current = map
        setMapLoaded(true)

        // Draw initial pins after a brief delay
        setTimeout(() => drawPins(map, explorePins, 'explore'), 300)
    }

    const PIN_COLORS = {
        trips:     '#1e6fd9',
        itinerary: '#7c3aed',
        explore:   '#059669',
    }

    const drawPins = (map, pins, layer) => {
        if (!map || !window.L) return
        const L = window.L

        // Clear existing markers
        map.eachLayer(l => { if (l._voyagePin) map.removeLayer(l) })

        // Add home marker
        const homeIcon = L.divIcon({
            html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#f97316);border:3px solid #ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:16px;">🏠</div>`,
            className: '', iconSize: [36, 36], iconAnchor: [18, 18],
        })
        const homeMarker = L.marker([HOME.lat, HOME.lng], { icon: homeIcon })
        homeMarker._voyagePin = true
        homeMarker.bindPopup(`<b>🏠 Home Base</b><br>Kuala Lumpur, Malaysia`)
        homeMarker.addTo(map)

        if (pins.length === 0) return

        const color = PIN_COLORS[layer] || '#1e6fd9'

        pins.forEach(pin => {
            const icon = L.divIcon({
                html: `<div style="width:40px;height:40px;border-radius:50%;background:${color};border:3px solid #ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.35);font-size:18px;cursor:pointer;">${pin.emoji}</div>`,
                className: '', iconSize: [40, 40], iconAnchor: [20, 20],
            })
            const marker = L.marker([pin.lat, pin.lng], { icon })
            marker._voyagePin = true
            marker.on('click', () => {
                setSelectedPin(pin)
                // If itinerary pin — drill in
                if (layer === 'itinerary' && pin.itineraryData) {
                    drillIntoItinerary(map, pin.itineraryData, pin)
                }
            })
            marker.addTo(map)

            if (layer === 'trips' || layer === 'itinerary') {
                const line = L.polyline(
                    [[HOME.lat, HOME.lng], [pin.lat, pin.lng]],
                    { color, weight: 2, opacity: 0.5, dashArray: '6, 8' }
                )
                line._voyagePin = true
                line.addTo(map)
            }
        })

        const allCoords = [[HOME.lat, HOME.lng], ...pins.map(p => [p.lat, p.lng])]
            .filter(([lat, lng]) => lat != null && lng != null && !isNaN(lat) && !isNaN(lng))
        if (allCoords.length >= 2) {
            try {
                const bounds = L.latLngBounds(allCoords)
                if (bounds.isValid()) map.fitBounds(bounds, { padding: [60, 60], maxZoom: 8 })
            } catch { map.setView([20, 100], 3) }
        } else {
            map.setView([20, 100], 3)
        }
    }

    // ── Drill into an itinerary — show all places as numbered day-coloured pins ──
    const drillIntoItinerary = (map, itinerary, cityPin) => {
        if (!map || !window.L || !itinerary?.days) return
        const L = window.L
        setDrilldown(itinerary)

        // Clear existing pins
        map.eachLayer(l => { if (l._voyagePin) map.removeLayer(l) })

        const cityCoords = { lat: cityPin.lat, lng: cityPin.lng }
        const placeBounds = []
        let globalOrder = 0

        itinerary.days.forEach((day, dayIndex) => {
            const color = getDayColor(dayIndex)
            const places = day.places || []

            places.forEach((place, placeIndex) => {
                globalOrder++
                const coords = getPlaceCoords(place.name, cityCoords)
                if (!coords) return

                placeBounds.push([coords.lat, coords.lng])

                // Numbered pin with day colour
                const num = globalOrder
                const icon = L.divIcon({
                    html: `<div style="
                        width:36px;height:36px;border-radius:50%;
                        background:${color};
                        border:3px solid #ffffff;
                        display:flex;align-items:center;justify-content:center;
                        box-shadow:0 4px 14px rgba(0,0,0,0.4);
                        font-size:13px;font-weight:900;color:#fff;
                        cursor:pointer;font-family:Inter,sans-serif;
                    ">${num}</div>`,
                    className: '', iconSize: [36, 36], iconAnchor: [18, 18],
                })

                const marker = L.marker([coords.lat, coords.lng], { icon })
                marker._voyagePin = true
                marker.on('click', () => setSelectedPin({
                    emoji: `${num}`,
                    label: place.name,
                    detail: `Day ${dayIndex + 1} · ${place.time || place.section || ''}`,
                    tip: place.tip,
                    dayColor: color,
                    lat: coords.lat, lng: coords.lng,
                }))
                marker.addTo(map)

                // Connect places within same day with solid line
                if (placeIndex > 0) {
                    const prevPlace = places[placeIndex - 1]
                    const prevCoords = getPlaceCoords(prevPlace.name, cityCoords)
                    if (prevCoords) {
                        const line = L.polyline(
                            [[prevCoords.lat, prevCoords.lng], [coords.lat, coords.lng]],
                            { color, weight: 2.5, opacity: 0.7 }
                        )
                        line._voyagePin = true
                        line.addTo(map)
                    }
                }
            })
        })

        // Fit to place pins
        if (placeBounds.length >= 2) {
            try {
                const bounds = L.latLngBounds(placeBounds)
                if (bounds.isValid()) map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 })
            } catch { map.setView([cityCoords.lat, cityCoords.lng], 13) }
        } else if (placeBounds.length === 1) {
            map.setView(placeBounds[0], 14)
        } else {
            map.setView([cityCoords.lat, cityCoords.lng], 13)
        }
    }

    // ── Exit drilldown — go back to itinerary overview ─────────────────────
    const exitDrilldown = () => {
        setDrilldown(null)
        setSelectedPin(null)
        if (leafletRef.current) drawPins(leafletRef.current, itinPins, 'itinerary')
    }

    // Redraw when layer changes
    useEffect(() => {
        if (!leafletRef.current || !window.L) return
        const pins = activeLayer === 'trips' ? tripPins
            : activeLayer === 'itinerary' ? itinPins
                : explorePins
        drawPins(leafletRef.current, pins, activeLayer)
        setSelectedPin(null)
    }, [activeLayer, trips.length, itineraries.length])

    // Update tile layer when map style changes
    useEffect(() => {
        if (!leafletRef.current || !window.L) return
        const L = window.L
        const map = leafletRef.current
        map.eachLayer(l => { if (l._url) map.removeLayer(l) })
        L.tileLayer(getTileUrl(mapStyle), {
            attribution: '© OpenStreetMap',
            maxZoom: 18,
        }).addTo(map)
    }, [mapStyle])

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: 'calc(100vh - 70px)', background: '#0a1628',
            position: 'relative',
        }}>
            {/* ── Header ── */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000,
                background: 'linear-gradient(to bottom, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0) 100%)',
                padding: '14px 16px 28px',
                pointerEvents: 'none',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'all' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Compass size={16} color='#ffffff' />
                            </div>
                            <div>
                                <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: '800', lineHeight: 1 }}>
                                    AR Maps
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>
                                    VoyageAI · Your travel world
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Map style toggle */}
                    <div style={{
                        display: 'flex', gap: '4px',
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                        borderRadius: '10px', padding: '4px',
                    }}>
                        {[
                            { key: 'street',    label: '🗺️' },
                            { key: 'satellite', label: '🛰️' },
                            { key: 'dark',      label: '🌑' },
                        ].map(s => (
                            <button key={s.key} onClick={() => setMapStyle(s.key)} style={{
                                background: mapStyle === s.key ? '#1e6fd9' : 'transparent',
                                border: 'none', borderRadius: '7px', padding: '5px 8px',
                                cursor: 'pointer', fontSize: '14px',
                            }}>{s.label}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Map container ── */}
            {mapError ? (
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: '#0a1628', padding: '40px',
                }}>
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</p>
                    <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                        Map unavailable offline
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textAlign: 'center', lineHeight: '1.6' }}>
                        AR Maps requires an internet connection to load map tiles.
                        Connect to the internet and restart the app.
                    </p>
                </div>
            ) : (
                <div ref={mapRef} style={{ flex: 1, width: '100%' }} />
            )}

            {/* ── Bottom panel ── */}
            <div style={{
                position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 1000,
            }}>
                {/* Selected pin popup */}
                {selectedPin && (
                    <div style={{
                        background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)',
                        borderRadius: '16px', padding: '14px 16px', marginBottom: '12px',
                        border: `1px solid ${selectedPin.dayColor ? selectedPin.dayColor + '60' : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '14px',
                            background: selectedPin.dayColor ? `${selectedPin.dayColor}30` : `${PIN_COLORS[activeLayer]}30`,
                            border: `2px solid ${selectedPin.dayColor || PIN_COLORS[activeLayer]}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: selectedPin.dayColor ? '16px' : '22px',
                            fontWeight: '900', color: '#fff', flexShrink: 0,
                        }}>
                            {selectedPin.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: '800' }}>
                                {selectedPin.label}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '2px' }}>
                                {selectedPin.detail}
                            </p>
                            {selectedPin.tip && (
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px' }}>
                                    💡 {selectedPin.tip}
                                </p>
                            )}
                            {selectedPin.date && (
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px' }}>
                                    📅 {selectedPin.date}{selectedPin.bookingRef && ` · ${selectedPin.bookingRef}`}
                                </p>
                            )}
                            {selectedPin.days && !selectedPin.dayColor && (
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px' }}>
                                    🗓️ {selectedPin.days} day itinerary — tap to explore
                                </p>
                            )}
                        </div>
                        <button onClick={() => setSelectedPin(null)} style={{
                            background: 'rgba(255,255,255,0.1)', border: 'none',
                            borderRadius: '8px', width: '30px', height: '30px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', flexShrink: 0,
                        }}>
                            <X size={14} color='rgba(255,255,255,0.7)' />
                        </button>
                    </div>
                )}

                {/* Drilldown mode — day legend + back button */}
                {drilldown ? (
                    <div style={{
                        background: 'rgba(10,22,40,0.92)', backdropFilter: 'blur(12px)',
                        borderRadius: '16px', padding: '12px 14px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        {/* Header row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                                <p style={{ color: '#fff', fontSize: '13px', fontWeight: '800' }}>
                                    🗺️ {drilldown.title || drilldown.destination}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
                                    Tap numbered pins to see details
                                </p>
                            </div>
                            <button onClick={exitDrilldown} style={{
                                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '5px',
                            }}>
                                <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>← Back</span>
                            </button>
                        </div>
                        {/* Day legend */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {drilldown.days?.map((day, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '5px',
                                    background: `${getDayColor(i)}20`,
                                    borderRadius: '8px', padding: '4px 10px',
                                    border: `1px solid ${getDayColor(i)}50`,
                                }}>
                                    <div style={{
                                        width: '10px', height: '10px', borderRadius: '50%',
                                        background: getDayColor(i), flexShrink: 0,
                                    }} />
                                    <span style={{ color: '#fff', fontSize: '11px', fontWeight: '600' }}>
                                        Day {i + 1}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                                        {day.places?.length || 0} places
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Normal layer tabs */
                    <div style={{
                        display: 'flex', gap: '8px',
                        background: 'rgba(10,22,40,0.9)', backdropFilter: 'blur(12px)',
                        borderRadius: '16px', padding: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        {[
                            { key: 'trips',     label: 'My Trips',    icon: '✈️', count: tripPins.length },
                            { key: 'itinerary', label: 'Itineraries', icon: '🗺️', count: itinPins.length },
                            { key: 'explore',   label: 'Explore',     icon: '🌍', count: explorePins.length },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveLayer(tab.key)} style={{
                                flex: 1,
                                background: activeLayer === tab.key ? PIN_COLORS[tab.key] : 'transparent',
                                border: 'none', borderRadius: '10px', padding: '9px 6px',
                                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: '3px', transition: 'all 0.2s ease',
                                boxShadow: activeLayer === tab.key ? `0 4px 12px ${PIN_COLORS[tab.key]}50` : 'none',
                            }}>
                                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                                <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '700' }}>{tab.label}</span>
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)', borderRadius: '10px',
                                    padding: '1px 7px', color: '#ffffff', fontSize: '10px', fontWeight: '800',
                                }}>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Loading overlay */}
            {!mapLoaded && !mapError && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 500,
                    background: '#0a1628',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '16px',
                }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'spin 1.5s linear infinite',
                    }}>
                        <Compass size={28} color='#ffffff' />
                    </div>
                    <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700' }}>Loading map...</p>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                        Fetching map tiles
                    </p>
                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                </div>
            )}
        </div>
    )
}

export default ARMapScreen