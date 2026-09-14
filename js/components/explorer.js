// Destination Explorer Component: Search, Multi-Filter, Sorting, World Map View & Bucket List

import { DESTINATIONS } from "../destinations-data.js";
import { weatherService } from "../services/weather-service.js";
import { geoService } from "../services/geo-service.js";
import { favoritesService } from "../services/favorites-service.js";
import { currencyService } from "../services/currency-service.js";
import { mapsService } from "../services/maps-service.js";
import { destinationResolver } from "../services/destination-resolver.js";
import { INDIAN_STATES_REGISTRY } from "../services/indian-states-data.js";
import { regionalAudioService } from "../services/regional-audio-service.js";

export const CONTINENT_THEMES = {
  "Asia": { 
    color: "#f43f5e", 
    glow: "rgba(244, 63, 94, 0.7)", 
    bg: "rgba(244, 63, 94, 0.2)", 
    badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    gradient: "linear-gradient(135deg, #f43f5e, #be123c)",
    label: "Asia", 
    icon: "⛩️", 
    center: [25, 95], 
    zoom: 3.5 
  },
  "Europe": { 
    color: "#3b82f6", 
    glow: "rgba(59, 130, 246, 0.7)", 
    bg: "rgba(59, 130, 246, 0.2)", 
    badgeClass: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    label: "Europe", 
    icon: "🏰", 
    center: [50, 15], 
    zoom: 4 
  },
  "North America": { 
    color: "#10b981", 
    glow: "rgba(16, 185, 129, 0.7)", 
    bg: "rgba(16, 185, 129, 0.2)", 
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    gradient: "linear-gradient(135deg, #10b981, #047857)",
    label: "N. America", 
    icon: "🗽", 
    center: [42, -98], 
    zoom: 3.5 
  },
  "South America": { 
    color: "#f59e0b", 
    glow: "rgba(245, 158, 11, 0.7)", 
    bg: "rgba(245, 158, 11, 0.2)", 
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    gradient: "linear-gradient(135deg, #f59e0b, #b45309)",
    label: "S. America", 
    icon: "🎭", 
    center: [-18, -60], 
    zoom: 3.5 
  },
  "Africa": { 
    color: "#f97316", 
    glow: "rgba(249, 115, 22, 0.7)", 
    bg: "rgba(249, 115, 22, 0.2)", 
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    label: "Africa", 
    icon: "🦁", 
    center: [2, 22], 
    zoom: 3.5 
  },
  "Oceania": { 
    color: "#8b5cf6", 
    glow: "rgba(139, 92, 246, 0.7)", 
    bg: "rgba(139, 92, 246, 0.2)", 
    badgeClass: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    label: "Oceania", 
    icon: "🦘", 
    center: [-25, 135], 
    zoom: 3.5 
  }
};

export const MAP_STYLES = {
  voyager: {
    name: "Vibrant Explorer",
    icon: "palette",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    subdomains: "abc",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://www.hotosm.org/" target="_blank">HOT</a>',
    maxZoom: 19
  },
  satellite: {
    name: "Satellite Earth",
    icon: "globe",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 18
  },
  natgeo: {
    name: "National Geographic",
    icon: "compass",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; National Geographic, Esri',
    maxZoom: 16
  },
  midnight: {
    name: "Midnight Glow",
    icon: "moon",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; Esri, HERE, DeLorme, &copy; OpenStreetMap contributors',
    maxZoom: 16
  }
};

function getDestinationIcon(dest) {
  const name = (dest.name || "").toLowerCase();
  const id = (dest.id || "").toLowerCase();
  const vibes = dest.vibes || [];
  if (vibes.includes("Beach") || id.includes("goa") || id.includes("bali")) return "🏖️";
  if (name.includes("taj") || id.includes("agra")) return "🕌";
  if (id.includes("jaipur")) return "🏰";
  if (id.includes("kerala")) return "🚤";
  if (id.includes("kyoto")) return "⛩️";
  if (id.includes("tokyo")) return "🗼";
  if (id.includes("paris")) return "🥖";
  if (id.includes("rome")) return "🏛️";
  if (id.includes("reykjavik")) return "🌋";
  if (id.includes("new-york")) return "🗽";
  if (id.includes("banff")) return "🏔️";
  if (id.includes("cape-town")) return "⛰️";
  if (id.includes("cairo")) return "🏺";
  if (id.includes("sydney")) return "⛵";
  if (id.includes("rio")) return "🎭";
  if (id.includes("cusco")) return "🦙";
  return "📍";
}

export class DestinationExplorer {
  constructor(containerId = "explorer-container") {
    this.container = document.getElementById(containerId);
    this.destinations = [...DESTINATIONS];
    this.filteredDestinations = [...DESTINATIONS];
    this.activeContinent = "All";
    this.activeVibe = "All";
    this.activeBudget = "All";
    this.searchQuery = "";
    this.sortBy = "featured";
    this.viewMode = "grid"; // "grid" or "map"
    this.weatherCache = new Map();
    this.worldMapInstance = null;
    this.currentMapTheme = "voyager";
    this.showFlightArcs = true;
    this.selectedContinentFocus = "All";
    this.mapTileLayers = [];
    this.mapFlightLayerGroup = null;
    this.mapMarkersLayerGroup = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.loadLiveWeatherForCards();

    // Re-render when external events fire
    window.addEventListener("voyage:location-updated", () => this.applyFiltersAndSort());
    window.addEventListener("voyage:temp-unit-changed", () => this.updateDisplay());
    window.addEventListener("voyage:currency-changed", () => this.updateDisplay());
    window.addEventListener("voyage:favorites-updated", () => this.updateDisplay());
  }

  updateDisplay() {
    if (this.viewMode === "grid") {
      this.renderGrid();
    } else {
      this.renderWorldMap();
    }
  }

  render() {
    this.container.innerHTML = `
      <section id="explorer-section" class="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <!-- Explorer Header & Section Title -->
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <i data-lucide="compass" class="w-3.5 h-3.5"></i>
              Curated Expeditions
            </div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Global Destinations
            </h2>
            <p class="text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
              Live weather, calculated distances from your location, and deep-dive itineraries powered by AI.
            </p>
          </div>

          <!-- Controls: View Mode Toggle, Surprise Me & Results Counter -->
          <div class="flex items-center gap-2.5 sm:gap-3 self-start md:self-auto flex-wrap">
            <!-- Spin the Compass / Surprise Me Shortcut -->
            <button 
              id="btn-explorer-spin-compass" 
              class="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm group cursor-pointer"
              title="Spin the Compass to discover a surprise destination"
            >
              <i data-lucide="compass" class="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-amber-400"></i>
              <span>Surprise Me</span>
            </button>

            <!-- Grid vs World Map Toggle -->
            <div class="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
              <button id="btn-view-grid" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${this.viewMode === 'grid' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
                <i data-lucide="grid" class="w-3.5 h-3.5"></i>
                <span>Grid</span>
              </button>
              <button id="btn-view-map" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${this.viewMode === 'map' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}">
                <i data-lucide="map" class="w-3.5 h-3.5"></i>
                <span>World Map</span>
              </button>
            </div>

            <!-- Results Counter -->
            <div class="text-xs sm:text-sm text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
              Showing <span id="results-count" class="font-bold text-emerald-400">${this.filteredDestinations.length}</span> destinations
            </div>
          </div>
        </div>

        <!-- Filter & Search Toolbar Card -->
        <div class="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 sm:p-6 mb-10 shadow-2xl">
          <!-- Top Row: Search Input & Sort Selector -->
          <div class="flex flex-col sm:flex-row gap-3 mb-5">
            <div class="relative flex-1">
              <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
              <input 
                type="text" 
                id="explorer-search-input" 
                placeholder="Search any destination worldwide (e.g., London, Dubai, Mumbai, Manali, Paris)..." 
                class="w-full bg-slate-950/60 border border-slate-700/70 rounded-xl pl-11 pr-32 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button id="explorer-clear-search" class="hidden p-1.5 text-slate-400 hover:text-white transition-colors" title="Clear search">
                  <i data-lucide="x" class="w-4 h-4"></i>
                </button>
                <button 
                  id="btn-search-global-location" 
                  type="button" 
                  class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  title="Search and discover any location worldwide"
                >
                  <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                  <span>Discover</span>
                </button>
              </div>
            </div>

            <!-- Sort Dropdown -->
            <div class="flex items-center gap-2">
              <label for="explorer-sort-select" class="text-xs text-slate-400 whitespace-nowrap hidden lg:inline">Sort by:</label>
              <div class="relative">
                <select 
                  id="explorer-sort-select" 
                  class="appearance-none bg-slate-950/60 border border-slate-700/70 rounded-xl pl-3 pr-9 py-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  <option value="featured">Featured / Popularity</option>
                  <option value="distance">Distance (Nearest First)</option>
                  <option value="budget-asc">Budget: Low to High</option>
                  <option value="budget-desc">Budget: High to Low</option>
                  <option value="name">Destination: A to Z</option>
                </select>
                <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              </div>
            </div>
          </div>

          <!-- Live Global Search Hint / Chip -->
          <div id="global-search-hint" class="hidden mb-4 p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2 text-slate-200">
              <span class="text-emerald-400 font-bold flex items-center gap-1"><i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Global Search:</span>
              <span>Discover and add <strong id="hint-query-text" class="text-white font-bold"></strong> to destinations with real landmarks & live weather</span>
            </div>
            <button id="btn-discover-hint" type="button" class="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow whitespace-nowrap cursor-pointer">
              Discover Spot →
            </button>
          </div>

          <!-- Region Pills -->
          <div class="mb-4">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Region / Continent:</span>
            <div class="flex flex-wrap gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5" id="continent-pills">
              ${["All", "Asia", "Europe", "North America", "South America", "Africa", "Oceania"].map(c => `
                <button 
                  data-continent="${c}" 
                  class="filter-pill-continent px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${c === "All" ? "bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20" : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"}"
                >
                  ${c}
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Vibe & Budget -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-800">
            <div>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Travel Vibe:</span>
              <div class="flex flex-wrap gap-1.5" id="vibe-pills">
                ${["All", "Cultural", "Beach", "Mountain & Nature", "Urban & Modern", "Romantic", "Adventure", "Foodie"].map(v => `
                  <button 
                    data-vibe="${v}" 
                    class="filter-pill-vibe px-2.5 py-1 rounded-lg text-xs transition-all ${v === "All" ? "bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20" : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white"}"
                  >
                    ${v}
                  </button>
                `).join("")}
              </div>
            </div>

            <div>
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Budget Tier:</span>
              <div class="flex gap-1.5" id="budget-pills">
                ${[
                  { id: "All", label: "All" },
                  { id: "$", label: "$ Budget" },
                  { id: "$$", label: "$$ Moderate" },
                  { id: "$$$", label: "$$$ Luxury" }
                ].map(b => `
                  <button 
                    data-budget="${b.id}" 
                    class="filter-pill-budget px-2.5 py-1 rounded-lg text-xs transition-all ${b.id === "All" ? "bg-amber-500 text-slate-950 font-semibold" : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white"}"
                  >
                    ${b.label}
                  </button>
                `).join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic Searched Location Showcase (Kept strictly separate from the front page) -->
        <div id="active-searched-location-container" class="hidden mb-12"></div>

        <!-- View 1: Destination Cards Grid -->
        <div id="destinations-cards-grid" class="${this.viewMode === 'grid' ? 'grid' : 'hidden'} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <!-- Dynamically populated -->
        </div>

        <!-- View 2: Global World Map View (Vibrant Multi-Style Map) -->
        <div id="destinations-map-view" class="${this.viewMode === 'map' ? 'block' : 'hidden'} bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
          <!-- Header & Map Style Controls -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 class="font-bold text-white text-lg tracking-tight">Interactive World Destination Map</h3>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Explore 17 curated global destinations across 6 continents with vibrant terrain, live weather radar, and geodesic flight paths.</p>
            </div>

            <!-- Controls: Map Style Selector & Flight Routes Toggle -->
            <div class="flex flex-wrap items-center gap-2.5">
              <!-- Map Styles Pill Group -->
              <div class="bg-slate-950/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1 shadow-inner text-xs" id="map-theme-buttons">
                <button type="button" data-theme="voyager" class="map-theme-btn px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${this.currentMapTheme === 'voyager' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}">
                  <span>🌈</span>
                  <span class="hidden sm:inline">Vibrant Explorer</span>
                </button>
                <button type="button" data-theme="satellite" class="map-theme-btn px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${this.currentMapTheme === 'satellite' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}">
                  <span>🛰️</span>
                  <span class="hidden sm:inline">Satellite</span>
                </button>
                <button type="button" data-theme="natgeo" class="map-theme-btn px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${this.currentMapTheme === 'natgeo' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}">
                  <span>🧭</span>
                  <span class="hidden sm:inline">NatGeo</span>
                </button>
                <button type="button" data-theme="midnight" class="map-theme-btn px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${this.currentMapTheme === 'midnight' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}">
                  <span>🌌</span>
                  <span class="hidden sm:inline">Midnight</span>
                </button>
              </div>

              <!-- Flight Arcs Toggle -->
              <button id="btn-toggle-flight-arcs" type="button" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${this.showFlightArcs ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-lg shadow-sky-500/10' : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'}">
                <span>✈️</span>
                <span>Flight Arcs: <b id="flight-arcs-label" class="font-extrabold uppercase">${this.showFlightArcs ? 'On' : 'Off'}</b></span>
              </button>
            </div>
          </div>

          <!-- Continent Quick-Focus Bar -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span class="text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
              <i data-lucide="compass" class="w-3.5 h-3.5 text-emerald-400"></i> Focus:
            </span>
            <button type="button" data-continent-focus="All" class="continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${this.selectedContinentFocus === 'All' ? 'bg-white text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
              🌐 Global All (17)
            </button>
            <button type="button" data-continent-focus="Asia" class="continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${this.selectedContinentFocus === 'Asia' ? 'bg-rose-500 text-white shadow-rose-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'}">
              ⛩️ Asia (7)
            </button>
            <button type="button" data-continent-focus="Europe" class="continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${this.selectedContinentFocus === 'Europe' ? 'bg-blue-500 text-white shadow-blue-500/30' : 'bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25'}">
              🏰 Europe (3)
            </button>
            <button type="button" data-continent-focus="North America" class="continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${this.selectedContinentFocus === 'North America' ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'}">
              🗽 N. America (2)
            </button>
            <button type="button" data-continent-focus="South America" class="continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${this.selectedContinentFocus === 'South America' ? 'bg-amber-500 text-slate-950 shadow-amber-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'}">
              🎭 S. America (2)
            </button>
            <button type="button" data-continent-focus="Africa" class="continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${this.selectedContinentFocus === 'Africa' ? 'bg-orange-500 text-white shadow-orange-500/30' : 'bg-orange-500/15 text-orange-300 border border-orange-500/30 hover:bg-orange-500/25'}">
              🦁 Africa (2)
            </button>
            <button type="button" data-continent-focus="Oceania" class="continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${this.selectedContinentFocus === 'Oceania' ? 'bg-purple-500 text-white shadow-purple-500/30' : 'bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25'}">
              🦘 Oceania (1)
            </button>
          </div>

          <!-- The Leaflet World Map Container -->
          <div id="explorer-world-map" class="h-[580px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative"></div>

          <!-- Bottom Color Spectrum Legend -->
          <div class="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 text-slate-400">
            <div class="flex flex-wrap items-center gap-3">
              <span class="font-semibold text-slate-300">Continent Colors:</span>
              <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span> Asia</span>
              <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span> Europe</span>
              <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span> North America</span>
              <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span> South America</span>
              <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50"></span> Africa</span>
              <span class="inline-flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></span> Oceania</span>
            </div>
            <div class="flex items-center gap-2 text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span> Live Origin Sensor</span>
              <span>•</span>
              <span>Click pin to view full details</span>
            </div>
          </div>
        </div>

        <!-- Empty State with Global Discovery Call to Action -->
        <div id="explorer-empty-state" class="hidden text-center py-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto shadow-2xl">
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 animate-pulse">
            <i data-lucide="compass" class="w-8 h-8"></i>
          </div>
          <h3 id="empty-state-title" class="text-lg font-bold text-white mb-2">No Matching Destinations Found</h3>
          <p id="empty-state-desc" class="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
            We couldn't find this destination in our initial collection. Would you like to search global databases for this location?
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button id="btn-empty-discover" type="button" class="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span id="btn-empty-discover-label">Discover & Add Location</span>
            </button>
            <button id="btn-reset-filters" type="button" class="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer">
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Discovery Loading Overlay Modal -->
        <div id="discovery-loading-overlay" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-4">
            <div class="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto animate-spin">
              <i data-lucide="compass" class="w-8 h-8 text-emerald-400"></i>
            </div>
            <h4 class="text-lg font-black text-white" id="discovery-loading-title">Discovering Location...</h4>
            <p class="text-xs text-slate-400 leading-relaxed" id="discovery-loading-desc">
              Querying international geocoding, authentic landmarks, high-res photos, and live weather stations...
            </p>
            <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    `;

    this.renderGrid();
    if (window.lucide) window.lucide.createIcons();
  }

  renderGrid() {
    const grid = document.getElementById("destinations-cards-grid");
    const emptyState = document.getElementById("explorer-empty-state");
    const countLabel = document.getElementById("results-count");

    if (!grid) return;
    if (countLabel) countLabel.textContent = this.filteredDestinations.length;

    if (this.filteredDestinations.length === 0) {
      grid.innerHTML = "";
      if (emptyState) {
        emptyState.classList.remove("hidden");
        const titleEl = document.getElementById("empty-state-title");
        const descEl = document.getElementById("empty-state-desc");
        const btnDiscover = document.getElementById("btn-empty-discover");
        const btnLabel = document.getElementById("btn-empty-discover-label");

        if (this.searchQuery && this.searchQuery.trim()) {
          const cleanQ = this.searchQuery.trim();
          if (titleEl) titleEl.textContent = `No Local Results for "${cleanQ}"`;
          if (descEl) descEl.textContent = `"${cleanQ}" is not in our default spots, but you can discover and add it with authentic landmarks, live weather, and directions right now.`;
          if (btnLabel) btnLabel.textContent = `✨ Discover & Add "${cleanQ}" to Destinations`;
          if (btnDiscover) btnDiscover.classList.remove("hidden");
        } else {
          if (titleEl) titleEl.textContent = "No Destinations Found";
          if (descEl) descEl.textContent = "We couldn't find any destinations matching your current filter combination.";
          if (btnDiscover) btnDiscover.classList.add("hidden");
        }
      }
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    grid.innerHTML = this.filteredDestinations.map((dest) => {
      const dist = geoService.getDistanceToDestination(dest.coordinates);
      const isFav = favoritesService.isDestinationFavorited(dest.id);

      const distBadge = dist ? `
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[11px] font-medium text-slate-200 border border-slate-700/60 shadow-md">
          <i data-lucide="navigation" class="w-3 h-3 text-cyan-400"></i>
          ${dist.km.toLocaleString()} km
        </span>
      ` : "";

      const cachedWeather = this.weatherCache.get(dest.id);
      const weatherBadge = cachedWeather ? `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[11px] font-medium text-amber-300 border border-slate-700/60 shadow-md">
          <i data-lucide="${cachedWeather.icon || 'sun'}" class="w-3.5 h-3.5 text-amber-400"></i>
          ${weatherService.toDisplayTemp(cachedWeather.temperatureC)} · ${cachedWeather.condition}
        </span>
      ` : `
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[11px] text-slate-400 border border-slate-700/60 shadow-md" data-dest-id="${dest.id}">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Live Weather...
        </span>
      `;

      // Multi-currency converted daily budget
      const dailyBudgetFormatted = currencyService.formatUSD(dest.budgetDailyEstimate);

      return `
        <article class="destination-card-elevated group relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-all duration-300 flex flex-col cursor-pointer" data-navigate-dest="${dest.id}">
          <!-- Hero Image Container -->
          <div class="relative h-56 w-full overflow-hidden bg-slate-950">
            <img 
              src="${dest.heroImage}" 
              alt="${dest.name}, ${dest.country}" 
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

            <!-- Floating Top Badges -->
            <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-emerald-400 border border-slate-700/60">
                ${dest.continent}
              </span>

              <div class="flex items-center gap-2">
                ${distBadge}
                <!-- Virtual Postcard Trigger -->
                <button 
                  class="btn-card-open-postcard p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-amber-300 transition-colors"
                  data-dest-id="${dest.id}"
                  title="Create 3D Virtual Postcard"
                  onclick="event.stopPropagation();"
                >
                  <i data-lucide="mail" class="w-4 h-4"></i>
                </button>

                <!-- Bookmark Heart Button (Advanced Upgrade 3) -->
                <button 
                  class="btn-toggle-fav-card p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-pink-400 transition-colors"
                  data-dest-id="${dest.id}"
                  title="Add to Bucket List"
                  onclick="event.stopPropagation();"
                >
                  <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-pink-500 text-pink-500' : ''}"></i>
                </button>
              </div>
            </div>

            <!-- Live Weather Badge -->
            <div class="absolute bottom-3 right-3" id="weather-badge-${dest.id}">
              ${weatherBadge}
            </div>

            <!-- Landmarks Tag -->
            <div class="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-300 font-semibold border border-slate-700/60">
              <i data-lucide="landmark" class="w-3 h-3 text-emerald-400"></i>
              ${dest.famousPlaces?.length || 0} Landmarks
            </div>
          </div>

          <!-- Card Content Body -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-baseline justify-between gap-2 mb-1">
                <h3 class="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  ${dest.name}
                </h3>
                <span class="text-xs font-semibold text-slate-400">
                  ${dest.country}
                </span>
              </div>

              <p class="text-xs text-slate-400 line-clamp-2 mb-4">
                ${dest.tagline}
              </p>

              <!-- Tags / Vibes & Currency Converted Budget -->
              <div class="flex flex-wrap gap-1 mb-4">
                ${dest.vibes.slice(0, 3).map(vibe => `
                  <span class="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300">
                    ${vibe}
                  </span>
                `).join("")}
                <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[11px] font-medium border border-amber-500/20">
                  ${dest.budget} (~${dailyBudgetFormatted}/day)
                </span>
              </div>
            </div>

            <!-- Bottom Action Bar -->
            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span class="text-slate-400 flex items-center gap-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-500"></i>
                ${dest.idealDuration}
              </span>

              <span class="font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Explore Destination <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </span>
            </div>
          </div>
        </article>
      `;
    }).join("");

    if (window.lucide) window.lucide.createIcons();

    // Bind card click
    grid.querySelectorAll("[data-navigate-dest]").forEach((el) => {
      el.addEventListener("click", () => {
        const destId = el.getAttribute("data-navigate-dest");
        window.location.hash = `#destination/${destId}`;
      });
    });

    // Bind bookmark hearts
    grid.querySelectorAll(".btn-toggle-fav-card").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const destId = btn.getAttribute("data-dest-id");
        const isNowFav = favoritesService.toggleDestination(destId);
        const icon = btn.querySelector("i");
        if (icon) {
          icon.className = `w-4 h-4 ${isNowFav ? 'fill-pink-500 text-pink-500' : ''}`;
        }
      });
    });

    // Bind virtual postcard buttons
    grid.querySelectorAll(".btn-card-open-postcard").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const destId = btn.getAttribute("data-dest-id");
        window.dispatchEvent(new CustomEvent("voyage:open-postcard", {
          detail: { id: destId }
        }));
      });
    });
  }

  renderWorldMap() {
    const mapEl = document.getElementById("explorer-world-map");
    if (!mapEl || !window.L) return;

    if (!this.worldMapInstance) {
      const map = window.L.map(mapEl, {
        zoomControl: false,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true
      }).setView([20, 10], 2);

      // Add styled zoom control to top-right
      window.L.control.zoom({ position: "topright" }).addTo(map);

      this.worldMapInstance = map;
      this.mapTileLayers = [];
      this.mapFlightLayerGroup = window.L.layerGroup().addTo(map);
      this.mapMarkersLayerGroup = window.L.layerGroup().addTo(map);

      // Set initial vibrant theme
      this.setMapTheme(this.currentMapTheme || "voyager");
    }

    // Refresh markers & flight paths
    this.updateMapLayers();

    // Ensure Leaflet tiles render smoothly without gray gaps
    setTimeout(() => {
      if (this.worldMapInstance) {
        this.worldMapInstance.invalidateSize();
      }
    }, 120);
  }

  setMapTheme(themeKey) {
    if (!MAP_STYLES[themeKey] || !this.worldMapInstance) return;
    this.currentMapTheme = themeKey;

    if (this.mapTileLayers && this.mapTileLayers.length) {
      this.mapTileLayers.forEach(l => {
        try { this.worldMapInstance.removeLayer(l); } catch(e){}
      });
      this.mapTileLayers = [];
    }

    const style = MAP_STYLES[themeKey];
    const base = window.L.tileLayer(style.url, {
      attribution: style.attribution,
      maxZoom: style.maxZoom || 19,
      subdomains: style.subdomains || "abc"
    }).addTo(this.worldMapInstance);
    this.mapTileLayers.push(base);

    if (style.labelsUrl) {
      const labels = window.L.tileLayer(style.labelsUrl, {
        attribution: "",
        maxZoom: style.maxZoom || 18
      }).addTo(this.worldMapInstance);
      this.mapTileLayers.push(labels);
    }

    // Update active UI theme buttons
    document.querySelectorAll(".map-theme-btn").forEach(btn => {
      const isTarget = btn.getAttribute("data-theme") === themeKey;
      if (isTarget) {
        btn.className = "map-theme-btn px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 bg-emerald-500 text-slate-950 shadow-md";
      } else {
        btn.className = "map-theme-btn px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 text-slate-400 hover:text-white";
      }
    });
  }

  focusContinent(continent) {
    this.selectedContinentFocus = continent;
    if (!this.worldMapInstance) return;

    if (continent === "All") {
      this.worldMapInstance.flyTo([20, 10], 2, { duration: 1.2 });
    } else if (CONTINENT_THEMES[continent]) {
      const target = CONTINENT_THEMES[continent];
      this.worldMapInstance.flyTo(target.center, target.zoom, { duration: 1.2 });
    }

    // Update focus buttons
    document.querySelectorAll(".continent-focus-btn").forEach(btn => {
      const c = btn.getAttribute("data-continent-focus");
      if (c === continent) {
        if (c === "All") {
          btn.className = "continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap bg-white text-slate-950 shadow";
        } else {
          btn.className = `continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap text-white shadow-lg bg-emerald-500`;
        }
      } else {
        if (c === "All") {
          btn.className = "continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap bg-slate-800 text-slate-300 hover:bg-slate-700";
        } else {
          const t = CONTINENT_THEMES[c];
          btn.className = `continent-focus-btn px-2.5 py-1 rounded-full font-bold transition-all whitespace-nowrap ${t ? t.badgeClass : 'bg-slate-800 text-slate-300'} hover:opacity-80`;
        }
      }
    });
  }

  toggleFlightArcs() {
    this.showFlightArcs = !this.showFlightArcs;
    const btn = document.getElementById("btn-toggle-flight-arcs");
    const label = document.getElementById("flight-arcs-label");
    if (label) label.textContent = this.showFlightArcs ? "On" : "Off";
    if (btn) {
      btn.className = `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
        this.showFlightArcs
          ? "bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-lg shadow-sky-500/10"
          : "bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white"
      }`;
    }

    if (this.mapFlightLayerGroup && this.worldMapInstance) {
      if (this.showFlightArcs) {
        if (!this.worldMapInstance.hasLayer(this.mapFlightLayerGroup)) {
          this.worldMapInstance.addLayer(this.mapFlightLayerGroup);
        }
      } else {
        if (this.worldMapInstance.hasLayer(this.mapFlightLayerGroup)) {
          this.worldMapInstance.removeLayer(this.mapFlightLayerGroup);
        }
      }
    }
  }

  calculateArcPoints(start, end, numPoints = 25) {
    const points = [];
    const midLat = (start[0] + end[0]) / 2;

    let dLng = end[1] - start[1];
    if (dLng > 180) dLng -= 360;
    if (dLng < -180) dLng += 360;

    const dLat = end[0] - start[0];
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);

    // Calculate curved arc offset
    const curveFactor = Math.min(Math.max(dist * 0.16, 5), 26);
    const controlLat = midLat + curveFactor;
    const controlLng = start[1] + dLng / 2;
    const endLng = start[1] + dLng;

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const lat = Math.pow(1 - t, 2) * start[0] + 2 * (1 - t) * t * controlLat + Math.pow(t, 2) * end[0];
      let lng = Math.pow(1 - t, 2) * start[1] + 2 * (1 - t) * t * controlLng + Math.pow(t, 2) * endLng;
      while (lng > 180) lng -= 360;
      while (lng < -180) lng += 360;
      points.push([lat, lng]);
    }
    return points;
  }

  updateMapLayers() {
    if (!this.worldMapInstance || !this.mapMarkersLayerGroup || !this.mapFlightLayerGroup) return;

    this.mapMarkersLayerGroup.clearLayers();
    this.mapFlightLayerGroup.clearLayers();

    const userLoc = geoService.getUserLocation();
    const hasUserLoc = Boolean(userLoc && userLoc.lat && userLoc.lng);

    // 1. User Origin Marker (Beacon Pulse)
    if (hasUserLoc) {
      const originIcon = window.L.divIcon({
        className: "custom-origin-leaflet-icon",
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20],
        html: `
          <div class="origin-pin-container" title="Your Origin: ${userLoc.city || 'Detected Location'}">
            <div class="origin-pulse"></div>
            <div class="origin-core">
              <span>📍</span>
            </div>
          </div>
        `
      });

      const originMarker = window.L.marker([userLoc.lat, userLoc.lng], {
        icon: originIcon,
        zIndexOffset: 1500
      });

      originMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; padding: 12px 14px; background: #0f172a; border-radius: 12px; color: #f8fafc; min-width: 180px;">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; color: #38bdf8; font-size: 13px; margin-bottom: 4px;">
            <span>📍</span> Your Travel Origin
          </div>
          <div style="font-size: 12px; color: #cbd5e1; font-weight: 600;">${userLoc.city || "Current City"}, ${userLoc.country || ""}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Global distances are calculated from here.</div>
        </div>
      `);

      this.mapMarkersLayerGroup.addLayer(originMarker);
    }

    // 2. Destination Markers with Continent Color Spectrum & Flight Lines
    this.destinations.forEach((dest) => {
      const theme = CONTINENT_THEMES[dest.continent] || {
        color: "#10b981",
        glow: "rgba(16, 185, 129, 0.7)",
        bg: "rgba(16, 185, 129, 0.2)",
        gradient: "linear-gradient(135deg, #10b981, #047857)",
        icon: "📍"
      };

      const weather = this.weatherCache.get(dest.id);
      const tempStr = weather ? weatherService.toDisplayTemp(weather.temperatureC) : "";
      const dist = geoService.getDistanceToDestination(dest.coordinates);
      const icon = getDestinationIcon(dest);

      // Flight Arcs
      if (hasUserLoc) {
        const arcPts = this.calculateArcPoints([userLoc.lat, userLoc.lng], [dest.coordinates.lat, dest.coordinates.lng]);
        const polyline = window.L.polyline(arcPts, {
          color: theme.color,
          weight: 2,
          opacity: 0.75,
          dashArray: "6, 8",
          className: "flight-arc-path"
        });
        this.mapFlightLayerGroup.addLayer(polyline);
      }

      // 3D Custom Glowing Pin
      const customIcon = window.L.divIcon({
        className: "custom-world-leaflet-icon",
        iconSize: [44, 52],
        iconAnchor: [22, 50],
        popupAnchor: [0, -48],
        html: `
          <div class="world-pin-container" style="--pin-glow: ${theme.glow};">
            <div class="world-pin-pulse" style="border: 2px solid ${theme.color}; background: ${theme.bg};"></div>
            <div class="world-pin-core" style="background: ${theme.gradient}; border: 2px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 16px ${theme.glow};">
              <span>${icon}</span>
            </div>
            <div class="world-pin-needle" style="border-top-color: ${theme.color};"></div>
            <div class="world-pin-pill" style="border-left: 3px solid ${theme.color};">
              <span>${dest.name}</span>
              ${tempStr ? `<span style="color: #34d399; font-weight: 800; margin-left: 2px;">${tempStr}</span>` : ""}
            </div>
          </div>
        `
      });

      const marker = window.L.marker([dest.coordinates.lat, dest.coordinates.lng], {
        icon: customIcon,
        riseOnHover: true
      });

      // Glassmorphic Colorful Popup with Google Maps Directions
      const originParam = hasUserLoc ? `${userLoc.lat},${userLoc.lng}` : (userLoc?.city || "");
      const gmapsDirUrl = mapsService.getDirectionsUrl(originParam, `${dest.coordinates.lat},${dest.coordinates.lng}`, "driving");

      marker.bindPopup(`
        <div style="width: 260px; border-radius: 16px; overflow: hidden; font-family: inherit;">
          <div style="position: relative; height: 120px; width: 100%;">
            <img src="${dest.heroImage}" alt="${dest.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%);"></div>
            
            <span style="position: absolute; top: 10px; left: 10px; background: ${theme.color}; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); text-transform: uppercase; letter-spacing: 0.5px;">
              ${dest.continent}
            </span>

            ${dest.safetyRating ? `
              <span style="position: absolute; top: 10px; right: 10px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(4px); color: #fbbf24; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; border: 1px solid rgba(251, 191, 36, 0.3);">
                ★ 4.9
              </span>
            ` : ""}

            <div style="position: absolute; bottom: 8px; left: 12px; right: 12px;">
              <div style="font-weight: 800; font-size: 16px; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.9); line-height: 1.2;">
                ${dest.name}
              </div>
              <div style="font-size: 11px; color: #cbd5e1; font-weight: 500;">${dest.country}</div>
            </div>
          </div>

          <div style="padding: 12px 14px; background: #0f172a;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 10px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">
              ${dest.summary || dest.tagline}
            </p>

            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; margin-bottom: 12px; padding: 6px 10px; background: rgba(30, 41, 59, 0.6); border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
              <span style="color: #38bdf8; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                ✈️ ${dist ? `${dist.km.toLocaleString()} km` : 'Global Spot'}
              </span>
              <span style="color: #34d399; font-weight: 700; display: flex; align-items: center; gap: 3px;">
                ${weather ? `🌤️ ${tempStr}` : '✨ Curated'}
              </span>
            </div>

            <div style="display: flex; gap: 6px;">
              <button onclick="window.location.hash='#destination/${dest.id}'" style="flex: 1.1; background: linear-gradient(135deg, #10b981, #059669); color: #022c22; font-weight: 800; font-size: 11px; padding: 7px 10px; border-radius: 9px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35); transition: all 0.2s; white-space: nowrap;">
                Explore Spot →
              </button>
              <a href="${gmapsDirUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); font-weight: 700; font-size: 11px; padding: 7px 8px; border-radius: 9px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.2s; white-space: nowrap;" title="Open directions to ${dest.name} in Google Maps">
                <span>🧭</span> Directions
              </a>
            </div>
          </div>
        </div>
      `, { maxWidth: 280 });

      this.mapMarkersLayerGroup.addLayer(marker);
    });

    if (!this.showFlightArcs && this.worldMapInstance.hasLayer(this.mapFlightLayerGroup)) {
      this.worldMapInstance.removeLayer(this.mapFlightLayerGroup);
    } else if (this.showFlightArcs && !this.worldMapInstance.hasLayer(this.mapFlightLayerGroup)) {
      this.worldMapInstance.addLayer(this.mapFlightLayerGroup);
    }
  }

  async loadLiveWeatherForCards() {
    for (const dest of this.destinations) {
      try {
        const weather = await weatherService.getWeather(dest.coordinates.lat, dest.coordinates.lng, dest.name);
        this.weatherCache.set(dest.id, weather);

        const badgeContainer = document.getElementById(`weather-badge-${dest.id}`);
        if (badgeContainer) {
          badgeContainer.innerHTML = `
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-[11px] font-medium text-amber-300 border border-slate-700/60 shadow-md">
              <i data-lucide="${weather.icon || 'sun'}" class="w-3.5 h-3.5 text-amber-400"></i>
              ${weatherService.toDisplayTemp(weather.temperatureC)} · ${weather.condition}
            </span>
          `;
          if (window.lucide) window.lucide.createIcons();
        }
      } catch (err) {
        console.warn(`Weather load error:`, err);
      }
    }
  }

  bindEvents() {
    const searchInput = document.getElementById("explorer-search-input");
    const clearBtn = document.getElementById("explorer-clear-search");
    const sortSelect = document.getElementById("explorer-sort-select");
    const resetBtn = document.getElementById("btn-reset-filters");
    const gridBtn = document.getElementById("btn-view-grid");
    const mapBtn = document.getElementById("btn-view-map");

    // Spin Compass / Surprise Me shortcut button
    const spinCompassBtn = document.getElementById("btn-explorer-spin-compass");
    if (spinCompassBtn) {
      spinCompassBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("voyage:open-compass"));
      });
    }

    // View mode switching
    if (gridBtn && mapBtn) {
      gridBtn.addEventListener("click", () => {
        this.viewMode = "grid";
        document.getElementById("destinations-cards-grid")?.classList.remove("hidden");
        document.getElementById("destinations-map-view")?.classList.add("hidden");
        gridBtn.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-emerald-500 text-slate-950 shadow";
        mapBtn.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-400 hover:text-white";
        this.renderGrid();
      });

      mapBtn.addEventListener("click", () => {
        this.viewMode = "map";
        document.getElementById("destinations-cards-grid")?.classList.add("hidden");
        document.getElementById("destinations-map-view")?.classList.remove("hidden");
        mapBtn.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-emerald-500 text-slate-950 shadow";
        gridBtn.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-400 hover:text-white";
        this.renderWorldMap();
      });
    }

    // Map theme switcher buttons
    document.querySelectorAll(".map-theme-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-theme");
        if (theme) this.setMapTheme(theme);
      });
    });

    // Flight arcs toggle
    const toggleFlightBtn = document.getElementById("btn-toggle-flight-arcs");
    if (toggleFlightBtn) {
      toggleFlightBtn.addEventListener("click", () => {
        this.toggleFlightArcs();
      });
    }

    // Continent focus buttons
    document.querySelectorAll(".continent-focus-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const c = btn.getAttribute("data-continent-focus");
        if (c) this.focusContinent(c);
      });
    });

    if (searchInput) {
      let searchDebounceTimer = null;
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        if (clearBtn) clearBtn.classList.toggle("hidden", this.searchQuery.length === 0);
        this.applyFiltersAndSort();

        clearTimeout(searchDebounceTimer);
        const q = this.searchQuery;
        if (q.length >= 3) {
          searchDebounceTimer = setTimeout(async () => {
            const stateLookup = q.replace(/^(state of|state)\s+/i, '').replace(/\s+state$/i, '').trim();
            const isStateMatch = Object.keys(INDIAN_STATES_REGISTRY).some(k => 
              k.includes(stateLookup) || stateLookup.includes(k)
            );
            if (isStateMatch) {
              await this.discoverAndShowLocation(q);
            }
          }, 350);
        }
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          clearTimeout(searchDebounceTimer);
          const q = this.searchQuery || searchInput.value.trim();
          if (q) this.discoverAndAddLocation(q);
        }
      });
    }

    // Global Search & Discovery Buttons
    const btnSearchGlobal = document.getElementById("btn-search-global-location");
    if (btnSearchGlobal) {
      btnSearchGlobal.addEventListener("click", () => {
        const q = this.searchQuery || searchInput?.value.trim();
        if (q) this.discoverAndAddLocation(q);
      });
    }

    const btnDiscoverHint = document.getElementById("btn-discover-hint");
    if (btnDiscoverHint) {
      btnDiscoverHint.addEventListener("click", () => {
        const q = this.searchQuery || searchInput?.value.trim();
        if (q) this.discoverAndAddLocation(q);
      });
    }

    const btnEmptyDiscover = document.getElementById("btn-empty-discover");
    if (btnEmptyDiscover) {
      btnEmptyDiscover.addEventListener("click", () => {
        const q = this.searchQuery || searchInput?.value.trim();
        if (q) this.discoverAndAddLocation(q);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (searchInput) {
          searchInput.value = "";
          this.searchQuery = "";
          clearBtn.classList.add("hidden");
          this.applyFiltersAndSort();
        }
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.applyFiltersAndSort();
      });
    }

    this.container.querySelectorAll(".filter-pill-continent").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.activeContinent = btn.getAttribute("data-continent");
        this.updatePillStyles(".filter-pill-continent", "data-continent", this.activeContinent, "bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20");
        this.applyFiltersAndSort();
      });
    });

    this.container.querySelectorAll(".filter-pill-vibe").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.activeVibe = btn.getAttribute("data-vibe");
        this.updatePillStyles(".filter-pill-vibe", "data-vibe", this.activeVibe, "bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20");
        this.applyFiltersAndSort();
      });
    });

    this.container.querySelectorAll(".filter-pill-budget").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.activeBudget = btn.getAttribute("data-budget");
        this.updatePillStyles(".filter-pill-budget", "data-budget", this.activeBudget, "bg-amber-500 text-slate-950 font-semibold");
        this.applyFiltersAndSort();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetFilters());
    }

    // Auto-update if any destination is registered dynamically
    window.addEventListener("voyage:destinations-updated", () => {
      this.destinations = [...DESTINATIONS];
      this.applyFiltersAndSort();
      if (this.worldMapInstance) {
        this.updateMapLayers();
      }
    });
  }

  updatePillStyles(selector, attr, activeValue, activeClasses) {
    this.container.querySelectorAll(selector).forEach((b) => {
      const val = b.getAttribute(attr);
      if (val === activeValue) {
        b.className = `${selector.replace(".", "")} px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeClasses}`;
      } else {
        b.className = `${selector.replace(".", "")} px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white`;
      }
    });
  }

  applyFiltersAndSort() {
    let list = this.destinations.filter((dest) => {
      if (this.activeContinent !== "All" && dest.continent !== this.activeContinent) return false;
      if (this.activeVibe !== "All" && !dest.vibes.includes(this.activeVibe)) return false;
      if (this.activeBudget !== "All" && dest.budget !== this.activeBudget) return false;

      if (this.searchQuery) {
        const matchName = dest.name.toLowerCase().includes(this.searchQuery);
        const matchCountry = dest.country.toLowerCase().includes(this.searchQuery);
        const matchSummary = dest.summary.toLowerCase().includes(this.searchQuery);
        const matchPlaces = dest.famousPlaces.some(p => p.name.toLowerCase().includes(this.searchQuery));
        if (!matchName && !matchCountry && !matchSummary && !matchPlaces) return false;
      }
      return true;
    });

    if (this.sortBy === "distance") {
      list.sort((a, b) => {
        const distA = geoService.getDistanceToDestination(a.coordinates)?.km || 999999;
        const distB = geoService.getDistanceToDestination(b.coordinates)?.km || 999999;
        return distA - distB;
      });
    } else if (this.sortBy === "budget-asc") {
      list.sort((a, b) => (a.budgetDailyEstimate || 0) - (b.budgetDailyEstimate || 0));
    } else if (this.sortBy === "budget-desc") {
      list.sort((a, b) => (b.budgetDailyEstimate || 0) - (a.budgetDailyEstimate || 0));
    } else if (this.sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredDestinations = list;

    // Update Live Global Search Hint Banner
    const searchHint = document.getElementById("global-search-hint");
    const hintQuery = document.getElementById("hint-query-text");
    if (searchHint && hintQuery) {
      if (this.searchQuery && this.searchQuery.trim().length >= 2) {
        hintQuery.textContent = `"${this.searchQuery.trim()}"`;
        searchHint.classList.remove("hidden");
      } else {
        searchHint.classList.add("hidden");
      }
    }

    this.updateDisplay();
  }

  resetFilters() {
    this.activeContinent = "All";
    this.activeVibe = "All";
    this.activeBudget = "All";
    this.searchQuery = "";
    this.sortBy = "featured";

    const searchInput = document.getElementById("explorer-search-input");
    if (searchInput) searchInput.value = "";
    const sortSelect = document.getElementById("explorer-sort-select");
    if (sortSelect) sortSelect.value = "featured";

    const searchHint = document.getElementById("global-search-hint");
    if (searchHint) searchHint.classList.add("hidden");

    this.updatePillStyles(".filter-pill-continent", "data-continent", "All", "bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20");
    this.updatePillStyles(".filter-pill-vibe", "data-vibe", "All", "bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20");
    this.updatePillStyles(".filter-pill-budget", "data-budget", "All", "bg-amber-500 text-slate-950 font-semibold");

    const showcaseContainer = document.getElementById("active-searched-location-container");
    if (showcaseContainer) {
      showcaseContainer.innerHTML = "";
      showcaseContainer.classList.add("hidden");
    }

    this.applyFiltersAndSort();
  }

  /**
   * Search ANY location worldwide with real landmarks and live weather
   * (Kept strictly isolated from the front-page curated landmarks)
   */
  async discoverAndShowLocation(query) {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();

    const overlay = document.getElementById("discovery-loading-overlay");
    const overlayTitle = document.getElementById("discovery-loading-title");
    const overlayDesc = document.getElementById("discovery-loading-desc");

    if (overlay) {
      overlay.classList.remove("hidden");
      if (overlayTitle) overlayTitle.textContent = `Searching "${cleanQuery}"...`;
      if (overlayDesc) overlayDesc.textContent = "Querying live weather station telemetry and authentic real landmarks...";
    }

    try {
      const resolved = await destinationResolver.resolve(cleanQuery);
      if (resolved) {
        if (resolved.isFrontPage) {
          // Curated front-page destination: dismiss showcase & highlight card in front page grid
          const showcase = document.getElementById("active-searched-location-container");
          if (showcase) {
            showcase.innerHTML = "";
            showcase.classList.add("hidden");
          }

          this.activeContinent = "All";
          this.activeVibe = "All";
          this.activeBudget = "All";
          this.searchQuery = resolved.name.toLowerCase();

          const searchInput = document.getElementById("explorer-search-input");
          if (searchInput) searchInput.value = resolved.name;

          this.applyFiltersAndSort();

          setTimeout(() => {
            const card = document.querySelector(`[data-navigate-dest="${resolved.id}"]`);
            if (card) {
              card.scrollIntoView({ behavior: "smooth", block: "center" });
              card.classList.add("ring-4", "ring-emerald-400", "scale-[1.02]");
              setTimeout(() => card.classList.remove("ring-4", "ring-emerald-400", "scale-[1.02]"), 3000);
            }
          }, 200);
        } else {
          // Searched location (NOT on front page):
          // Show dedicated showcase banner with REAL landmarks and LIVE weather
          this.renderSearchedLocationShowcase(resolved);

          // Reset search input & query so front page grid below displays all 17 default landmarks
          this.searchQuery = "";
          this.applyFiltersAndSort();

          if (this.worldMapInstance && resolved.coordinates) {
            this.worldMapInstance.flyTo([resolved.coordinates.lat, resolved.coordinates.lng], 6, { duration: 1.5 });
          }
        }
      } else {
        alert(`Could not find a recognized destination for "${cleanQuery}". Please check the spelling or try a major city name.`);
      }
    } catch (err) {
      console.error("Discovery error:", err);
      alert(`Could not resolve location "${cleanQuery}". Please check your internet connection or try again.`);
    } finally {
      if (overlay) overlay.classList.add("hidden");
    }
  }

  // Backwards compatibility alias
  async discoverAndAddLocation(query) {
    return this.discoverAndShowLocation(query);
  }

  /**
   * Render the dedicated Searched Location Showcase with real landmarks & live weather
   */
  renderSearchedLocationShowcase(dest) {
    const container = document.getElementById("active-searched-location-container");
    if (!container) return;

    const userLoc = geoService.getUserLocation();
    const userOrigin = userLoc ? `${userLoc.lat},${userLoc.lng}` : (userLoc?.city || "");
    const dist = geoService.getDistanceToDestination(dest.coordinates);

    const weather = dest.liveWeather;
    const tempC = weather?.temperatureC !== undefined ? Math.round(weather.temperatureC) : (dest.weather?.tempC || 22);
    const tempF = Math.round(tempC * 9/5 + 32);
    const weatherCondition = weather?.condition || "Partly Cloudy";
    const weatherDesc = weather?.description || "Pleasant traveling conditions";
    const humidity = weather?.humidity !== undefined ? weather.humidity : 58;
    const windSpeed = weather?.windSpeedKmh !== undefined ? weather.windSpeedKmh : 12;

    container.innerHTML = `
      <div class="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 relative overflow-hidden animate-fadeIn">
        <!-- Ambient Glow -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Header Controls -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800 relative z-10">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center gap-1.5 shadow-sm">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-400 animate-pulse"></i>
              <span>Live Searched Location</span>
            </span>
            <span class="text-xs text-slate-400 hidden sm:inline">
              (Preserved curated front page • Real landmarks & live weather telemetry)
            </span>
          </div>
          <button 
            id="btn-close-searched-showcase" 
            type="button" 
            class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Dismiss search showcase"
          >
            <i data-lucide="x" class="w-4 h-4"></i>
            <span>Dismiss Result</span>
          </button>
        </div>

        <!-- City Hero & Live Weather Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8 relative z-10">
          <!-- Left: Real Hero Image -->
          <div class="lg:col-span-5 relative group rounded-2xl overflow-hidden shadow-xl aspect-video lg:aspect-[4/3]">
            <img 
              src="${dest.heroImage}" 
              alt="${dest.name}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            
            <div class="absolute top-3 left-3 flex gap-2">
              <span class="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white border border-slate-700/80">
                ${dest.continent}
              </span>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/90 text-[11px] font-bold text-slate-950 shadow-md">
                ${dest.country}
              </span>
            </div>

            <div class="absolute bottom-3 left-3 right-3 text-white">
              <h3 class="text-2xl font-black">${dest.name}</h3>
              <p class="text-xs text-slate-300 truncate">${dest.tagline || dest.country}</p>
            </div>
          </div>

          <!-- Right: Details, Telemetry & Live Weather Station -->
          <div class="lg:col-span-7 space-y-4">
            <div>
              <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1.5">
                ${dest.name}, ${dest.country}
              </h2>
              <p class="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                ${dest.summary || dest.fullDescription}
              </p>
            </div>

            <!-- Live Weather Sensor Panel -->
            <div class="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 shadow-inner">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-slate-800/80">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Live Weather Station Sensor</span>
                </span>
                <span class="text-[11px] text-slate-400">
                  ${dist ? `${dist.km.toLocaleString()} km away • ` : ""}GPS: ${dest.coordinates.lat.toFixed(3)}°, ${dest.coordinates.lng.toFixed(3)}°
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div class="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
                  <span class="text-[11px] text-slate-400 block mb-0.5">Live Temp</span>
                  <span class="text-lg font-black text-white">${tempC}°C <span class="text-xs text-slate-400 font-normal">/ ${tempF}°F</span></span>
                </div>
                <div class="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
                  <span class="text-[11px] text-slate-400 block mb-0.5">Conditions</span>
                  <span class="text-xs font-bold text-cyan-300 truncate block mt-1">${weatherCondition}</span>
                </div>
                <div class="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
                  <span class="text-[11px] text-slate-400 block mb-0.5">Humidity</span>
                  <span class="text-base font-extrabold text-white">${humidity}%</span>
                </div>
                <div class="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
                  <span class="text-[11px] text-slate-400 block mb-0.5">Wind Velocity</span>
                  <span class="text-base font-extrabold text-white">${windSpeed} <span class="text-[10px] text-slate-400">km/h</span></span>
                </div>
              </div>
            </div>

            <!-- Action CTAs -->
            <div class="flex flex-wrap items-center gap-3 pt-1">
              <a 
                href="#destination/${dest.id}" 
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <i data-lucide="compass" class="w-4 h-4"></i>
                <span>Open Full Deep-Dive Page & Google Directions</span>
              </a>
              ${dest.localPhrases && dest.localPhrases.length > 0 ? `
                <button 
                  type="button" 
                  class="btn-speak-showcase-greeting inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-white font-bold text-xs border border-blue-500/40 transition-all cursor-pointer shadow-sm"
                  data-phrase="${dest.localPhrases[0].phrase}"
                  data-lang="${dest.localPhrases[0].lang || 'en-US'}"
                  title="Listen to native regional greeting in ${dest.language || 'Regional Language'}"
                >
                  <i data-lucide="volume-2" class="w-4 h-4 text-blue-400"></i>
                  <span>Say "${dest.localPhrases[0].phrase}" ${dest.localPhrases[0].native && dest.localPhrases[0].native !== dest.localPhrases[0].phrase ? `(${dest.localPhrases[0].native})` : ''}</span>
                </button>
              ` : ''}
              <a 
                href="#itinerary?dest=${dest.id}" 
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700/80 transition-colors cursor-pointer"
              >
                <i data-lucide="calendar" class="w-4 h-4 text-emerald-400"></i>
                <span>Plan Trip with this Location</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Real Iconic Landmarks Section -->
        <div class="pt-4 border-t border-slate-800/80 relative z-10">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <i data-lucide="landmark" class="w-4 h-4 text-emerald-400"></i>
              <span>Real Iconic Landmarks in ${dest.name} (${dest.famousPlaces?.length || 0} Places)</span>
            </h4>
            <span class="text-xs text-slate-400">Click directions to navigate in Google Maps</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${(dest.famousPlaces || []).map((place) => {
              const placeDirectionsUrl = mapsService.getDirectionsUrl(userOrigin, place.coordinates ? `${place.coordinates.lat},${place.coordinates.lng}` : `${place.name}, ${dest.name}`, "driving");
              const googlePhotosUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + dest.name)}`;
              return `
                <div class="bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-3 flex flex-col justify-between transition-all group shadow-md">
                  <div>
                    <div 
                      class="relative rounded-xl overflow-hidden aspect-[4/3] mb-3 cursor-pointer group/photo showcase-landmark-trigger"
                      data-img-src="${place.image}"
                      data-img-title="${place.name}"
                      data-img-caption="${place.category || 'Landmark'} · ${dest.name}, ${dest.country}"
                      title="Click to view full image of ${place.name}"
                    >
                      <img 
                        src="${place.image}" 
                        alt="${place.name}" 
                        class="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                        loading="lazy"
                        referrerpolicy="no-referrer"
                        onerror="this.onerror=null; this.src='${dest.heroImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}';"
                      />
                      <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-slate-700">
                        ${place.category || 'Landmark'}
                      </span>
                      <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold text-white/90 border border-slate-700 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center gap-1">
                        <span>📷 Google Photos</span>
                      </span>
                    </div>

                    <h5 class="text-xs font-black text-white mb-1 group-hover:text-emerald-400 transition-colors line-clamp-1" title="${place.name}">
                      ${place.name}
                    </h5>
                    <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                      ${place.description}
                    </p>
                  </div>

                  <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                    <span class="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      ⭐ ${place.rating || 4.8}
                    </span>
                    <div class="flex flex-wrap items-center gap-1 sm:gap-1.5">
                      <a 
                        href="https://artsandculture.google.com/search?q=${encodeURIComponent(place.name)}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition-all shadow-sm"
                        title="Compare high-resolution art, virtual museum tours & history of ${place.name} on Google Arts & Culture"
                      >
                        <span>🏛️</span>
                        <span>Arts & Culture</span>
                      </a>
                      <a 
                        href="${googlePhotosUrl}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-[10px] font-bold transition-all shadow-sm"
                        title="View real photos and 360° panoramas of ${place.name} on Google Maps"
                      >
                        <span>📷</span>
                        <span>Google Photos</span>
                      </a>
                      <a 
                        href="${placeDirectionsUrl}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition-all shadow-sm"
                        title="Navigate to ${place.name} with Google Maps"
                      >
                        <span>🧭</span>
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <!-- Popular Places Nearby to Visit & Day Trips (Google Travel Guide) -->
          ${dest.nearbyPlaces && dest.nearbyPlaces.length > 0 ? `
            <div class="mt-8 pt-6 border-t border-slate-800/80">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h4 class="text-sm font-black text-white flex items-center gap-2">
                    <span>🚗</span>
                    <span>Popular Places Nearby to Visit & Day Trips</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Google Travel Guide</span>
                  </h4>
                  <p class="text-xs text-slate-400 mt-0.5">Top scenic excursions, hill stations, and heritage destinations near ${dest.name}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                ${dest.nearbyPlaces.map((np) => {
                  const npDirectionsUrl = mapsService.getDirectionsUrl(
                    userOrigin, 
                    np.coordinates ? `${np.coordinates.lat},${np.coordinates.lng}` : `${np.name}, ${dest.name}`, 
                    "driving"
                  );
                  const npGooglePhotosUrl = np.googlePhotosUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(np.name + " " + dest.name)}`;
                  return `
                    <div class="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-3 flex flex-col justify-between transition-all group shadow-md cursor-pointer showcase-excursion-card" data-place-name="${np.name}">
                      <div>
                        <div 
                          class="relative rounded-xl overflow-hidden aspect-[4/3] mb-3 cursor-pointer group/photo"
                          title="Click to view real photos of ${np.name} on Google Maps"
                          onclick="window.open('${npGooglePhotosUrl}', '_blank')"
                        >
                          <img 
                            src="${np.image}" 
                            alt="${np.name}" 
                            class="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                            onerror="this.onerror=null; this.src='${dest.heroImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"}';"
                          />
                          <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-slate-700">
                            ${np.category || 'Excursion'}
                          </span>
                          <span class="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/90 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-slate-700 flex items-center gap-1 shadow">
                            <span>🚗</span>
                            <span>${np.distanceKm ? `~${np.distanceKm} km` : ''} ${np.driveTime ? `• ${np.driveTime}` : ''}</span>
                          </span>
                        </div>

                        <h5 class="text-xs font-black text-white mb-1 group-hover:text-cyan-400 transition-colors line-clamp-1" title="${np.name}">
                          ${np.name}
                        </h5>
                        <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                          ${np.description}
                        </p>
                      </div>

                      <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                        <button
                          class="btn-explore-nearby px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition-all shadow-sm flex items-center gap-1"
                          data-place-name="${np.name}"
                          title="Search and explore ${np.name} in Voyage"
                        >
                          <span>🔍</span>
                          <span>Explore</span>
                        </button>
                        <div class="flex items-center gap-1.5">
                          <a 
                            href="${npGooglePhotosUrl}" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-[10px] font-bold transition-all shadow-sm"
                            title="View real photos of ${np.name} on Google Maps"
                          >
                            <span>📷</span>
                            <span>Photos</span>
                          </a>
                          <a 
                            href="${npDirectionsUrl}" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-[10px] font-bold transition-all shadow-sm"
                            title="Navigate to ${np.name} with Google Maps"
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
            </div>
          ` : ''}
        </div>
      </div>
    `;

    container.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();

    // Wire Dismiss button
    const closeBtn = document.getElementById("btn-close-searched-showcase");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        container.innerHTML = "";
        container.classList.add("hidden");
        const searchInput = document.getElementById("explorer-search-input");
        if (searchInput) searchInput.value = "";
        this.searchQuery = "";
        this.applyFiltersAndSort();
      });
    }

    // Wire Landmark Lightbox on Showcase Landmark Cards
    container.querySelectorAll(".showcase-landmark-trigger").forEach(el => {
      el.addEventListener("click", () => {
        const img = el.querySelector("img");
        const src = img ? img.src : el.getAttribute("data-img-src");
        const title = el.getAttribute("data-img-title");
        const caption = el.getAttribute("data-img-caption");
        window.dispatchEvent(new CustomEvent("voyage:open-lightbox", {
          detail: { src, title, caption }
        }));
      });
    });

    // Wire Showcase Audio Greeting button
    container.querySelectorAll(".btn-speak-showcase-greeting").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const phrase = btn.getAttribute("data-phrase");
        const lang = btn.getAttribute("data-lang") || "en-US";
        if (phrase) {
          regionalAudioService.speak(phrase, lang, {
            buttonEl: btn,
            onStart: () => btn.classList.add("ring-2", "ring-blue-400", "scale-105"),
            onEnd: () => btn.classList.remove("ring-2", "ring-blue-400", "scale-105")
          });
        }
      });
    });

    // Wire Explore Nearby Place buttons and cards to deep-dive destination view
    const handleShowcaseExcursion = (placeName) => {
      if (placeName) {
        window.location.hash = `#destination/${encodeURIComponent(placeName)}`;
      }
    };

    container.querySelectorAll(".showcase-excursion-card").forEach(card => {
      card.addEventListener("click", () => {
        const placeName = card.getAttribute("data-place-name");
        handleShowcaseExcursion(placeName);
      });
    });

    container.querySelectorAll(".btn-explore-nearby").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const placeName = btn.getAttribute("data-place-name");
        handleShowcaseExcursion(placeName);
      });
    });

    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
