# ✈️ VoyageAI — AI-Powered Travel Assistant

<div align="center">

![VoyageAI Banner](https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80)

**An intelligent travel companion built with React, Electron, and Claude AI.**  
Plan trips, book flights & hotels, translate languages, explore destinations — all in one app.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?style=flat&logo=electron)](https://electronjs.org/)
[![Claude AI](https://img.shields.io/badge/Claude-Anthropic-FF6B35?style=flat)](https://anthropic.com/)
[![Groq](https://img.shields.io/badge/Groq-Whisper%20STT-F55036?style=flat)](https://groq.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=flat&logo=leaflet)](https://leafletjs.com/)

</div>

---

## 📱 Overview

VoyageAI is a full-featured AI travel assistant desktop app built as a hackathon project. It combines the power of **Claude AI** for intelligent travel planning with real-time **speech recognition**, **interactive maps**, **flight & hotel search**, and **language translation** — all packaged as a cross-platform desktop app.

### ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Travel Agent** | Chat with Claude AI to plan trips, search flights & hotels, build itineraries |
| ✈️ **Flight & Hotel Search** | Real-time search via Aviationstack API with mock fallback |
| 🗺️ **Interactive AR Maps** | Leaflet-powered world map with trip pins, itinerary drilldown, day-coloured route pins |
| 📋 **Smart Itinerary Planner** | AI generates day-by-day plans with colour-coded sections |
| 🌐 **Real-time Translator** | Translate between 15 languages with voice input and TTS output |
| 🧑‍🦯 **Local Guides** | Browse and book local expert guides with reviews and ratings |
| 🔍 **Explore Destinations** | Trending destinations, outfit suggestions, nearby restaurants |
| 💳 **Full Payment Flow** | Complete booking experience with saved cards, passengers & e-tickets |
| 👤 **User Profiles** | Language, currency, travel style, interests — all personalised |
| 🎙️ **Voice Input** | Groq Whisper speech-to-text across Chat and Translate screens |

---

## 🖥️ Screenshots

![Home Screen](screenshots/screenshot-home.png)
![Reminder Screen](screenshots/screenshot-home-reminder.png)
![Chat Screen](screenshots/screenshot-agent-1.png)
![Chat Screen](screenshots/screenshot-agent-2.png)
![AR Map Screen](screenshots/screenshot-armap.png)
![AR Map Screen](screenshots/screenshot-armap-itinerary.png)
![Explore Screen](screenshots/screenshot-explore.png)
![Translate Screen](screenshots/screenshot-translate.png)




---

## 🏗️ Tech Stack

### Frontend
- **React 18** — UI framework
- **Electron** — Cross-platform desktop wrapper
- **Lucide React** — Icon library
- **Leaflet.js** — Interactive maps (loaded via CDN)

### AI & APIs
| Service | Usage | Cost |
|---|---|---|
| **Anthropic Claude** (`claude-sonnet-4-20250514`) | AI chat, itinerary generation, translation, language detection | Pay per token |
| **Groq Whisper** (`whisper-large-v3-turbo`) | Speech-to-text transcription | Free tier available |
| **Aviationstack** | Live flight data | Free tier (100 req/month) |
| **OpenWeather** | Weather data | Free tier |
| **OpenStreetMap / Leaflet** | Map tiles | Free |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- API keys (see [Environment Variables](#environment-variables))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/voyageai.git
cd voyageai

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_CLAUDE_API_KEY=your_anthropic_api_key_here
REACT_APP_AVIATIONSTACK_KEY=your_aviationstack_key_here
REACT_APP_OPENWEATHER_KEY=your_openweather_key_here
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

#### Getting API Keys

| Key | Where to get it | Free Tier |
|---|---|---|
| `REACT_APP_CLAUDE_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) | $5 free credits |
| `REACT_APP_GROQ_API_KEY` | [console.groq.com](https://console.groq.com/) | Free (rate limited) |
| `REACT_APP_AVIATIONSTACK_KEY` | [aviationstack.com](https://aviationstack.com/) | 100 req/month free |
| `REACT_APP_OPENWEATHER_KEY` | [openweathermap.org](https://openweathermap.org/api) | 1000 req/day free |

> **Note:** The app includes mock data fallbacks for flights and hotels, so it works even without Aviationstack/OpenWeather keys.

### Running the App

```bash
# Run as desktop app (Electron)
npm run dev

# Run in browser only (React)
npm start

# Build for production
npm run build
```

---

## 📦 Publishing & Distribution

### 🖥️ Desktop App (Electron)

#### Build for your current platform

```bash
# Install electron-builder if not already installed
npm install --save-dev electron-builder

# Add to package.json scripts:
# "dist": "react-scripts build && electron-builder"

npm run dist
```

#### Build for specific platforms

```bash
# Windows (.exe installer)
npm run dist -- --win

# macOS (.dmg)
npm run dist -- --mac

# Linux (.AppImage)
npm run dist -- --linux
```

Add this to your `package.json` for electron-builder config:

```json
"build": {
  "appId": "com.yourname.voyageai",
  "productName": "VoyageAI",
  "icon": "public/logo512.png",
  "files": ["build/**/*", "public/electron.js"],
  "directories": {
    "output": "dist"
  },
  "win": {
    "target": "nsis"
  },
  "mac": {
    "target": "dmg"
  },
  "linux": {
    "target": "AppImage"
  }
}
```

---

### 📱 Mobile App (Capacitor)

Convert to Android/iOS using Capacitor:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Initialise Capacitor
npx cap init VoyageAI com.yourname.voyageai

# Build the React app
npm run build

# Add platforms
npx cap add android
npx cap add ios

# Sync built files
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode (macOS only)
npx cap open ios
```

#### Android APK
1. Open in Android Studio via `npx cap open android`
2. Go to **Build → Generate Signed Bundle / APK**
3. Choose **APK**, create or select a keystore
4. Build release APK

#### iOS IPA (macOS required)
1. Open in Xcode via `npx cap open ios`
2. Select your signing team
3. Go to **Product → Archive**
4. Distribute via App Store or Ad Hoc

---

### 🌐 Web App (Vercel / Netlify)

Deploy as a web app — note Electron-specific features (mic permissions, local file access) will behave differently in browsers.

#### Vercel (recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run build
vercel --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for auto-deploys on push.

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=build
```

Or drag and drop the `build/` folder at [app.netlify.com](https://app.netlify.com).

> ⚠️ **Important for web deployment:** Your API keys will be exposed in the browser. For production web apps, proxy your API calls through a backend server (e.g. Next.js API routes, Express, or Supabase Edge Functions).

---

## 📁 Project Structure

```
voyageai/
├── public/
│   ├── electron.js          # Electron main process
│   ├── index.html
│   └── logo192.png
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js        # Dashboard with quick actions & upcoming trips
│   │   ├── ChatScreen.js        # AI chat with flights/hotels/itinerary cards
│   │   ├── ExploreScreen.js     # Destinations, outfit guide, restaurants
│   │   ├── MyTripsScreen.js     # Bookings with destination photos
│   │   ├── ItineraryScreen.js   # Day-by-day itinerary viewer
│   │   ├── TranslateScreen.js   # Real-time translation + voice
│   │   ├── GuideScreen.js       # Local guide marketplace
│   │   ├── ARMapScreen.js       # Interactive Leaflet map
│   │   ├── MeScreen.js          # Profile & settings
│   │   ├── PaymentScreen.js     # Booking checkout
│   │   └── ETicketScreen.js     # Booking confirmation & QR ticket
│   ├── components/
│   │   ├── BottomNav.js         # Tab navigation
│   │   ├── FloatingAIButton.js  # Chat shortcut button
│   │   ├── FlightCard.js        # Flight result card
│   │   ├── HotelCard.js         # Hotel result card
│   │   ├── VoyageLogo.js        # Brand logo component
│   │   └── ItineraryPreviewCard.js
│   ├── services/
│   │   ├── claudeService.js     # Claude AI + Groq Whisper integration
│   │   └── flightService.js     # Aviationstack + mock flight data
│   ├── App.js                   # Root component + global state
│   └── App.css
├── .env                         # API keys (never commit this)
├── .gitignore
└── package.json
```

---

## 🤖 AI Features Deep Dive

### Chat Agent Capabilities
The AI agent (powered by Claude) can:
- Search flights: *"Find flights from KL to Tokyo on 20 March"*
- Search hotels: *"Find hotels in Bangkok for 3 nights from 15 April"*
- Build itineraries: *"Plan a 5-day trip to Bali"* (guided flow with dates)
- Answer travel questions in any language
- Switch languages mid-conversation (auto-detects)
- Give weather, visa, packing advice

### Itinerary Parser
The app includes a custom parser (`parseItineraryText`) that converts Claude's free-text itinerary responses into structured day/place/time data used by:
- ItineraryScreen (day tabs, section colours)
- ARMapScreen (numbered pins on map)

### Speech Recognition
Uses **Groq Whisper** (`whisper-large-v3-turbo`) via HTTP fetch — same approach in both ChatScreen and TranslateScreen. Supports 99 languages automatically detected.

---

## 🗺️ AR Maps

The AR Maps screen uses **Leaflet.js** with OpenStreetMap tiles:

- **My Trips** — pins your booked destinations with flight lines from KUL
- **Itineraries** — tap any destination pin to drill into day-by-day route
- **Explore** — shows 10 popular destinations as discovery pins
- **3 map styles** — Street, Satellite (ArcGIS), Dark (CartoDB)

The itinerary drilldown shows numbered pins (1, 2, 3...) colour-coded by day, connected by route lines. 80+ tourist landmarks are pre-geocoded. Unknown places are silently skipped — numbers remain consecutive.

---

## 💾 Data Persistence

All user data is stored in **localStorage** (no backend required):

| Key | Data |
|---|---|
| `voyageai_conversations` | Chat history |
| `voyageai_fav_passengers` | Saved passenger profiles |
| `voyageai_fav_cards` | Saved payment cards (no CVV) |
| `voyageai_reviews_[id]` | Guide reviews per guide |
| `voyageai_name` / `voyageai_email` | Profile info |
| `voyageai_currency` | Selected currency |
| `voyageai_interests` | Travel interest tags |
| `voyageai_style` | Travel style preference |

---

## 🌍 Supported Languages (Translate Screen)

English · 中文 · Bahasa Melayu · 日本語 · 한국어 · ภาษาไทย · Français · Español · Deutsch · العربية · हिन्दी · Bahasa Indonesia · Tiếng Việt · Português · Русский

---

## 💱 Supported Currencies

MYR · USD · SGD · JPY · EUR · GBP · AUD

Currency selection in Me Screen propagates to flight/hotel prices and payment totals.

---

## 🔒 Security Notes

- **Never commit your `.env` file** — it's in `.gitignore`
- Payment card CVV is never saved to localStorage
- Card numbers are masked for display (`**** **** **** 4242`)
- This is a demo app — no real payments are processed

---

## 🐛 Known Limitations

- Flight data uses mock fallback when Aviationstack free tier is exhausted
- AR Maps requires internet connection for map tiles
- AR Maps place geocoding covers 80+ popular landmarks — unknown places are omitted from map pins
- App Language is English only (multilingual UI coming soon)
- TTS (text-to-speech) uses browser `speechSynthesis` — voice quality depends on OS installed voices

---

## 🛠️ Development

### Available Scripts

```bash
npm start          # React dev server (browser only)
npm run dev        # Electron + React (desktop app)
npm run build      # Production build
npm test           # Run tests
```

### Adding New Destinations to AR Maps

Edit `PLACE_COORDS` in `src/screens/ARMapScreen.js`:

```js
const PLACE_COORDS = {
    // Add your landmark:
    'your landmark name': { lat: 3.1579, lng: 101.7116 },
}
```

### Adding New Guide Profiles

Edit the `GUIDES` array in `src/screens/GuideScreen.js` — each guide needs: `name`, `specialty`, `photo` (Unsplash URL), `languages`, `city`, `country`, `flag`, `rating`, `reviews`, `price`, `tags`, `about`, `mockReviews`.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 Licence

This project is licensed under the MIT Licence — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Anthropic](https://anthropic.com/) — Claude AI API
- [Groq](https://groq.com/) — Ultra-fast Whisper speech-to-text
- [Aviationstack](https://aviationstack.com/) — Flight data API
- [Leaflet.js](https://leafletjs.com/) — Interactive maps
- [OpenStreetMap](https://openstreetmap.org/) — Map tiles
- [Unsplash](https://unsplash.com/) — Destination photography
- [Lucide](https://lucide.dev/) — Icon library

---

<div align="center">

**Built With Spirit For The 4th China-ASEAN **

*VoyageAI — Where every journey begins with a conversation.*

</div>
