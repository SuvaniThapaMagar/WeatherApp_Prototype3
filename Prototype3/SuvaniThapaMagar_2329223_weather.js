const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

function fetchWeather(city) {
  const APIKey = '684f6b931569a4243c07634eb61fc2f9';

  const weatherData = localStorage.getItem(city);

  if (weatherData) {
    // Weather data exists in local storage
    showWeatherData(JSON.parse(weatherData), 'Local Storage');
    alert('Weather data retrieved from Local Storage');
    console.log("Data was retrieved from local storage")
  } else {
    // Fetch weather data from API
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
      .then(response => response.json())
      .then(json => {
        showWeatherData(json, 'API');
        alert('Weather data retrieved from API');
        console.log("Data was retrieved from API")
        // Store weather data in local storage
        localStorage.setItem(city, JSON.stringify(json));
      });
  }
}

function showWeatherData(data, source) {
  const place = document.querySelector('.weather-box .town');
  const image = document.querySelector('.weather-box img');
  const temperature = document.querySelector('.weather-box .temperature');
  const description = document.querySelector('.weather-box .description');
  const humidity = document.querySelector('.weather-details .humidity span');
  const wind = document.querySelector('.weather-details .wind span');

  switch (data.weather[0].main) {
    case 'Clear':
      image.src = 'imgs/SuvaniThapaMagar_2329223_clear.png';
      break;
    case 'Rain':
      image.src = 'imgs/SuvaniThapaMagar_2329223_rain.png';
      break;
    case 'Snow':
      image.src = 'imgs/SuvaniThapaMagar_2329223_snow.png';
      break;
    case 'Clouds':
      image.src = 'imgs/SuvaniThapaMagar_2329223_cloud.png';
      break;
    case 'Haze':
      image.src = 'imgs/SuvaniThapaMagar_2329223_mist.png';
      break;
    default:
      image.src = '';
  }
  place.innerHTML = `${data.name}`
  temperature.innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`;
  description.innerHTML = `${data.weather[0].description}`;
  humidity.innerHTML = `${data.main.humidity}%`;
  wind.innerHTML = `${parseInt(data.wind.speed)}Km/h`;
}

function fetchForecast(city) {
    const APIKey = '684f6b931569a4243c07634eb61fc2f9';
  
    fetch(`http://localhost/FinalWeather/SuvaniThapaMagar_2329223_myapi.php?city=${city}`)
      .then(response => response.json())
      .then(json => {
        // Send the weather forecast data to the server for database storage
        saveForecastData(city, json);
      });
  }
  
// Fetch weather for Suffolk on page load
fetchWeather('Scottsboro');

// Event listener for search button
search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetchWeather(city);
});
