// Fullscreen Photo Lightbox Component

export class Lightbox {
  constructor(containerId = "lightbox-container") {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();

    window.addEventListener("voyage:open-lightbox", (e) => {
      const { src, title, caption } = e.detail || {};
      this.open(src, title, caption);
    });
  }

  render() {
    this.container.innerHTML = `
      <div id="photo-lightbox-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-2xl transition-opacity duration-300">
        <!-- Close Button -->
        <button id="btn-close-lightbox" class="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors z-20" title="Close Lightbox (Esc)">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <!-- Lightbox Content Frame -->
        <div class="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center">
          <img 
            id="lightbox-img" 
            src="" 
            alt="Travel Landmark" 
            class="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-slate-800 transition-transform duration-300"
          />
          <div class="mt-4 text-center flex flex-col items-center">
            <h4 id="lightbox-title" class="text-lg sm:text-xl font-bold text-white"></h4>
            <p id="lightbox-caption" class="text-xs sm:text-sm text-slate-400 mt-1"></p>
            <a 
              id="lightbox-google-link" 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-medium transition-colors shadow-sm"
              title="View authentic visitor photos on Google Maps"
            >
              <span>📷 Explore on Google Maps & Photos</span>
            </a>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents() {
    const modal = document.getElementById("photo-lightbox-modal");
    const closeBtn = document.getElementById("btn-close-lightbox");

    if (closeBtn) closeBtn.addEventListener("click", () => this.close());

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.close();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
  }

  open(src, title = "", caption = "") {
    const modal = document.getElementById("photo-lightbox-modal");
    const img = document.getElementById("lightbox-img");
    const titleEl = document.getElementById("lightbox-title");
    const captionEl = document.getElementById("lightbox-caption");
    const googleLink = document.getElementById("lightbox-google-link");

    if (img && src) {
      img.onerror = () => {
        img.onerror = null;
        img.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80";
      };
      img.src = src;
      img.alt = title || "Travel Landmark";
    }
    if (titleEl) titleEl.textContent = title;
    if (captionEl) captionEl.textContent = caption;
    if (googleLink) {
      googleLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title || "Landmark")}`;
    }

    if (modal) modal.classList.remove("hidden");
  }

  close() {
    const modal = document.getElementById("photo-lightbox-modal");
    if (modal) modal.classList.add("hidden");
  }
}
