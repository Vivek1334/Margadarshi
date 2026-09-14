# 🧭 MargaDarshi — The Companion That Shows The Way

> 🌐 **Live Website:** [https://vivek1334.github.io/Margadarshi/](https://vivek1334.github.io/Margadarshi/)  
> *An intelligent, interactive travel companion that turns dreaming into day-by-day expedition planning.*

---

## 📖 What is MargaDarshi?

**MargaDarshi** (Sanskrit for *"The Guide that Shows the Path"*) is a modern, responsive travel exploration platform designed to help travelers discover, explore, and plan journeys anywhere in the world.

Unlike traditional travel sites that only show generic lists of cities, MargaDarshi combines **live meteorological weather telemetry**, **authentic landmark verification with real photography**, **location-aware distance calculations**, and **day-by-day itinerary planning powered by Google Gemini AI** into one seamless, fast, and visually stunning web experience.

The application is built to run entirely in the browser with **zero backend dependencies**, working smoothly across **smartphones**, **iPads/tablets**, and **laptops/desktops**.

---

## ✨ Key Features

* 🗺️ **Global Destination Explorer**: Search by city, state, country, or specific landmark (e.g. *Gujarat*, *Jaipur*, *Tokyo*, *Eiffel Tower*). Filter by Continents, Travel Vibes (*Adventure, Culture, Beach, Historic*), and Budget Tiers.
* 🏛️ **Authentic Landmark Verification**: Every landmark card displays verified photographs, honest descriptions, ticket costs, opening hours, insider pro-tips, and direct links to **Google Arts & Culture 360° virtual tours**.
* 🌦️ **Real-Time Weather Radar**: Live meteorological weather (current temperature, feels-like, wind speed, humidity, and 5-day forecasts) via **Open-Meteo** telemetry so you always know what to pack.
* 🤖 **AI Day-by-Day Itinerary Planner**: Generate custom, structured itineraries with Morning, Afternoon, and Evening slots, activity costs, insider tips, culinary recommendations, and interactive check-off items.
* 💬 **WanderAI Travel Concierge**: A 24/7 floating AI chatbot powered by **Google Gemini** to answer questions about local etiquette, best visiting months, packing essentials, and hidden gems.
* 🔊 **Interactive Audio Phrasebook**: Built-in speech synthesis that pronounces essential greetings and phrases aloud in the destination's native language.
* 🧭 **3D Mystery Destination Compass**: Feeling spontaneous? Spin the 3D compass with interactive sound effects to let fate pick your next adventure.
* 💌 **Interactive 3D Postcards**: Flip, customize, and write digital vintage travel postcards to download or share.
* 💖 **Bucket List & Saved Places**: Save your favorite spots and view them anytime in your persistent offline favorites drawer.

---

## 🚀 How to Use MargaDarshi

### 1. Explore Destinations
* **Browse the Feed**: Scroll through curated global and regional destinations on the home page.
* **Search Anything**: Use the search bar at the top to type any destination, state, or landmark name (e.g., `"Goa"`, `"Gujarat"`, `"Kyoto"`, `"Rome"`).
* **Filter by Preference**: Use the category pills (*Culture, Nature, Beach, Luxury, Budget*) or the continent selector to narrow down your dream destination.

### 2. Deep Dive into a Location
* Click **"Explore Guide"** on any destination card to open its dedicated view.
* **Check the Weather**: See real-time temperature, wind, and the 5-day weather outlook before you go.
* **Inspect Real Landmarks**: Browse verified landmarks with ticket prices, ideal visiting durations, and insider advice.
* **Explore in 360°**: Click the **"Google Arts & Culture"** button on any landmark card to take an immersive virtual tour.

### 3. Generate a Custom Day-by-Day Itinerary
1. On any destination page, click **"Plan Day-by-Day Trip"** (or use the Planner tab).
2. Choose your trip length (1 to 7 days) and travel vibe.
3. Click **"Generate Itinerary"** — Google Gemini AI will construct a structured day-by-day schedule with morning, afternoon, and evening activities.
4. **Interact with Your Plan**: Check off activities as you complete them, copy the plan to your clipboard, or click **Print / Save as PDF**.

### 4. Practice Local Language
* Scroll down to the **Local Phrasebook** section inside any destination guide.
* Click the **speaker icon 🔊** next to any greeting or phrase (*"Hello"*, *"Thank You"*, *"How much is this?"*) to hear the authentic pronunciation.

### 5. Spin the Mystery Compass
* Click **"Surprise Me"** in the top navigation (or tap the center compass icon in the mobile bottom dock).
* Watch the 3D compass spin and land on an unexpected global destination with sound effects!

### 6. Chat with WanderAI
* Tap the floating **chat bubble icon** at the bottom-right corner of the screen.
* Ask anything: *"What street food should I try in Mumbai?"*, *"Is 3 days enough for Paris?"*, or *"What is the tipping etiquette in Japan?"*.

---

## 📱 Multi-Device Experience

* **📱 Smartphones (iPhone & Android)**: Thumb-friendly 5-target bottom dock navigation, safe-area inset padding, mobile currency selector, and slide-down drawer.
* **📱 iPads & Tablets**: Responsive 2-column card layouts, touch momentum scrolling, and balanced drawers.
* **💻 Laptops & Desktops**: Full widescreen 3-column feed, interactive hover elevations, and widescreen split views.

---

## 🛠️ Technology Stack

* **Core**: Vanilla JavaScript (Modern ES6+ Modules) — *Zero build step or bundler needed*
* **Styling**: Tailwind CSS (CDN) + Glassmorphism UI
* **Maps**: Leaflet.js with CartoDB Dark Matter / OpenStreetMap tiles
* **Live Weather**: Open-Meteo API (100% free, CORS-enabled meteorological telemetry)
* **AI Intelligence**: Google Gemini REST API (`gemini-2.5-flash`)
* **Landmarks & Imagery**: Wikipedia / Wikimedia Commons REST APIs + Unsplash
* **Audio**: HTML5 Web SpeechSynthesis API & Web Audio API synthesizers
* **Storage**: Browser `localStorage` for offline persistence

---

## ⚙️ Optional Configuration

MargaDarshi works **100% out of the box with zero setup** (live weather, landmark imagery, speech synthesis, and built-in travel recommendations all work without entering any keys).

If you wish to connect your own personal API keys:
1. Click the **Settings (Sliders)** icon in the top navigation bar.
2. Enter your **Google Gemini API Key** ([Get free key from Google AI Studio](https://aistudio.google.com/app/apikey)).
3. Enter your optional **OpenWeather** or **Unsplash** keys.
4. Settings are saved locally in your own browser's `localStorage`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
