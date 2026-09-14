// Day-by-Day Interactive Itinerary View & Generator (Editable & Multi-Currency)

import { DESTINATIONS, SEARCHED_DESTINATIONS, getDestinationById } from "../destinations-data.js";
import { INDIAN_STATES_REGISTRY } from "../services/indian-states-data.js";
import { geminiService } from "../services/gemini-service.js";
import { itineraryService } from "../services/itinerary-service.js";
import { geoService } from "../services/geo-service.js";
import { currencyService } from "../services/currency-service.js";
import { mapsService } from "../services/maps-service.js";

export class ItineraryView {
  constructor(containerId = "itinerary-container") {
    this.container = document.getElementById(containerId);
    this.selectedDestId = DESTINATIONS[0].id;
    this.daysCount = 4;
    this.selectedStyle = "Balanced Discovery";
    this.selectedInterests = ["Culture", "Food & Dining", "Historic Landmarks"];
    this.isGenerating = false;
    this.currentItinerary = itineraryService.getCurrentItinerary();
    this.dayRouteMaps = {};
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();

    window.addEventListener("voyage:currency-changed", () => {
      if (this.currentItinerary) {
        const display = document.getElementById("itinerary-display-container");
        if (display) {
          display.innerHTML = this.renderItineraryPlan(this.currentItinerary);
          this.bindActionButtons();
        }
      }
    });

    window.addEventListener("voyage:searched-destinations-updated", () => {
      const selectEl = document.getElementById("itin-dest-select");
      if (selectEl) {
        selectEl.innerHTML = this.renderSelectOptions();
      }
    });

    window.addEventListener("voyage:destinations-updated", () => {
      const selectEl = document.getElementById("itin-dest-select");
      if (selectEl) {
        selectEl.innerHTML = this.renderSelectOptions();
      }
    });
  }

  renderSelectOptions() {
    const frontOptions = DESTINATIONS.map(d => `
      <option value="${d.id}" ${d.id === this.selectedDestId ? "selected" : ""}>
        ${d.name}, ${d.country}
      </option>
    `).join("");

    const searchedList = Array.from(SEARCHED_DESTINATIONS.values());
    const searchedOptions = searchedList.length > 0 ? `
      <optgroup label="🔍 Searched Locations">
        ${searchedList.map(d => `
          <option value="${d.id}" ${d.id === this.selectedDestId ? "selected" : ""}>
            ${d.name}, ${d.country}
          </option>
        `).join("")}
      </optgroup>
    ` : "";

    return `
      <optgroup label="⭐ Front-Page Curated Landmarks">
        ${frontOptions}
      </optgroup>
      ${searchedOptions}
    `;
  }

  setDestination(destId) {
    if (destId) {
      this.selectedDestId = destId;
      const selectEl = document.getElementById("itin-dest-select");
      if (selectEl) {
        selectEl.innerHTML = this.renderSelectOptions();
        selectEl.value = destId;
      }
    }
  }

  render() {
    this.container.innerHTML = `
      <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto animate-fadeIn">
        <!-- Itinerary Header -->
        <div class="text-center max-w-3xl mx-auto mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <i data-lucide="calendar-range" class="w-3.5 h-3.5"></i>
            AI Trip Planning Engine
          </div>
          <h2 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Craft Your Custom Itinerary
          </h2>
          <p class="text-slate-400 text-sm sm:text-base mt-2">
            Structured day-by-day expedition schedule with morning, afternoon, and evening slots. You can check off activities, edit, add custom plans, and export to PDF.
          </p>
        </div>

        <!-- Trip Configuration Generator Card -->
        <div class="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12">
          <form id="itinerary-form" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Destination Picker -->
              <div>
                <label for="itin-dest-select" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Destination
                </label>
                <div class="relative">
                  <select 
                    id="itin-dest-select" 
                    class="w-full appearance-none bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    ${this.renderSelectOptions()}
                  </select>
                  <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                </div>
              </div>

              <!-- Days Selector -->
              <div>
                <label for="itin-days-slider" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Trip Duration: <span id="label-days-count" class="text-emerald-400 font-extrabold text-sm">${this.daysCount} Days</span>
                </label>
                <div class="pt-2">
                  <input 
                    type="range" 
                    id="itin-days-slider" 
                    min="1" 
                    max="7" 
                    value="${this.daysCount}" 
                    class="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div class="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>1 Day</span>
                    <span>3 Days</span>
                    <span>5 Days</span>
                    <span>7 Days</span>
                  </div>
                </div>
              </div>

              <!-- Travel Style -->
              <div>
                <label for="itin-style-select" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Pace & Travel Style
                </label>
                <div class="relative">
                  <select 
                    id="itin-style-select" 
                    class="w-full appearance-none bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Balanced Discovery" selected>Balanced Discovery</option>
                    <option value="Relaxed & Leisure">Relaxed & Leisure</option>
                    <option value="Fast-Paced Explorer">Fast-Paced Explorer</option>
                    <option value="Foodie & Culinary">Foodie & Culinary</option>
                    <option value="Outdoor Adventure">Outdoor Adventure</option>
                    <option value="Romantic Getaway">Romantic Getaway</option>
                  </select>
                  <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                </div>
              </div>
            </div>

            <!-- Interests Checkboxes -->
            <div>
              <span class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Traveler Interests & Focus Areas
              </span>
              <div class="flex flex-wrap gap-2" id="interests-container">
                ${["Culture", "Food & Dining", "Historic Landmarks", "Nature & Parks", "Photography", "Shopping & Markets", "Hidden Gems"].map(interest => {
                  const isChecked = this.selectedInterests.includes(interest);
                  return `
                    <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${isChecked ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}">
                      <input type="checkbox" value="${interest}" ${isChecked ? "checked" : ""} class="hidden interest-checkbox" />
                      <i data-lucide="${isChecked ? 'check' : 'plus'}" class="w-3.5 h-3.5"></i>
                      ${interest}
                    </label>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-2 flex items-center justify-end gap-3">
              <button 
                type="submit" 
                id="btn-generate-itinerary"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <i data-lucide="wand-2" class="w-4 h-4 text-slate-950"></i>
                <span>Generate Day-by-Day Plan</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Generated Itinerary Display Area -->
        <div id="itinerary-display-container">
          ${this.currentItinerary ? this.renderItineraryPlan(this.currentItinerary) : `
            <div class="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8">
              <div class="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <i data-lucide="map-pin" class="w-7 h-7"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">No Active Itinerary Yet</h3>
              <p class="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
                Select your preferred destination and duration above, then click <b>Generate Day-by-Day Plan</b> to create a personalized schedule.
              </p>
            </div>
          `}
        </div>

        <!-- Inline Activity Edit Modal (Advanced Upgrade 5) -->
        <div id="activity-edit-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h4 class="text-base font-bold text-white mb-4 flex items-center gap-2">
              <i data-lucide="pencil" class="w-4 h-4 text-emerald-400"></i>
              Edit Itinerary Activity
            </h4>
            <form id="form-edit-activity" class="space-y-4 text-xs">
              <input type="hidden" id="edit-day-num" />
              <input type="hidden" id="edit-slot-key" />

              <div>
                <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1">Activity Title</label>
                <input type="text" id="edit-act-title" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" required />
              </div>

              <div>
                <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1">Description & Tips</label>
                <textarea id="edit-act-desc" rows="3" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" required></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1">Estimated Cost</label>
                  <input type="text" id="edit-act-cost" placeholder="e.g. Free, $$, $25" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1">Category Tag</label>
                  <input type="text" id="edit-act-tag" placeholder="e.g. Culture, Dining" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div class="pt-3 flex items-center justify-end gap-2">
                <button type="button" id="btn-cancel-edit-act" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
                  Cancel
                </button>
                <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  renderItineraryPlan(it) {
    // Convert estimated budget to selected currency
    let budgetDisplay = it.estimatedBudgetUSD;
    if (it.estimatedBudgetUSD.includes("$")) {
      const nums = it.estimatedBudgetUSD.match(/\d+/g);
      if (nums && nums.length >= 2) {
        budgetDisplay = currencyService.formatBudgetRange(parseInt(nums[0]), parseInt(nums[1]));
      }
    }

    return `
      <div class="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10" id="printable-itinerary-sheet">
        <!-- Real Destination Visual Header Banner -->
        ${(it.heroImage || this.currentDestination?.heroImage) ? `
          <div class="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-slate-800 shadow-xl mb-6">
            <img 
              src="${it.heroImage || this.currentDestination?.heroImage}" 
              alt="${it.destination}" 
              class="w-full h-full object-cover"
              loading="lazy"
              referrerpolicy="no-referrer"
              onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/1200px-Louvre_Museum_Wikimedia_Commons.jpg'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/80 backdrop-blur-md text-slate-950 font-black text-[11px] shadow">
                  ⭐ Verified Destination Photography
                </span>
                <h4 class="text-xl sm:text-2xl font-black text-white drop-shadow mt-1">
                  ${it.destination}
                </h4>
              </div>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.destination || '')}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 text-sky-300 border border-slate-700/80 text-xs font-bold transition-all shadow"
              >
                <span>📷</span>
                <span>Google Photos & Street View</span>
              </a>
            </div>
          </div>
        ` : ''}

        <!-- Itinerary Header Banner -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
              Custom Structured Itinerary
            </div>
            <h3 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ${it.tripTitle}
            </h3>
            <p class="text-slate-400 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              ${it.overview}
            </p>
          </div>

          <!-- Trip Meta Card with Multi-Currency -->
          <div class="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 shrink-0 flex md:flex-col justify-between gap-4 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px] uppercase tracking-wider">Duration</span>
              <span class="font-bold text-white text-sm">${it.totalDays} Days</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px] uppercase tracking-wider">Estimated Budget</span>
              <span class="font-bold text-amber-400 text-sm">${budgetDisplay}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px] uppercase tracking-wider">Travel Style</span>
              <span class="font-bold text-cyan-400 text-sm">${it.travelStyle}</span>
            </div>
          </div>
        </div>

        <!-- Action Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-3 print:hidden">
          <span class="text-xs text-slate-400">
            Interactive Day-by-Day Timeline (Check off completed activities or click edit to customize)
          </span>
          <div class="flex items-center gap-2">
            <button id="btn-copy-itinerary" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span id="copy-btn-text">Copy Text</span>
            </button>
            <button id="btn-export-json" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              Export JSON
            </button>
            <button id="btn-print-itinerary" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors">
              <i data-lucide="printer" class="w-3.5 h-3.5"></i>
              Print / Save PDF
            </button>
          </div>
        </div>

        <!-- Day-by-Day Structured Timeline -->
        <div class="space-y-8">
          ${it.days.map((day) => `
            <div class="border border-slate-800/90 rounded-2xl bg-slate-950/40 overflow-hidden">
              <div class="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow">
                    D${day.dayNumber}
                  </span>
                  <h4 class="text-base sm:text-lg font-bold text-white">
                    ${day.title}
                  </h4>
                </div>
                ${day.heroImage || day.morning?.image ? `
                  <div 
                    class="hidden sm:flex items-center gap-2 cursor-pointer group/dh"
                    title="Explore day highlights on Google Maps"
                    onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((day.morning?.title || day.title) + ' ' + (it.destination || ''))}', '_blank')"
                  >
                    <div class="w-12 h-8 rounded-lg overflow-hidden border border-slate-700 shadow shrink-0">
                      <img src="${day.heroImage || day.morning?.image}" class="w-full h-full object-cover group-hover/dh:scale-110 transition-transform" />
                    </div>
                    <span class="text-[11px] font-bold text-sky-400 group-hover/dh:underline">Real Photos 📷</span>
                  </div>
                ` : ''}
              </div>

              <!-- Day Route Flow Strip & Leaflet Map Toggle (Recommendation 3) -->
              <div class="px-6 py-3 bg-slate-900/40 border-b border-slate-800/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Day ${day.dayNumber} Route Flow:</span>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-[11px] flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      1. ${(day.morning?.title || 'Morning Spot').slice(0, 26)}
                    </span>
                    <span class="text-slate-500 font-bold text-[10px]">──(~15 min)──></span>
                    <span class="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold text-[11px] flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      2. ${(day.afternoon?.title || 'Afternoon Spot').slice(0, 26)}
                    </span>
                    <span class="text-slate-500 font-bold text-[10px]">──(~12 min)──></span>
                    <span class="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold text-[11px] flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      3. ${(day.evening?.title || 'Evening Spot').slice(0, 26)}
                    </span>
                  </div>
                </div>

                <button 
                  type="button" 
                  class="btn-toggle-day-map inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-700/80 font-bold transition-all shadow-sm cursor-pointer text-xs"
                  data-day="${day.dayNumber}"
                >
                  <i data-lucide="map" class="w-3.5 h-3.5"></i>
                  <span class="day-map-label">Interactive Day Route Map</span>
                </button>
              </div>

              <!-- Interactive Leaflet Route Map Drawer (Recommendation 3) -->
              <div id="day-map-drawer-${day.dayNumber}" class="hidden p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="font-bold text-white">Day ${day.dayNumber} Sequential Route Trail</span>
                    <span class="text-slate-400 hidden sm:inline">• Morning [1] → Afternoon [2] → Evening [3]</span>
                  </div>
                  <a 
                    href="${this.getMultiStopGoogleMapsUrl(day, it)}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 underline self-start sm:self-auto"
                  >
                    <span>Open Multi-Stop Route in Google Maps</span>
                    <i data-lucide="external-link" class="w-3 h-3"></i>
                  </a>
                </div>
                <div id="day-route-map-${day.dayNumber}" class="w-full h-64 sm:h-72 rounded-2xl border border-slate-800 overflow-hidden shadow-inner bg-slate-950 z-0"></div>
                <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>💡 Tip: Click any numbered pin to inspect landmark details & stop timing.</span>
                  <span class="text-emerald-400 font-medium">Watermark-Free Navigation</span>
                </div>
              </div>

              <div class="p-6 space-y-6">
                ${this.renderActivitySlot(day.dayNumber, "morning", "Morning", day.morning, "sun", "text-amber-400", day, it)}
                ${this.renderActivitySlot(day.dayNumber, "afternoon", "Afternoon", day.afternoon, "compass", "text-cyan-400", day, it)}
                ${this.renderActivitySlot(day.dayNumber, "evening", "Evening", day.evening, "moon", "text-purple-400", day, it)}

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800/70 text-xs">
                  <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
                    <i data-lucide="utensils" class="w-4 h-4 text-amber-400 mt-0.5 shrink-0"></i>
                    <div>
                      <span class="font-bold text-amber-400 block mb-0.5">Culinary Highlight</span>
                      <span class="text-slate-300">${day.foodHighlight}</span>
                    </div>
                  </div>

                  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                    <i data-lucide="lightbulb" class="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"></i>
                    <div>
                      <span class="font-bold text-emerald-400 block mb-0.5">Insider Pro-Tip</span>
                      <span class="text-slate-300">${day.insiderTip}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Packing Essentials Checklist -->
        ${it.packingEssentials && it.packingEssentials.length > 0 ? `
          <div class="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <i data-lucide="backpack" class="w-4 h-4 text-emerald-400"></i>
              Curated Packing Essentials
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
              ${it.packingEssentials.map(item => `
                <div class="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>
                  <span>${item}</span>
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  resolveActivityImage(slotData, day, it, slotKey) {
    if (!slotData) return null;
    if (slotData.image) return slotData.image;

    const titleLower = (slotData.title || "").toLowerCase();
    const destName = (it?.destination || "").toLowerCase();

    const allDests = [
      ...DESTINATIONS, 
      ...Array.from(SEARCHED_DESTINATIONS.values()),
      ...Object.values(INDIAN_STATES_REGISTRY || {})
    ];
    const targetDest = allDests.find(d => 
      destName.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(destName) || d.id === this.selectedDestId
    );

    if (targetDest) {
      if (targetDest.famousPlaces) {
        const matched = targetDest.famousPlaces.find(p => 
          titleLower.includes(p.name.toLowerCase()) || 
          p.name.toLowerCase().includes(titleLower) ||
          (p.wikiTitle && titleLower.includes(p.wikiTitle.toLowerCase().replace(/_/g, " ")))
        );
        if (matched && matched.image) return matched.image;
      }

      if (targetDest.nearbyPlaces) {
        const matchedNearby = targetDest.nearbyPlaces.find(np => 
          titleLower.includes(np.name.toLowerCase()) || np.name.toLowerCase().includes(titleLower)
        );
        if (matchedNearby && matchedNearby.image) return matchedNearby.image;
      }

      return targetDest.heroImage;
    }

    return null;
  }

  renderActivitySlot(dayNum, slotKey, slotLabel, slotData, iconName, iconColorClass, day, it) {
    if (!slotData) return "";
    const isChecked = itineraryService.isActivityChecked(dayNum, slotKey);
    const actImg = slotData.image || this.resolveActivityImage(slotData, day, it, slotKey);
    const destName = it?.destination || "";
    const googlePhotosUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(slotData.title + " " + destName)}`;
    const googleDirectionsUrl = mapsService.getDirectionsUrl('', slotData.title + ', ' + destName, 'driving');

    return `
      <div class="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl transition-all ${isChecked ? 'bg-emerald-950/20 border border-emerald-900/40 opacity-70' : 'bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/70 hover:border-slate-700 shadow-md'}">
        <!-- Interactive Checkbox & Time in Mobile/Desktop -->
        <div class="flex items-center sm:items-start gap-3 w-full sm:w-auto shrink-0">
          <button 
            class="activity-checkbox mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600 hover:border-emerald-400 text-transparent'}"
            data-day="${dayNum}" 
            data-slot="${slotKey}"
            title="Mark activity as done"
          >
            <i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>
          </button>

          <!-- Time & Slot Label -->
          <div class="w-24 shrink-0">
            <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-0.5">
              <i data-lucide="${iconName}" class="w-3.5 h-3.5 ${iconColorClass}"></i>
              ${slotLabel}
            </span>
            <span class="text-[11px] text-slate-400">${slotData.time || "Morning"}</span>
          </div>

          <!-- Real Image Thumbnail on Mobile inline -->
          ${actImg ? `
            <div 
              class="sm:hidden ml-auto w-16 h-12 rounded-lg overflow-hidden shrink-0 cursor-pointer shadow border border-slate-800"
              title="Click to view real photos on Google Maps"
              onclick="window.open('${googlePhotosUrl}', '_blank')"
            >
              <img 
                src="${actImg}" 
                alt="${slotData.title}" 
                class="w-full h-full object-cover"
                loading="lazy"
                referrerpolicy="no-referrer"
                onerror="this.style.display='none'"
              />
            </div>
          ` : ""}
        </div>

        <!-- Real Landmark / Activity Photo (Desktop) -->
        ${actImg ? `
          <div 
            class="hidden sm:block relative w-32 h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer group/photo shadow-md border border-slate-800/80"
            title="Click to view real photos of ${slotData.title} on Google Maps"
            onclick="window.open('${googlePhotosUrl}', '_blank')"
          >
            <img 
              src="${actImg}" 
              alt="${slotData.title}" 
              class="w-full h-full object-cover group-hover/photo:scale-110 transition-transform duration-500"
              loading="lazy"
              referrerpolicy="no-referrer"
              onerror="this.style.display='none'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <span class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-950/90 backdrop-blur-md text-[9px] font-bold text-sky-300 flex items-center gap-1 border border-slate-800 shadow">
              <span>📷</span>
              <span>Photos</span>
            </span>
          </div>
        ` : ""}

        <!-- Activity Body -->
        <div class="flex-1 w-full">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <h5 class="font-bold text-white text-sm sm:text-base group-hover:text-emerald-300 transition-colors ${isChecked ? 'line-through text-slate-400' : ''}">
              ${slotData.title}
            </h5>
            <div class="flex items-center gap-2">
              ${slotData.tag ? `
                <span class="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                  ${slotData.tag}
                </span>
              ` : ""}
              ${slotData.cost ? `
                <span class="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-amber-400 font-semibold">
                  ${slotData.cost}
                </span>
              ` : ""}

              <!-- Activity Action & Edit Controls -->
              <div class="flex items-center gap-1.5">
                <a 
                  href="${googlePhotosUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="p-1 px-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors flex items-center gap-1 text-[10px] font-semibold"
                  title="View authentic visitor photos on Google Maps"
                >
                  <i data-lucide="camera" class="w-3 h-3"></i>
                  <span class="hidden md:inline">Google Photos</span>
                </a>
                <a 
                  href="${googleDirectionsUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="p-1 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors flex items-center gap-1 text-[10px] font-semibold"
                  title="View driving directions on Google Maps"
                >
                  <i data-lucide="navigation" class="w-3 h-3"></i>
                  <span class="hidden md:inline">Route</span>
                </a>
                <button 
                  class="btn-edit-act p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors print:hidden"
                  data-day="${dayNum}"
                  data-slot="${slotKey}"
                  data-title="${encodeURIComponent(slotData.title)}"
                  data-desc="${encodeURIComponent(slotData.description)}"
                  data-cost="${slotData.cost || ''}"
                  data-tag="${slotData.tag || ''}"
                  title="Edit activity details"
                >
                  <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                </button>
                <button 
                  class="btn-delete-act p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors print:hidden"
                  data-day="${dayNum}"
                  data-slot="${slotKey}"
                  title="Clear activity"
                >
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            ${slotData.description}
          </p>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const form = document.getElementById("itinerary-form");
    const slider = document.getElementById("itin-days-slider");
    const daysLabel = document.getElementById("label-days-count");
    const destSelect = document.getElementById("itin-dest-select");
    const styleSelect = document.getElementById("itin-style-select");

    if (slider && daysLabel) {
      slider.addEventListener("input", (e) => {
        this.daysCount = parseInt(e.target.value);
        daysLabel.textContent = `${this.daysCount} Day${this.daysCount > 1 ? "s" : ""}`;
      });
    }

    this.container.querySelectorAll(".interest-checkbox").forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const val = e.target.value;
        if (e.target.checked) {
          if (!this.selectedInterests.includes(val)) this.selectedInterests.push(val);
        } else {
          this.selectedInterests = this.selectedInterests.filter(i => i !== val);
        }
        this.updateInterestStyles();
      });
    });

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const destId = destSelect.value;
        const style = styleSelect.value;
        const destination = getDestinationById(destId);
        if (!destination) return;

        await this.handleGenerate({ destination, days: this.daysCount, travelStyle: style, interests: this.selectedInterests });
      });
    }

    this.bindActionButtons();
    this.setupEditModalEvents();
  }

  updateInterestStyles() {
    this.container.querySelectorAll("#interests-container label").forEach((label) => {
      const cb = label.querySelector(".interest-checkbox");
      const icon = label.querySelector("i");
      if (cb && cb.checked) {
        label.className = "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer text-xs font-medium transition-all bg-emerald-500/20 border-emerald-500 text-emerald-300";
        if (icon) icon.setAttribute("data-lucide", "check");
      } else if (label) {
        label.className = "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer text-xs font-medium transition-all bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700";
        if (icon) icon.setAttribute("data-lucide", "plus");
      }
    });
    if (window.lucide) window.lucide.createIcons();
  }

  async handleGenerate({ destination, days, travelStyle, interests }) {
    if (this.isGenerating) return;
    this.isGenerating = true;

    const btn = document.getElementById("btn-generate-itinerary");
    const display = document.getElementById("itinerary-display-container");

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <span class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
        <span>Synthesizing ${days}-Day Itinerary with AI...</span>
      `;
    }

    if (display) {
      display.innerHTML = `
        <div class="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 text-slate-950 shadow-xl shadow-emerald-500/20 animate-pulse">
            <i data-lucide="sparkles" class="w-8 h-8"></i>
          </div>
          <h4 class="text-xl font-bold text-white mb-2">Analyzing Travel Routes & Recommendations</h4>
          <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Structuring optimal morning, afternoon, and evening timelines for <b>${destination.name}</b>...
          </p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }

    try {
      const userOrigin = geoService.getUserLocation()?.city || "";
      const result = await geminiService.generateItinerary({ destination, days, travelStyle, interests, originCity: userOrigin });

      itineraryService.saveItinerary(result.itinerary);
      this.currentItinerary = result.itinerary;

      if (display) {
        display.innerHTML = this.renderItineraryPlan(result.itinerary);
        this.bindActionButtons();
      }
    } catch (err) {
      console.error("Itinerary generation error:", err);
      if (display) {
        display.innerHTML = `
          <div class="text-center py-12 bg-red-950/20 border border-red-800/40 rounded-2xl p-6 text-red-300">
            <p class="font-bold mb-2">Unable to generate itinerary.</p>
            <p class="text-xs">Please try again or select different criteria.</p>
          </div>
        `;
      }
    } finally {
      this.isGenerating = false;
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `
          <i data-lucide="wand-2" class="w-4 h-4 text-slate-950"></i>
          <span>Generate Day-by-Day Plan</span>
        `;
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }


  getMultiStopGoogleMapsUrl(day, it) {
    const dest = it?.destination || "";
    const origin = encodeURIComponent(`${day.morning?.title || 'Morning'} ${dest}`);
    const destination = encodeURIComponent(`${day.evening?.title || 'Evening'} ${dest}`);
    const waypoints = encodeURIComponent(`${day.afternoon?.title || 'Afternoon'} ${dest}`);
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=transit`;
  }

  toggleDayRouteMap(dayNum, btn) {
    const drawer = document.getElementById(`day-map-drawer-${dayNum}`);
    if (!drawer) return;
    const isHidden = drawer.classList.contains("hidden");
    const label = btn.querySelector(".day-map-label");

    if (isHidden) {
      drawer.classList.remove("hidden");
      if (label) label.textContent = "Hide Route Map";
      btn.classList.add("bg-emerald-500", "text-slate-950");
      btn.classList.remove("bg-slate-800/90", "text-emerald-400");
      this.initDayRouteMap(dayNum);
    } else {
      drawer.classList.add("hidden");
      if (label) label.textContent = "Interactive Day Route Map";
      btn.classList.remove("bg-emerald-500", "text-slate-950");
      btn.classList.add("bg-slate-800/90", "text-emerald-400");
    }
  }

  initDayRouteMap(dayNum) {
    if (!this.currentItinerary || !window.L) return;
    const day = this.currentItinerary.days.find(d => d.dayNumber === dayNum);
    if (!day) return;

    this.dayRouteMaps = this.dayRouteMaps || {};
    const mapContainer = document.getElementById(`day-route-map-${dayNum}`);
    if (!mapContainer) return;

    if (this.dayRouteMaps[dayNum]) {
      setTimeout(() => this.dayRouteMaps[dayNum].invalidateSize(), 150);
      return;
    }

    const destName = (this.currentItinerary.destination || "").toLowerCase();
    const allDests = [
      ...DESTINATIONS,
      ...Array.from(SEARCHED_DESTINATIONS.values()),
      ...Object.values(INDIAN_STATES_REGISTRY || {})
    ];
    const targetDest = allDests.find(d =>
      destName.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(destName) || d.id === this.selectedDestId
    ) || DESTINATIONS[0];

    const baseLat = targetDest?.coordinates?.lat || 35.0116;
    const baseLng = targetDest?.coordinates?.lng || 135.7681;

    const resolveCoords = (slotData, index) => {
      if (!slotData) return { lat: baseLat, lng: baseLng };
      const titleLower = (slotData.title || "").toLowerCase();
      if (targetDest && targetDest.famousPlaces) {
        const found = targetDest.famousPlaces.find(p =>
          titleLower.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(titleLower)
        );
        if (found && found.coordinates) return found.coordinates;
      }
      const angle = (dayNum * 45 + index * 110) * (Math.PI / 180);
      const radius = 0.012 + (index * 0.008);
      return {
        lat: baseLat + Math.sin(angle) * radius,
        lng: baseLng + Math.cos(angle) * radius
      };
    };

    const stop1 = { ...resolveCoords(day.morning, 0), title: day.morning?.title || "Morning Discovery", time: "Morning", color: "bg-amber-400 text-slate-950" };
    const stop2 = { ...resolveCoords(day.afternoon, 1), title: day.afternoon?.title || "Afternoon Exploration", time: "Afternoon", color: "bg-cyan-400 text-slate-950" };
    const stop3 = { ...resolveCoords(day.evening, 2), title: day.evening?.title || "Evening Culture", time: "Evening", color: "bg-purple-400 text-white" };

    const stops = [stop1, stop2, stop3];
    const latlngs = stops.map(s => [s.lat, s.lng]);

    const map = window.L.map(mapContainer, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false
    }).setView([baseLat, baseLng], 13);

    window.L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    const polyline = window.L.polyline(latlngs, {
      color: "#10b981",
      weight: 4,
      opacity: 0.85,
      dashArray: "6, 8",
      lineCap: "round",
      lineJoin: "round"
    }).addTo(map);

    stops.forEach((stop, idx) => {
      const pinIcon = window.L.divIcon({
        className: "custom-route-stop-pin",
        html: `<div class="w-7 h-7 rounded-full ${stop.color} font-black text-xs flex items-center justify-center border-2 border-white shadow-xl ring-2 ring-slate-950 scale-100 hover:scale-125 transition-transform cursor-pointer">${idx + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = window.L.marker([stop.lat, stop.lng], { icon: pinIcon }).addTo(map);
      marker.bindPopup(`
        <div class="p-2 text-xs font-sans text-slate-900">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Stop ${idx + 1} · ${stop.time}</span>
          <h5 class="font-bold text-slate-950 text-sm mb-1">${stop.title}</h5>
          <span class="text-[11px] text-emerald-600 font-semibold block">Day ${dayNum} Sequence</span>
        </div>
      `);
    });

    map.fitBounds(polyline.getBounds().pad(0.35));
    this.dayRouteMaps[dayNum] = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 180);
  }

  bindActionButtons() {
    const printBtn = document.getElementById("btn-print-itinerary");
    const copyBtn = document.getElementById("btn-copy-itinerary");
    const exportBtn = document.getElementById("btn-export-json");
    const copyText = document.getElementById("copy-btn-text");

    if (printBtn) printBtn.addEventListener("click", () => itineraryService.triggerPrint());

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await itineraryService.copyAsMarkdown();
          if (copyText) {
            copyText.textContent = "Copied!";
            setTimeout(() => { copyText.textContent = "Copy Text"; }, 2000);
          }
        } catch {
          alert("Could not copy to clipboard.");
        }
      });
    }

    if (exportBtn) exportBtn.addEventListener("click", () => itineraryService.exportAsJson());

    // Day Route Map Drawer Toggles (Recommendation 3)
    this.container.querySelectorAll(".btn-toggle-day-map").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dayNum = parseInt(btn.getAttribute("data-day"));
        this.toggleDayRouteMap(dayNum, btn);
      });
    });

    // Checkbox toggling
    this.container.querySelectorAll(".activity-checkbox").forEach((btn) => {
      btn.addEventListener("click", () => {
        const day = btn.getAttribute("data-day");
        const slot = btn.getAttribute("data-slot");
        itineraryService.toggleActivityCheck(day, slot);
        if (this.currentItinerary) {
          const display = document.getElementById("itinerary-display-container");
          if (display) {
            display.innerHTML = this.renderItineraryPlan(this.currentItinerary);
            this.bindActionButtons();
            if (window.lucide) window.lucide.createIcons();
          }
        }
      });
    });

    // Activity Edit Button
    this.container.querySelectorAll(".btn-edit-act").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dayNum = btn.getAttribute("data-day");
        const slotKey = btn.getAttribute("data-slot");
        const title = decodeURIComponent(btn.getAttribute("data-title") || "");
        const desc = decodeURIComponent(btn.getAttribute("data-desc") || "");
        const cost = btn.getAttribute("data-cost") || "";
        const tag = btn.getAttribute("data-tag") || "";

        this.openEditModal(dayNum, slotKey, title, desc, cost, tag);
      });
    });

    // Activity Delete Button
    this.container.querySelectorAll(".btn-delete-act").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dayNum = btn.getAttribute("data-day");
        const slotKey = btn.getAttribute("data-slot");
        if (confirm("Reset this activity to Free Time?")) {
          itineraryService.deleteActivity(dayNum, slotKey);
          this.currentItinerary = itineraryService.getCurrentItinerary();
          const display = document.getElementById("itinerary-display-container");
          if (display && this.currentItinerary) {
            display.innerHTML = this.renderItineraryPlan(this.currentItinerary);
            this.bindActionButtons();
            if (window.lucide) window.lucide.createIcons();
          }
        }
      });
    });
  }

  setupEditModalEvents() {
    const modal = document.getElementById("activity-edit-modal");
    const cancelBtn = document.getElementById("btn-cancel-edit-act");
    const form = document.getElementById("form-edit-activity");

    if (cancelBtn && modal) {
      cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }

    if (form && modal) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const dayNum = document.getElementById("edit-day-num").value;
        const slotKey = document.getElementById("edit-slot-key").value;
        const title = document.getElementById("edit-act-title").value;
        const desc = document.getElementById("edit-act-desc").value;
        const cost = document.getElementById("edit-act-cost").value;
        const tag = document.getElementById("edit-act-tag").value;

        itineraryService.updateActivity(dayNum, slotKey, title, desc, cost, tag);
        this.currentItinerary = itineraryService.getCurrentItinerary();

        modal.classList.add("hidden");
        const display = document.getElementById("itinerary-display-container");
        if (display && this.currentItinerary) {
          display.innerHTML = this.renderItineraryPlan(this.currentItinerary);
          this.bindActionButtons();
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }
  }

  openEditModal(dayNum, slotKey, title, desc, cost, tag) {
    const modal = document.getElementById("activity-edit-modal");
    if (!modal) return;

    document.getElementById("edit-day-num").value = dayNum;
    document.getElementById("edit-slot-key").value = slotKey;
    document.getElementById("edit-act-title").value = title;
    document.getElementById("edit-act-desc").value = desc;
    document.getElementById("edit-act-cost").value = cost;
    document.getElementById("edit-act-tag").value = tag;

    modal.classList.remove("hidden");
  }
}
