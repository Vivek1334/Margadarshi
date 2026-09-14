// 3D Interactive Virtual Travel Postcard Creator Component
// Allows travelers to design, customize, 3D-flip, and download high-resolution digital postcards
// with authentic vintage postmarks, live weather stamps, handwritten notes, and airmail styling.

import { DESTINATIONS, getDestinationById } from "../destinations-data.js";
import { weatherService } from "../services/weather-service.js";

export class PostcardModal {
  constructor(containerId = "postcard-modal-container") {
    this.container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
    this.currentDest = DESTINATIONS[0];
    this.selectedPhoto = this.currentDest.heroImage;
    this.isFlipped = false;
    this.fontFamily = "script"; // 'script' | 'serif' | 'sans'
    this.senderName = "A Fellow Wanderer";
    this.recipientName = "Travel Lover";
    this.message = `Wish you were here! Wandering through the magical streets of ${this.currentDest.name}, soaking in the vibrant culture, breathtaking views, and unforgettable moments. Sending you warm memories from across the world!`;

    this.presets = {
      adventure: `Exploring the hidden trails, ancient landmarks, and wild horizons of ${this.currentDest.name}! Every corner here tells a thrilling story. Can't wait to tell you all about it when I return!`,
      romantic: `The sunset over ${this.currentDest.name} tonight was pure poetry. Thinking of you as the city lights shimmer into life. Sending you love across the miles!`,
      foodie: `Just tasted the most incredible regional delicacies here in ${this.currentDest.name}! The flavors, aromas, and street markets are truly out of this world. You would absolutely love it here!`,
      serendipity: `Lost in the beauty of ${this.currentDest.name}. No maps, no rush—just pure wanderlust and unforgettable memories. The world is so much bigger than we imagine!`
    };

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.bindGlobalEvents();
  }

  open(destinationOrId) {
    if (typeof destinationOrId === "string") {
      this.currentDest = getDestinationById(destinationOrId) || DESTINATIONS[0];
    } else if (destinationOrId && typeof destinationOrId === "object") {
      this.currentDest = destinationOrId;
    }
    if (!this.currentDest) {
      this.currentDest = DESTINATIONS[0];
    }

    this.selectedPhoto = this.currentDest.heroImage;
    this.isFlipped = false;
    this.message = `Wish you were here! Wandering through the magical sights of ${this.currentDest.name}, soaking in the vibrant atmosphere, breathtaking views, and unforgettable moments. Sending you warm memories from afar!`;

    this.render();
    this.bindEvents();

    document.body.classList.add("overflow-hidden");
    const modal = document.getElementById("postcard-creator-modal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  }

  close() {
    document.body.classList.remove("overflow-hidden");
    const modal = document.getElementById("postcard-creator-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    const cardEl = document.getElementById("postcard-3d-card");
    if (cardEl) {
      if (this.isFlipped) {
        cardEl.classList.add("is-flipped");
      } else {
        cardEl.classList.remove("is-flipped");
      }
    }
  }

  downloadPostcard() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    const weather = (typeof weatherService?.getCachedWeather === "function") ? weatherService.getCachedWeather(this.currentDest) : null;
    const tempText = weather?.temperatureC !== undefined ? `${Math.round(weather.temperatureC)}°C ${weather.condition || "Pleasant"}` : "MILD WEATHER";
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();

    // If card is currently showing the back, export the vintage back side; otherwise front!
    if (this.isFlipped) {
      // --- RENDER VINTAGE BACK SIDE ---
      // Vintage Paper Base
      ctx.fillStyle = "#fbf8ef";
      ctx.fillRect(0, 0, 1200, 800);

      // Card border
      ctx.strokeStyle = "#e5dfce";
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, 1186, 786);

      // Airmail top-left banner
      ctx.fillStyle = "#1e3a8a";
      ctx.fillRect(40, 40, 260, 36);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PAR AVION · VIA AIR MAIL", 170, 64);

      // Airmail red/blue accent stripes
      const stripeW = 20;
      for (let s = 0; s < 260; s += stripeW * 2) {
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(40 + s, 76, stripeW, 6);
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(40 + s + stripeW, 76, stripeW, 6);
      }

      // Vertical Divider
      ctx.strokeStyle = "#d1c7b7";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(600, 50);
      ctx.lineTo(600, 750);
      ctx.stroke();
      ctx.setLineDash([]);

      // Left Column: Message
      ctx.fillStyle = "#1e293b";
      ctx.font = "italic 24px Georgia, serif";
      ctx.textAlign = "left";

      // Wrap text in left column
      const words = this.message.split(" ");
      let line = "";
      let y = 140;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 500 && n > 0) {
          ctx.fillText(line, 60, y);
          line = words[n] + " ";
          y += 36;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 60, y);

      // Sign-off
      ctx.font = "bold 20px Georgia, serif";
      ctx.fillText(`With love,`, 60, y + 60);
      ctx.font = "italic 22px Georgia, serif";
      ctx.fillText(this.senderName, 60, y + 90);

      // Right Column: Stamp & Postmark
      // Postal Stamp Box
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(980, 50, 160, 200);
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 4;
      ctx.strokeRect(980, 50, 160, 200);

      ctx.fillStyle = "#854d0e";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("AIR POSTAGE", 1060, 75);
      ctx.font = "bold 26px serif";
      ctx.fillText("✈ $1.50", 1060, 140);
      ctx.font = "12px monospace";
      ctx.fillText(this.currentDest.country.toUpperCase(), 1060, 225);

      // Circular Postmark Cancellation Stamp
      ctx.save();
      ctx.translate(920, 160);
      ctx.rotate(-0.15);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = "bold 11px monospace";
      ctx.fillStyle = "#334155";
      ctx.textAlign = "center";
      ctx.fillText(this.currentDest.name.toUpperCase(), 0, -35);
      ctx.font = "bold 13px monospace";
      ctx.fillText(dateStr, 0, 0);
      ctx.font = "10px monospace";
      ctx.fillText(tempText.toUpperCase(), 0, 35);
      ctx.restore();

      // Recipient Address Lines
      ctx.fillStyle = "#334155";
      ctx.font = "20px Georgia, serif";
      ctx.fillText(`To: ${this.recipientName}`, 640, 380);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.5;
      [420, 480, 540, 600].forEach((ly) => {
        ctx.beginPath();
        ctx.moveTo(640, ly);
        ctx.lineTo(1120, ly);
        ctx.stroke();
      });

      // MargaDarshi Authenticity Seal
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("MargaDarshi Digital Heritage Series · Certified Authentic Travel Card", 640, 720);

      this.saveCanvasAsImage(canvas, `${this.currentDest.name.toLowerCase()}-postcard-back.png`);
    } else {
      // --- RENDER FRONT SCENIC SIDE ---
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Draw photo cover
        ctx.drawImage(img, 0, 0, 1200, 800);

        // Dark gradient overlay for text readability
        const grad = ctx.createLinearGradient(0, 400, 0, 800);
        grad.addColorStop(0, "rgba(2, 6, 23, 0)");
        grad.addColorStop(1, "rgba(2, 6, 23, 0.92)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 400, 1200, 400);

        // Gold border frame
        ctx.strokeStyle = "rgba(251, 191, 36, 0.65)";
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, 1160, 760);

        // Golden Cursive Script "Greetings from"
        ctx.fillStyle = "#fbbf24";
        ctx.font = "italic 36px Georgia, serif";
        ctx.textAlign = "left";
        ctx.fillText("Greetings from...", 60, 660);

        // Bold Destination Title
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 68px 'Outfit', sans-serif";
        ctx.fillText(`${this.currentDest.name.toUpperCase()}`, 60, 730);

        // Coordinates & Tagline
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "right";
        ctx.fillText(`${this.currentDest.coordinates.lat.toFixed(2)}°N, ${this.currentDest.coordinates.lng.toFixed(2)}°E · ${this.currentDest.country.toUpperCase()}`, 1140, 730);

        this.saveCanvasAsImage(canvas, `${this.currentDest.name.toLowerCase()}-postcard-front.png`);
      };

      img.onerror = () => {
        // Fallback procedural rendering if CORS image fails
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, 1200, 800);
        ctx.fillStyle = "#fbbf24";
        ctx.font = "italic 42px Georgia, serif";
        ctx.fillText("Greetings from...", 80, 360);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 78px 'Outfit', sans-serif";
        ctx.fillText(`${this.currentDest.name.toUpperCase()}, ${this.currentDest.country.toUpperCase()}`, 80, 460);
        this.saveCanvasAsImage(canvas, `${this.currentDest.name.toLowerCase()}-postcard-front.png`);
      };

      img.src = this.selectedPhoto;
    }
  }

  saveCanvasAsImage(canvas, filename) {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  copyShareLink() {
    const url = `${window.location.origin}${window.location.pathname}#destination/${this.currentDest.id}`;
    const shareText = `💌 Here is a postcard from ${this.currentDest.name}, ${this.currentDest.country} on MargaDarshi! Explore the journey: ${url}`;

    navigator.clipboard.writeText(shareText).then(() => {
      const copyBtn = document.getElementById("btn-copy-postcard-link");
      if (copyBtn) {
        copyBtn.innerHTML = `
          <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
          <span class="text-emerald-400 font-bold">Copied to Clipboard!</span>
        `;
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          copyBtn.innerHTML = `
            <i data-lucide="share-2" class="w-4 h-4 text-slate-300"></i>
            <span>Share Postcard</span>
          `;
          if (window.lucide) window.lucide.createIcons();
        }, 2500);
      }
    });
  }

  render() {
    const dest = this.currentDest || DESTINATIONS[0];
    const weather = (typeof weatherService?.getCachedWeather === "function") ? weatherService.getCachedWeather(dest) : null;
    const tempText = weather?.temperatureC !== undefined ? `${Math.round(weather.temperatureC)}°C ${weather.condition || "Clear"}` : "Live Weather";
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();

    // Available photos from famous places
    const photos = [
      dest.heroImage,
      ...(dest.famousPlaces || []).map((p) => p.image).filter(Boolean)
    ].slice(0, 4);

    this.container.innerHTML = `
      <div 
        id="postcard-creator-modal" 
        class="hidden fixed inset-0 z-50 items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      >
        <div class="relative w-full max-w-4xl my-auto bg-slate-900/95 border border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl flex flex-col">
          
          <!-- Header Bar -->
          <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <i data-lucide="mail" class="w-5 h-5"></i>
              </div>
              <div>
                <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                  Virtual Travel Postcard · ${dest.name}
                </h2>
                <span class="text-xs text-slate-400 mt-1 block">
                  3D Interactive Digital Card · Customize, Flip & Export
                </span>
              </div>
            </div>

            <button 
              id="btn-close-postcard" 
              class="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Postcard Creator"
            >
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Main Layout: 3D Postcard Viewer (Top/Left) + Customization Controls (Bottom/Right) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <!-- 3D Card Perspective Stage (Col 7) -->
            <div class="lg:col-span-7 flex flex-col items-center">
              
              <!-- The 3D Flipping Card Container -->
              <div class="postcard-perspective-stage w-full max-w-[480px] aspect-[3/2] relative cursor-pointer group" id="postcard-click-flipper">
                <div id="postcard-3d-card" class="postcard-flipper-body w-full h-full relative transition-transform duration-700 ease-out [transform-style:preserve-3d]">
                  
                  <!-- ================= FRONT FACE ================= -->
                  <div class="postcard-face postcard-front-face absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400/40 select-none bg-slate-950 [backface-visibility:hidden]">
                    <img 
                      id="postcard-preview-photo"
                      src="${this.selectedPhoto}" 
                      alt="${dest.name}" 
                      class="w-full h-full object-cover"
                      onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';"
                    />
                    <!-- Vignette & Lighting Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40"></div>

                    <!-- Greeting Top Corner -->
                    <div class="absolute top-4 left-4">
                      <span class="font-serif italic text-base sm:text-lg text-amber-300 drop-shadow-md">
                        Greetings from...
                      </span>
                    </div>

                    <!-- Flip Card Hint Pill -->
                    <div class="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-slate-200 flex items-center gap-1.5 shadow-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <i data-lucide="refresh-cw" class="w-3 h-3"></i>
                      <span>Click to Flip ↺</span>
                    </div>

                    <!-- Grand Typography Bottom -->
                    <div class="absolute bottom-4 left-4 right-4 text-left">
                      <h3 class="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase drop-shadow-lg leading-none">
                        ${dest.name}
                      </h3>
                      <div class="flex items-center justify-between mt-1 text-slate-300 text-xs font-mono">
                        <span>${dest.country.toUpperCase()}</span>
                        <span>${dest.coordinates.lat.toFixed(2)}°N, ${dest.coordinates.lng.toFixed(2)}°E</span>
                      </div>
                    </div>
                  </div>

                  <!-- ================= BACK FACE ================= -->
                  <div class="postcard-face postcard-back-face absolute inset-0 w-full h-full rounded-2xl p-4 sm:p-5 shadow-2xl select-none bg-[#fbf8ee] text-slate-800 border-4 border-[#e6dfce] overflow-hidden flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    
                    <!-- Top Bar: Airmail & Stamp -->
                    <div class="flex items-start justify-between">
                      <!-- Airmail Label -->
                      <div class="flex flex-col">
                        <div class="px-2.5 py-0.5 bg-blue-900 text-white font-mono font-bold text-[9px] tracking-wider rounded-sm uppercase">
                          PAR AVION · VIA AIR MAIL
                        </div>
                        <div class="flex h-1 mt-0.5">
                          <div class="w-1/2 bg-red-600"></div>
                          <div class="w-1/2 bg-blue-600"></div>
                        </div>
                      </div>

                      <!-- Flip Back Hint -->
                      <div class="px-2 py-0.5 rounded-full bg-slate-800/10 text-[9px] font-bold text-slate-600 flex items-center gap-1">
                        <i data-lucide="refresh-cw" class="w-2.5 h-2.5"></i>
                        <span>Flip Front</span>
                      </div>

                      <!-- Postage Stamp & Postmark -->
                      <div class="flex items-center gap-2">
                        <!-- Postmark -->
                        <div class="w-16 h-16 rounded-full border-2 border-slate-600/70 p-1 flex flex-col items-center justify-center -rotate-12 select-none">
                          <span class="text-[7px] font-mono font-bold uppercase tracking-wider text-slate-700">${dest.name}</span>
                          <span class="text-[8px] font-mono font-black text-slate-900">${dateStr}</span>
                          <span class="text-[6.5px] font-mono text-slate-600">${tempText}</span>
                        </div>
                        <!-- Postage Stamp -->
                        <div class="w-12 h-16 bg-amber-100 border-2 border-dashed border-amber-600 rounded p-1 flex flex-col items-center justify-between text-center select-none shadow-sm">
                          <span class="text-[7px] font-bold font-mono text-amber-900">AIRMAIL</span>
                          <span class="text-sm">✈</span>
                          <span class="text-[8px] font-black font-mono text-amber-900">$1.50</span>
                        </div>
                      </div>
                    </div>

                    <!-- Middle Area: Divided Body -->
                    <div class="grid grid-cols-2 gap-3 my-2 flex-1 items-stretch">
                      <!-- Left: Handwritten Message -->
                      <div class="flex flex-col justify-between pr-2 border-r border-dashed border-slate-300 text-left">
                        <p id="postcard-preview-msg" class="text-xs sm:text-sm font-serif italic text-slate-800 leading-relaxed overflow-y-auto max-h-[140px]">
                          "${this.message}"
                        </p>
                        <div class="mt-2 text-[11px] font-serif">
                          <span class="italic text-slate-500">With love,</span><br/>
                          <b id="postcard-preview-sender" class="text-slate-900 font-bold">${this.senderName}</b>
                        </div>
                      </div>

                      <!-- Right: Address Lines -->
                      <div class="pl-2 flex flex-col justify-center space-y-3.5 text-left">
                        <div class="border-b border-slate-300 pb-1 text-xs font-serif">
                          <span class="text-[10px] text-slate-400 block font-mono">RECIPIENT:</span>
                          <b id="postcard-preview-recipient" class="text-slate-900">${this.recipientName}</b>
                        </div>
                        <div class="border-b border-slate-300 pb-1 text-[11px] font-mono text-slate-500">
                          Destination: ${dest.name}, ${dest.country}
                        </div>
                        <div class="border-b border-slate-300 pb-1 text-[11px] font-mono text-slate-500">
                          Coordinates: ${dest.coordinates.lat.toFixed(2)}°N, ${dest.coordinates.lng.toFixed(2)}°E
                        </div>
                      </div>
                    </div>

                    <!-- Bottom Bar: Serial & Branding -->
                    <div class="flex items-center justify-between pt-1 border-t border-slate-200 text-[8.5px] font-mono text-slate-500">
                      <span>MargaDarshi Vintage Series · No. ${Math.floor(1000 + Math.random() * 9000)}</span>
                      <span>Certified Heritage Postcard</span>
                    </div>

                  </div>

                </div>
              </div>

              <!-- Flip Action Helper -->
              <div class="flex items-center gap-3 mt-4">
                <button 
                  id="btn-trigger-flip-card"
                  class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2 border border-slate-700"
                >
                  <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-amber-400"></i>
                  <span>Flip Postcard (Front / Back)</span>
                </button>
              </div>

            </div>

            <!-- Customization Controls Panel (Col 5) -->
            <div class="lg:col-span-5 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col gap-4 text-left">
              
              <!-- 1. Photo Picker -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  1. Choose Landmark Cover Photo
                </label>
                <div class="grid grid-cols-4 gap-2" id="postcard-photos-list">
                  ${photos.map((src, i) => `
                    <button 
                      class="postcard-photo-btn relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${src === this.selectedPhoto ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-700 opacity-70 hover:opacity-100'}"
                      data-src="${src}"
                    >
                      <img src="${src}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';" />
                    </button>
                  `).join("")}
                </div>
              </div>

              <!-- 2. Message Presets -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  2. Choose or Write Your Message
                </label>
                <div class="grid grid-cols-2 gap-1.5 mb-2.5">
                  <button data-preset="adventure" class="postcard-preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition-colors text-left truncate">
                    ⛰️ Adventure
                  </button>
                  <button data-preset="romantic" class="postcard-preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition-colors text-left truncate">
                    🌅 Romantic
                  </button>
                  <button data-preset="foodie" class="postcard-preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition-colors text-left truncate">
                    🍜 Culinary
                  </button>
                  <button data-preset="serendipity" class="postcard-preset-btn px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition-colors text-left truncate">
                    ✨ Wanderlust
                  </button>
                </div>
                <textarea 
                  id="postcard-input-message"
                  rows="3"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="Type your personal travel note..."
                >${this.message}</textarea>
              </div>

              <!-- 3. Sender & Recipient -->
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-bold text-slate-400 mb-1">From:</label>
                  <input 
                    type="text" 
                    id="postcard-input-sender"
                    value="${this.senderName}"
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-400 mb-1">To:</label>
                  <input 
                    type="text" 
                    id="postcard-input-recipient"
                    value="${this.recipientName}"
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <!-- 4. Export Actions Island -->
              <div class="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button 
                  id="btn-download-postcard"
                  class="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <i data-lucide="download" class="w-4 h-4"></i>
                  <span>Download Postcard (PNG)</span>
                </button>

                <button 
                  id="btn-copy-postcard-link"
                  class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <i data-lucide="share-2" class="w-4 h-4"></i>
                  <span>Share</span>
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
    const modal = document.getElementById("postcard-creator-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.close();
      });
    }

    const closeBtn = document.getElementById("btn-close-postcard");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // Card flippers
    const flipperCard = document.getElementById("postcard-click-flipper");
    if (flipperCard) {
      flipperCard.addEventListener("click", () => this.flip());
    }

    const triggerFlipBtn = document.getElementById("btn-trigger-flip-card");
    if (triggerFlipBtn) {
      triggerFlipBtn.addEventListener("click", () => this.flip());
    }

    // Photo selection
    const photosContainer = document.getElementById("postcard-photos-list");
    if (photosContainer) {
      photosContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".postcard-photo-btn");
        if (!btn) return;
        this.selectedPhoto = btn.dataset.src;
        photosContainer.querySelectorAll(".postcard-photo-btn").forEach((b) => {
          b.className = "postcard-photo-btn relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-slate-700 opacity-70 hover:opacity-100 transition-all";
        });
        btn.className = "postcard-photo-btn relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-amber-400 scale-105 shadow-md transition-all";

        const previewImg = document.getElementById("postcard-preview-photo");
        if (previewImg) previewImg.src = this.selectedPhoto;
      });
    }

    // Preset messages
    const modalEl = document.getElementById("postcard-creator-modal");
    if (modalEl) {
      modalEl.addEventListener("click", (e) => {
        const presetBtn = e.target.closest(".postcard-preset-btn");
        if (!presetBtn) return;
        const presetType = presetBtn.dataset.preset;
        if (this.presets[presetType]) {
          this.message = this.presets[presetType];
          const textarea = document.getElementById("postcard-input-message");
          if (textarea) textarea.value = this.message;
          const previewMsg = document.getElementById("postcard-preview-msg");
          if (previewMsg) previewMsg.innerText = `"${this.message}"`;
        }
      });
    }

    // Live textarea update
    const msgInput = document.getElementById("postcard-input-message");
    if (msgInput) {
      msgInput.addEventListener("input", (e) => {
        this.message = e.target.value;
        const previewMsg = document.getElementById("postcard-preview-msg");
        if (previewMsg) previewMsg.innerText = `"${this.message}"`;
      });
    }

    // Live sender update
    const senderInput = document.getElementById("postcard-input-sender");
    if (senderInput) {
      senderInput.addEventListener("input", (e) => {
        this.senderName = e.target.value;
        const previewSender = document.getElementById("postcard-preview-sender");
        if (previewSender) previewSender.innerText = this.senderName;
      });
    }

    // Live recipient update
    const recipientInput = document.getElementById("postcard-input-recipient");
    if (recipientInput) {
      recipientInput.addEventListener("input", (e) => {
        this.recipientName = e.target.value;
        const previewRecipient = document.getElementById("postcard-preview-recipient");
        if (previewRecipient) previewRecipient.innerText = this.recipientName;
      });
    }

    // Download button
    const downloadBtn = document.getElementById("btn-download-postcard");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => this.downloadPostcard());
    }

    // Copy link button
    const copyBtn = document.getElementById("btn-copy-postcard-link");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyShareLink());
    }
  }

  bindGlobalEvents() {
    // Keyboard Escape
    document.addEventListener("keydown", (e) => {
      const modal = document.getElementById("postcard-creator-modal");
      if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
        this.close();
      }
    });

    // Global custom event
    window.addEventListener("voyage:open-postcard", (e) => {
      this.open(e.detail?.destination || e.detail?.id);
    });
  }
}
