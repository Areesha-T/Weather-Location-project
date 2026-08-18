import React, { useState, useEffect } from "react";
import { 
  GLOBAL_CITIES, 
  fetchLocalWeatherData, 
  fetchGlobalCitiesData 
} from "./weatherService";

const DEFAULT_LAT = 33.5974;
const DEFAULT_LON = 73.0479;

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("location");
  const [localWeather, setLocalWeather] = useState(null);
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [loading, setLoading] = useState(true);

  const [inputLat, setInputLat] = useState("");
  const [inputLon, setInputLon] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    detectUserGPSLocation();
  }, []);

  const detectUserGPSLocation = () => {
    setLoading(true);
    setInputError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await loadData(position.coords.latitude, position.coords.longitude);
        },
        async () => {
          await loadData(DEFAULT_LAT, DEFAULT_LON);
        },
        { timeout: 10000 }
      );
    } else {
      loadData(DEFAULT_LAT, DEFAULT_LON);
    }
  };

  const loadData = async (lat, lon) => {
    const local = await fetchLocalWeatherData(lat, lon);
    const global = await fetchGlobalCitiesData();
    setLocalWeather(local);
    setCitiesWeather(global);
    setLoading(false);
  };

  const handleCustomCoordinatesSubmit = async (e) => {
    e.preventDefault();
    setInputError("");

    if (!inputLat || !inputLon) {
      setInputError("Please enter both Latitude and Longitude values.");
      return;
    }

    const parsedLat = parseFloat(inputLat);
    const parsedLon = parseFloat(inputLon);

    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      setInputError("Invalid Latitude! Must be between -90 and 90.");
      return;
    }

    if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) {
      setInputError("Invalid Longitude! Must be between -180 and 180.");
      return;
    }

    setLoading(true);
    const data = await fetchLocalWeatherData(parsedLat, parsedLon);
    setLocalWeather(data);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {onLogout && (
            <button onClick={onLogout} style={styles.backBtn} title="Back to Login">
              ←
            </button>
          )}
          <h1 style={{ margin: 0 }}>Dashboard</h1>
        </div>
        {onLogout && (
          <button onClick={onLogout} style={styles.logoutBtn}>
            Logout
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === "location" ? "#38bdf8" : "#1e293b",
            color: activeTab === "location" ? "#0f172a" : "#94a3b8"
          }}
          onClick={() => setActiveTab("location")}
        >
          📍 Live Location Details
        </button>

        <button
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === "weather" ? "#38bdf8" : "#1e293b",
            color: activeTab === "weather" ? "#0f172a" : "#94a3b8"
          }}
          onClick={() => setActiveTab("weather")}
        >
          🌤️ Weather Overview
        </button>
      </div>

      {/* Input Form for Manual Lat/Long */}
      <div style={styles.inputCard}>
        <h3 style={{ margin: "0 0 12px 0", color: "#38bdf8" }}>🌐 Direct Coordinates Input</h3>
        <form onSubmit={handleCustomCoordinatesSubmit} style={styles.formRow}>
          <input
            type="number"
            step="any"
            placeholder="Latitude (e.g. 33.5510)"
            value={inputLat}
            onChange={(e) => setInputLat(e.target.value)}
            style={styles.inputField}
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude (e.g. 73.1232)"
            value={inputLon}
            onChange={(e) => setInputLon(e.target.value)}
            style={styles.inputField}
          />
          <button type="submit" style={styles.submitBtn}>
            Fetch Weather
          </button>
          <button 
            type="button" 
            onClick={detectUserGPSLocation} 
            style={styles.gpsBtn}
            title="Detect GPS"
          >
             Auto GPS
          </button>
        </form>
        {inputError && <p style={styles.errorText}>{inputError}</p>}
      </div>

      {loading && <p style={{ textAlign: "center", marginTop: "20px" }}>Loading Weather Data...</p>}

      {/* Tab 1: Live Location Details */}
      {!loading && activeTab === "location" && (
        <div style={styles.section}>
          <h2>📍 Location & Coordinates Details</h2>
          {localWeather ? (
            <div style={styles.card}>
              <h3>
                {localWeather.city}, {localWeather.country}
              </h3>
              <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
                Latitude: <strong>{localWeather.lat}</strong>
              </p>
              <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
                Longitude: <strong>{localWeather.lon}</strong>
              </p>
              <p style={{ color: "#38bdf8", marginTop: "15px", fontSize: "1.2rem", fontWeight: "bold" }}>
                Current Temp: {localWeather.temp}°C ({localWeather.condition})
              </p>
            </div>
          ) : (
            <p>Fetching exact live location...</p>
          )}

          <h3 style={{ marginTop: "30px" }}>🌐 Global Cities Coordinates</h3>
          <div style={styles.grid}>
            {GLOBAL_CITIES.map((city, index) => (
              <div key={index} style={styles.smallCard}>
                <img 
                  src={city.image} 
                  alt={city.name} 
                  style={styles.cityImg} 
                />
                <h4 style={{ margin: "10px 0 5px 0" }}>{city.name}, {city.country}</h4>
                <p style={{ margin: "3px 0" }}>Latitude: {city.lat}</p>
                <p style={{ margin: "3px 0" }}>Longitude: {city.lon}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Weather Overview */}
      {!loading && activeTab === "weather" && (
        <div style={styles.section}>
          <h2>🌤️ Live Weather Overview</h2>

          {localWeather && (
            <div style={{ ...styles.card, marginBottom: "30px" }}>
              <h3>📍 Location: {localWeather.city}, {localWeather.country}</h3>
              <h1 style={styles.tempText}>{localWeather.temp}°C</h1>
              <p>Condition: <strong>{localWeather.condition}</strong></p>
            </div>
          )}

          <h3>Global Cities Weather</h3>
          <div style={styles.grid}>
            {citiesWeather.map((city, index) => (
              <div key={index} style={styles.smallCard}>
                <img 
                  src={city.image} 
                  alt={city.name} 
                  style={styles.cityImg} 
                />
                <div style={{ fontSize: "1.5rem", marginTop: "8px" }}>{city.icon}</div>
                <h4 style={{ margin: "5px 0" }}>{city.name}, {city.country}</h4>
                <h2 style={styles.tempText}>{city.temp}°C</h2>
                <p style={{ margin: "3px 0" }}>Condition: <strong>{city.condition}</strong></p>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>
                  Wind Speed: {city.wind} km/h
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#6a84c27b",
    color: "#ffffff",
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  backBtn: {
    backgroundColor: "#193665",
    color: "#38bdf8",
    border: "1px solid #334155",
    fontSize: "1.4rem",
    fontWeight: "bold",
    padding: "4px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  logoutBtn: {
    backgroundColor: "#c45454",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  tabContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px"
  },
  tabBtn: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  inputCard: {
    backgroundColor: "#1e293b",
    padding: "18px 22px",
    borderRadius: "12px",
    border: "1px solid #334155",
    marginBottom: "25px",
    maxWidth: "750px"
  },
  formRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center"
  },
  inputField: {
    flex: "1 1 180px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontSize: "0.95rem",
    outline: "none"
  },
  submitBtn: {
    backgroundColor: "#38bdf8",
    color: "#0f172a",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  gpsBtn: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  errorText: {
    color: "#f87171",
    fontSize: "0.9rem",
    marginTop: "10px",
    marginBottom: 0
  },
  section: {
    animation: "fadeIn 0.3s ease"
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    borderLeft: "5px solid #38bdf8",
    maxWidth: "500px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "15px"
  },
  smallCard: {
    background: "#1b3257",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #153056",
    textAlign: "center",
    overflow: "hidden"
  },
  cityImg: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "8px"
  },
  tempText: {
    fontSize: "2.2rem",
    margin: "8px 0",
    color: "#38bdf8"
  }
};

export default Dashboard;