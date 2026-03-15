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

// KUL as home base
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
                days: it.totalDays,
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
            html: `<div style="
                width:36px;height:36px;border-radius:50%;
                background:linear-gradient(135deg,#f59e0b,#f97316);
                border:3px solid #ffffff;
                display:flex;align-items:center;justify-content:center;
                box-shadow:0 4px 12px rgba(0,0,0,0.3);
                font-size:16px;
            ">🏠</div>`,
            className: '',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
        })
        const homeMarker = L.marker([HOME.lat, HOME.lng], { icon: homeIcon })
        homeMarker._voyagePin = true
        homeMarker.bindPopup(`<b>🏠 Home Base</b><br>Kuala Lumpur, Malaysia`)
        homeMarker.addTo(map)

        if (pins.length === 0) return

        const color = PIN_COLORS[layer] || '#1e6fd9'

        pins.forEach(pin => {
            const icon = L.divIcon({
                html: `<div style="
                    width:40px;height:40px;border-radius:50%;
                    background:${color};
                    border:3px solid #ffffff;
                    display:flex;align-items:center;justify-content:center;
                    box-shadow:0 4px 16px rgba(0,0,0,0.35);
                    font-size:18px;cursor:pointer;
                    transition:transform 0.2s;
                ">${pin.emoji}</div>`,
                className: '',
                iconSize: [40, 40],
                iconAnchor: [20, 20],
            })

            const marker = L.marker([pin.lat, pin.lng], { icon })
            marker._voyagePin = true
            marker.on('click', () => setSelectedPin(pin))
            marker.addTo(map)

            // Draw line from home to trip/itinerary pins
            if (layer === 'trips' || layer === 'itinerary') {
                const line = L.polyline(
                    [[HOME.lat, HOME.lng], [pin.lat, pin.lng]],
                    { color, weight: 2, opacity: 0.5, dashArray: '6, 8' }
                )
                line._voyagePin = true
                line.addTo(map)
            }
        })

        // Fit map to show all pins — only if we have 2+ valid points
        const allCoords = [[HOME.lat, HOME.lng], ...pins.map(p => [p.lat, p.lng])]
            .filter(([lat, lng]) => lat != null && lng != null && !isNaN(lat) && !isNaN(lng))

        if (allCoords.length >= 2) {
            try {
                const bounds = L.latLngBounds(allCoords)
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 8 })
                }
            } catch (e) {
                console.warn('fitBounds failed:', e)
                map.setView([20, 100], 3)
            }
        } else {
            // Just one or no pins — show world view
            map.setView([20, 100], 3)
        }
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

            {/* ── Layer tabs ── */}
            <div style={{
                position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 1000,
            }}>
                {/* Selected pin popup */}
                {selectedPin && (
                    <div style={{
                        background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)',
                        borderRadius: '16px', padding: '14px 16px', marginBottom: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '14px',
                            background: `${PIN_COLORS[activeLayer]}30`,
                            border: `2px solid ${PIN_COLORS[activeLayer]}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '22px', flexShrink: 0,
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
                            {selectedPin.date && (
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px' }}>
                                    📅 {selectedPin.date}
                                    {selectedPin.bookingRef && ` · ${selectedPin.bookingRef}`}
                                </p>
                            )}
                            {selectedPin.days && (
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px' }}>
                                    🗓️ {selectedPin.days} day itinerary
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

                {/* Layer tabs */}
                <div style={{
                    display: 'flex', gap: '8px',
                    background: 'rgba(10,22,40,0.9)', backdropFilter: 'blur(12px)',
                    borderRadius: '16px', padding: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}>
                    {[
                        { key: 'trips',     label: 'My Trips',   icon: '✈️', count: tripPins.length },
                        { key: 'itinerary', label: 'Itineraries',icon: '🗺️', count: itinPins.length },
                        { key: 'explore',   label: 'Explore',    icon: '🌍', count: explorePins.length },
                    ].map(tab => (
                        <button key={tab.key} onClick={() => setActiveLayer(tab.key)} style={{
                            flex: 1,
                            background: activeLayer === tab.key
                                ? PIN_COLORS[tab.key]
                                : 'transparent',
                            border: 'none', borderRadius: '10px', padding: '9px 6px',
                            cursor: 'pointer',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: '3px',
                            transition: 'all 0.2s ease',
                            boxShadow: activeLayer === tab.key ? `0 4px 12px ${PIN_COLORS[tab.key]}50` : 'none',
                        }}>
                            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                            <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '700' }}>
                                {tab.label}
                            </span>
                            <span style={{
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '10px', padding: '1px 7px',
                                color: '#ffffff', fontSize: '10px', fontWeight: '800',
                            }}>{tab.count}</span>
                        </button>
                    ))}
                </div>
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