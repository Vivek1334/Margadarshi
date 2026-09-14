// Weather Service: Dual-Provider (OpenWeather & Open-Meteo) with 24h Hourly Forecast

class WeatherService {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 15 * 60 * 1000; // 15 minutes
    this.temperatureUnit = localStorage.getItem("voyage_temp_unit") || "C"; // "C" or "F"
  }

  getOpenWeatherApiKey() {
    return localStorage.getItem("voyage_openweather_key") || "";
  }

  setTemperatureUnit(unit) {
    this.temperatureUnit = unit === "F" ? "F" : "C";
    localStorage.setItem("voyage_temp_unit", this.temperatureUnit);
    window.dispatchEvent(new CustomEvent("voyage:temp-unit-changed", { detail: { unit: this.temperatureUnit } }));
  }

  getTemperatureUnit() {
    return this.temperatureUnit;
  }

  toDisplayTemp(celsius) {
    if (celsius === null || celsius === undefined || isNaN(celsius)) return "--";
    if (this.temperatureUnit === "F") {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  }

  toUnitValue(celsius) {
    if (celsius === null || celsius === undefined || isNaN(celsius)) return 0;
    if (this.temperatureUnit === "F") {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  }

  /**
   * Get cached weather data for a destination or coordinate set if available
   */
  getCachedWeather(destOrCoords) {
    if (!destOrCoords) return null;
    let lat = null;
    let lng = null;
    if (typeof destOrCoords === "object" && destOrCoords.coordinates) {
      lat = destOrCoords.coordinates.lat;
      lng = destOrCoords.coordinates.lng;
    } else if (typeof destOrCoords === "object" && destOrCoords.lat !== undefined && destOrCoords.lng !== undefined) {
      lat = destOrCoords.lat;
      lng = destOrCoords.lng;
    }
    if (lat !== null && lng !== null) {
      const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
      const cached = this.cache.get(cacheKey);
      if (cached && cached.data) return cached.data;
    }
    for (const val of this.cache.values()) {
      if (val && val.data) {
        if (typeof destOrCoords === "string" && (val.data.city === destOrCoords || val.data.name === destOrCoords)) {
          return val.data;
        }
      }
    }
    return null;
  }

  /**
   * Fetch live weather for coordinates or city
   */
  async getWeather(lat, lng, cityName = "") {
    const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const openWeatherKey = this.getOpenWeatherApiKey();
    let result = null;

    // Try OpenWeather if API key is provided
    if (openWeatherKey) {
      try {
        result = await this.fetchFromOpenWeather(lat, lng, cityName, openWeatherKey);
      } catch (err) {
        console.warn("OpenWeather fetch failed, falling back to Open-Meteo:", err);
      }
    }

    // Default or Fallback: Open-Meteo (Zero API key needed, live worldwide data)
    if (!result) {
      try {
        result = await this.fetchFromOpenMeteo(lat, lng, cityName);
      } catch (err) {
        console.error("Open-Meteo fetch failed:", err);
        result = this.getStaticFallbackWeather(cityName);
      }
    }

    this.cache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  }

  /**
   * OpenWeather Map API Implementation
   */
  async fetchFromOpenWeather(lat, lng, cityName, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(url),
      fetch(forecastUrl).catch(() => null)
    ]);

    if (!currentRes.ok) {
      throw new Error(`OpenWeather HTTP ${currentRes.status}`);
    }

    const current = await currentRes.json();
    let forecastList = [];
    let hourlyList = [];

    if (forecastRes && forecastRes.ok) {
      const forecastData = await forecastRes.json();
      const dailyMap = new Map();

      forecastData.list.forEach((item, idx) => {
        // Hourly (first 8 slots = 24 hours in 3h steps)
        if (idx < 8) {
          const time = new Date(item.dt * 1000).toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
          hourlyList.push({
            time,
            tempC: item.main.temp,
            condition: item.weather[0].main,
            icon: this.mapOpenWeatherIcon(item.weather[0].icon)
          });
        }

        // Daily
        const date = item.dt_txt.split(" ")[0];
        if (!dailyMap.has(date) && dailyMap.size < 5) {
          dailyMap.set(date, {
            day: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
            tempMax: item.main.temp_max,
            tempMin: item.main.temp_min,
            condition: item.weather[0].main,
            icon: this.mapOpenWeatherIcon(item.weather[0].icon),
            description: item.weather[0].description
          });
        }
      });
      forecastList = Array.from(dailyMap.values());
    }

    return {
      provider: "OpenWeather",
      city: current.name || cityName,
      temperatureC: current.main.temp,
      feelsLikeC: current.main.feels_like,
      humidity: current.main.humidity,
      windSpeedKmh: Math.round(current.wind.speed * 3.6),
      pressureHpa: current.main.pressure,
      condition: current.weather[0].main,
      description: current.weather[0].description,
      icon: this.mapOpenWeatherIcon(current.weather[0].icon),
      forecast: forecastList.length > 0 ? forecastList : this.generateForecastFromBase(current.main.temp),
      hourly: hourlyList.length > 0 ? hourlyList : this.generateHourlyFromBase(current.main.temp)
    };
  }

  /**
   * Open-Meteo API Implementation (Free, Open, No Key Required)
   */
  async fetchFromOpenMeteo(lat, lng, cityName) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const conditionMeta = this.wmoCodeToCondition(current.weather_code);

    const forecast = [];
    if (data.daily && data.daily.time) {
      for (let i = 1; i < Math.min(data.daily.time.length, 6); i++) {
        const d = new Date(data.daily.time[i]);
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        const meta = this.wmoCodeToCondition(data.daily.weather_code[i]);
        forecast.push({
          day: dayName,
          tempMax: data.daily.temperature_2m_max[i],
          tempMin: data.daily.temperature_2m_min[i],
          condition: meta.condition,
          icon: meta.icon,
          description: meta.description
        });
      }
    }

    // Extract next 24 hours (step by 3 hours: 8 slots)
    const hourly = [];
    if (data.hourly && data.hourly.time) {
      const nowIdx = new Date().getHours();
      for (let i = nowIdx; i < nowIdx + 24 && i < data.hourly.time.length; i += 3) {
        const timeStr = new Date(data.hourly.time[i]).toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
        const meta = this.wmoCodeToCondition(data.hourly.weather_code[i]);
        hourly.push({
          time: timeStr,
          tempC: data.hourly.temperature_2m[i],
          condition: meta.condition,
          icon: meta.icon
        });
      }
    }

    return {
      provider: "Open-Meteo",
      city: cityName,
      temperatureC: current.temperature_2m,
      feelsLikeC: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeedKmh: Math.round(current.wind_speed_10m),
      pressureHpa: Math.round(current.surface_pressure),
      condition: conditionMeta.condition,
      description: conditionMeta.description,
      icon: conditionMeta.icon,
      forecast: forecast.length > 0 ? forecast : this.generateForecastFromBase(current.temperature_2m),
      hourly: hourly.length > 0 ? hourly : this.generateHourlyFromBase(current.temperature_2m)
    };
  }

  wmoCodeToCondition(code) {
    if (code === 0) return { condition: "Clear", description: "Clear sky", icon: "sun" };
    if (code === 1) return { condition: "Mainly Clear", description: "Mainly clear", icon: "sun" };
    if (code === 2) return { condition: "Partly Cloudy", description: "Partly cloudy", icon: "cloud-sun" };
    if (code === 3) return { condition: "Overcast", description: "Overcast", icon: "cloud" };
    if (code >= 45 && code <= 48) return { condition: "Fog", description: "Foggy conditions", icon: "cloud-fog" };
    if (code >= 51 && code <= 55) return { condition: "Drizzle", description: "Light drizzle", icon: "cloud-drizzle" };
    if (code >= 61 && code <= 65) return { condition: "Rain", description: "Rain showers", icon: "cloud-rain" };
    if (code >= 71 && code <= 77) return { condition: "Snow", description: "Snow fall", icon: "snowflake" };
    if (code >= 80 && code <= 82) return { condition: "Showers", description: "Heavy rain showers", icon: "cloud-rain" };
    if (code >= 85 && code <= 86) return { condition: "Snow Showers", description: "Snow showers", icon: "snowflake" };
    if (code >= 95 && code <= 99) return { condition: "Thunderstorm", description: "Thunderstorm", icon: "cloud-lightning" };
    return { condition: "Fair", description: "Pleasant", icon: "sun" };
  }

  mapOpenWeatherIcon(iconCode) {
    if (!iconCode) return "sun";
    if (iconCode.startsWith("01")) return "sun";
    if (iconCode.startsWith("02")) return "cloud-sun";
    if (iconCode.startsWith("03") || iconCode.startsWith("04")) return "cloud";
    if (iconCode.startsWith("09") || iconCode.startsWith("10")) return "cloud-rain";
    if (iconCode.startsWith("11")) return "cloud-lightning";
    if (iconCode.startsWith("13")) return "snowflake";
    if (iconCode.startsWith("50")) return "cloud-fog";
    return "sun";
  }

  generateForecastFromBase(baseC) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    return days.map((day, idx) => ({
      day,
      tempMax: Math.round(baseC + (idx % 2 === 0 ? 2 : -1)),
      tempMin: Math.round(baseC - 5),
      condition: "Partly Cloudy",
      icon: "cloud-sun",
      description: "Pleasant weather"
    }));
  }

  generateHourlyFromBase(baseC) {
    const hours = ["Now", "3 PM", "6 PM", "9 PM", "12 AM", "3 AM", "6 AM", "9 AM"];
    return hours.map((h, i) => ({
      time: h,
      tempC: Math.round(baseC + Math.sin(i) * 3),
      condition: "Clear",
      icon: "sun"
    }));
  }

  getStaticFallbackWeather(city) {
    return {
      provider: "Simulated",
      city: city || "Destination",
      temperatureC: 22,
      feelsLikeC: 23,
      humidity: 55,
      windSpeedKmh: 14,
      pressureHpa: 1013,
      condition: "Clear",
      description: "Sunny and clear skies",
      icon: "sun",
      forecast: this.generateForecastFromBase(22),
      hourly: this.generateHourlyFromBase(22)
    };
  }
}

export const weatherService = new WeatherService();
