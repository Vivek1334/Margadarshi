// Google Maps Integration & Directions Service

export class MapsService {
  /**
   * Generates official universal Google Maps Directions URL
   * Works across desktop browsers, Android Google Maps App, and iOS Apple/Google Maps
   * @param {string|object} origin - City name, address, or {lat, lng}
   * @param {string|object} destination - Place name, address, or {lat, lng}
   * @param {string} travelMode - 'driving' | 'transit' | 'walking' | 'bicycling' | 'flying'
   */
  getDirectionsUrl(origin, destination, travelMode = "driving") {
    const base = "https://www.google.com/maps/dir/?api=1";
    const params = new URLSearchParams();

    // Set Origin
    if (origin) {
      if (typeof origin === "object" && origin.lat != null && origin.lng != null) {
        params.set("origin", `${origin.lat},${origin.lng}`);
      } else if (typeof origin === "string" && origin.trim()) {
        params.set("origin", origin.trim());
      }
    }

    // Set Destination
    if (destination) {
      if (typeof destination === "object" && destination.lat != null && destination.lng != null) {
        params.set("destination", `${destination.lat},${destination.lng}`);
      } else if (typeof destination === "string" && destination.trim()) {
        params.set("destination", destination.trim());
      }
    }

    // Travel Mode mapping
    const mode = (travelMode || "driving").toLowerCase();
    if (["driving", "transit", "walking", "bicycling", "biking"].includes(mode)) {
      params.set("travelmode", mode === "biking" ? "bicycling" : mode);
    }

    return `${base}&${params.toString()}`;
  }

  /**
   * Generates Google Maps Place Search / Coordinate pinpoint URL
   */
  getPlaceUrl(query, coords = null) {
    if (coords && coords.lat != null && coords.lng != null) {
      return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "")}`;
  }

  /**
   * Generates interactive embed URL for iframe
   */
  getEmbedRouteUrl(origin, destination) {
    let saddr = "";
    if (origin) {
      if (typeof origin === "object" && origin.lat != null && origin.lng != null) {
        saddr = `${origin.lat},${origin.lng}`;
      } else {
        saddr = origin.toString().trim();
      }
    }

    let daddr = "";
    if (destination) {
      if (typeof destination === "object" && destination.lat != null && destination.lng != null) {
        daddr = `${destination.lat},${destination.lng}`;
      } else {
        daddr = destination.toString().trim();
      }
    }

    return `https://maps.google.com/maps?saddr=${encodeURIComponent(saddr)}&daddr=${encodeURIComponent(daddr)}&output=embed`;
  }

  /**
   * Estimate travel duration based on geodesic distance & travel mode
   */
  estimateTravelTime(distanceKm, mode = "driving") {
    if (!distanceKm || isNaN(distanceKm)) return "Calculate in Google Maps";

    switch (mode) {
      case "walking": {
        const hours = distanceKm / 4.5;
        if (hours < 1) return `~${Math.round(hours * 60)} mins walk`;
        return `~${hours.toFixed(1)} hrs walk`;
      }
      case "transit": {
        const hours = distanceKm / 45;
        if (hours < 1) return `~${Math.round(hours * 60)} mins transit`;
        if (hours > 24) return `~${(hours / 24).toFixed(1)} days train/transit`;
        return `~${hours.toFixed(1)} hrs transit`;
      }
      case "driving": {
        if (distanceKm > 1500) {
          return `Long distance (${distanceKm.toLocaleString()} km) • Best via flight`;
        }
        const hours = distanceKm / 65;
        if (hours < 1) return `~${Math.round(hours * 60)} mins drive`;
        return `~${hours.toFixed(1)} hrs drive`;
      }
      case "flying":
      default: {
        if (distanceKm < 300) {
          return `Short flight (~45 mins) or drive (~${(distanceKm / 70).toFixed(1)} hrs)`;
        }
        const flightHours = (distanceKm / 800) + 1.5; // cruising speed + airport buffer
        return `~${flightHours.toFixed(1)} hrs flight`;
      }
    }
  }
}

export const mapsService = new MapsService();
