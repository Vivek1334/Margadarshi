// Favorites & Bucket List Service

class FavoritesService {
  constructor() {
    this.destinations = this.loadList("voyage_fav_destinations");
    this.places = this.loadList("voyage_fav_places");
  }

  loadList(key) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("voyage:favorites-updated", {
      detail: {
        destinationsCount: this.destinations.length,
        placesCount: this.places.length,
        total: this.destinations.length + this.places.length
      }
    }));
  }

  isDestinationFavorited(destId) {
    return this.destinations.includes(destId);
  }

  toggleDestination(destId) {
    if (this.isDestinationFavorited(destId)) {
      this.destinations = this.destinations.filter(id => id !== destId);
    } else {
      this.destinations.push(destId);
    }
    this.saveList("voyage_fav_destinations", this.destinations);
    return this.isDestinationFavorited(destId);
  }

  isPlaceFavorited(placeId) {
    return this.places.some(p => p.placeId === placeId);
  }

  togglePlace(destId, place) {
    const exists = this.isPlaceFavorited(place.id);
    if (exists) {
      this.places = this.places.filter(p => p.placeId !== place.id);
    } else {
      this.places.push({
        destId,
        placeId: place.id,
        name: place.name,
        category: place.category,
        image: place.image,
        rating: place.rating
      });
    }
    this.saveList("voyage_fav_places", this.places);
    return !exists;
  }

  getFavoritesCount() {
    return this.destinations.length + this.places.length;
  }

  getAllFavorites() {
    return {
      destinationIds: [...this.destinations],
      places: [...this.places]
    };
  }
}

export const favoritesService = new FavoritesService();
