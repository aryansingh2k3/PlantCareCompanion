const axios = require('axios');

const getWeatherData = async (city) => {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) return null;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    const { main, weather } = response.data;
    
    // Logic for watering recommendations based on weather
    let recommendation = "Maintain normal schedule.";
    if (main.temp > 30) {
      recommendation = "High temperature detected. Consider watering more frequently.";
    } else if (weather[0].main === 'Rain') {
      recommendation = "Rain detected. You may skip watering today if outdoors.";
    }

    return {
      temp: main.temp,
      condition: weather[0].main,
      recommendation
    };
  } catch (error) {
    console.error('Weather API Error:', error.message);
    return null;
  }
};

module.exports = { getWeatherData };
