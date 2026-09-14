// Bucket List & Saved Places Slide-over Drawer Component

import { favoritesService } from "../services/favorites-service.js";
import { DESTINATIONS } from "../destinations-data.js";

export class FavoritesDrawer {
  constructor(containerId = "favorites-drawer-container") {
    this.container = document.getElementById(containerId);
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();

    window.addEventListener("voyage:open-favorites", () => this.open());
    window.addEventListener("voyage:favorites-updated", () => {
      this.updateBadge();
      if (this.isOpen) this.renderList();
    });

    this.updateBadge();
  }

  updateBadge() {
    const count = favoritesService.getFavoritesCount();
    const badges = [
      document.getElementById("nav-favorites-count"),
      document.getElementById("mobile-favorites-count")
    ];
    badges.forEach(badge => {
      if (badge) {
        badge.textContent = count;
        badge.classList.toggle("hidden", count === 0);
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <!-- Backdrop -->
      <div id="fav-drawer-backdrop" class="hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>

      <!-- Slide-over Drawer -->
      <div id="fav-drawer-panel" class="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[440px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300 ease-in-out">
        <!-- Header -->
        <div class="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shadow">
              <i data-lucide="heart" class="w-5 h-5 fill-pink-400"></i>
            </div>
            <div>
              <h3 class="font-bold text-white text-base">Your Travel Bucket List</h3>
              <p class="text-xs text-slate-400">Saved destinations and notable landmarks.</p>
            </div>
          </div>
          <button id="btn-close-fav-drawer" class="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- List Content Area -->
        <div id="fav-drawer-content" class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Dynamically Populated -->
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents() {
    const closeBtn = document.getElementById("btn-close-fav-drawer");
    const backdrop = document.getElementById("fav-drawer-backdrop");

    if (closeBtn) closeBtn.addEventListener("click", () => this.close());
    if (backdrop) backdrop.addEventListener("click", () => this.close());
  }

  open() {
    this.isOpen = true;
    const panel = document.getElementById("fav-drawer-panel");
    const backdrop = document.getElementById("fav-drawer-backdrop");

    if (panel) panel.classList.remove("translate-x-full");
    if (backdrop) backdrop.classList.remove("hidden");

    this.renderList();
  }

  close() {
    this.isOpen = false;
    const panel = document.getElementById("fav-drawer-panel");
    const backdrop = document.getElementById("fav-drawer-backdrop");

    if (panel) panel.classList.add("translate-x-full");
    if (backdrop) backdrop.classList.add("hidden");
  }

  renderList() {
    const content = document.getElementById("fav-drawer-content");
    if (!content) return;

    const { destinationIds, places } = favoritesService.getAllFavorites();
    const savedDestinations = DESTINATIONS.filter(d => destinationIds.includes(d.id));

    if (savedDestinations.length === 0 && places.length === 0) {
      content.innerHTML = `
        <div class="text-center py-16 text-slate-400">
          <div class="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-pink-400">
            <i data-lucide="heart" class="w-7 h-7"></i>
          </div>
          <h4 class="text-base font-bold text-white mb-1">Your Bucket List is Empty</h4>
          <p class="text-xs text-slate-400 max-w-xs mx-auto">
            Click the heart icon on any destination card or famous landmark to bookmark it here for later planning!
          </p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let html = "";

    // Section 1: Destinations
    if (savedDestinations.length > 0) {
      html += `
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Bookmarked Destinations (${savedDestinations.length})
          </span>
          <div class="space-y-3">
            ${savedDestinations.map(dest => `
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <img src="${dest.heroImage}" alt="${dest.name}" class="w-14 h-14 object-cover rounded-lg shrink-0" />
                <div class="flex-1 min-w-0">
                  <h5 class="font-bold text-white text-sm truncate">${dest.name}, ${dest.country}</h5>
                  <span class="text-[11px] text-emerald-400">${dest.continent} · ${dest.idealDuration}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <button class="btn-go-dest p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors" data-dest-id="${dest.id}">
                    View
                  </button>
                  <button class="btn-remove-dest p-2 text-slate-400 hover:text-red-400 transition-colors" data-dest-id="${dest.id}" title="Remove">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    // Section 2: Famous Landmarks
    if (places.length > 0) {
      html += `
        <div class="pt-4 border-t border-slate-800">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Saved Famous Places (${places.length})
          </span>
          <div class="space-y-3">
            ${places.map(p => `
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <img src="${p.image}" alt="${p.name}" class="w-14 h-14 object-cover rounded-lg shrink-0" />
                <div class="flex-1 min-w-0">
                  <h5 class="font-bold text-white text-sm truncate">${p.name}</h5>
                  <span class="text-[11px] text-amber-400">★ ${p.rating} · ${p.category}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <button class="btn-go-dest p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors" data-dest-id="${p.destId}">
                    View
                  </button>
                  <button class="btn-remove-place p-2 text-slate-400 hover:text-red-400 transition-colors" data-place-id="${p.placeId}" data-dest-id="${p.destId}" title="Remove">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    content.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Bind item buttons
    content.querySelectorAll(".btn-go-dest").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-dest-id");
        this.close();
        window.location.hash = `#destination/${id}`;
      });
    });

    content.querySelectorAll(".btn-remove-dest").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-dest-id");
        favoritesService.toggleDestination(id);
        this.renderList();
      });
    });

    content.querySelectorAll(".btn-remove-place").forEach((b) => {
      b.addEventListener("click", () => {
        const placeId = b.getAttribute("data-place-id");
        const destId = b.getAttribute("data-dest-id");
        favoritesService.togglePlace(destId, { id: placeId });
        this.renderList();
      });
    });
  }
}
