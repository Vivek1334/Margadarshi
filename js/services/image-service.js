// Image Service: Fetches dynamic images from Unsplash, Pexels, and Wikipedia APIs

class ImageService {
  constructor() {
    this.cache = new Map();
    this.unsplashKey = localStorage.getItem("voyage_unsplash_key") || "";
    this.pexelsKey = localStorage.getItem("voyage_pexels_key") || "";
  }

  setApiKeys(unsplash, pexels) {
    if (unsplash !== undefined) {
      this.unsplashKey = unsplash.trim();
      localStorage.setItem("voyage_unsplash_key", this.unsplashKey);
    }
    if (pexels !== undefined) {
      this.pexelsKey = pexels.trim();
      localStorage.setItem("voyage_pexels_key", this.pexelsKey);
    }
  }

  /**
   * Dynamically fetch an authentic image for a query string or famous landmark
   * @param {string} query - Search terms (e.g., "Taj Mahal Agra")
   * @param {string} wikiTitle - Wikipedia article title for authentic landmark photo
   * @param {string} fallbackUrl - Verified high-resolution default image
   * @returns {Promise<string>} Image URL
   */
  async getImage(query, wikiTitle = "", fallbackUrl = "") {
    const cacheKey = `img_${query}_${wikiTitle}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 1. Try Unsplash official API if user provided a key
    if (this.unsplashKey) {
      try {
        const url = await this.fetchFromUnsplash(query);
        if (url) {
          this.cache.set(cacheKey, url);
          return url;
        }
      } catch (err) {
        console.warn("Unsplash API error:", err);
      }
    }

    // 2. Try Pexels official API if user provided a key
    if (this.pexelsKey) {
      try {
        const url = await this.fetchFromPexels(query);
        if (url) {
          this.cache.set(cacheKey, url);
          return url;
        }
      } catch (err) {
        console.warn("Pexels API error:", err);
      }
    }

    // 3. If verified curated landmark image is provided, use it directly (100% authentic landmark match)
    if (fallbackUrl) {
      this.cache.set(cacheKey, fallbackUrl);
      return fallbackUrl;
    }

    // 4. Try Wikipedia PageImages API (Authentic landmark and destination photos)
    if (wikiTitle) {
      try {
        const url = await this.fetchFromWikipedia(wikiTitle);
        if (url) {
          this.cache.set(cacheKey, url);
          return url;
        }
      } catch (err) {
        console.warn("Wikipedia image error:", err);
      }
    }

    // 5. Try Wikipedia PageImages with query if wikiTitle didn't return an image
    if (query && query !== wikiTitle) {
      try {
        const url = await this.fetchFromWikipedia(query.replace(/\s+/g, "_"));
        if (url) {
          this.cache.set(cacheKey, url);
          return url;
        }
      } catch (err) {
        // silent fallback
      }
    }

    // 6. Return verified distinct fallback URL
    const finalUrl = this.getGenericTravelPhoto(query);
    this.cache.set(cacheKey, finalUrl);
    return finalUrl;
  }

  async fetchFromUnsplash(query) {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: {
        Authorization: `Client-ID ${this.unsplashKey}`
      }
    });
    if (!res.ok) throw new Error(`Unsplash HTTP ${res.status}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return null;
  }

  async fetchFromPexels(query) {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: {
        Authorization: this.pexelsKey
      }
    });
    if (!res.ok) throw new Error(`Pexels HTTP ${res.status}`);
    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.large2x || data.photos[0].src.large;
    }
    return null;
  }

  isBadImage(url) {
    if (!url) return true;
    const lower = url.toLowerCase();
    return (
      lower.includes('.svg') ||
      lower.includes('map') ||
      lower.includes('flag') ||
      lower.includes('coat_of_arms') ||
      lower.includes('logo') ||
      lower.includes('locator') ||
      lower.includes('district') ||
      lower.includes('symbol') ||
      lower.includes('diagram') ||
      lower.includes('icon') ||
      lower.includes('seal') ||
      lower.includes('insignia') ||
      lower.includes('region')
    );
  }

  async fetchFromWikipedia(wikiTitle) {
    if (!wikiTitle) return null;
    try {
      // 1. Try modern Wikipedia REST summary endpoint (returns full authentic originalimage or thumbnail)
      const restUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
      const res = await fetch(restUrl, { headers: { "User-Agent": "VoyageTravelApp/1.0 (contact@voyage.com)" } });
      if (res.ok) {
        const data = await res.json();
        const img = data.originalimage?.source || data.thumbnail?.source;
        if (img && !this.isBadImage(img)) return ((typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) && (img.includes('wikimedia.org') || img.includes('wikipedia.org'))) ? `/api/image-proxy?url=${encodeURIComponent(img)}` : img;
      }
    } catch (err) {
      // fallback
    }

    try {
      // 2. Query search API if title had slight discrepancy
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(wikiTitle)}&srlimit=1&format=json&origin=*`;
      const sRes = await fetch(searchUrl, { headers: { "User-Agent": "VoyageTravelApp/1.0 (contact@voyage.com)" } });
      if (sRes.ok) {
        const sData = await sRes.json();
        const firstTitle = sData.query?.search?.[0]?.title;
        if (firstTitle) {
          const sumRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstTitle)}`, {
            headers: { "User-Agent": "VoyageTravelApp/1.0 (contact@voyage.com)" }
          });
          if (sumRes.ok) {
            const sumData = await sumRes.json();
            const img = sumData.originalimage?.source || sumData.thumbnail?.source;
            if (img && !this.isBadImage(img)) return ((typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) && (img.includes('wikimedia.org') || img.includes('wikipedia.org'))) ? `/api/image-proxy?url=${encodeURIComponent(img)}` : img;
          }
        }
      }
    } catch (err) {
      console.warn(`Wikipedia image search error for ${wikiTitle}:`, err);
    }
    return null;
  }

  getGenericTravelPhoto(query) {
    return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80`;
  }
}

export const imageService = new ImageService();
