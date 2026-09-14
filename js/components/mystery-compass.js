// Mystery Trip Compass Component
// Gamified spontaneous travel discovery with an animated celestial brass compass,
// realistic deceleration physics, procedural audio ticks, and curated destination reveal.

import { DESTINATIONS } from "../destinations-data.js";
import { geoService } from "../services/geo-service.js";
import { weatherService } from "../services/weather-service.js";

export class MysteryCompass {
  constructor(containerId = "mystery-compass-container") {
    this.container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
    this.isOpen = false;
    this.isSpinning = false;
    this.selectedVibe = "all";
    this.selectedRegion = "all";
    this.currentRotation = 0;
    this.selectedDestination = null;
    this.audioCtx = null;

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.bindGlobalEvents();
  }

  playTickSound() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800 + Math.random() * 200, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.03);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playWinChime() {
    try {
      if (!this.audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime + idx * 0.08);
        osc.stop(this.audioCtx.currentTime + idx * 0.08 + 0.4);
      });
    } catch (e) {}
  }

  getFilteredDestinations() {
    return DESTINATIONS.filter((d) => {
      // Vibe matching
      if (this.selectedVibe !== "all") {
        if (this.selectedVibe === "budget" && d.budget !== "$" && d.budgetDailyEstimate > 110) return false;
        if (this.selectedVibe === "beach" && !d.vibes?.some((v) => /beach|tropical|coastal|island/i.test(v))) return false;
        if (this.selectedVibe === "mountain" && !d.vibes?.some((v) => /mountain|alpine|nature|trek/i.test(v))) return false;
        if (this.selectedVibe === "culture" && !d.vibes?.some((v) => /culture|history|heritage|spiritual/i.test(v))) return false;
        if (this.selectedVibe === "city" && !d.vibes?.some((v) => /metropolis|city|skyline|modern/i.test(v))) return false;
      }
      // Region matching
      if (this.selectedRegion !== "all" && d.continent !== this.selectedRegion) {
        return false;
      }
      return true;
    });
  }

  open() {
    if (!document.getElementById("mystery-compass-modal")) {
      this.render();
      this.bindEvents();
    }
    this.isOpen = true;
    this.isSpinning = false;
    this.selectedDestination = null;

    const resultCard = document.getElementById("compass-result-card");
    if (resultCard) {
      resultCard.innerHTML = "";
      resultCard.classList.add("hidden");
    }

    const spinBtn = document.getElementById("btn-trigger-spin");
    if (spinBtn) {
      spinBtn.disabled = false;
      spinBtn.innerHTML = `
        <i data-lucide="compass" class="w-5 h-5 text-slate-950"></i>
        <span>Spin the Compass</span>
      `;
    }

    document.body.classList.add("overflow-hidden");
    const modal = document.getElementById("mystery-compass-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
    if (window.lucide) window.lucide.createIcons();
  }

  close() {
    this.isOpen = false;
    this.isSpinning = false;
    document.body.classList.remove("overflow-hidden");
    const modal = document.getElementById("mystery-compass-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  }

  spin() {
    if (this.isSpinning) return;

    const candidates = this.getFilteredDestinations();
    if (candidates.length === 0) {
      alert("No destinations match this filter combination! Please broaden your filters.");
      return;
    }

    this.isSpinning = true;
    this.selectedDestination = null;

    // Reset winner card view
    const resultCard = document.getElementById("compass-result-card");
    if (resultCard) resultCard.classList.add("hidden");

    // Random destination pick
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    this.selectedDestination = winner;

    // Physics rotation calculation
    const extraSpins = 4 + Math.floor(Math.random() * 3); // 4 to 6 full turns
    const targetDeg = Math.floor(Math.random() * 360);
    const totalRotation = this.currentRotation + extraSpins * 360 + targetDeg;
    this.currentRotation = totalRotation;

    const needleEl = document.getElementById("compass-needle-group");
    const spinBtn = document.getElementById("btn-trigger-spin");

    if (spinBtn) {
      spinBtn.disabled = true;
      spinBtn.innerHTML = `
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i>
        <span>Exploring the Cosmos...</span>
      `;
      if (window.lucide) window.lucide.createIcons();
    }

    if (needleEl) {
      needleEl.style.transition = "transform 4.5s cubic-bezier(0.12, 0.95, 0.22, 1)";
      needleEl.style.transform = `rotate(${totalRotation}deg)`;
    }

    // Sound ticks that decelerate alongside needle
    let tickCount = 0;
    const maxTicks = 24;
    const playNextTick = () => {
      if (tickCount < maxTicks && this.isSpinning) {
        this.playTickSound();
        tickCount++;
        // Quadratic slowdown
        const delay = 60 + Math.pow(tickCount / maxTicks, 2.5) * 360;
        setTimeout(playNextTick, delay);
      }
    };
    playNextTick();

    // After deceleration completes
    setTimeout(() => {
      this.isSpinning = false;
      this.playWinChime();
      this.revealWinner(winner);

      if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.innerHTML = `
          <i data-lucide="compass" class="w-5 h-5 text-amber-300"></i>
          <span>Spin Again</span>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    }, 4600);
  }

  revealWinner(dest) {
    const resultCard = document.getElementById("compass-result-card");
    if (!resultCard) return;

    const dist = typeof geoService?.getDistanceToDestination === "function" ? geoService.getDistanceToDestination(dest.coordinates) : null;
    const weather = (typeof weatherService?.getCachedWeather === "function") ? weatherService.getCachedWeather(dest) : null;
    const tempText = weather?.temperatureC !== undefined ? `${weatherService.toDisplayTemp(weather.temperatureC)} · ${weather.condition || "Pleasant"}` : "Live Weather Ready";

    resultCard.innerHTML = `
      <div class="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-amber-500/40 shadow-2xl animate-in zoom-in-95 duration-300">
        <div class="flex flex-col md:flex-row gap-5 items-center">
          <!-- Thumbnail Image -->
          <div class="relative w-full md:w-48 h-36 rounded-xl overflow-hidden shrink-0 border border-slate-700/80 shadow-lg group">
            <img 
              src="${dest.heroImage}" 
              alt="${dest.name}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';"
            />
            <div class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-[10px] font-bold text-amber-400">
              ${dest.continent}
            </div>
          </div>

          <!-- Destination Details -->
          <div class="flex-1 text-left w-full">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-semibold uppercase tracking-wider text-amber-400">
                ✨ Destiny Beckons You To
              </span>
              <span class="text-xs text-slate-400 flex items-center gap-1">
                <i data-lucide="star" class="w-3.5 h-3.5 text-amber-400 fill-amber-400"></i>
                <b class="text-white">${dest.rating || 4.9}</b>
              </span>
            </div>

            <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              ${dest.name}, <span class="text-slate-400 font-medium">${dest.country}</span>
            </h3>

            <p class="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-1 mb-3">
              ${dest.tagline || dest.description || "An extraordinary place waiting for your footprint."}
            </p>

            <!-- Metrics Pills -->
            <div class="flex flex-wrap items-center gap-2 mb-4 text-xs">
              <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                <i data-lucide="cloud-sun" class="w-3.5 h-3.5 text-sky-400"></i>
                ${tempText}
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                <i data-lucide="navigation" class="w-3.5 h-3.5 text-emerald-400"></i>
                ${dist ? `${dist.km.toLocaleString()} km away` : "Calculated on Map"}
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                <i data-lucide="wallet" class="w-3.5 h-3.5 text-amber-400"></i>
                ${dest.budget || "$$"} · ~${dest.budgetDailyEstimate || 120}/day
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center gap-3">
              <button 
                id="btn-compass-view-dest" 
                data-id="${dest.id}"
                class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <i data-lucide="compass" class="w-4 h-4"></i>
                Explore ${dest.name}
              </button>

              <button 
                id="btn-compass-postcard" 
                data-id="${dest.id}"
                class="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs sm:text-sm border border-cyan-500/40 transition-all flex items-center gap-2"
              >
                <i data-lucide="mail" class="w-4 h-4 text-cyan-300"></i>
                3D Postcard
              </button>

              <button 
                id="btn-compass-plan-ai" 
                data-id="${dest.id}"
                class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
                Plan Itinerary
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    resultCard.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();

    // Bind action clicks
    const viewBtn = resultCard.querySelector("#btn-compass-view-dest");
    if (viewBtn) {
      viewBtn.addEventListener("click", () => {
        this.close();
        window.location.hash = `#destination/${dest.id}`;
      });
    }

    const postcardBtn = resultCard.querySelector("#btn-compass-postcard");
    if (postcardBtn) {
      postcardBtn.addEventListener("click", () => {
        this.close();
        window.dispatchEvent(new CustomEvent("voyage:open-postcard", { detail: { destination: dest } }));
      });
    }

    const planBtn = resultCard.querySelector("#btn-compass-plan-ai");
    if (planBtn) {
      planBtn.addEventListener("click", () => {
        this.close();
        window.location.hash = `#itinerary?dest=${dest.id}`;
      });
    }
  }

  render() {
    this.container.innerHTML = `
      <div 
        id="mystery-compass-modal" 
        class="hidden fixed inset-0 z-50 items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      >
        <div class="relative w-full max-w-3xl my-8 bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
          
          <!-- Close Button -->
          <button 
            id="btn-close-compass" 
            class="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close Mystery Compass"
          >
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <!-- Header Badge & Title -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            Serendipitous Discovery
          </div>

          <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Spin the Compass of Destiny
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
            Let the ancient celestial needle chart your next voyage. Pick your vibe or leave it entirely to fate!
          </p>

          <!-- Filter Pills Toolbar -->
          <div class="w-full max-w-xl mb-6 space-y-2.5">
            <!-- Vibe Presets -->
            <div class="flex flex-wrap items-center justify-center gap-1.5" id="compass-vibe-filters">
              <button data-vibe="all" class="compass-vibe-pill px-3 py-1 rounded-full text-xs font-semibold transition-all ${this.selectedVibe === 'all' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                ✨ Any Vibe
              </button>
              <button data-vibe="beach" class="compass-vibe-pill px-3 py-1 rounded-full text-xs font-semibold transition-all ${this.selectedVibe === 'beach' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                🏖️ Tropical
              </button>
              <button data-vibe="mountain" class="compass-vibe-pill px-3 py-1 rounded-full text-xs font-semibold transition-all ${this.selectedVibe === 'mountain' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                ⛰️ Alpine
              </button>
              <button data-vibe="culture" class="compass-vibe-pill px-3 py-1 rounded-full text-xs font-semibold transition-all ${this.selectedVibe === 'culture' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                🏛️ Heritage
              </button>
              <button data-vibe="city" class="compass-vibe-pill px-3 py-1 rounded-full text-xs font-semibold transition-all ${this.selectedVibe === 'city' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                🌆 Metropolis
              </button>
              <button data-vibe="budget" class="compass-vibe-pill px-3 py-1 rounded-full text-xs font-semibold transition-all ${this.selectedVibe === 'budget' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
                💰 Budget Friendly
              </button>
            </div>
          </div>

          <!-- Compass Physical Instrument Mount -->
          <div class="relative w-64 h-64 sm:w-72 sm:h-72 my-4 select-none">
            <!-- Brass Outer Ring Bezel -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-b from-amber-400/30 via-slate-900 to-amber-600/30 p-1.5 shadow-[0_0_35px_rgba(245,158,11,0.25)]">
              <!-- Dark Inner Basin -->
              <div class="w-full h-full rounded-full bg-slate-950 border-2 border-amber-500/50 relative overflow-hidden flex items-center justify-center">
                
                <!-- Astrolabe Ticks & Markings SVG -->
                <svg class="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="92" fill="none" stroke="#f59e0b" stroke-width="0.75" stroke-dasharray="2 3"/>
                  <circle cx="100" cy="100" r="76" fill="none" stroke="#f59e0b" stroke-width="0.5" stroke-opacity="0.4"/>
                  <!-- Cardinal Rays -->
                  <line x1="100" y1="10" x2="100" y2="190" stroke="#f59e0b" stroke-width="0.8" stroke-opacity="0.3"/>
                  <line x1="10" y1="100" x2="190" y2="100" stroke="#f59e0b" stroke-width="0.8" stroke-opacity="0.3"/>
                  <line x1="36" y1="36" x2="164" y2="164" stroke="#f59e0b" stroke-width="0.5" stroke-opacity="0.2"/>
                  <line x1="164" y1="36" x2="36" y2="164" stroke="#f59e0b" stroke-width="0.5" stroke-opacity="0.2"/>
                </svg>

                <!-- Cardinal Direction Labels -->
                <span class="absolute top-2.5 font-mono text-xs font-black text-amber-400 tracking-wider">N</span>
                <span class="absolute bottom-2.5 font-mono text-xs font-black text-amber-400 tracking-wider">S</span>
                <span class="absolute right-3 font-mono text-xs font-black text-amber-400 tracking-wider">E</span>
                <span class="absolute left-3 font-mono text-xs font-black text-amber-400 tracking-wider">W</span>

                <!-- Rotating Needle Assembly -->
                <div 
                  id="compass-needle-group" 
                  class="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out pointer-events-none"
                >
                  <!-- North Needle (Crimson Gold) -->
                  <div class="absolute top-7 w-4 h-24 bg-gradient-to-b from-rose-500 via-amber-400 to-amber-500 [clip-path:polygon(50%_0%,100%_100%,50%_80%,0%_100%)] drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                  <!-- South Needle (Slate Ivory) -->
                  <div class="absolute bottom-7 w-4 h-24 bg-gradient-to-t from-slate-400 via-slate-200 to-white [clip-path:polygon(50%_0%,100%_100%,50%_80%,0%_100%)] opacity-80"></div>
                  <!-- Pivot Jewel -->
                  <div class="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border-2 border-slate-950 shadow-xl flex items-center justify-center">
                    <div class="w-3 h-3 rounded-full bg-rose-500 animate-ping opacity-75"></div>
                    <div class="absolute w-3 h-3 rounded-full bg-rose-600"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Spin Action Button -->
          <button 
            id="btn-trigger-spin" 
            class="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 my-3"
          >
            <i data-lucide="compass" class="w-5 h-5 text-slate-950"></i>
            <span>Spin the Compass</span>
          </button>

          <!-- Winner Reveal Mount -->
          <div id="compass-result-card" class="w-full mt-4 hidden"></div>

        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents() {
    // Backdrop click & close button
    const modal = document.getElementById("mystery-compass-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.close();
      });
    }

    const closeBtn = document.getElementById("btn-close-compass");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // Vibe filter pills
    const vibeContainer = document.getElementById("compass-vibe-filters");
    if (vibeContainer) {
      vibeContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".compass-vibe-pill");
        if (!btn) return;
        this.selectedVibe = btn.dataset.vibe || "all";
        vibeContainer.querySelectorAll(".compass-vibe-pill").forEach((b) => {
          b.className = "compass-vibe-pill px-3 py-1 rounded-full text-xs font-semibold transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer";
        });
        btn.className = "compass-vibe-pill px-3 py-1 rounded-full text-xs font-semibold transition-all bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 cursor-pointer";
      });
    }

    // Spin button
    const spinBtn = document.getElementById("btn-trigger-spin");
    if (spinBtn) {
      spinBtn.addEventListener("click", () => this.spin());
    }
  }

  bindGlobalEvents() {
    // Keyboard Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) this.close();
    });

    // Global event listener
    window.addEventListener("voyage:open-compass", () => this.open());
  }
}
