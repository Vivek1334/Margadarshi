// Geolocation, Distance Calculation, and Origin Location Service

class GeoService {
  constructor() {
    this.currentLocation = this.loadSavedLocation() || null;
  }

  loadSavedLocation() {
    try {
      const saved = localStorage.getItem("voyage_user_location");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveLocation(loc) {
    this.currentLocation = loc;
    localStorage.setItem("voyage_user_location", JSON.stringify(loc));
    window.dispatchEvent(new CustomEvent("voyage:location-updated", { detail: loc }));
  }

  getUserLocation() {
    return this.currentLocation;
  }

  clearLocation() {
    this.currentLocation = null;
    try {
      localStorage.removeItem("voyage_user_location");
    } catch(e) {}
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new CustomEvent("voyage:location-updated", { detail: null }));
    }
  }

  /**
   * Request browser geolocation
   */
  async requestBrowserLocation() {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser.");
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const placeDetails = await this.reverseGeocode(lat, lng);
            const loc = {
              lat,
              lng,
              city: placeDetails.city || "Current Location",
              country: placeDetails.country || "",
              isManual: false
            };
            this.saveLocation(loc);
            resolve(loc);
          } catch (err) {
            const loc = { lat, lng, city: "Current Location", country: "", isManual: false };
            this.saveLocation(loc);
            resolve(loc);
          }
        },
        (error) => {
          let msg = "Could not retrieve your location.";
          if (error.code === error.PERMISSION_DENIED) {
            msg = "Location permission was denied. You can search for your city manually.";
          }
          reject(new Error(msg));
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  }

  /**
   * Reverse geocode latitude and longitude to city/country
   */
  async reverseGeocode(lat, lng) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`, {
        headers: { "Accept-Language": "en" }
      });
      if (!res.ok) throw new Error("Reverse geocode failed");
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.municipality || addr.village || addr.state || "Your City";
      const country = addr.country || "";
      return { city, country };
    } catch (e) {
      return { city: "Your Location", country: "" };
    }
  }

  /**
   * Manual search for cities
   */
  async searchCities(query) {
    if (!query || query.trim().length < 2) return [];
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`, {
        headers: { "Accept-Language": "en" }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.map((item) => {
        const addr = item.address || {};
        const city = addr.city || addr.town || addr.municipality || item.display_name.split(",")[0];
        const country = addr.country || "";
        return {
          displayName: item.display_name,
          city,
          country,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        };
      });
    } catch (e) {
      console.warn("City search error:", e);
      return [];
    }
  }

  /**
   * Set user origin manually by choosing a city
   */
  setManualLocation(city, country, lat, lng) {
    const loc = { city, country, lat, lng, isManual: true };
    this.saveLocation(loc);
    return loc;
  }

  /**
   * Haversine formula: calculate distance between two coordinates in km and miles
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c);
    const distanceMiles = Math.round(distanceKm * 0.621371);
    return { km: distanceKm, miles: distanceMiles };
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Calculate distance from current user location to a destination
   */
  getDistanceToDestination(destCoordinates) {
    if (!this.currentLocation || !this.currentLocation.lat || !destCoordinates) {
      return null;
    }
    return this.calculateDistance(
      this.currentLocation.lat,
      this.currentLocation.lng,
      destCoordinates.lat,
      destCoordinates.lng
    );
  }
}

export const geoService = new GeoService();
