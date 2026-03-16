import React, { useState, useRef } from 'react'
import { ArrowLeft, Upload, FileText, Image, Check, AlertCircle, Plane, Hotel } from 'lucide-react'

const CLAUDE_KEY = process.env.REACT_APP_CLAUDE_API_KEY

const ImportTicketScreen = ({ setActiveScreen, onImportComplete }) => {
    const [step, setStep]         = useState('upload') // upload | reading | result | error
    const [dragOver, setDragOver] = useState(false)
    const [fileName, setFileName] = useState('')
    const [result, setResult]     = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const fileRef = useRef(null)

    const processFile = async (file) => {
        if (!file) return
        setFileName(file.name)
        setStep('reading')

        try {
            // Convert to base64
            const base64 = await new Promise((res, rej) => {
                const r = new FileReader()
                r.onload = () => res(r.result.split(',')[1])
                r.onerror = rej
                r.readAsDataURL(file)
            })

            const isPDF = file.type === 'application/pdf'
            const mediaType = isPDF ? 'application/pdf' : file.type || 'image/jpeg'

            // Send to Claude to extract ticket info
            const CLAUDE_KEY = process.env.REACT_APP_CLAUDE_API_KEY
            if (!CLAUDE_KEY) throw new Error('Claude API key not configured')

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': CLAUDE_KEY,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true',
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1000,
                    messages: [{
                        role: 'user',
                        content: [
                            {
                                type: isPDF ? 'document' : 'image',
                                source: { type: 'base64', media_type: mediaType, data: base64 },
                            },
                            {
                                type: 'text',
                                text: `Extract all flight or hotel booking information from this ticket/document. Return ONLY a JSON object with no markdown, no backticks. For flights use: { "type": "flight", "airline": "", "flightNumber": "", "origin": "", "destination": "", "departureTime": "ISO string or time string", "arrivalTime": "ISO string or time string", "date": "YYYY-MM-DD", "terminal": "", "gate": "", "seat": "", "passengerName": "", "bookingRef": "", "status": "Confirmed", "price": "" }. For hotels use: { "type": "hotel", "hotelName": "", "city": "", "checkIn": "YYYY-MM-DD", "checkOut": "YYYY-MM-DD", "passengerName": "", "bookingRef": "", "roomType": "", "price": "", "status": "Confirmed" }. If you cannot extract the info, return { "error": "Could not read ticket" }.`,
                            },
                        ],
                    }],
                }),
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData?.error?.message || `API error ${response.status}`)
            }

            const data = await response.json()
            const text = data.content?.[0]?.text || ''
            console.log('[ImportTicket] Claude response:', text)

            // Parse JSON response — Claude sometimes wraps in backticks
            let parsed
            try {
                const clean = text.replace(/```json\n?|```\n?/g, '').trim()
                parsed = JSON.parse(clean)
            } catch {
                // Try to find JSON object in response
                const match = text.match(/\{[\s\S]*\}/)
                if (match) {
                    try { parsed = JSON.parse(match[0]) }
                    catch { throw new Error('Could not parse ticket data from response') }
                } else {
                    throw new Error('No valid ticket data found in document')
                }
            }

            if (parsed.error) throw new Error(parsed.error)

            setResult(parsed)
            setStep('result')

        } catch (err) {
            setErrorMsg(err.message || 'Failed to read ticket')
            setStep('error')
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) processFile(file)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) processFile(file)
    }

    const handleImport = () => {
        if (!result) return
        // Build a ticket-compatible object
        const ticketData = result.type === 'hotel' ? {
            type: 'hotel',
            hotel: {
                name:    result.hotelName,
                address: result.city,
                stars:   4,
                price:   result.price || 'N/A',
            },
            city:           result.city,
            checkIn:        result.checkIn,
            checkOut:       result.checkOut,
            passengerName:  result.passengerName || 'Guest',
            passportNumber: '',
            bookingRef:     result.bookingRef || ('VA' + Math.random().toString(36).slice(2,8).toUpperCase()),
            price:          result.price || 'N/A',
            paidAt:         new Date().toISOString(),
            imported:       true,
        } : {
            type: 'flight',
            flight: {
                airline:       result.airline,
                flightNumber:  result.flightNumber,
                origin:        result.origin,
                destination:   result.destination,
                departureTime: result.departureTime,
                arrivalTime:   result.arrivalTime,
                terminal:      result.terminal,
                gate:          result.gate,
                status:        result.status || 'Confirmed',
            },
            date:           result.date,
            origin:         result.origin,
            destination:    result.destination,
            passengerName:  result.passengerName || 'Passenger',
            passportNumber: '',
            bookingRef:     result.bookingRef || ('VA' + Math.random().toString(36).slice(2,8).toUpperCase()),
            price:          result.price || 'N/A',
            paidAt:         new Date().toISOString(),
            imported:       true,
        }

        if (onImportComplete) onImportComplete(ticketData)
        setActiveScreen('eticket')
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f6ff' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #7c3aed, #1e6fd9)',
                padding: '14px 16px', flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setActiveScreen('mytrips')} style={{
                        background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
                        borderRadius: '10px', width: '34px', height: '34px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                        <ArrowLeft size={16} color='#fff' />
                    </button>
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>VoyageAI</p>
                        <p style={{ color: '#fff', fontSize: '16px', fontWeight: '800' }}>Import Ticket</p>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
                {step === 'upload' && (
                    <>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '800', marginBottom: '6px' }}>
                            Import your existing ticket
                        </p>
                        <p style={{ color: '#5a7a9f', fontSize: '13px', marginBottom: '24px', lineHeight: '1.5' }}>
                            Upload a flight or hotel booking confirmation — PDF or image. Claude AI will read it and add it to your trips.
                        </p>

                        {/* Drop zone */}
                        <div
                            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                            style={{
                                background: dragOver ? '#e0f2fe' : '#ffffff',
                                border: `2px dashed ${dragOver ? '#0ea5e9' : '#c0d8f0'}`,
                                borderRadius: '20px', padding: '40px 20px',
                                textAlign: 'center', cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: dragOver ? '0 0 0 4px #0ea5e920' : '0 2px 12px #1e6fd910',
                                marginBottom: '20px',
                            }}
                        >
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: dragOver ? '#e0f2fe' : '#f0f6ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 14px',
                            }}>
                                <Upload size={28} color={dragOver ? '#0ea5e9' : '#1e6fd9'} />
                            </div>
                            <p style={{ color: '#0a1628', fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>
                                {dragOver ? 'Drop it here!' : 'Tap to upload or drag & drop'}
                            </p>
                            <p style={{ color: '#8aaac8', fontSize: '12px' }}>PDF, JPG, PNG supported</p>
                        </div>

                        <input
                            ref={fileRef}
                            type='file'
                            accept='.pdf,.jpg,.jpeg,.png,.webp'
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />

                        {/* Supported types */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                                { icon: FileText, label: 'PDF Booking', desc: 'E-mail confirmations, booking PDFs' },
                                { icon: Image,    label: 'Screenshot',  desc: 'Photo or screenshot of ticket' },
                            ].map((item, i) => {
                                const Icon = item.icon
                                return (
                                    <div key={i} style={{
                                        flex: 1, background: '#fff', borderRadius: '14px',
                                        padding: '14px', border: '1px solid #e0ecff',
                                        textAlign: 'center',
                                    }}>
                                        <Icon size={22} color='#1e6fd9' style={{ margin: '0 auto 8px', display: 'block' }} />
                                        <p style={{ color: '#0a1628', fontSize: '12px', fontWeight: '700', marginBottom: '3px' }}>{item.label}</p>
                                        <p style={{ color: '#8aaac8', fontSize: '10px', lineHeight: '1.4' }}>{item.desc}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {step === 'reading' && (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{
                            width: '70px', height: '70px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7c3aed, #1e6fd9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            animation: 'spin 1.5s linear infinite',
                        }}>
                            <FileText size={30} color='#fff' />
                        </div>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                            Reading your ticket...
                        </p>
                        <p style={{ color: '#8aaac8', fontSize: '13px', marginBottom: '6px' }}>
                            Claude AI is extracting your booking details
                        </p>
                        <p style={{ color: '#c0d8f0', fontSize: '12px' }}>{fileName}</p>
                        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                    </div>
                )}

                {step === 'error' && (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <AlertCircle size={30} color='#dc2626' />
                        </div>
                        <p style={{ color: '#0a1628', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                            Could not read ticket
                        </p>
                        <p style={{ color: '#5a7a9f', fontSize: '13px', marginBottom: '24px', lineHeight: '1.5' }}>
                            {errorMsg}. Please try a clearer image or a different file.
                        </p>
                        <button onClick={() => setStep('upload')} style={{
                            background: 'linear-gradient(135deg, #7c3aed, #1e6fd9)',
                            border: 'none', borderRadius: '12px', padding: '12px 28px',
                            color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                        }}>
                            Try Again
                        </button>
                    </div>
                )}

                {step === 'result' && result && (
                    <>
                        <div style={{
                            background: '#f0fdf4', border: '1.5px solid #059669',
                            borderRadius: '14px', padding: '14px 16px', marginBottom: '20px',
                            display: 'flex', alignItems: 'center', gap: '10px',
                        }}>
                            <Check size={18} color='#059669' />
                            <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700' }}>
                                Ticket read successfully!
                            </p>
                        </div>

                        {/* Preview extracted info */}
                        <div style={{
                            background: result.type === 'hotel'
                                ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                                : 'linear-gradient(135deg, #1e6fd9, #4a9fe8)',
                            borderRadius: '18px', padding: '18px', marginBottom: '16px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                                }}>
                                    {result.type === 'hotel' ? '🏨' : '✈️'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: '#fff', fontSize: '15px', fontWeight: '800' }}>
                                        {result.type === 'hotel' ? result.hotelName : `${result.airline} ${result.flightNumber}`}
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                                        {result.type === 'hotel'
                                            ? `${result.checkIn || ''} → ${result.checkOut || ''}`
                                            : `${result.origin || ''} → ${result.destination || ''} · ${result.date || ''}`}
                                    </p>
                                </div>
                            </div>

                            {/* Key details grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {(result.type === 'flight' ? [
                                    { label: 'Passenger',  value: result.passengerName },
                                    { label: 'Booking Ref',value: result.bookingRef },
                                    { label: 'Terminal',   value: result.terminal },
                                    { label: 'Gate',       value: result.gate },
                                    { label: 'Seat',       value: result.seat },
                                    { label: 'Departure',  value: result.departureTime },
                                    { label: 'Date',       value: result.date },
                                    { label: 'Price',      value: result.price },
                                ] : [
                                    { label: 'Guest',      value: result.passengerName },
                                    { label: 'Booking Ref',value: result.bookingRef },
                                    { label: 'City',       value: result.city },
                                    { label: 'Room',       value: result.roomType },
                                    { label: 'Check-in',   value: result.checkIn },
                                    { label: 'Price',      value: result.price },
                                ])
                                    .filter(i => i.value && typeof i.value !== 'object')
                                    .map((item, i) => (
                                        <div key={i} style={{
                                            background: 'rgba(255,255,255,0.15)',
                                            borderRadius: '8px', padding: '8px 10px',
                                        }}>
                                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>
                                                {item.label}
                                            </p>
                                            <p style={{ color: '#fff', fontSize: '12px', fontWeight: '700', marginTop: '2px' }}>
                                                {String(item.value)}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <p style={{ color: '#8aaac8', fontSize: '12px', textAlign: 'center', marginBottom: '16px' }}>
                            Please verify the details above before importing
                        </p>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setStep('upload')} style={{
                                flex: 1, background: '#f0f6ff', border: '1.5px solid #c0d8f0',
                                borderRadius: '12px', padding: '13px',
                                color: '#5a7a9f', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                            }}>
                                Upload Different
                            </button>
                            <button onClick={handleImport} style={{
                                flex: 2,
                                background: 'linear-gradient(135deg, #7c3aed, #1e6fd9)',
                                border: 'none', borderRadius: '12px', padding: '13px',
                                color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                                boxShadow: '0 4px 14px #7c3aed30',
                            }}>
                                ✅ Import to My Trips
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ImportTicketScreen