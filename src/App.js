import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=';
const CITIES = [
  { name: 'Toronto', lat: 43.653225, lon: -79.383186 },
  { name: 'Ottowa', lat: 45.42, lon: -75.69},
  { name: 'Hamilton', lat: 43.26, lon: -79.87 },
  { name: 'London', lat: 42.98, lon: -81.25 },
  { name: 'Mississauga', lat: 43.59, lon: -79.64 },
  { name: 'Brampton', lat: 43.68, lon: -79.76 },
  { name: 'Markham', lat: 43.85, lon: -79.34 },
  { name: 'Windsor', lat: 42.31, lon: -83.04 },
  { name: 'Kichener', lat: 43.45, lon: -80.49 },
  { name: 'Kingston', lat: 44.23, lon: -76.49 },
  // Add more cities as needed
];

const App = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,weather_code,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, [selectedCity]);
  const renderForecast = () => {
    if (!weatherData) return null;
  
    const { current, daily } = weatherData;
    const today = new Date(current.time);
  
    return (
      <div className="main-content">
        <div className="current-temp" style={{ width: '60%' }}>
          <h2>{today.toLocaleDateString(undefined, { weekday: 'long' })}</h2>
          <h2>{today.toUTCString()}</h2>
          <div className="current-info">
            <h2>Current Temperature: {current.temperature_2m}°C</h2>
            <h2>High: {daily.temperature_2m_max[0]}°C</h2>
            <h2>Low: {daily.temperature_2m_min[0]}°C</h2>
            <h2>Humidity: {current.relative_humidity_2m}%</h2>
            <h2>Precipitation: {current.precipitation}mm</h2>
            <h2>Wind Speed: {current.wind_speed_10m}km/h</h2>
          </div>


        </div>
        <div className="SevenDayForecast" style={{ width: '30%' }}>
          <h2>7-Day Forecast:</h2>
          <ul>
            {daily.temperature_2m_max.map((maxTemp, index) => (
              <li key={index}>
                {new Date(weatherData.daily.time[index]).toUTCString().split(',')[0]}
                <br />
                {maxTemp}°C / {daily.temperature_2m_min[index]}°C
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>101351543 - Weather App</h1>
      <label><b>Select a city:</b></label>
      <select onChange={(e) => setSelectedCity(CITIES.find((city) => city.name === e.target.value))}>
        {CITIES.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
      {renderForecast()}
    </div>
  );
};

export default App;