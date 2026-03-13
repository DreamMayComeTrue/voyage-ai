import React from 'react'

const VoyageLogo = ({ size = 'md' }) => {
    const sizes = {
        sm: { icon: 28, font: 18, gap: 7 },
        md: { icon: 36, font: 22, gap: 9 },
        lg: { icon: 48, font: 30, gap: 12 },
    }
    const s = sizes[size]

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: `${s.gap}px`,
        }}>
            <svg
                width={s.icon}
                height={s.icon}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Rounded square background */}
                <rect
                    x="0" y="0"
                    width="100" height="100"
                    rx="22"
                    fill="#1E4FA3"
                />

                {/* Outer circle */}
                <circle
                    cx="50" cy="50" r="33"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    opacity="0.95"
                />

                {/*
          Rotated ~45deg clockwise around center (50,50)
          Top:    (50 + 22*sin45, 50 - 22*cos45) = (66, 34)
          Bottom: (50 - 22*sin45, 50 + 22*cos45) = (34, 66)
          Right:  (50 + 16*cos45, 50 + 16*sin45) = (61, 61)
          Left:   (50 - 16*cos45, 50 - 16*sin45) = (39, 39)
        */}

                {/* Top-right needle (bright white) */}
                <polygon
                    points="66,34 61,61 50,50"
                    fill="white"
                    opacity="1"
                />

                {/* Bottom-left needle (dim white) */}
                <polygon
                    points="34,66 39,39 50,50"
                    fill="white"
                    opacity="0.35"
                />

                {/* Full diamond outline */}
                <polygon
                    points="66,34 61,61 34,66 39,39"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    opacity="0.95"
                />

                {/* Hollow center */}
                <circle cx="50" cy="50" r="5" fill="#1E4FA3" />

            </svg>

            {/* Text */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
        <span style={{
            fontSize: `${s.font}px`,
            fontWeight: '800',
            color: '#1a3a6a',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.3px',
        }}>
          Voyage
        </span>
                <span style={{
                    fontSize: `${s.font}px`,
                    fontWeight: '800',
                    color: '#0ea5e9',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.3px',
                }}>
          AI
        </span>
            </div>
        </div>
    )
}

export default VoyageLogo