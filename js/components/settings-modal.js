// Location Settings Modal: Geolocation Detection & Manual Origin Configuration
import { geoService } from "../services/geo-service.js";

export class SettingsModal {
  constructor(containerId = "settings-modal-container") {
    this.container = document.getElementById(containerId);
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();

    window.addEventListener("voyage:open-settings", () => {
      this.open();
    });
  }

  open() {
    this.isOpen = true;
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
    this.populateFields();
  }

  close() {
    this.isOpen = false;
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  render() {
    this.container.innerHTML = `
      <div id="settings-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md transition-all">
        <div class="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col no-scrollbar">
          
          <!-- Modal Header -->
          <div class="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md">
                <i data-lucide="map-pin" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="font-bold text-white text-base">Location Settings</h3>
                <p class="text-xs text-slate-400">Manage your origin to calculate real travel distances & routes</p>
              </div>
            </div>
            <button id="btn-close-settings" class="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer" title="Close">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6 text-xs sm:text-sm">
            
            <!-- Current Origin Status Card -->
            <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Origin Location
                </span>
                <span id="cfg-loc-badge" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Not Set
                </span>
              </div>
              <div id="cfg-current-loc-display" class="text-white font-bold text-base mb-1">
                No origin location set yet
              </div>
              <div id="cfg-current-loc-coords" class="text-[11px] text-slate-400 font-mono">
                Click GPS or choose a city below to calculate distances
              </div>
              <div id="cfg-clear-loc-wrap" class="mt-3 pt-3 border-t border-slate-800/80 hidden">
                <button 
                  type="button" 
                  id="btn-clear-user-origin" 
                  class="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  <span>Clear Origin Location</span>
                </button>
              </div>
            </div>

            <!-- Auto Detection via GPS -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-200">
                1. Automatic GPS Detection
              </label>
              <button 
                type="button" 
                id="btn-cfg-gps" 
                class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <i data-lucide="crosshair" class="w-4 h-4"></i>
                <span id="btn-gps-text">Detect My Location (Browser GPS)</span>
              </button>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                Uses your browser's secure geolocation to detect your coordinates and reverse-geocode your nearest city.
              </p>
            </div>

            <!-- Manual City Search -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-200">
                2. Search Any City or Region Manually
              </label>
              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <input 
                    type="text" 
                    id="cfg-location-search" 
                    placeholder="Type city name (e.g. Bengaluru, Mumbai, London, Paris)..." 
                    class="w-full bg-slate-950 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors pl-9"
                  />
                  <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                </div>
                <button 
                  type="button" 
                  id="btn-cfg-search-city" 
                  class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer shrink-0"
                >
                  Search
                </button>
              </div>
              <div id="cfg-location-results" class="space-y-1.5 pt-1 text-xs"></div>
            </div>

            <!-- Popular Quick-Select Travel Hubs -->
            <div class="space-y-2.5">
              <label class="block text-xs font-bold text-slate-300">
                3. Popular Travel Origins (Instant 1-Click)
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="cfg-popular-cities">
                <button type="button" class="btn-quick-origin p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group" data-city="Bengaluru" data-country="India" data-lat="12.9716" data-lng="77.5946">
                  <div class="text-[10px] text-slate-400 group-hover:text-emerald-300">🇮🇳 India</div>
                  <div class="font-bold text-white text-xs">Bengaluru</div>
                </button>
                <button type="button" class="btn-quick-origin p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group" data-city="Mumbai" data-country="India" data-lat="19.0760" data-lng="72.8777">
                  <div class="text-[10px] text-slate-400 group-hover:text-emerald-300">🇮🇳 India</div>
                  <div class="font-bold text-white text-xs">Mumbai</div>
                </button>
                <button type="button" class="btn-quick-origin p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group" data-city="Delhi" data-country="India" data-lat="28.6139" data-lng="77.2090">
                  <div class="text-[10px] text-slate-400 group-hover:text-emerald-300">🇮🇳 India</div>
                  <div class="font-bold text-white text-xs">Delhi (NCR)</div>
                </button>
                <button type="button" class="btn-quick-origin p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group" data-city="London" data-country="United Kingdom" data-lat="51.5074" data-lng="-0.1278">
                  <div class="text-[10px] text-slate-400 group-hover:text-emerald-300">🇬🇧 UK</div>
                  <div class="font-bold text-white text-xs">London</div>
                </button>
                <button type="button" class="btn-quick-origin p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group" data-city="New York" data-country="United States" data-lat="40.7128" data-lng="-74.0060">
                  <div class="text-[10px] text-slate-400 group-hover:text-emerald-300">🇺🇸 USA</div>
                  <div class="font-bold text-white text-xs">New York</div>
                </button>
                <button type="button" class="btn-quick-origin p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group" data-city="Dubai" data-country="UAE" data-lat="25.2048" data-lng="55.2708">
                  <div class="text-[10px] text-slate-400 group-hover:text-emerald-300">🇦🇪 UAE</div>
                  <div class="font-bold text-white text-xs">Dubai</div>
                </button>
                <button type="button" class="btn-quick-origin p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group" data-city="Paris" data-country="France" data-lat="48.8566" data-lng="2.3522">
                  <div class="text-[10px] text-slate-400 group-hover:text-emerald-300">🇫🇷 France</div>
                  <div class="font-bold text-white text-xs">Paris</div>
                </button>
                <button type="button" class="btn-quick-origin p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group" data-city="Tokyo" data-country="Japan" data-lat="35.6762" data-lng="139.6503">
                  <div class="text-[10px] text-slate-400 group-hover:text-emerald-300">🇯🇵 Japan</div>
                  <div class="font-bold text-white text-xs">Tokyo</div>
                </button>
                <button type="button" class="btn-quick-origin p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group" data-city="Singapore" data-country="Singapore" data-lat="1.3521" data-lng="103.8198">
                  <div class="text-[10px] text-slate-400 group-hover:text-emerald-300">🇸🇬 Singapore</div>
                  <div class="font-bold text-white text-xs">Singapore</div>
                </button>
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="p-5 border-t border-slate-800 flex items-center justify-end bg-slate-900/90 sticky bottom-0 z-10 backdrop-blur-md">
            <button 
              id="btn-done-settings" 
              class="px-6 py-2.5 text-xs font-bold text-slate-950 rounded-xl bg-emerald-500 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  populateFields() {
    const loc = geoService.getUserLocation();
    const locBadge = document.getElementById("cfg-loc-badge");
    const locDisplay = document.getElementById("cfg-current-loc-display");
    const locCoords = document.getElementById("cfg-current-loc-coords");
    const clearWrap = document.getElementById("cfg-clear-loc-wrap");

    if (loc && loc.lat && loc.lng) {
      if (locBadge) {
        locBadge.textContent = loc.isManual ? "Manual Origin" : "GPS Detected";
        locBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      }
      if (locDisplay) {
        locDisplay.textContent = `${loc.city}${loc.country ? `, ${loc.country}` : ""}`;
      }
      if (locCoords) {
        locCoords.textContent = `Coordinates: ${loc.lat.toFixed(4)}°, ${loc.lng.toFixed(4)}°`;
      }
      if (clearWrap) {
        clearWrap.classList.remove("hidden");
      }
    } else {
      if (locBadge) {
        locBadge.textContent = "Not Set";
        locBadge.className = "text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700";
      }
      if (locDisplay) {
        locDisplay.textContent = "No origin location set yet";
      }
      if (locCoords) {
        locCoords.textContent = "Click GPS or choose a city below to calculate distances";
      }
      if (clearWrap) {
        clearWrap.classList.add("hidden");
      }
    }

    // Highlight active popular city if matched
    const currentCity = loc?.city?.toLowerCase() || "";
    document.querySelectorAll(".btn-quick-origin").forEach(btn => {
      const bCity = btn.getAttribute("data-city")?.toLowerCase() || "";
      if (currentCity && bCity && (currentCity.includes(bCity) || bCity.includes(currentCity))) {
        btn.classList.add("ring-2", "ring-emerald-400", "bg-emerald-500/20");
      } else {
        btn.classList.remove("ring-2", "ring-emerald-400", "bg-emerald-500/20");
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents() {
    const closeBtn = document.getElementById("btn-close-settings");
    const doneBtn = document.getElementById("btn-done-settings");
    const searchCityBtn = document.getElementById("btn-cfg-search-city");
    const cityInput = document.getElementById("cfg-location-search");
    const gpsBtn = document.getElementById("btn-cfg-gps");
    const clearBtn = document.getElementById("btn-clear-user-origin");

    if (closeBtn) closeBtn.addEventListener("click", () => this.close());
    if (doneBtn) doneBtn.addEventListener("click", () => this.close());

    // Click outside to close
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.close();
      });
    }

    // Clear Origin
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        geoService.clearLocation();
        this.populateFields();
      });
    }

    // GPS Auto Detection
    if (gpsBtn) {
      gpsBtn.addEventListener("click", async () => {
        const textSpan = document.getElementById("btn-gps-text");
        try {
          if (textSpan) textSpan.innerHTML = `<span class="inline-block animate-pulse">Detecting GPS coordinates...</span>`;
          gpsBtn.classList.add("opacity-75", "pointer-events-none");
          await geoService.requestBrowserLocation();
          this.populateFields();
          if (textSpan) textSpan.textContent = "Location Detected via GPS!";
          setTimeout(() => {
            if (textSpan) textSpan.textContent = "Detect My Location (Browser GPS)";
            gpsBtn.classList.remove("opacity-75", "pointer-events-none");
          }, 2000);
        } catch (err) {
          alert(err.message || "Could not detect location. Please search manually.");
          if (textSpan) textSpan.textContent = "Detect My Location (Browser GPS)";
          gpsBtn.classList.remove("opacity-75", "pointer-events-none");
        }
      });
    }

    // Quick Popular Origins
    document.querySelectorAll(".btn-quick-origin").forEach(btn => {
      btn.addEventListener("click", () => {
        const city = btn.getAttribute("data-city");
        const country = btn.getAttribute("data-country");
        const lat = parseFloat(btn.getAttribute("data-lat"));
        const lng = parseFloat(btn.getAttribute("data-lng"));
        if (city && lat && lng) {
          geoService.setManualLocation(city, country, lat, lng);
          this.populateFields();
        }
      });
    });

    // Manual City Search
    const performSearch = async () => {
      const q = cityInput ? cityInput.value.trim() : "";
      if (!q) return;
      const resultsEl = document.getElementById("cfg-location-results");
      if (!resultsEl) return;
      resultsEl.innerHTML = `<div class="p-2 text-slate-400 text-xs flex items-center gap-2"><span class="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full animate-spin"></span> Searching OpenStreetMap...</div>`;

      const list = await geoService.searchCities(q);
      if (list.length === 0) {
        resultsEl.innerHTML = `<div class="p-2 text-amber-400 text-xs bg-amber-500/10 rounded-xl border border-amber-500/20">No matching cities found for "${q}". Please try a different name.</div>`;
        return;
      }

      resultsEl.innerHTML = list.map((item, idx) => `
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between gap-2 transition-colors">
          <div class="truncate">
            <span class="font-bold text-white block truncate text-xs">${item.city}</span>
            <span class="text-[10px] text-slate-400 truncate block">${item.displayName}</span>
          </div>
          <button 
            type="button" 
            class="btn-select-city px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
            data-idx="${idx}"
          >
            Set Origin
          </button>
        </div>
      `).join("");

      resultsEl.querySelectorAll(".btn-select-city").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          const chosen = list[idx];
          if (chosen) {
            geoService.setManualLocation(chosen.city, chosen.country, chosen.lat, chosen.lng);
            resultsEl.innerHTML = "";
            if (cityInput) cityInput.value = "";
            this.populateFields();
          }
        });
      });
    };

    if (searchCityBtn) searchCityBtn.addEventListener("click", performSearch);
    if (cityInput) {
      cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          performSearch();
        }
      });
    }
  }
}
