// Destination Deep-Dive Page View with Hourly Weather Curve, Audio Phrasebook & Lightbox Hooks

import { DESTINATIONS, getDestinationById } from "../destinations-data.js";
import { weatherService } from "../services/weather-service.js";
import { geoService } from "../services/geo-service.js";
import { imageService } from "../services/image-service.js";
import { favoritesService } from "../services/favorites-service.js";
import { currencyService } from "../services/currency-service.js";
import { mapsService } from "../services/maps-service.js";
import { destinationResolver } from "../services/destination-resolver.js";
import { regionalAudioService } from "../services/regional-audio-service.js";
import { telemetryService } from "../services/telemetry-service.js";
import { hiddenGemsService } from "../services/hidden-gems-service.js";

export class DestinationView {
  constructor(containerId = "destination-detail-container") {
    this.container = document.getElementById(containerId);
    this.currentDestination = null;
    this.activeTab = "places";
    this.mapInstance = null;
    this.weatherData = null;
    this.selectedTravelMode = "driving";
    this.directionsTarget = "city";
    this.placesFilter = "all";
    this.customOrigin = "";
    this.mapDisplayMode = "leaflet";
    this.placesFilter = "all";
  }

  async show(destId) {
    if (!destId) {
      window.location.hash = "#explore";
      return;
    }
    const rawDestId = decodeURIComponent(destId);
    const cleanDestId = rawDestId.split("?")[0].split("#")[0].trim();
    let dest = getDestinationById(cleanDestId);
    if (!dest) {
      if (this.container) {
        this.container.innerHTML = `
          <div class="min-h-screen flex flex-col items-center justify-center py-32 text-center text-slate-300">
            <div class="relative w-16 h-16 mb-6">
              <div class="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
              <div class="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Exploring ${cleanDestId.replace(/-/g, " ")}</h3>
            <p class="text-slate-400 text-sm max-w-md">Gathering authentic landmarks, live meteorological conditions, and travel guides...</p>
          </div>
        `;
      }
      dest = await destinationResolver.resolve(cleanDestId);
    }
    if (dest) {
      dest = await destinationResolver.ensureNearbyPlaces(dest);
    }
    if (!dest) {
      window.location.hash = "#explore";
      return;
    }

    this.currentDestination = dest;
    this.activeTab = "places";
    this.selectedTravelMode = "driving";
    this.directionsTarget = "city";
    this.customOrigin = "";
    this.mapDisplayMode = "leaflet";

    try {
      this.render();
      this.loadWeatherData();
      this.loadDynamicImages();
      this.bindEvents();
    } catch (err) {
      console.error("Error rendering destination view:", err);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  render() {
    if (!this.container || !this.currentDestination) return;
    const rawDest = this.currentDestination;

    // Guaranteed safe defaults for all destination fields
    const dest = {
      tagline: rawDest.tagline || `Discover the iconic culture and authentic landmarks of ${rawDest.name}`,
      bestTimeToVisit: rawDest.bestTimeToVisit || "Spring & Autumn (Mild Season)",
      idealDuration: rawDest.idealDuration || "3 to 5 days",
      budget: rawDest.budget || "$$",
      budgetDailyEstimate: rawDest.budgetDailyEstimate || 120,
      currency: rawDest.currency || "USD ($)",
      language: rawDest.language || "English / Local",
      safetyRating: rawDest.safetyRating || "4.8/5 (High)",
      famousPlaces: Array.isArray(rawDest.famousPlaces) ? rawDest.famousPlaces : [],
      localPhrases: (() => {
        if (Array.isArray(rawDest.localPhrases) && rawDest.localPhrases.length > 0) {
          // If generic English fallback, upgrade to authentic regional phrases
          if (rawDest.localPhrases.length === 3 && rawDest.localPhrases[0].phrase === "Hello" && rawDest.localPhrases[0].lang === "en") {
            return regionalAudioService.getRegionalPhrases(rawDest.name, rawDest.country, rawDest.region || rawDest.name);
          }
          return rawDest.localPhrases;
        }
        return regionalAudioService.getRegionalPhrases(rawDest.name, rawDest.country, rawDest.region || rawDest.name);
      })(),
      localCuisine: Array.isArray(rawDest.localCuisine) && rawDest.localCuisine.length > 0 ? rawDest.localCuisine : [
        `Authentic regional specialties of ${rawDest.name}`,
        `Traditional local street food and culinary dishes`,
        `Locally roasted coffees, artisanal breads, and market delicacies`
      ],
      travelTips: Array.isArray(rawDest.travelTips) && rawDest.travelTips.length > 0 ? rawDest.travelTips : [
        "Carry some local currency for small artisan markets and public transit.",
        "Wear comfortable footwear as exploring historical quarters involves walking on cobblestones.",
        "Reserve entry tickets online in advance for major museums and historic landmarks to skip long lines.",
        "Download offline maps on your smartphone for effortless navigation around the city."
      ],
      vibes: Array.isArray(rawDest.vibes) ? rawDest.vibes : ["Cultural", "Scenic", "Historic"],
      heroImage: rawDest.heroImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
      ...rawDest
    };

    const telemetry = telemetryService.getTelemetryForDestination(dest);
    const hiddenGems = hiddenGemsService.getGemsForDestination(dest);
    const combinedPlaces = [
      ...dest.famousPlaces.map(p => ({ ...p, isGem: false })),
      ...hiddenGems.map(g => ({ ...g, isGem: true }))
    ];
    const currentMonthIdx = new Date().getMonth();
    const currentSeason = telemetry?.seasonality?.currentSeasonName ? telemetry.seasonality.currentSeasonName(currentMonthIdx) : null;
    const dist = geoService.getDistanceToDestination(dest.coordinates);
    const isDestFav = favoritesService.isDestinationFavorited(dest.id);
    const budgetFormatted = currencyService.formatUSD(dest.budgetDailyEstimate);

    const userLoc = geoService.getUserLocation();
    const userOriginParam = this.customOrigin.trim() || (userLoc ? `${userLoc.lat},${userLoc.lng}` : (userLoc?.city || ""));
    const originDisplay = this.customOrigin.trim() || (userLoc?.city ? `${userLoc.city}, ${userLoc.country || ""}` : (userLoc ? `${userLoc.lat.toFixed(3)}, ${userLoc.lng.toFixed(3)}` : "Current Location"));

    let targetCoords = dest.coordinates;
    let targetName = `${dest.name} (City Center)`;
    if (this.directionsTarget !== "city") {
      const p = dest.famousPlaces.find(pl => pl.id === this.directionsTarget);
      if (p && p.coordinates) {
        targetCoords = p.coordinates;
        targetName = p.name;
      }
    }

    const calculatedDist = geoService.calculateDistance(
      userLoc?.lat || dest.coordinates.lat,
      userLoc?.lng || dest.coordinates.lng,
      targetCoords.lat,
      targetCoords.lng
    );
    const distKm = userLoc ? calculatedDist.km : 0;
    const routeDistText = userLoc ? `${calculatedDist.km.toLocaleString()} km (${calculatedDist.miles.toLocaleString()} mi)` : "Global Coordinates";
    const routeTimeText = mapsService.estimateTravelTime(distKm, this.selectedTravelMode);
    const googleMapsUrl = mapsService.getDirectionsUrl(userOriginParam, `${targetCoords.lat},${targetCoords.lng}`, this.selectedTravelMode);
    const googleEmbedUrl = mapsService.getEmbedRouteUrl(userOriginParam, `${targetCoords.lat},${targetCoords.lng}`);

    this.container.innerHTML = `
      <div class="min-h-screen pb-24 text-slate-100 animate-fadeIn">
        <!-- Hero Banner with Background Imagery -->
        <div class="relative h-[65vh] min-h-[440px] max-h-[580px] w-full overflow-hidden bg-slate-950">
          <img 
            id="dest-hero-img"
            src="${dest.heroImage}" 
            alt="${dest.name}, ${dest.country}" 
            class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
            title="Click to view full screen photo"
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70"></div>

          <!-- Top Navigation Header inside Hero -->
          <div class="absolute top-4 sm:top-6 left-3 sm:left-8 right-3 sm:right-8 flex flex-wrap items-center justify-between gap-2 z-10 max-w-7xl mx-auto">
            <button id="btn-back-to-explore" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all shadow-xl">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              Back to Explorer
            </button>

            <!-- Actions: Bookmark, Postcard & Plan Trip Button -->
            <div class="flex items-center gap-2">
              <button 
                id="btn-fav-destination-hero" 
                class="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-pink-400 transition-colors shadow-lg"
                title="Add to Bucket List"
              >
                <i data-lucide="heart" class="w-5 h-5 ${isDestFav ? 'fill-pink-500 text-pink-500' : ''}"></i>
              </button>

              <button 
                id="btn-create-postcard-dest" 
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-bold transition-all shadow-lg"
                title="Create 3D Virtual Postcard"
              >
                <i data-lucide="mail" class="w-4 h-4 text-amber-400"></i>
                <span class="hidden sm:inline">Postcard</span>
              </button>

              <button id="btn-plan-dest-trip" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-500/25">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
                Plan Itinerary with AI
              </button>
            </div>
          </div>

          <!-- Hero Bottom Title & Badges -->
          <div class="absolute bottom-8 left-4 right-4 sm:left-8 sm:right-8 max-w-7xl mx-auto">
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                ${dest.continent} · ${dest.region || dest.country}
              </span>
              ${dist ? `
                <span class="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-cyan-400 text-xs font-medium flex items-center gap-1">
                  <i data-lucide="navigation" class="w-3.5 h-3.5"></i>
                  ${dist.km.toLocaleString()} km from you
                </span>
              ` : ""}
            </div>

            <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight mb-2">
              ${dest.name}
            </h1>
            <p class="text-slate-300 text-base sm:text-xl font-medium max-w-2xl drop-shadow-sm">
              ${dest.tagline}
            </p>
          </div>
        </div>

        <!-- Main Content Wrapper -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <!-- Key Facts Grid Strip with Multi-Currency Support -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl mb-10">
            <div class="p-3 border-r border-slate-800/80 last:border-r-0">
              <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Best Season</span>
              <span class="text-xs sm:text-sm font-bold text-white">${dest.bestTimeToVisit.split("&")[0]}</span>
            </div>
            <div class="p-3 border-r border-slate-800/80 last:border-r-0">
              <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Ideal Stay</span>
              <span class="text-xs sm:text-sm font-bold text-emerald-400">${dest.idealDuration}</span>
            </div>
            <div class="p-3 border-r border-slate-800/80 last:border-r-0">
              <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Daily Budget</span>
              <span class="text-xs sm:text-sm font-bold text-amber-400">${dest.budget} (~${budgetFormatted}/day)</span>
            </div>
            <div class="p-3 border-r border-slate-800/80 last:border-r-0">
              <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Currency</span>
              <span class="text-xs sm:text-sm font-bold text-white">${dest.currency}</span>
            </div>
            <div class="p-3 border-r border-slate-800/80 last:border-r-0">
              <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Language</span>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-xs sm:text-sm font-bold text-white">${dest.language}</span>
                ${dest.localPhrases && dest.localPhrases.length > 0 ? `
                  <button 
                    type="button" 
                    class="btn-quick-listen text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                    data-phrase="${dest.localPhrases[0].phrase}"
                    data-lang="${dest.localPhrases[0].lang || 'en-US'}"
                    title="Listen to native regional greeting"
                  >
                    <i data-lucide="volume-2" class="w-3 h-3"></i>
                    <span>Listen</span>
                  </button>
                ` : ''}
              </div>
            </div>
            <div class="p-3">
              <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Safety Rating</span>
              <span class="text-xs sm:text-sm font-bold text-cyan-400">${dest.safetyRating}</span>
            </div>
          </div>

          <!-- Quick Traveler Readiness Telemetry Strip (Recommendation 1 & 2) -->
          <div class="flex flex-wrap items-center justify-between gap-3 p-3.5 px-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl mb-8 text-xs">
            <div class="flex flex-wrap items-center gap-4 sm:gap-6">
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">🔌</span>
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Power Plugs</span>
                  <span class="font-bold text-white text-xs">${telemetry?.plugs?.types?.join(", ") || "Type C"} · ${telemetry?.plugs?.voltage || "230V"}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-${telemetry?.tapWater?.safe ? 'emerald' : 'amber'}-500/10 text-${telemetry?.tapWater?.safe ? 'emerald' : 'amber'}-400 border border-${telemetry?.tapWater?.safe ? 'emerald' : 'amber'}-500/20">🚰</span>
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Tap Water</span>
                  <span class="font-bold text-white text-xs">${telemetry?.tapWater?.status || "Safe"}</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">💵</span>
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Tipping</span>
                  <span class="font-bold text-white text-xs">${telemetry?.tipping?.percentage || "5-10%"} (${telemetry?.tipping?.norm || "Customary"})</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">🚑</span>
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Emergency</span>
                  <span class="font-bold text-rose-300 text-xs">Dial ${telemetry?.emergency?.general || "112"}</span>
                </div>
              </div>
            </div>

            <button type="button" data-dest-tab="telemetry" class="tab-quick-trigger inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <span>Seasonality & Telemetry Guide</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Tab Navigation Bar -->
          <div class="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto no-scrollbar touch-pan-x" style="-webkit-overflow-scrolling: touch;">
            <button data-dest-tab="places" class="tab-btn shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${this.activeTab === "places" ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}">
              <i data-lucide="landmark" class="w-4 h-4 inline mr-1.5"></i>
              Places & Hidden Gems (${combinedPlaces.length})
            </button>
            <button data-dest-tab="weather" class="tab-btn shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${this.activeTab === "weather" ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}">
              <i data-lucide="cloud-sun" class="w-4 h-4 inline mr-1.5"></i>
              Real-Time Weather
            </button>
            <button data-dest-tab="map" class="tab-btn shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${this.activeTab === "map" ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}">
              <i data-lucide="map" class="w-4 h-4 inline mr-1.5"></i>
              Map & Google Directions
            </button>
            <button data-dest-tab="culture" class="tab-btn shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${this.activeTab === "culture" ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}">
              <i data-lucide="volume-2" class="w-4 h-4 inline mr-1.5"></i>
              Audio Phrasebook & Culture
            </button>
            <button data-dest-tab="nearby" class="tab-btn shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${this.activeTab === "nearby" ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}">
              <i data-lucide="map-pin" class="w-4 h-4 inline mr-1.5"></i>
              Nearby Excursions (${(dest.nearbyPlaces || []).length})
            </button>
          </div>

          <!-- TAB 1: FAMOUS PLACES & HIDDEN GEMS (Recommendation 4 - Atlas Obscura Feature) -->
          <div id="tab-content-places" class="${this.activeTab === "places" ? "block" : "hidden"}">
            <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/25 flex items-center justify-center text-sm shadow">
                    💎
                  </span>
                  <h3 class="text-2xl font-bold text-white">Notable Places & Secret Gems</h3>
                </div>
                <p class="text-sm text-slate-400">Explore world-famous monuments alongside curious, off-the-beaten-path local secrets.</p>
              </div>

              <!-- Atlas Obscura Filter Switch (Recommendation 4) -->
              <div class="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs self-start sm:self-auto shadow-lg" id="places-filter-bar">
                <button type="button" data-filter="all" class="btn-places-filter px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${this.placesFilter === 'all' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
                  <span>★ All</span>
                  <span class="text-[10px] px-1.5 py-0.2 rounded-full ${this.placesFilter === 'all' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}">${combinedPlaces.length}</span>
                </button>
                <button type="button" data-filter="landmark" class="btn-places-filter px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${this.placesFilter === 'landmark' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
                  <span>🏛️ Top Landmarks</span>
                  <span class="text-[10px] px-1.5 py-0.2 rounded-full ${this.placesFilter === 'landmark' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}">${dest.famousPlaces.length}</span>
                </button>
                <button type="button" data-filter="gem" class="btn-places-filter px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${this.placesFilter === 'gem' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-purple-400 hover:text-purple-300'}">
                  <span>💎 Secret Gems & Lore</span>
                  <span class="text-[10px] px-1.5 py-0.2 rounded-full ${this.placesFilter === 'gem' ? 'bg-white text-purple-950 font-black' : 'bg-purple-950/60 text-purple-300'}">${hiddenGems.length}</span>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="places-grid-container">
              ${combinedPlaces.map((place) => {
                const safeId = String(place.id || place.name).replace(/[^a-zA-Z0-9_-]/g, "_");
                const isPlaceFav = favoritesService.isPlaceFavorited(place.id || safeId);
                const placeImg = place.image || "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80";
                const placeDirUrl = mapsService.getDirectionsUrl(userOriginParam, place.coordinates ? `${place.coordinates.lat},${place.coordinates.lng}` : `${place.name}, ${dest.name}`, 'driving');
                const isHiddenByFilter = this.placesFilter !== 'all' && this.placesFilter !== (place.isGem ? 'gem' : 'landmark');
                return `
                  <div class="place-card-item bg-slate-900/70 border ${place.isGem ? 'border-purple-800/50 shadow-purple-950/20' : 'border-slate-800'} rounded-2xl overflow-hidden hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between ${isHiddenByFilter ? 'hidden' : ''}" data-place-type="${place.isGem ? 'gem' : 'landmark'}">
                    <!-- Landmark Image (Lightbox click) -->
                    <div class="relative h-64 w-full overflow-hidden bg-slate-950 group cursor-pointer landmark-photo-trigger" data-img-src="${placeImg}" data-img-title="${place.name}" data-img-caption="${place.category || 'Landmark'} · ${dest.name}, ${dest.country}">
                      <img 
                        id="place-img-${safeId}"
                        src="${placeImg}" 
                        alt="${place.name}" 
                        loading="lazy"
                        referrerpolicy="no-referrer"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onerror="this.onerror=null; this.src='${dest.heroImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}';"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                      <div class="absolute top-3 left-3">
                        ${place.isGem ? `
                          <span class="px-2.5 py-1 rounded-lg bg-purple-950/90 backdrop-blur-md text-xs font-bold text-purple-300 border border-purple-600/50 shadow-lg flex items-center gap-1.5">
                            <span>💎</span>
                            <span>${place.category || 'Secret Gem'}</span>
                          </span>
                        ` : `
                          <span class="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-xs font-semibold text-emerald-400 border border-slate-700/60 shadow">
                            ${place.category || 'Historic Landmark'}
                          </span>
                        `}
                      </div>

                      <div class="absolute top-3 right-3 flex items-center gap-1.5">
                        <!-- Bookmark Place Heart -->
                        <button 
                          class="btn-toggle-place-fav p-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md text-slate-300 hover:text-pink-400 border border-slate-700/60 shadow"
                          data-place-id="${place.id || safeId}"
                          title="Save Landmark to Bucket List"
                          onclick="event.stopPropagation();"
                        >
                          <i data-lucide="heart" class="w-4 h-4 ${isPlaceFav ? 'fill-pink-500 text-pink-500' : ''}"></i>
                        </button>
                      </div>

                      <div class="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-xs font-bold text-amber-300 border border-slate-700/60">
                        <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
                        ${place.rating || 4.8} <span class="text-slate-400 font-normal">(${place.reviewsCount ? place.reviewsCount.toLocaleString() : '25,000+'} reviews)</span>
                      </div>

                      <!-- Enlarge Hint -->
                      <div class="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-white bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-md">
                        <i data-lucide="maximize-2" class="w-3 h-3"></i> Fullscreen
                      </div>
                    </div>

                    <!-- Landmark Content Body -->
                    <div class="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 class="text-xl font-bold text-white mb-2">
                          ${place.name}
                        </h4>
                        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                          ${place.description || `One of the most celebrated cultural sites in ${dest.name}.`}
                        </p>

                        ${place.isGem && place.curiousLore ? `
                          <!-- Atlas Obscura: Curious Lore Box (Recommendation 4) -->
                          <div class="p-3.5 rounded-xl bg-purple-950/25 border border-purple-800/40 mb-3 text-xs">
                            <span class="font-bold text-purple-300 flex items-center gap-1.5 mb-1">
                              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-400"></i>
                              Curious Lore & Secret Mystery
                            </span>
                            <p class="text-slate-300 leading-relaxed">${place.curiousLore}</p>
                          </div>
                        ` : ''}

                        <!-- Why Visit Quote Card -->
                        <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 mb-3 text-xs">
                          <span class="font-bold text-emerald-400 block mb-1">
                            <i data-lucide="sparkles" class="w-3.5 h-3.5 inline mr-1"></i>
                            Why Visit
                          </span>
                          <p class="text-slate-300 italic">"${place.whyVisit || `An essential cultural landmark offering deep historical insight into ${dest.name}.`}"</p>
                        </div>

                        <!-- Insider Tip -->
                        <div class="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs mb-4">
                          <span class="font-bold text-cyan-400 block mb-1">
                            <i data-lucide="lightbulb" class="w-3.5 h-3.5 inline mr-1"></i>
                            Insider Pro-Tip
                          </span>
                          <p class="text-slate-300">${place.insiderTip || "Visit during early morning or sunset hours for quieter exploration and stunning lighting."}</p>
                        </div>
                      </div>

                      <!-- Meta & Directions / Ask AI Actions -->
                      <div class="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div class="flex items-center flex-wrap gap-2 text-slate-400">
                          <span class="flex items-center gap-1">
                            <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-500"></i>
                            ${place.estimatedTime || "1.5 – 2.5 hours"}
                          </span>
                          <span class="flex items-center gap-1">
                            <i data-lucide="ticket" class="w-3.5 h-3.5 text-slate-500"></i>
                            ${place.entryCost || "Free / Standard entry"}
                          </span>
                          ${place.crowdFactor ? `
                            <span class="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-[11px] font-medium">
                              ${place.crowdFactor}
                            </span>
                          ` : ''}
                        </div>

                        <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 sm:mt-0">
                          <a 
                            href="https://artsandculture.google.com/search?q=${encodeURIComponent(place.name)}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                            title="Explore authentic virtual tours, museum archives & exhibits on Google Arts & Culture"
                          >
                            <span>🏛️</span>
                            <span>Google Arts & Culture</span>
                          </a>

                          <a 
                            href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + dest.name)}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                            title="View real visitor photos & 360° Street View on Google Maps"
                          >
                            <span>📷</span>
                            <span>Google Photos</span>
                          </a>

                          <a 
                            href="${placeDirUrl}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="px-2.5 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                            title="Get turn-by-turn directions to ${place.name} in Google Maps"
                          >
                            <span>🧭</span>
                            <span>Directions</span>
                          </a>

                          <button class="btn-ask-place text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all" data-place-name="${place.name}">
                            Ask AI <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
            <!-- Quick Link Banner to Nearby Excursions Tab if available -->
            ${dest.nearbyPlaces && dest.nearbyPlaces.length > 0 ? `
              <div class="mt-14 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 to-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div class="flex items-center gap-3.5">
                  <div class="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xl shadow">
                    🚗
                  </div>
                  <div>
                    <h4 class="text-base font-bold text-white flex items-center gap-2">
                      <span>Popular Places Nearby & Day Trips</span>
                      <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">${dest.nearbyPlaces.length} Excursions</span>
                    </h4>
                    <p class="text-xs text-slate-400 mt-0.5">Explore scenic hill stations, coastal retreats, and heritage towns easily reachable from ${dest.name}.</p>
                  </div>
                </div>
                <button type="button" data-dest-tab="nearby" class="tab-quick-trigger px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
                  <span>View All Day Trips (${dest.nearbyPlaces.length})</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            ` : ''}

          </div>

          <!-- TAB 2: REAL-TIME WEATHER (05 Requirement + 24H Hourly Curve) -->
          <div id="tab-content-weather" class="${this.activeTab === "weather" ? "block" : "hidden"}">
            <div id="weather-detail-view" class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
              <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 class="text-2xl font-bold text-white flex items-center gap-2">
                    <i data-lucide="cloud-sun" class="w-6 h-6 text-amber-400"></i>
                    Live Weather Station: ${dest.name}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-400 mt-1" id="weather-provider-label">
                    Fetching meteorological measurements...
                  </p>
                </div>

                <div class="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button id="btn-set-celsius" class="px-3 py-1 rounded-lg text-xs font-bold transition-colors ${weatherService.getTemperatureUnit() === "C" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"}">
                    °C
                  </button>
                  <button id="btn-set-fahrenheit" class="px-3 py-1 rounded-lg text-xs font-bold transition-colors ${weatherService.getTemperatureUnit() === "F" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"}">
                    °F
                  </button>
                </div>
              </div>

              <!-- Weather Metrics Container -->
              <div id="weather-metrics-container">
                <div class="text-center py-12 text-slate-400">
                  <div class="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  Loading live weather data...
                </div>
              </div>

              <!-- 24-Hour Hourly Weather Curve (Advanced Upgrade 7) -->
              <div id="weather-hourly-container" class="pt-6 border-t border-slate-800">
                <!-- Dynamically populated SVG graph -->
              </div>
            </div>
          </div>

          <!-- TAB 3: INTERACTIVE MAP & GOOGLE MAPS DIRECTIONS -->
          <div id="tab-content-map" class="${this.activeTab === "map" ? "block" : "hidden"} space-y-6">
            <div class="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              <!-- Header with Dual-View Switcher -->
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-sm shadow">
                      🧭
                    </span>
                    <h3 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Directions & Google Maps Navigation
                    </h3>
                  </div>
                  <p class="text-xs sm:text-sm text-slate-400">
                    Plan turn-by-turn routes from your current location or custom origin to ${dest.name} and iconic landmarks.
                  </p>
                </div>

                <!-- Dual View Mode: Leaflet Explorer vs Google Maps Route -->
                <div class="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs self-start lg:self-auto">
                  <button type="button" id="btn-show-leaflet" class="px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${this.mapDisplayMode === 'leaflet' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
                    <i data-lucide="map" class="w-3.5 h-3.5"></i>
                    <span>Interactive Explorer</span>
                  </button>
                  <button type="button" id="btn-show-google-route" class="px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${this.mapDisplayMode === 'google-embed' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}">
                    <span>🗺️</span>
                    <span>Google Maps Route</span>
                  </button>
                </div>
              </div>

              <!-- Route Setup Grid: Origin, Target Landmark & Travel Mode -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <!-- Origin Input -->
                <div class="md:col-span-4">
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Starting From (Origin)
                    </label>
                    <button type="button" id="btn-use-detected-origin" class="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer">
                      <i data-lucide="locate-fixed" class="w-3 h-3"></i> My Location
                    </button>
                  </div>
                  <div class="relative">
                    <input 
                      type="text" 
                      id="input-directions-origin" 
                      value="${originDisplay}"
                      placeholder="e.g. Current Location, Airport, Hotel..."
                      class="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pl-9"
                    />
                    <i data-lucide="map-pin" class="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                  </div>
                </div>

                <!-- Destination Target Landmark Selector -->
                <div class="md:col-span-4">
                  <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Destination Landmark
                  </label>
                  <div class="relative">
                    <select 
                      id="select-directions-target" 
                      class="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pl-9 cursor-pointer"
                    >
                      <option value="city" ${this.directionsTarget === 'city' ? 'selected' : ''}>📍 ${dest.name} (City Center)</option>
                      ${combinedPlaces.map(p => `
                        <option value="${p.id}" ${this.directionsTarget === p.id ? 'selected' : ''}>
                          ${p.isGem ? '💎' : '★'} ${p.name}
                        </option>
                      `).join("")}
                    </select>
                    <i data-lucide="navigation-2" class="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                  </div>
                </div>

                <!-- Travel Mode Selector -->
                <div class="md:col-span-4">
                  <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Travel Mode
                  </label>
                  <div class="grid grid-cols-4 gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-700/80 text-xs text-center" id="travel-mode-selector">
                    <button type="button" data-mode="driving" class="mode-btn py-1.5 rounded-lg font-bold transition-all flex flex-col items-center gap-0.5 ${this.selectedTravelMode === 'driving' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-white'}">
                      <span>🚗</span>
                      <span class="text-[10px]">Drive</span>
                    </button>
                    <button type="button" data-mode="transit" class="mode-btn py-1.5 rounded-lg font-bold transition-all flex flex-col items-center gap-0.5 ${this.selectedTravelMode === 'transit' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-white'}">
                      <span>🚆</span>
                      <span class="text-[10px]">Transit</span>
                    </button>
                    <button type="button" data-mode="walking" class="mode-btn py-1.5 rounded-lg font-bold transition-all flex flex-col items-center gap-0.5 ${this.selectedTravelMode === 'walking' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-white'}">
                      <span>🚶</span>
                      <span class="text-[10px]">Walk</span>
                    </button>
                    <button type="button" data-mode="flying" class="mode-btn py-1.5 rounded-lg font-bold transition-all flex flex-col items-center gap-0.5 ${this.selectedTravelMode === 'flying' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-white'}">
                      <span>✈️</span>
                      <span class="text-[10px]">Flight</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Route Stats & Action Buttons -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div class="flex flex-wrap items-center gap-4 text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-slate-400">Target:</span>
                    <b id="route-target-name" class="text-white">${targetName}</b>
                  </div>
                  <span class="text-slate-600 hidden sm:inline">•</span>
                  <div class="flex items-center gap-1.5 text-sky-400 font-semibold">
                    <i data-lucide="milestone" class="w-3.5 h-3.5"></i>
                    <span id="route-distance-text">${routeDistText}</span>
                  </div>
                  <span class="text-slate-600 hidden sm:inline">•</span>
                  <div class="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                    <span id="route-time-text">${routeTimeText}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <a 
                    id="btn-launch-google-maps" 
                    href="${googleMapsUrl}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <span>🧭</span>
                    <span>Launch Google Maps App</span>
                    <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                  </a>
                </div>
              </div>

              <!-- Container 1: Leaflet Interactive Map -->
              <div id="container-leaflet-map" class="${this.mapDisplayMode === 'leaflet' ? 'block' : 'hidden'}">
                <div class="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Interactive Map & Category Colored Landmark Pins:</span>
                  <span class="text-emerald-400 font-semibold">Click any pin to view details and direct Google Maps route</span>
                </div>
                <div id="destination-leaflet-map" class="h-[520px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner"></div>
              </div>

              <!-- Container 2: Embedded Live Google Maps Route View -->
              <div id="container-google-embed-map" class="${this.mapDisplayMode === 'google-embed' ? 'block' : 'hidden'}">
                <div class="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span> Live Google Maps Route Preview:</span>
                  <span class="text-slate-400">Official turn-by-turn road network & transit lines</span>
                </div>
                <div class="h-[520px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950 relative">
                  <iframe 
                    id="google-maps-iframe"
                    src="${googleEmbedUrl}"
                    class="w-full h-full border-0"
                    loading="lazy"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 4: AUDIO PHRASEBOOK & CULTURE (Advanced Upgrade 6) -->
          <div id="tab-content-culture" class="${this.activeTab === "culture" ? "block" : "hidden"}">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Audio Phrasebook -->
              <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h4 class="text-xl font-bold text-white flex items-center gap-2">
                    <i data-lucide="volume-2" class="w-5 h-5 text-emerald-400"></i>
                    Regional Audio Phrasebook
                  </h4>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/25 font-mono font-bold">
                      ${dest.localPhrases?.[0]?.lang || 'Regional Audio'}
                    </span>
                    <span class="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Click speaker to listen
                    </span>
                  </div>
                </div>
                <p class="text-xs text-slate-400 mb-4">
                  Authentic regional pronunciation & native scripts powered by Web Speech Synthesis:
                </p>
                <div class="space-y-3">
                  ${(dest.localPhrases || []).map(item => `
                    <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
                      <div class="space-y-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-sm font-bold text-white">${item.phrase}</span>
                          ${item.native && item.native !== item.phrase ? `
                            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              ${item.native}
                            </span>
                          ` : ''}
                        </div>
                        <span class="text-xs text-slate-400 block">${item.english}</span>
                        <span class="text-[11px] text-slate-500 italic block">Phonetic: "${item.phonetic}"</span>
                      </div>
                      <button 
                        class="btn-speak-phrase p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all shrink-0 ml-3 cursor-pointer shadow-sm"
                        data-phrase="${item.phrase}"
                        data-lang="${item.lang || 'en-US'}"
                        title="Listen to native regional pronunciation"
                      >
                        <i data-lucide="volume-2" class="w-4 h-4"></i>
                      </button>
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- Cuisine & Practical Travel Tips -->
              <div class="space-y-6">
                <!-- Food Specialties -->
                <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h4 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <i data-lucide="utensils" class="w-5 h-5 text-amber-400"></i>
                    Signature Local Dishes
                  </h4>
                  <ul class="space-y-2 text-xs sm:text-sm text-slate-300">
                    ${(dest.localCuisine || []).map(item => `
                      <li class="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                        <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"></i>
                        <span>${item}</span>
                      </li>
                    `).join("")}
                  </ul>
                </div>

                <!-- Tips -->
                <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h4 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <i data-lucide="compass" class="w-5 h-5 text-cyan-400"></i>
                    Travel Etiquette & Tips
                  </h4>
                  <ul class="space-y-2 text-xs sm:text-sm text-slate-300">
                    ${(dest.travelTips || []).map(tip => `
                      <li class="flex items-start gap-2 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                        <i data-lucide="info" class="w-4 h-4 text-cyan-400 mt-0.5 shrink-0"></i>
                        <span>${tip}</span>
                      </li>
                    `).join("")}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 5: NEARBY EXCURSIONS & POPULAR DAY TRIPS -->
          <div id="tab-content-nearby" class="${this.activeTab === "nearby" ? "block" : "hidden"}">
            <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 flex items-center justify-center text-sm shadow">
                    🚗
                  </span>
                  <h3 class="text-2xl sm:text-3xl font-bold text-white">Nearby Excursions & Scenic Day Trips</h3>
                  <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Google Travel Guide</span>
                </div>
                <p class="text-sm text-slate-400">Top-rated scenic excursions, historic hill stations, and heritage retreats easily reachable from ${dest.name}. Click any place to explore its authentic landmarks.</p>
              </div>

              <div class="text-xs text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 self-start sm:self-auto shadow flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>${(dest.nearbyPlaces || []).length} Verified Day Trips</span>
              </div>
            </div>

            ${dest.nearbyPlaces && dest.nearbyPlaces.length > 0 ? `
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${dest.nearbyPlaces.map((np) => {
                  const npDirUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(dest.name)}&destination=${encodeURIComponent(np.coordinates ? `${np.coordinates.lat},${np.coordinates.lng}` : np.name)}&travelmode=driving`;
                  const npGooglePhotosUrl = np.googlePhotosUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(np.name + " " + dest.name)}`;
                  return `
                    <div 
                      class="excursion-card bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-cyan-500/10 flex flex-col justify-between group cursor-pointer"
                      data-place-name="${np.name}"
                      data-excursion-id="${np.id || ''}"
                    >
                      <div>
                        <!-- Photo with distance badge -->
                        <div class="relative aspect-[16/10] overflow-hidden group/photo">
                          <img 
                            src="${np.image}" 
                            alt="${np.name}" 
                            class="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                            onerror="this.onerror=null; this.src='${dest.heroImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}';"
                          />
                          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                          <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-cyan-400 border border-slate-700">
                            ${np.category || 'Excursion'}
                          </span>
                          <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-xs font-bold text-amber-300 border border-slate-700 shadow flex items-center gap-1.5">
                            <span>🚗</span>
                            <span>${np.distanceKm ? `~${np.distanceKm} km` : ''} ${np.driveTime ? `• ${np.driveTime}` : ''}</span>
                          </span>
                        </div>

                        <!-- Info Content -->
                        <div class="p-5 space-y-3">
                          <h4 class="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1" title="${np.name}">
                            ${np.name}
                          </h4>
                          <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            ${np.description}
                          </p>

                          <!-- Why Visit -->
                          <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px]">
                            <span class="font-bold text-emerald-400 block mb-0.5">Why Visit:</span>
                            <p class="text-slate-300 italic line-clamp-2">"${np.whyVisit}"</p>
                          </div>
                        </div>
                      </div>

                      <!-- Actions Strip -->
                      <div class="p-4 pt-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2 text-xs">
                        <button
                          type="button"
                          class="btn-explore-nearby-deep px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          data-place-name="${np.name}"
                          data-excursion-id="${np.id || ''}"
                          title="Explore ${np.name} and view all its authentic landmarks"
                          onclick="event.stopPropagation();"
                        >
                          <i data-lucide="compass" class="w-3.5 h-3.5"></i>
                          <span>Explore Landmarks</span>
                        </button>
                        <div class="flex items-center gap-1.5">
                          <a 
                            href="${npGooglePhotosUrl}" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="px-2 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-500/30 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                            title="View real visitor photos & Street View on Google Maps"
                            onclick="event.stopPropagation();"
                          >
                            <span>📷</span>
                            <span>Photos</span>
                          </a>
                          <a 
                            href="${npDirUrl}" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="px-2 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                            title="Get Google Maps driving directions from ${dest.name}"
                            onclick="event.stopPropagation();"
                          >
                            <span>🧭</span>
                            <span>Route</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  `;
                }).join("")}
              </div>
            ` : `
              <div class="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
                <span class="text-4xl mb-3 block">🚗</span>
                <h4 class="text-lg font-bold text-white mb-1">Discovering Excursions Around ${dest.name}...</h4>
                <p class="text-xs text-slate-400 max-w-md mx-auto">Connecting to regional travel telemetry to fetch nearby towns, nature sanctuaries, and historical day trips.</p>
              </div>
            `}
          </div>

          <!-- TAB 6: GOOD TO KNOW: ESSENTIAL TRAVELER TELEMETRY & 12-MONTH SEASONALITY (Recommendations 1 & 2) -->
          <div id="tab-content-telemetry" class="${this.activeTab === "telemetry" ? "block" : "hidden"} space-y-10">
            <!-- Header Section -->
            <div class="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                    Travel Readiness & Intelligence
                  </div>
                  <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Good to Know Before You Go: ${dest.name}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-400 mt-1">
                    Electrical standards, tap water drinkability, tipping norms, local emergency lines, and annual weather seasonality.
                  </p>
                </div>

                <!-- Current Month Seasonal Verdict Callout -->
                ${currentSeason ? `
                  <div class="flex items-center gap-3 p-3.5 px-4 rounded-2xl bg-${currentSeason.color === 'emerald' ? 'emerald' : currentSeason.color === 'amber' ? 'amber' : 'sky'}-500/10 border border-${currentSeason.color === 'emerald' ? 'emerald' : currentSeason.color === 'amber' ? 'amber' : 'sky'}-500/30 self-start lg:self-auto shrink-0 shadow-lg">
                    <span class="text-2xl">🗓️</span>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-${currentSeason.color === 'emerald' ? 'emerald' : currentSeason.color === 'amber' ? 'amber' : 'sky'}-400 animate-pulse"></span>
                        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Month (${['January','February','March','April','May','June','July','August','September','October','November','December'][currentMonthIdx]})</span>
                      </div>
                      <span class="text-sm font-extrabold text-${currentSeason.color === 'emerald' ? 'emerald' : currentSeason.color === 'amber' ? 'amber' : 'sky'}-300 block">
                        ${currentSeason.season} · ${currentSeason.tag}
                      </span>
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- 6 Essential Traveler Telemetry Cards (Recommendation 1) -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-8">
                <!-- 1. Electrical Sockets & Plugs -->
                <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-base font-bold shadow">
                          🔌
                        </span>
                        <h4 class="font-bold text-white text-sm">Power Plugs & Voltage</h4>
                      </div>
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-bold">
                        ${telemetry?.plugs?.voltage || "230V"}
                      </span>
                    </div>
                    <div class="flex flex-wrap gap-1.5 mb-3">
                      ${(telemetry?.plugs?.types || ["Type C"]).map(t => `
                        <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white shadow-inner">
                          ${t}
                        </span>
                      `).join("")}
                      <span class="px-2 py-1 rounded-lg bg-slate-900/60 text-[11px] text-slate-400">
                        ${telemetry?.plugs?.frequency || "50Hz"}
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">
                      ${telemetry?.plugs?.summary || "Standard sockets. Universal travel adapter recommended."}
                    </p>
                  </div>
                </div>

                <!-- 2. Tap Water Safety -->
                <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-xl bg-${telemetry?.tapWater?.safe ? 'emerald' : 'amber'}-500/10 text-${telemetry?.tapWater?.safe ? 'emerald' : 'amber'}-400 border border-${telemetry?.tapWater?.safe ? 'emerald' : 'amber'}-500/20 flex items-center justify-center text-base font-bold shadow">
                          🚰
                        </span>
                        <h4 class="font-bold text-white text-sm">Tap Water Drinkability</h4>
                      </div>
                      <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-${telemetry?.tapWater?.safe ? 'emerald' : 'amber'}-500/15 text-${telemetry?.tapWater?.safe ? 'emerald' : 'amber'}-300 border border-${telemetry?.tapWater?.safe ? 'emerald' : 'amber'}-500/30">
                        ${telemetry?.tapWater?.grade || "Standard"}
                      </span>
                    </div>
                    <div class="mb-3">
                      <span class="text-sm font-extrabold ${telemetry?.tapWater?.safe ? 'text-emerald-400' : 'text-amber-400'} flex items-center gap-1.5">
                        <i data-lucide="${telemetry?.tapWater?.safe ? 'check-circle' : 'alert-triangle'}" class="w-4 h-4"></i>
                        ${telemetry?.tapWater?.status || "Drinkable"}
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">
                      ${telemetry?.tapWater?.notes || "Clean water available in hotels and restaurants."}
                    </p>
                  </div>
                </div>

                <!-- 3. Tipping Customs & Etiquette -->
                <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center text-base font-bold shadow">
                          💵
                        </span>
                        <h4 class="font-bold text-white text-sm">Tipping Customs</h4>
                      </div>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-teal-300">
                        ${telemetry?.tipping?.percentage || "5-10%"}
                      </span>
                    </div>
                    <div class="mb-2.5">
                      <span class="text-xs font-bold text-white block">
                        ${telemetry?.tipping?.norm || "Customary"}
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">
                      ${telemetry?.tipping?.notes || "Small tips for good table service are appreciated."}
                    </p>
                  </div>
                </div>

                <!-- 4. Local Emergency Assistance -->
                <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center text-base font-bold shadow">
                          🚑
                        </span>
                        <h4 class="font-bold text-white text-sm">Emergency Hotlines</h4>
                      </div>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        24/7 Dial
                      </span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <a href="tel:${telemetry?.emergency?.police || '112'}" class="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group transition-colors">
                        <span class="text-slate-400">Police:</span>
                        <span class="font-black text-rose-400 group-hover:underline">${telemetry?.emergency?.police || '112'}</span>
                      </a>
                      <a href="tel:${telemetry?.emergency?.ambulanceFire?.split(' ')[0] || '112'}" class="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group transition-colors">
                        <span class="text-slate-400">Ambulance:</span>
                        <span class="font-black text-rose-400 group-hover:underline">${telemetry?.emergency?.ambulanceFire?.split('/')[0]?.trim() || '112'}</span>
                      </a>
                    </div>
                    <p class="text-[11px] text-slate-400">
                      Tourist line: <span class="text-slate-300 font-medium">${telemetry?.emergency?.touristHelpline || "112 (English)"}</span>
                    </p>
                  </div>
                </div>

                <!-- 5. Visa & Digital Arrival -->
                <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-base font-bold shadow">
                          🛂
                        </span>
                        <h4 class="font-bold text-white text-sm">Visa & Entry Guidelines</h4>
                      </div>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        ${telemetry?.visa?.duration || "90 Days"}
                      </span>
                    </div>
                    <div class="mb-2">
                      <span class="text-xs font-bold text-white block">
                        ${telemetry?.visa?.type || "Tourist Entry"}
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">
                      ${telemetry?.visa?.notes || "Check national visa requirements prior to flight departure."}
                    </p>
                  </div>
                </div>

                <!-- 6. Transit Pass & Connectivity -->
                <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md">
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-base font-bold shadow">
                          📱
                        </span>
                        <h4 class="font-bold text-white text-sm">Transit Card & eSIM</h4>
                      </div>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Recommended
                      </span>
                    </div>
                    <div class="mb-2">
                      <span class="text-xs font-bold text-emerald-400 block">
                        💳 ${telemetry?.transit?.card || "Contactless Transit Card"}
                      </span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">
                      ${telemetry?.transit?.notes || "Rechargeable travel card or contactless credit card tap supported."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recommendation 2: 12-Month Seasonality & Weather Matrix -->
            <div class="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h4 class="text-xl font-bold text-white flex items-center gap-2">
                    <i data-lucide="calendar" class="w-5 h-5 text-emerald-400"></i>
                    12-Month Seasonality & Crowd Heatmap
                  </h4>
                  <p class="text-xs text-slate-400 mt-1">
                    Month-by-month temperature, weather conditions, crowd levels, and prime visiting windows.
                  </p>
                </div>
                <div class="flex items-center gap-3 text-xs">
                  <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Peak Season</span>
                  <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Shoulder</span>
                  <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Low / Quiet</span>
                </div>
              </div>

              <!-- 12-Month Calendar Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                ${(telemetry?.seasonality?.months || []).map((m, idx) => {
                  const isCurrentMonth = currentMonthIdx === idx;
                  const statusColors = {
                    peak: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300",
                    shoulder: "border-amber-500/40 bg-amber-950/20 text-amber-300",
                    low: "border-slate-800 bg-slate-950/60 text-slate-400"
                  };
                  return `
                    <div class="p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 relative ${isCurrentMonth ? 'ring-2 ring-emerald-400 border-emerald-400 bg-slate-900 shadow-lg shadow-emerald-500/10' : statusColors[m.status] || 'border-slate-800 bg-slate-950/40'}">
                      ${isCurrentMonth ? `
                        <div class="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                          Current
                        </div>
                      ` : ''}
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-sm font-black text-white">${m.name}</span>
                          <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${m.status === 'peak' ? 'bg-emerald-500/20 text-emerald-300' : m.status === 'shoulder' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}">
                            ${m.status}
                          </span>
                        </div>
                        <div class="text-[11px] font-bold text-slate-200 mb-1">
                          ${m.temp}
                        </div>
                        <div class="text-[10px] text-slate-400 mb-2">
                          Crowds: <b class="text-slate-300">${m.crowds}</b>
                        </div>
                      </div>
                      <p class="text-[11px] text-slate-400 leading-snug">
                        ${m.desc}
                      </p>
                    </div>
                  `;
                }).join("")}
              </div>

              <!-- Recommended Window Callout -->
              <div class="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div class="flex items-center gap-2.5">
                  <span class="text-xl">⭐</span>
                  <div>
                    <span class="font-bold text-emerald-400 block mb-0.5">Recommended Prime Window for ${dest.name}</span>
                    <span class="text-slate-200">${telemetry?.seasonality?.bestMonths || dest.bestTimeToVisit}</span>
                  </div>
                </div>
                <button type="button" onclick="window.location.hash='#itinerary?dest=${dest.id}'" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md self-start sm:self-auto shrink-0 cursor-pointer">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                  <span>Plan Trip in Prime Season</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents() {
    const backBtn = document.getElementById("btn-back-to-explore");
    const planBtn = document.getElementById("btn-plan-dest-trip");
    const favHeroBtn = document.getElementById("btn-fav-destination-hero");
    const postcardBtn = document.getElementById("btn-create-postcard-dest");
    const heroImg = document.getElementById("dest-hero-img");

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.hash = "#explore";
      });
    }

    if (postcardBtn) {
      postcardBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("voyage:open-postcard", {
          detail: { destination: this.currentDestination }
        }));
      });
    }

    if (planBtn) {
      planBtn.addEventListener("click", () => {
        window.location.hash = `#itinerary?dest=${this.currentDestination.id}`;
      });
    }

    if (favHeroBtn) {
      favHeroBtn.addEventListener("click", () => {
        const isFav = favoritesService.toggleDestination(this.currentDestination.id);
        const icon = favHeroBtn.querySelector("i");
        if (icon) {
          icon.className = `w-5 h-5 ${isFav ? 'fill-pink-500 text-pink-500' : ''}`;
        }
      });
    }

    // Hero Lightbox
    if (heroImg) {
      heroImg.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("voyage:open-lightbox", {
          detail: {
            src: this.currentDestination.heroImage,
            title: `${this.currentDestination.name}, ${this.currentDestination.country}`,
            caption: this.currentDestination.tagline
          }
        }));
      });
    }

    // Places & Hidden Gems Filter Switch (Recommendation 4)
    this.container.querySelectorAll(".btn-places-filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        this.filterPlaces(filter);
      });
    });

    // Tabs
    this.container.querySelectorAll("[data-dest-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-dest-tab");
        this.switchTab(tab);
      });
    });

    // Quick Trigger to Telemetry Tab
    this.container.querySelectorAll(".tab-quick-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-dest-tab") || "telemetry";
        this.switchTab(tab);
      });
    });

    // Landmark Lightbox Triggers
    this.container.querySelectorAll(".landmark-photo-trigger").forEach((el) => {
      el.addEventListener("click", () => {
        const imgEl = el.querySelector("img");
        const src = (imgEl && imgEl.src) ? imgEl.src : el.getAttribute("data-img-src");
        const title = el.getAttribute("data-img-title");
        const caption = el.getAttribute("data-img-caption");
        window.dispatchEvent(new CustomEvent("voyage:open-lightbox", {
          detail: { src, title, caption }
        }));
      });
    });

    // Landmark Favorite Buttons
    this.container.querySelectorAll(".btn-toggle-place-fav").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const placeId = btn.getAttribute("data-place-id");
        const place = this.currentDestination.famousPlaces.find(p => p.id === placeId);
        if (place) {
          const isFav = favoritesService.togglePlace(this.currentDestination.id, place);
          const icon = btn.querySelector("i");
          if (icon) icon.className = `w-4 h-4 ${isFav ? 'fill-pink-500 text-pink-500' : ''}`;
        }
      });
    });

    // Explore Nearby Place Buttons & Excursion Cards
    const handleExcursionNavigation = (placeName, excursionId) => {
      const target = placeName || excursionId;
      if (target) {
        window.location.hash = `#destination/${encodeURIComponent(target)}`;
      }
    };

    this.container.querySelectorAll(".excursion-card").forEach((card) => {
      card.addEventListener("click", () => {
        const placeName = card.getAttribute("data-place-name");
        const excursionId = card.getAttribute("data-excursion-id");
        handleExcursionNavigation(placeName, excursionId);
      });
    });

    this.container.querySelectorAll(".btn-explore-nearby-deep").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const placeName = btn.getAttribute("data-place-name");
        const excursionId = btn.getAttribute("data-excursion-id");
        handleExcursionNavigation(placeName, excursionId);
      });
    });

    // Ask AI Buttons
    this.container.querySelectorAll(".btn-ask-place").forEach((btn) => {
      btn.addEventListener("click", () => {
        const placeName = btn.getAttribute("data-place-name");
        window.dispatchEvent(new CustomEvent("voyage:open-chat-with-query", {
          detail: { query: `Tell me insider tips and how to best experience ${placeName} in ${this.currentDestination.name}.` }
        }));
      });
    });

    // Audio Phrasebook & Quick Listen Speech Synthesis
    this.container.querySelectorAll(".btn-speak-phrase, .btn-quick-listen").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const phrase = btn.getAttribute("data-phrase");
        const lang = btn.getAttribute("data-lang") || "en-US";
        if (phrase) {
          this.speakPhrase(phrase, lang, btn);
        }
      });
    });

    // Directions Dual View Mode Buttons
    const btnShowLeaflet = document.getElementById("btn-show-leaflet");
    const btnShowGoogle = document.getElementById("btn-show-google-route");
    const containerLeaflet = document.getElementById("container-leaflet-map");
    const containerGoogle = document.getElementById("container-google-embed-map");

    if (btnShowLeaflet && btnShowGoogle) {
      btnShowLeaflet.addEventListener("click", () => {
        this.mapDisplayMode = "leaflet";
        containerLeaflet?.classList.remove("hidden");
        containerGoogle?.classList.add("hidden");
        btnShowLeaflet.className = "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 bg-emerald-500 text-slate-950 shadow";
        btnShowGoogle.className = "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 text-slate-400 hover:text-white";
        this.initLeafletMap();
      });

      btnShowGoogle.addEventListener("click", () => {
        this.mapDisplayMode = "google-embed";
        containerLeaflet?.classList.add("hidden");
        containerGoogle?.classList.remove("hidden");
        btnShowGoogle.className = "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 bg-blue-500 text-white shadow-lg shadow-blue-500/20";
        btnShowLeaflet.className = "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 text-slate-400 hover:text-white";
        this.updateDirectionsState();
      });
    }

    // Origin Input Handler
    const originInput = document.getElementById("input-directions-origin");
    if (originInput) {
      originInput.addEventListener("input", (e) => {
        this.customOrigin = e.target.value;
        this.updateDirectionsState();
      });
    }

    // Use Detected Location Button
    const btnMyLoc = document.getElementById("btn-use-detected-origin");
    if (btnMyLoc) {
      btnMyLoc.addEventListener("click", () => {
        const uLoc = geoService.getUserLocation();
        this.customOrigin = "";
        if (originInput) {
          originInput.value = uLoc?.city ? `${uLoc.city}, ${uLoc.country || ""}` : (uLoc ? `${uLoc.lat.toFixed(3)}, ${uLoc.lng.toFixed(3)}` : "Current Location");
        }
        this.updateDirectionsState();
      });
    }

    // Destination Target Selector Handler
    const targetSelect = document.getElementById("select-directions-target");
    if (targetSelect) {
      targetSelect.addEventListener("change", (e) => {
        this.directionsTarget = e.target.value;
        this.updateDirectionsState();
      });
    }

    // Travel Mode Buttons Handler
    const modeButtons = this.container.querySelectorAll("#travel-mode-selector .mode-btn");
    modeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        this.selectedTravelMode = mode;
        modeButtons.forEach(b => {
          if (b.getAttribute("data-mode") === mode) {
            b.className = "mode-btn py-1.5 rounded-lg font-bold transition-all flex flex-col items-center gap-0.5 bg-blue-500 text-white shadow";
          } else {
            b.className = "mode-btn py-1.5 rounded-lg font-bold transition-all flex flex-col items-center gap-0.5 text-slate-400 hover:text-white";
          }
        });
        this.updateDirectionsState();
      });
    });
  }

  filterPlaces(filter) {
    this.placesFilter = filter;
    const cards = this.container.querySelectorAll(".place-card-item");
    cards.forEach(card => {
      const type = card.getAttribute("data-place-type");
      if (filter === "all" || type === filter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });

    this.container.querySelectorAll(".btn-places-filter").forEach(btn => {
      const f = btn.getAttribute("data-filter");
      if (f === filter) {
        if (f === "gem") {
          btn.className = "btn-places-filter px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 bg-purple-600 text-white shadow-lg shadow-purple-500/25";
        } else {
          btn.className = "btn-places-filter px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 bg-emerald-500 text-slate-950 shadow";
        }
      } else {
        btn.className = f === "gem"
          ? "btn-places-filter px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-purple-400 hover:text-purple-300"
          : "btn-places-filter px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-slate-400 hover:text-white";
      }
    });
  }

  updateDirectionsState() {
    if (!this.currentDestination) return;
    const dest = this.currentDestination;
    const userLoc = geoService.getUserLocation();
    const origin = this.customOrigin.trim() || (userLoc ? `${userLoc.lat},${userLoc.lng}` : (userLoc?.city || ""));

    let targetCoords = dest.coordinates;
    let targetName = `${dest.name} (City Center)`;

    if (this.directionsTarget !== "city") {
      const allPlaces = [
        ...(dest.famousPlaces || []),
        ...hiddenGemsService.getGemsForDestination(dest)
      ];
      const place = allPlaces.find(p => p.id === this.directionsTarget);
      if (place && place.coordinates) {
        targetCoords = place.coordinates;
        targetName = place.name;
      }
    }

    const dist = geoService.calculateDistance(
      userLoc?.lat || dest.coordinates.lat,
      userLoc?.lng || dest.coordinates.lng,
      targetCoords.lat,
      targetCoords.lng
    );
    const distKm = userLoc ? dist.km : 0;
    const distText = userLoc ? `${dist.km.toLocaleString()} km (${dist.miles.toLocaleString()} mi)` : "Global Coordinates";
    const timeText = mapsService.estimateTravelTime(distKm, this.selectedTravelMode);

    const dirUrl = mapsService.getDirectionsUrl(origin, `${targetCoords.lat},${targetCoords.lng}`, this.selectedTravelMode);
    const embedUrl = mapsService.getEmbedRouteUrl(origin, `${targetCoords.lat},${targetCoords.lng}`);

    const targetNameEl = document.getElementById("route-target-name");
    if (targetNameEl) targetNameEl.textContent = targetName;

    const distEl = document.getElementById("route-distance-text");
    if (distEl) distEl.textContent = distText;

    const timeEl = document.getElementById("route-time-text");
    if (timeEl) timeEl.textContent = timeText;

    const launchBtn = document.getElementById("btn-launch-google-maps");
    if (launchBtn) launchBtn.href = dirUrl;

    const iframe = document.getElementById("google-maps-iframe");
    if (iframe && iframe.src !== embedUrl) {
      iframe.src = embedUrl;
    }
  }

  speakPhrase(phrase, lang, btnEl = null) {
    regionalAudioService.speak(phrase, lang, {
      buttonEl: btnEl,
      onStart: () => {
        if (btnEl) btnEl.classList.add("ring-2", "ring-emerald-400", "scale-105");
      },
      onEnd: () => {
        if (btnEl) btnEl.classList.remove("ring-2", "ring-emerald-400", "scale-105");
      }
    });
  }

  switchTab(tabKey) {
    this.activeTab = tabKey;
    const tabKeys = ["places", "weather", "map", "culture", "nearby", "telemetry"];
    tabKeys.forEach((key) => {
      const el = document.getElementById(`tab-content-${key}`);
      if (el) el.classList.toggle("hidden", key !== tabKey);
    });

    this.container.querySelectorAll(".tab-btn").forEach((btn) => {
      const k = btn.getAttribute("data-dest-tab");
      if (k === tabKey) {
        btn.className = "tab-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20";
      } else {
        btn.className = "tab-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-800/60";
      }
    });

    if (tabKey === "map") {
      this.initLeafletMap();
    }
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  async loadWeatherData() {
    if (!this.currentDestination) return;
    const dest = this.currentDestination;
    try {
      const weather = await weatherService.getWeather(dest.coordinates.lat, dest.coordinates.lng, dest.name);
      this.weatherData = weather;
      const metricsContainer = document.getElementById("weather-metrics-container");
      const providerLabel = document.getElementById("weather-provider-label");
      const hourlyContainer = document.getElementById("weather-hourly-container");

      if (providerLabel) {
        providerLabel.innerHTML = `Live data source: <span class="font-bold text-emerald-400">${weather.provider}</span> (Updated just now)`;
      }

      if (metricsContainer) {
        metricsContainer.innerHTML = `
          <!-- Metrics Hero Strip -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <i data-lucide="${weather.icon || 'sun'}" class="w-8 h-8"></i>
              </div>
              <div>
                <span class="text-3xl font-black text-white">${weatherService.toDisplayTemp(weather.temperatureC)}</span>
                <span class="text-xs text-slate-400 block">${weather.condition} · Feels like ${weatherService.toDisplayTemp(weather.feelsLikeC)}</span>
              </div>
            </div>

            <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <i data-lucide="droplets" class="w-6 h-6"></i>
              </div>
              <div>
                <span class="text-2xl font-bold text-white">${weather.humidity}%</span>
                <span class="text-xs text-slate-400 block">Relative Humidity</span>
              </div>
            </div>

            <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <i data-lucide="wind" class="w-6 h-6"></i>
              </div>
              <div>
                <span class="text-2xl font-bold text-white">${weather.windSpeedKmh} km/h</span>
                <span class="text-xs text-slate-400 block">Wind Velocity</span>
              </div>
            </div>

            <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <i data-lucide="gauge" class="w-6 h-6"></i>
              </div>
              <div>
                <span class="text-2xl font-bold text-white">${weather.pressureHpa} hPa</span>
                <span class="text-xs text-slate-400 block">Atmospheric Pressure</span>
              </div>
            </div>
          </div>

          <!-- 5-Day Forecast -->
          <h4 class="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">5-Day Meteorological Forecast</h4>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            ${weather.forecast.map((f) => `
              <div class="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 text-center">
                <span class="text-xs font-semibold text-slate-400 block mb-1">${f.day}</span>
                <div class="w-8 h-8 mx-auto my-1 flex items-center justify-center text-amber-400">
                  <i data-lucide="${f.icon || 'sun'}" class="w-5 h-5"></i>
                </div>
                <div class="text-xs font-bold text-white mt-1">
                  ${weatherService.toDisplayTemp(f.tempMax)} <span class="text-slate-500 font-normal">/ ${weatherService.toDisplayTemp(f.tempMin)}</span>
                </div>
                <span class="text-[10px] text-slate-400 block mt-0.5 truncate">${f.condition}</span>
              </div>
            `).join("")}
          </div>
        `;
      }

      // Render 24-Hour SVG Hourly Curve
      if (hourlyContainer && weather.hourly && weather.hourly.length > 0) {
        hourlyContainer.innerHTML = this.renderHourlySvg(weather.hourly);
      }

      if (window.lucide) window.lucide.createIcons();
    } catch (e) {
      console.error("Weather detail error:", e);
    }
  }

  renderHourlySvg(hourly) {
    const temps = hourly.map(h => weatherService.toUnitValue(h.tempC));
    const minT = Math.min(...temps) - 2;
    const maxT = Math.max(...temps) + 2;
    const range = (maxT - minT) || 1;

    const width = 700;
    const height = 120;
    const padding = 25;
    const usableW = width - padding * 2;
    const usableH = height - padding * 2;

    const points = hourly.map((h, i) => {
      const x = padding + (i / (hourly.length - 1)) * usableW;
      const t = weatherService.toUnitValue(h.tempC);
      const y = height - padding - ((t - minT) / range) * usableH;
      return { x, y, temp: t, time: h.time };
    });

    const pathD = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    return `
      <div>
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-bold text-slate-300 uppercase tracking-wider">
            24-Hour Hourly Temperature Curve
          </h4>
          <span class="text-xs text-slate-400">Unit: °${weatherService.getTemperatureUnit()}</span>
        </div>

        <div class="w-full overflow-x-auto bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <svg viewBox="0 0 ${width} ${height + 20}" class="w-full min-w-[550px] h-36">
            <!-- Curve Path -->
            <path d="${pathD}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" />
            
            <!-- Nodes & Text -->
            ${points.map(p => `
              <circle cx="${p.x}" cy="${p.y}" r="4" fill="#34d399" stroke="#064e3b" stroke-width="2" />
              <text x="${p.x}" y="${p.y - 10}" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">
                ${p.temp}°
              </text>
              <text x="${p.x}" y="${height + 14}" fill="#94a3b8" font-size="10" text-anchor="middle">
                ${p.time}
              </text>
            `).join("")}
          </svg>
        </div>
      </div>
    `;
  }

  async loadDynamicImages() {
    if (!this.currentDestination) return;
    const dest = this.currentDestination;

    // 1. Concurrently fetch dynamic authentic images for famous places that need them
    const placePromises = (dest.famousPlaces || []).map(async (place) => {
      try {
        const safeId = String(place.id || place.name).replace(/[^a-zA-Z0-9_-]/g, "_");
        const imgEl = document.getElementById(`place-img-${safeId}`);
        
        // Preserve authentic curated or Wikimedia photo if already set
        if (place.image && !place.image.includes("placeholder") && !place.image.startsWith("data:")) {
          return;
        }

        const liveImgUrl = await imageService.getImage(
          `${place.name} ${dest.name}`,
          place.wikiTitle,
          place.image
        );
        if (imgEl && liveImgUrl) {
          imgEl.src = liveImgUrl;
          const parentTrigger = imgEl.closest(".landmark-photo-trigger");
          if (parentTrigger) {
            parentTrigger.setAttribute("data-img-src", liveImgUrl);
          }
        }
      } catch (err) {
        console.warn(`Dynamic image fetch failed for ${place.name}:`, err);
      }
    });

    // 2. Fetch destination hero image (only if placeholder or missing)
    const heroPromise = (async () => {
      try {
        if (dest.heroImage && !dest.heroImage.includes("placeholder") && !dest.heroImage.startsWith("data:")) {
          return; // PRESERVE AUTHENTIC HERO IMAGE!
        }
        const heroImgUrl = await imageService.getImage(dest.name, dest.name, dest.heroImage);
        const heroEl = document.getElementById("dest-hero-img");
        if (heroEl && heroImgUrl) {
          heroEl.src = heroImgUrl;
        }
      } catch (err) {
        console.warn(`Hero image fetch failed for ${dest.name}:`, err);
      }
    })();

    await Promise.allSettled([...placePromises, heroPromise]);
  }

  initLeafletMap() {
    const mapEl = document.getElementById("destination-leaflet-map");
    if (!mapEl || !window.L || !this.currentDestination) return;

    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }

    const { lat, lng } = this.currentDestination.coordinates;
    const map = window.L.map(mapEl).setView([lat, lng], 12);
    this.mapInstance = map;

    window.L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://www.hotosm.org/" target="_blank">HOT</a>',
      subdomains: 'abc',
      maxZoom: 19
    }).addTo(map);

    // City Center Pulsing Beacon
    const cityCenterIcon = window.L.divIcon({
      className: "destination-center-icon",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(16, 185, 129, 0.25); border: 2px solid #10b981; animation: map-pulse 2s infinite;"></div>
          <div style="position: relative; z-index: 2; width: 22px; height: 22px; border-radius: 50%; background: #10b981; border: 2px solid #ffffff; box-shadow: 0 0 12px #10b981; display: flex; align-items: center; justify-content: center; font-size: 11px;">
            ⭐
          </div>
        </div>
      `
    });

    const userLoc = geoService.getUserLocation();
    const userOriginParam = this.customOrigin.trim() || (userLoc ? `${userLoc.lat},${userLoc.lng}` : (userLoc?.city || ""));

    window.L.marker([lat, lng], { icon: cityCenterIcon })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 8px 12px; background: #0f172a; color: #ffffff; border-radius: 12px; font-family: inherit; min-width: 170px;">
          <b style="color: #34d399; font-size: 13px;">${this.currentDestination.name}</b><br/>
          <span style="color: #94a3b8; font-size: 11px;">City Center & Cultural Hub</span>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.12);">
            <a href="${mapsService.getDirectionsUrl(userOriginParam, `${lat},${lng}`, 'driving')}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; color: #38bdf8; font-size: 11px; font-weight: bold; text-decoration: none;">
              🧭 Directions in Google Maps ↗
            </a>
          </div>
        </div>
      `);

    // Category Color Mapping for Landmarks
    const CATEGORY_COLORS = {
      "Natural Wonder": { color: "#10b981", icon: "🏔️" },
      "Wildlife Sanctuary": { color: "#f97316", icon: "🐧" },
      "Scenic Coastline": { color: "#0ea5e9", icon: "🌊" },
      "Botanical Garden": { color: "#84cc16", icon: "🌸" },
      "New 7 Wonder & UNESCO Heritage": { color: "#f43f5e", icon: "🏛️" },
      "Imperial Red Sandstone Citadel": { color: "#ea580c", icon: "🏰" },
      "Mughal Imperial Ghost City": { color: "#d97706", icon: "🕌" },
      "Mughal Riverfront Garden": { color: "#059669", icon: "🌿" },
      "Hilltop UNESCO Fortress": { color: "#d97706", icon: "🏰" },
      "Royal Architectural Icon": { color: "#ec4899", icon: "🪟" },
      "Lake Palace": { color: "#06b6d4", icon: "⛵" },
      "Tropical Canal Network": { color: "#10b981", icon: "🛶" },
      "Mountain Tea Plantations & Wildlife": { color: "#16a34a", icon: "🍃" },
      "Historic Maritime Quarter": { color: "#3b82f6", icon: "⚓" },
      "Quiet Coconut Beach": { color: "#0ea5e9", icon: "🏖️" },
      "UNESCO Portuguese Baroque Heritage": { color: "#8b5cf6", icon: "⛪" },
      "Scenic Crescent Bay": { color: "#06b6d4", icon: "🌴" },
      "Four-Tiered Natural Waterfall": { color: "#0284c7", icon: "🌊" },
      "17th-Century Coastal Fort": { color: "#e11d48", icon: "🛡️" }
    };

    this.currentDestination.famousPlaces.forEach((place) => {
      if (place.coordinates) {
        const catInfo = CATEGORY_COLORS[place.category] || { color: "#f59e0b", icon: "📍" };
        const landmarkIcon = window.L.divIcon({
          className: "landmark-custom-icon",
          iconSize: [38, 44],
          iconAnchor: [19, 42],
          popupAnchor: [0, -40],
          html: `
            <div style="position: relative; width: 38px; height: 44px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: ${catInfo.color}; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.5), 0 0 14px ${catInfo.color}; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                ${catInfo.icon}
              </div>
              <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid #ffffff; margin-top: -1px;"></div>
            </div>
          `
        });

        const placeDirUrl = mapsService.getDirectionsUrl(userOriginParam, `${place.coordinates.lat},${place.coordinates.lng}`, 'driving');

        window.L.marker([place.coordinates.lat, place.coordinates.lng], { icon: landmarkIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: inherit; font-size: 12px; width: 220px; padding: 6px; background: #0f172a; border-radius: 12px; color: #f8fafc;">
              ${place.image ? `<img src="${place.image}" style="width: 100%; height: 85px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />` : ''}
              <b style="color: #ffffff; font-size: 13px;">${place.name}</b><br/>
              <span style="color: ${catInfo.color}; font-weight: 600; font-size: 10px;">${place.category}</span><br/>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px; font-size: 11px;">
                <span style="color: #fbbf24; font-weight: bold;">★ ${place.rating}</span>
                <span style="color: #38bdf8;">${place.estimatedTime || ''}</span>
              </div>
              <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">
                <a href="${placeDirUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; gap: 4px; width: 100%; background: #2563eb; color: #ffffff; font-weight: 700; font-size: 11px; padding: 6px 8px; border-radius: 7px; text-decoration: none; box-shadow: 0 2px 6px rgba(37,99,235,0.4);">
                  <span>🧭</span> Directions in Google Maps →
                </a>
              </div>
            </div>
          `);
      }
    });
  }
}
