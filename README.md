# MargaDarshi — The Companion That Shows The Way
> **Front-End Developer Assignment Submission**  
> 🌐 **Live Demo:** [https://vivek1334.github.io/Margadarshi/](https://vivek1334.github.io/Margadarshi/)  
> An intelligent global travel exploration platform featuring real-time meteorological telemetry, location-aware distance calculations, dynamic landmark photography, and interactive day-by-day expedition planning powered by Google Gemini AI.

---

## 🌟 Quick Start & Preview

### Method 1: Instant Local Server (Zero Dependencies Required)
Run the included PowerShell server script from the project directory:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
Then open your browser at **`http://localhost:8080/`**.

### Method 2: Standard Node.js Static Server
```bash
npx serve .
```

### Method 3: Direct File Inspection or VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 📋 Assignment Requirements Mapping

| # | Assignment Requirement | Implementation in MargaDarshi | Key Source Files |
|---|---|---|---|
| **01** | **Landing Experience (Hero Background Video)** | Full-viewport cinematic hero with looping Mixkit/Pexels aerial footage, dark gradient overlay for text readability, video switcher, and play/pause & mute controls. | [`js/components/hero-video.js`](./js/components/hero-video.js) |
| **02** | **Destination Explorer** | Multi-faceted search (city, country, landmark) and filtering (Continents, Travel Vibes, Budget Tiers, Distance sorting). Individual deep-dive page for each destination. | [`js/components/explorer.js`](./js/components/explorer.js), [`js/components/destination-view.js`](./js/components/destination-view.js) |
| **03** | **Famous Places** | **Not a bare list of names!** Presented as rich media cards with high-res photos, star ratings, review counts, narrative descriptions, "Why Visit" quotes, "Insider Pro-Tips", estimated visit duration, and ticket costs. | [`js/components/destination-view.js`](./js/components/destination-view.js), [`js/destinations-data.js`](./js/destinations-data.js) |
| **04** | **Location Awareness** | Asks visitor for browser Geolocation permission with friendly banner. Also allows manual city search for users who prefer not to share GPS. Automatically calculates Haversine distance to every global destination and shows origin in navbar. | [`js/services/geo-service.js`](./js/services/geo-service.js) |
| **05** | **Real-Time Weather** | Dual-provider live weather integration. Supports **OpenWeather API** (custom key input) and seamlessly defaults to **Open-Meteo API** (zero key needed, 100% free live telemetry). Displays current temp, feels-like, wind, humidity, pressure, and 5-day daily forecasts with °C / °F toggle. | [`js/services/weather-service.js`](./js/services/weather-service.js) |
| **06** | **Dynamic Images** | Images are dynamically fetched via **Unsplash API**, **Pexels API**, and the **Wikipedia PageImages API** (for authentic landmark photographs without rate-limit constraints). | [`js/services/image-service.js`](./js/services/image-service.js) |
| **07** | **AI Chatbot Concierge** | Conversational **WanderAI** assistant powered by **Google Gemini API** (`gemini-2.5-flash`). Features quick suggestion chips ("How long to spend?", "Best time to visit?", "Local cuisine must-haves?"), streaming indicators, and a built-in expert travel fallback engine if no key is entered. | [`js/services/gemini-service.js`](./js/services/gemini-service.js), [`js/components/chat-widget.js`](./js/components/chat-widget.js) |
| **08** | **Itinerary Planning** | Clear way to generate custom trips. Generates and renders a **structured, day-by-day interactive plan** (NOT a block of chat text!) with Morning/Afternoon/Evening time slots, activity tags, costs, interactive completion checkboxes, culinary spotlights, insider tips, and export options (Print/PDF, Markdown copy, JSON download). | [`js/services/itinerary-service.js`](./js/services/itinerary-service.js), [`js/components/itinerary-view.js`](./js/components/itinerary-view.js) |

---

## 🏗️ Architecture & Technology Stack

- **Core**: Vanilla Modern JavaScript (ES6+ Modules), HTML5 Semantic Shell.
- **Styling**: Tailwind CSS (CDN) + Custom Glassmorphism CSS (`css/styles.css`).
- **Icons**: Lucide Icons.
- **Maps**: Leaflet.js with CartoDB Dark Matter tiles.
- **Typography**: Google Fonts (*Outfit* for bold display titles, *Plus Jakarta Sans* for ultra-clean body legibility).
- **APIs**:
  - **AI**: Google Gemini REST API (`gemini-2.5-flash`).
  - **Weather**: Dual-tier OpenWeather API + Open-Meteo meteorological telemetry.
  - **Images**: Unsplash API, Pexels API, Wikimedia Commons / Wikipedia PageImages API.
  - **Geolocation**: HTML5 Geolocation API + OpenStreetMap Nominatim Reverse Geocoding.

---

## ⚙️ API Configuration

Click the **Settings Icon (Sliders)** in the top-right navigation bar to configure:
1. **Google Gemini API Key**: [Get a free key from Google AI Studio](https://aistudio.google.com/app/apikey).
2. **OpenWeather API Key** *(Optional)*: [Get key from OpenWeather](https://openweathermap.org/api).
3. **Unsplash Access Key** *(Optional)*: Client ID for Unsplash API.
4. **Origin City**: Set manually or auto-detect with GPS.

> [!NOTE]
> **Zero-Setup Evaluation**: The application is purposefully engineered to function 100% out of the box even **without entering any API keys**. Live weather runs via Open-Meteo, landmark images stream via Wikipedia PageImages, and WanderAI features a built-in expert travel engine with realistic responses and day-by-day itineraries. Entering your own keys activates direct live Google Gemini 2.5 Flash and OpenWeather.

---

## 🚀 Deployment

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run in project directory:
   ```bash
   vercel
   ```
3. `vercel.json` is already included with clean URLs and SPA rewrites.

### Deploy to Netlify
1. Drag and drop the `voyage-travel-app` folder directly into [Netlify Drop](https://app.netlify.com/drop).
2. Or link via Git: `netlify.toml` is pre-configured with publish directory `.` and redirect rules.

### Deploy to GitHub Pages
1. Push repository to GitHub.
2. In **Repository Settings > Pages**, select `Deploy from a branch` -> `main` -> `/ (root)`.
3. Save and your live URL will be ready in under 60 seconds!
