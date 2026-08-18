const OPENWEATHER_KEY = "d3defca2d800e2674efa01996eee07a5";

export const GLOBAL_CITIES = [
  { 
    name: "Islamabad", 
    country: "PK", 
    lat: 33.6844, 
    lon: 73.0479, 
    icon: "☀️",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Faisal_Mosque_Islamabad_Pakistan.jpg"
  },
  { 
    name: "New York", 
    country: "US", 
    lat: 40.7128, 
    lon: -74.0060, 
    icon: "⛅",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&auto=format&fit=crop"
  },
  { 
    name: "Sydney", 
    country: "AU", 
    lat: -33.8688, 
    lon: 151.2093, 
    icon: "🌧️",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&auto=format&fit=crop"
  }
];

// Weather Fetch By Lat/Lon
export const fetchLocalWeatherData = async (lat, lon) => {
  try {
    let exactAreaName = "";
    const latNum = parseFloat(lat).toFixed(4);
    const lonNum = parseFloat(lon).toFixed(4);

    // Custom Mapping
    if (latNum === "33.5510" && lonNum === "73.1232") {
      exactAreaName = "Rasheed Sweets, Bahria Town Phase 4";
    } else if (latNum === "33.5350" && lonNum === "73.0980") {
      exactAreaName = "Bahria Town Phase 4";
    } else {
      // Reverse Geocoding
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const addr = geoData.address || {};

          let detectedName =
            addr.shop ||
            addr.amenity ||
            addr.building ||
            addr.point_of_interest ||
            addr.suburb ||
            addr.neighbourhood ||
            addr.residential ||
            addr.road ||
            "";

          if (detectedName.toLowerCase().includes("nai")) {
            detectedName = "Bahria Town Phase 4";
          }
          exactAreaName = detectedName;
        }
      } catch (e) {
        console.log("Reverse Geocoding Error:", e);
      }
    }

    // OpenWeather Call
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`
    );

    if (res.ok) {
      const data = await res.json();
      const mainCity = data.name || "Rawalpindi";
      return {
        city: exactAreaName ? `${exactAreaName}, ${mainCity}` : mainCity,
        country: data.sys?.country || "PK",
        temp: Math.round(data.main.temp),
        condition: data.weather[0]?.main || "Clear",
        lat: Number(lat).toFixed(4),
        lon: Number(lon).toFixed(4)
      };
    }

    // Fallback API
    const omRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const omData = await omRes.json();
    return {
      city: exactAreaName ? `${exactAreaName}, Rawalpindi` : "Rawalpindi",
      country: "PK",
      temp: Math.round(omData.current_weather.temperature),
      condition: "Clear",
      lat: Number(lat).toFixed(4),
      lon: Number(lon).toFixed(4)
    };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return null;
  }
};

// Global Cities Weather Fetch
export const fetchGlobalCitiesData = async () => {
  try {
    const weatherPromises = GLOBAL_CITIES.map(async (city) => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${OPENWEATHER_KEY}`
      );

      if (res.ok) {
        const data = await res.json();
        return {
          ...city,
          temp: Math.round(data.main.temp),
          wind: (data.wind.speed * 3.6).toFixed(1),
          condition: data.weather[0]?.main || "Clear"
        };
      }

      const omRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
      );
      const omData = await omRes.json();
      return {
        ...city,
        temp: Math.round(omData.current_weather.temperature),
        wind: omData.current_weather.windspeed,
        condition: "Clear"
      };
    });

    return await Promise.all(weatherPromises);
  } catch (err) {
    console.error("Global weather fetch error:", err);
    return [];
  }
};