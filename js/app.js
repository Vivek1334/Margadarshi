// Main Application Coordinator and Single-Page Router

import { HeroVideo } from "./components/hero-video.js";
import { DestinationExplorer } from "./components/explorer.js";
import { DestinationView } from "./components/destination-view.js";
import { ChatWidget } from "./components/chat-widget.js";
import { ItineraryView } from "./components/itinerary-view.js";
import { SettingsModal } from "./components/settings-modal.js";
import { FavoritesDrawer } from "./components/favorites-drawer.js";
import { Lightbox } from "./components/lightbox.js";
import { MysteryCompass } from "./components/mystery-compass.js";
import { PostcardModal } from "./components/postcard-modal.js";
import { geoService } from "./services/geo-service.js";
import { currencyService } from "./services/currency-service.js";
import { favoritesService } from "./services/favorites-service.js";
import { DESTINATIONS, getDestinationById } from "./destinations-data.js";

class App {
  constructor() {
    this.heroVideo = null;
    this.explorer = null;
    this.destinationView = null;
    this.chatWidget = null;
    this.itineraryView = null;
    this.settingsModal = null;
    this.favoritesDrawer = null;
    this.lightbox = null;
    this.mysteryCompass = null;
    this.postcardModal = null;
  }

  init() {
    console.log("Initializing MargaDarshi Travel Web Application...");

    // 1. Initialize Components with fault isolation
    try { this.heroVideo = new HeroVideo("hero-video-container"); } catch (e) { console.error("HeroVideo init failed:", e); }
    try { this.explorer = new DestinationExplorer("explorer-container"); } catch (e) { console.error("DestinationExplorer init failed:", e); }
    try { this.destinationView = new DestinationView("destination-detail-container"); } catch (e) { console.error("DestinationView init failed:", e); }
    try { this.chatWidget = new ChatWidget("chat-widget-container"); } catch (e) { console.error("ChatWidget init failed:", e); }
    try { this.itineraryView = new ItineraryView("itinerary-container"); } catch (e) { console.error("ItineraryView init failed:", e); }
    try { this.settingsModal = new SettingsModal("settings-modal-container"); } catch (e) { console.error("SettingsModal init failed:", e); }
    try { this.favoritesDrawer = new FavoritesDrawer("favorites-drawer-container"); } catch (e) { console.error("FavoritesDrawer init failed:", e); }
    try { this.lightbox = new Lightbox("lightbox-container"); } catch (e) { console.error("Lightbox init failed:", e); }
    try { this.mysteryCompass = new MysteryCompass("mystery-compass-container"); } catch (e) { console.error("MysteryCompass init failed:", e); }
    try { this.postcardModal = new PostcardModal("postcard-modal-container"); } catch (e) { console.error("PostcardModal init failed:", e); }

    // 2. Setup Global Navigation & Hash Router
    try { this.initRouter(); } catch (e) { console.error("initRouter failed:", e); }
    try { this.initLocationBanner(); } catch (e) { console.error("initLocationBanner failed:", e); }
    try { this.initCurrencySelector(); } catch (e) { console.error("initCurrencySelector failed:", e); }
    try { this.initFavoritesTrigger(); } catch (e) { console.error("initFavoritesTrigger failed:", e); }
    try { this.bindGlobalActions(); } catch (e) { console.error("bindGlobalActions failed:", e); }
    try { this.initMobileNavigation(); } catch (e) { console.error("initMobileNavigation failed:", e); }

    // 3. Lucide Icons
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) { console.error("createIcons failed:", e); }
    }
  }

  initRouter() {
    window.addEventListener("hashchange", () => this.handleRoute());
    // Initial route
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash || "#home";
    const landingView = document.getElementById("landing-view");
    const destView = document.getElementById("destination-detail-container");
    const itinView = document.getElementById("itinerary-container");

    // Reset views
    if (landingView) landingView.classList.add("hidden");
    if (destView) destView.classList.add("hidden");
    if (itinView) itinView.classList.add("hidden");

    if (hash.startsWith("#destination/") || hash.startsWith("#destination?id=")) {
      let destId = "";
      if (hash.startsWith("#destination/")) {
        destId = decodeURIComponent(hash.replace("#destination/", "").trim());
      } else {
        const params = new URLSearchParams(hash.split("?")[1] || "");
        destId = decodeURIComponent(params.get("id") || "").trim();
      }
      if (destView && destId) {
        destView.classList.remove("hidden");
        if (this.destinationView) {
          this.destinationView.show(destId).then(() => {
            const destObj = this.destinationView.currentDestination || getDestinationById(destId);
            if (destObj && this.chatWidget) {
              this.chatWidget.setDestinationContext(destObj);
            }
          });
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (hash.startsWith("#itinerary")) {
      if (this.chatWidget) this.chatWidget.setDestinationContext(null);
      if (itinView) {
        itinView.classList.remove("hidden");
        const params = new URLSearchParams(hash.split("?")[1] || "");
        const destParam = params.get("dest");
        if (destParam) {
          this.itineraryView.setDestination(destParam);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (hash === "#explore") {
      if (this.chatWidget) this.chatWidget.setDestinationContext(null);
      if (landingView) {
        landingView.classList.remove("hidden");
        const expSec = document.getElementById("explorer-section");
        if (expSec) {
          setTimeout(() => {
            expSec.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    } else {
      // Default: #home
      if (this.chatWidget) this.chatWidget.setDestinationContext(null);
      if (landingView) {
        landingView.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  initCurrencySelector() {
    const selectEl = document.getElementById("nav-currency-select");
    if (selectEl) {
      selectEl.value = currencyService.getCurrency();
      selectEl.addEventListener("change", (e) => {
        currencyService.setCurrency(e.target.value);
      });
    }
  }


  initFavoritesTrigger() {
    const btn = document.getElementById("nav-btn-favorites");
    if (btn) {
      btn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("voyage:open-favorites"));
      });
    }
  }

  initLocationBanner() {
    const banner = document.getElementById("location-awareness-banner");
    const navPill = document.getElementById("navbar-user-location");
    const allowBtn = document.getElementById("banner-btn-allow-loc");
    const manualBtn = document.getElementById("banner-btn-manual-loc");
    const dismissBtn = document.getElementById("banner-btn-dismiss");

    // Update location pill in navbar if already saved
    const savedLoc = geoService.getUserLocation();
    if (savedLoc && savedLoc.city) {
      this.updateNavbarLocation(savedLoc.city);
    } else {
      // Show location permission banner if user hasn't dismissed it
      const dismissed = sessionStorage.getItem("voyage_loc_banner_dismissed");
      if (!dismissed && banner) {
        banner.classList.remove("hidden");
      }
    }

    if (allowBtn) {
      allowBtn.addEventListener("click", async () => {
        allowBtn.innerHTML = `
          <span class="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
          Detecting...
        `;
        try {
          const loc = await geoService.requestBrowserLocation();
          if (banner) banner.classList.add("hidden");
          this.updateNavbarLocation(loc.city);
        } catch {
          alert("Location request was denied. You can manually enter your city via Settings or the Search City button.");
          allowBtn.textContent = "Allow Geolocation";
        }
      });
    }

    if (manualBtn) {
      manualBtn.addEventListener("click", () => {
        if (banner) banner.classList.add("hidden");
        window.dispatchEvent(new CustomEvent("voyage:open-settings"));
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        if (banner) banner.classList.add("hidden");
        sessionStorage.setItem("voyage_loc_banner_dismissed", "true");
      });
    }

    if (navPill) {
      navPill.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("voyage:open-settings"));
      });
    }

    window.addEventListener("voyage:location-updated", (e) => {
      const city = e.detail?.city || e.detail?.location?.city;
      if (city) {
        this.updateNavbarLocation(city);
      } else {
        const navPill = document.getElementById("navbar-user-location");
        if (navPill) {
          navPill.innerHTML = `
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-500 mr-1.5"></i>
            <span>Set Origin</span>
          `;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  updateNavbarLocation(cityName) {
    const navPill = document.getElementById("navbar-user-location");
    if (navPill) {
      navPill.classList.remove("hidden");
      navPill.innerHTML = `
        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-emerald-400 mr-1.5"></i>
        <span class="font-bold text-white">${cityName}</span>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  bindGlobalActions() {
    // Top nav settings button
    const settingsBtn = document.getElementById("nav-btn-settings");
    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("voyage:open-settings"));
      });
    }

    // Hero buttons
    const heroExploreBtn = document.getElementById("hero-btn-explore");
    const heroAiBtn = document.getElementById("hero-btn-ai");

    const heroSpinCompassBtn = document.getElementById("hero-btn-spin-compass");

    if (heroExploreBtn) {
      heroExploreBtn.addEventListener("click", () => {
        window.location.hash = "#explore";
      });
    }

    if (heroSpinCompassBtn) {
      heroSpinCompassBtn.addEventListener("click", () => {
        if (this.mysteryCompass) this.mysteryCompass.open();
      });
    }

    if (heroAiBtn) {
      heroAiBtn.addEventListener("click", () => {
        window.location.hash = "#itinerary";
      });
    }
  }

  initMobileNavigation() {
    // 1. Mobile Menu Drawer Toggle
    const menuBtn = document.getElementById("nav-btn-mobile-menu");
    const drawer = document.getElementById("mobile-menu-drawer");
    const menuIcon = document.getElementById("mobile-menu-icon");

    if (menuBtn && drawer) {
      menuBtn.addEventListener("click", () => {
        const isHidden = drawer.classList.contains("hidden");
        drawer.classList.toggle("hidden", !isHidden);
        if (menuIcon) {
          menuIcon.setAttribute("data-lucide", isHidden ? "x" : "menu");
          if (window.lucide) window.lucide.createIcons();
        }
      });

      // Close mobile menu on any link/button click
      drawer.querySelectorAll("a, button").forEach(el => {
        el.addEventListener("click", () => {
          drawer.classList.add("hidden");
          if (menuIcon) {
            menuIcon.setAttribute("data-lucide", "menu");
            if (window.lucide) window.lucide.createIcons();
          }
        });
      });
    }

    // 2. Mobile Menu Action Buttons
    const compassMenuBtn = document.getElementById("mobile-menu-compass");
    if (compassMenuBtn) {
      compassMenuBtn.addEventListener("click", () => {
        if (this.mysteryCompass) this.mysteryCompass.open();
      });
    }

    const locMenuBtn = document.getElementById("mobile-menu-location");
    if (locMenuBtn) {
      locMenuBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("voyage:open-settings"));
      });
    }

    // 3. Mobile Bottom Dock Navigation Buttons
    const mobFavoritesBtn = document.getElementById("mobile-nav-favorites");
    if (mobFavoritesBtn) {
      mobFavoritesBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("voyage:open-favorites"));
      });
    }

    const mobCompassBtn = document.getElementById("mobile-nav-compass");
    if (mobCompassBtn) {
      mobCompassBtn.addEventListener("click", () => {
        if (this.mysteryCompass) this.mysteryCompass.open();
      });
    }

    // 4. Update Mobile Active Tab on Route Change
    this.updateMobileDockActive();
    window.addEventListener("hashchange", () => this.updateMobileDockActive());
  }

  updateMobileDockActive() {
    const hash = window.location.hash || "#home";
    const dockBtns = {
      home: document.getElementById("mobile-nav-home"),
      explore: document.getElementById("mobile-nav-explore"),
      itinerary: document.getElementById("mobile-nav-itinerary")
    };

    // Reset all buttons
    Object.values(dockBtns).forEach(btn => {
      if (btn) {
        btn.classList.remove("text-emerald-400", "active");
        btn.classList.add("text-slate-400");
      }
    });

    if (hash.startsWith("#itinerary")) {
      dockBtns.itinerary?.classList.add("text-emerald-400", "active");
      dockBtns.itinerary?.classList.remove("text-slate-400");
    } else if (hash.startsWith("#explore") || hash.startsWith("#destination")) {
      dockBtns.explore?.classList.add("text-emerald-400", "active");
      dockBtns.explore?.classList.remove("text-slate-400");
    } else {
      dockBtns.home?.classList.add("text-emerald-400", "active");
      dockBtns.home?.classList.remove("text-slate-400");
    }
  }

}

// Bootstrap application safely regardless of DOM state
function bootstrapApp() {
  const app = new App();
  app.init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapApp);
} else {
  bootstrapApp();
}
