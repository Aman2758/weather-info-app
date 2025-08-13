const apiKey = "8393084a1de4c4fe38f9e0c0c44e363f"; // 🔑 Replace with your OpenWeatherMap API key

// User name storage (no localStorage)
let userName = '';

// Theme management
let currentTheme = 'light';

// Weather icon mapping
const weatherIcons = {
  '01d': 'fas fa-sun',
  '01n': 'fas fa-moon',
  '02d': 'fas fa-cloud-sun',
  '02n': 'fas fa-cloud-moon',
  '03d': 'fas fa-cloud',
  '03n': 'fas fa-cloud',
  '04d': 'fas fa-cloud',
  '04n': 'fas fa-cloud',
  '09d': 'fas fa-cloud-rain',
  '09n': 'fas fa-cloud-rain',
  '10d': 'fas fa-cloud-sun-rain',
  '10n': 'fas fa-cloud-moon-rain',
  '11d': 'fas fa-bolt',
  '11n': 'fas fa-bolt',
  '13d': 'fas fa-snowflake',
  '13n': 'fas fa-snowflake',
  '50d': 'fas fa-smog',
  '50n': 'fas fa-smog'
};

// Weather background management
let currentWeatherBackground = '';

// Apply weather-based background
function applyWeatherBackground(weatherData) {
  const weatherBackground = document.getElementById('weatherBackground');
  const weatherCondition = weatherData.weather[0].main.toLowerCase();
  const weatherDescription = weatherData.weather[0].description.toLowerCase();
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;
  
  // Remove previous background class
  weatherBackground.className = 'weather-background';
  
  // Determine background type based on weather and time
  let backgroundType = 'clear';
  
  if (weatherCondition.includes('rain') || weatherDescription.includes('drizzle')) {
    backgroundType = 'rainy';
  } else if (weatherCondition.includes('snow')) {
    backgroundType = 'snowy';
  } else if (weatherCondition.includes('thunder') || weatherDescription.includes('storm')) {
    backgroundType = 'stormy';
  } else if (weatherCondition.includes('cloud') || weatherDescription.includes('overcast')) {
    backgroundType = 'cloudy';
  } else if (isNight) {
    backgroundType = 'night';
  } else {
    backgroundType = 'clear';
  }
  
  // Apply new background
  weatherBackground.classList.add(backgroundType);
  currentWeatherBackground = backgroundType;
  
  // Create particle effects based on weather
  createWeatherParticles(backgroundType);
  
  // Add page transition effect
  document.body.classList.add('page-transition');
  setTimeout(() => {
    document.body.classList.remove('page-transition');
  }, 800);
}

// Create weather-specific particle effects
function createWeatherParticles(weatherType) {
  const particleContainer = document.querySelector('.particle-container');
  if (particleContainer) {
    particleContainer.remove();
  }
  
  const container = document.createElement('div');
  container.className = 'particle-container';
  document.body.appendChild(container);
  
  const particleCount = getParticleCount(weatherType);
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Set particle properties based on weather type
    const properties = getParticleProperties(weatherType);
    Object.assign(particle.style, properties);
    
    // Randomize position and animation delay
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    container.appendChild(particle);
  }
}

// Get particle count based on weather type
function getParticleCount(weatherType) {
  const counts = {
    'clear': 20,
    'cloudy': 15,
    'rainy': 50,
    'snowy': 80,
    'stormy': 30,
    'night': 40
  };
  return counts[weatherType] || 20;
}

// Get particle properties based on weather type
function getParticleProperties(weatherType) {
  const properties = {
    'clear': {
      width: '2px',
      height: '2px',
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '50%'
    },
    'cloudy': {
      width: '3px',
      height: '3px',
      background: 'rgba(255, 255, 255, 0.4)',
      borderRadius: '50%'
    },
    'rainy': {
      width: '1px',
      height: '20px',
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '0'
    },
    'snowy': {
      width: '3px',
      height: '3px',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '50%'
    },
    'stormy': {
      width: '2px',
      height: '15px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '0'
    },
    'night': {
      width: '1px',
      height: '1px',
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '50%'
    }
  };
  return properties[weatherType] || properties['clear'];
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  console.log('Weather app loaded - Audio features ready!');
  console.log('To test weather sounds:');
  console.log('1. Search for any city (e.g., "London")');
  console.log('2. Scroll down to "Weather Experience" section');
  console.log('3. Click "Play Weather Sound" button');
  console.log('4. Check console for debugging messages');
  
  initializeApp();
  setupEventListeners();
  initializeTheme();
  resetLoadingState(); // Ensure loading spinner is hidden on startup
});

// Reset loading state
function resetLoadingState() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  if (loadingSpinner) {
    loadingSpinner.classList.add('hidden');
    loadingSpinner.style.display = 'none';
    loadingSpinner.style.visibility = 'hidden';
    console.log('Loading state reset');
  }
}

// Initialize the app
function initializeApp() {
  // Always show welcome modal
  showWelcomeModal();
}

// Initialize theme
function initializeTheme() {
  const savedTheme = localStorage.getItem('weatherAppTheme') || 'light';
  setTheme(savedTheme);
}

// Toggle theme
function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Set theme
function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('weatherAppTheme', theme);
  
  // Update theme button
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-moon';
    themeText.textContent = 'Dark Mode';
  } else {
    themeIcon.className = 'fas fa-sun';
    themeText.textContent = 'Light Mode';
  }
}

// Show welcome modal
function showWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  const mainContainer = document.getElementById('mainContainer');
  
  modal.classList.remove('hidden');
  mainContainer.style.display = 'none';
  
  // Focus on input
  setTimeout(() => {
    document.getElementById('userName').focus();
  }, 500);
}

// Show main app
function showMainApp() {
  const modal = document.getElementById('welcomeModal');
  const mainContainer = document.getElementById('mainContainer');
  
  modal.classList.add('hidden');
  mainContainer.style.display = 'block';
  
  // Ensure loading spinner is hidden when app starts
  hideLoading();
  
  // Update greeting
  updateGreeting();
}

// Submit name and proceed to app
function submitName() {
  const nameInput = document.getElementById('userName');
  const name = nameInput.value.trim();
  
  if (!name) {
    // Add shake animation to input
    nameInput.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      nameInput.style.animation = '';
    }, 500);
    return;
  }
  
  // Save name to localStorage for persistence
  localStorage.setItem('userName', name);
  
  // Set name for current session
  userName = name;
  
  // Hide modal with animation
  const modal = document.getElementById('welcomeModal');
  modal.style.animation = 'fadeOut 0.5s ease-in-out';
  
  setTimeout(() => {
    showMainApp();
  }, 500);
}

// Update greeting message
function updateGreeting() {
  const userName = localStorage.getItem('userName') || 'Weather Enthusiast';
  const greetingElement = document.getElementById('userGreeting');
  const timeEmojiElement = document.getElementById('timeEmoji');
  const currentHour = new Date().getHours();
  
  let greeting = '';
  let emoji = '';
  let timeEffect = '';
  
  if (currentHour >= 5 && currentHour < 12) {
    greeting = `Good morning, ${userName}!`;
    emoji = '🌅';
    timeEffect = 'day';
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = `Good afternoon, ${userName}!`;
    emoji = '☀️';
    timeEffect = 'day';
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = `Good evening, ${userName}!`;
    emoji = '🌆';
    timeEffect = 'evening';
  } else {
    greeting = `Good night, ${userName}!`;
    emoji = '🌙';
    timeEffect = 'night';
  }
  
  greetingElement.textContent = greeting;
  
  // Update the time emoji if the element exists
  if (timeEmojiElement) {
    timeEmojiElement.textContent = emoji;
  }
  
  // Update time-based visual effects
  updateTimeEffects(timeEffect);
}

// Update time-based visual effects
function updateTimeEffects(timeEffect) {
  const dayEffect = document.querySelector('.day-effect');
  const eveningEffect = document.querySelector('.evening-effect');
  const nightEffect = document.querySelector('.night-effect');
  
  // Hide all effects first
  if (dayEffect) dayEffect.style.opacity = '0';
  if (eveningEffect) eveningEffect.style.opacity = '0';
  if (nightEffect) nightEffect.style.opacity = '0';
  
  // Show the appropriate effect
  switch (timeEffect) {
    case 'day':
      if (dayEffect) {
        dayEffect.style.opacity = '1';
        dayEffect.style.animation = 'dayEffectShow 0.5s ease-in-out';
      }
      break;
    case 'evening':
      if (eveningEffect) {
        eveningEffect.style.opacity = '1';
        eveningEffect.style.animation = 'eveningEffectShow 0.5s ease-in-out';
      }
      break;
    case 'night':
      if (nightEffect) {
        nightEffect.style.opacity = '1';
        nightEffect.style.animation = 'nightEffectShow 0.5s ease-in-out';
      }
      break;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Initialize audio context on first user interaction
  document.addEventListener('click', function initAudioOnInteraction() {
    if (!audioContext) {
      initAudioContext();
      console.log('Audio context initialized on user interaction');
    }
    document.removeEventListener('click', initAudioOnInteraction);
  }, { once: true });
  
  // Setup scroll animations
  setupScrollAnimations();
  
  // Unit toggle event listener
  document.querySelectorAll('input[name="unit"]').forEach(radio => {
    radio.addEventListener('change', function() {
      // If weather is already displayed, refresh with new units
      if (!document.getElementById("weatherResult").classList.contains("hidden")) {
        const city = document.getElementById("cityInput").value.trim();
        if (city) {
          getWeather();
        }
      }
    });
  });

  // Enter key support for input
  document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });

  // Enter key support for welcome modal
  document.getElementById("userName").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      submitName();
    }
  });
}

// Get selected unit
function getSelectedUnit() {
  return document.querySelector('input[name="unit"]:checked').value;
}

// Get unit symbol
function getUnitSymbol() {
  return getSelectedUnit() === 'metric' ? '°C' : '°F';
}

// Get speed unit
function getSpeedUnit() {
  return getSelectedUnit() === 'metric' ? 'm/s' : 'mph';
}

// Show loading spinner
function showLoading() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  const loadingText = document.getElementById('loadingText');
  
  if (loadingSpinner) {
    loadingSpinner.classList.remove('hidden');
    loadingSpinner.style.display = 'flex';
    loadingSpinner.style.visibility = 'visible';
    console.log('Loading spinner shown');
    
    // Start dynamic loading text
    startLoadingText(loadingText);
  } else {
    console.error('Loading spinner element not found');
  }
  
  document.getElementById('weatherResult').classList.add('hidden');
  document.getElementById('forecastResult').classList.add('hidden');
  document.getElementById('weatherTips').classList.add('hidden');
  document.getElementById('weatherWidgets').classList.add('hidden');
}

// Dynamic loading text function
function startLoadingText(loadingTextElement) {
  const loadingMessages = [
    "Scanning weather data...",
    "Analyzing conditions...",
    "Gathering forecast...",
    "Processing location...",
    "Almost ready..."
  ];
  
  let messageIndex = 0;
  
  const textInterval = setInterval(() => {
    if (loadingTextElement && !loadingTextElement.parentElement.classList.contains('hidden')) {
      loadingTextElement.textContent = loadingMessages[messageIndex];
      messageIndex = (messageIndex + 1) % loadingMessages.length;
    } else {
      clearInterval(textInterval);
    }
  }, 800);
  
  // Store interval ID to clear it later
  window.loadingTextInterval = textInterval;
}

// Hide loading spinner
function hideLoading() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  
  // Clear the text interval
  if (window.loadingTextInterval) {
    clearInterval(window.loadingTextInterval);
    window.loadingTextInterval = null;
  }
  
  if (loadingSpinner) {
    // Add fade-out effect
    loadingSpinner.style.opacity = '0';
    loadingSpinner.style.transform = 'scale(0.9)';
    loadingSpinner.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    
    setTimeout(() => {
      loadingSpinner.classList.add('hidden');
      loadingSpinner.style.display = 'none';
      loadingSpinner.style.visibility = 'hidden';
      loadingSpinner.style.opacity = '1';
      loadingSpinner.style.transform = 'scale(1)';
      console.log('Loading spinner hidden');
    }, 500);
  } else {
    console.error('Loading spinner element not found');
  }
}

// Get weather icon
function getWeatherIcon(iconCode) {
  return weatherIcons[iconCode] || 'fas fa-question';
}

// Format date
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Get current location weather
function getCurrentLocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by this browser.');
    return;
  }

  // Check if running on HTTPS (required for geolocation)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    showError('Geolocation requires HTTPS. Please use a secure connection or localhost.');
    return;
  }

  // Update button text to show progress
  const locationBtn = document.getElementById('locationBtn');
  const locationBtnText = document.getElementById('locationBtnText');
  const originalText = locationBtnText.textContent;
  
  locationBtn.disabled = true;
  locationBtnText.textContent = 'Getting Location...';
  
  showLoading();
  
  // Configure geolocation options
  const options = {
    enableHighAccuracy: true,
    timeout: 15000, // 15 seconds
    maximumAge: 300000 // 5 minutes
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log('Location obtained:', { latitude, longitude });
      
      // Update button text
      locationBtnText.textContent = 'Fetching Weather...';
      
      getWeatherByCoords(latitude, longitude);
    },
    (error) => {
      hideLoading();
      
      // Reset button
      locationBtn.disabled = false;
      locationBtnText.textContent = originalText;
      
      let errorMessage = 'Unable to get your location. ';
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Location permission was denied. Please allow location access in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information is unavailable. Please try again.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Location request timed out. Please try again.';
          break;
        default:
          errorMessage += 'Please enter a city name instead.';
      }
      
      showError(errorMessage);
      console.error('Geolocation error:', error);
    },
    options
  );
}

// Get weather by coordinates
function getWeatherByCoords(lat, lon) {
  const unit = getSelectedUnit();
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  console.log('Fetching weather data for coordinates:', { lat, lon });

  Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl),
    fetch(uvUrl),
    fetch(airQualityUrl)
  ])
  .then(responses => Promise.all(responses.map(res => {
    if (!res.ok) throw new Error('Weather data not available for this location');
    return res.json();
  })))
  .then(([currentData, forecastData, uvData, airQualityData]) => {
    console.log('Weather data received successfully');
    
    // Add UV and Air Quality data to current weather data
    currentData.uv = uvData;
    currentData.airQuality = airQualityData;
    
    // Add a small delay before hiding loading to show "Almost ready..." message
    setTimeout(() => {
      hideLoading();
      displayWeather(currentData);
      displayForecast(forecastData);
      displayWeatherTips(currentData);
      displayWeatherWidgets(currentData);
    }, 1000);
  })
  .catch(error => {
    hideLoading();
    console.error('Weather fetch error:', error);
    showError(error.message);
    
    // Reset location button
    const locationBtn = document.getElementById('locationBtn');
    const locationBtnText = document.getElementById('locationBtnText');
    locationBtn.disabled = false;
    locationBtnText.textContent = 'My Location';
  });
}

// Get weather for entered city
function getWeather() {
  const city = document.getElementById("cityInput").value.trim();

  if (!city) {
    showError("Please enter a city name!");
    return;
  }

  console.log('Starting weather fetch for:', city);
  showLoading();
  
  // Add a longer delay to ensure loading spinner is visible and engaging
  setTimeout(() => {
    const unit = getSelectedUnit();
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${unit}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${unit}`;
    
    // Get coordinates for UV Index and Air Quality
    fetch(currentUrl)
      .then(response => {
        if (!response.ok) throw new Error('City not found');
        return response.json();
      })
      .then(currentData => {
        const { lat, lon } = currentData.coord;
        const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        
        console.log('Fetching weather data...');

        Promise.all([
          fetch(forecastUrl),
          fetch(uvUrl),
          fetch(airQualityUrl)
        ])
        .then(responses => Promise.all(responses.map(res => {
          if (!res.ok) throw new Error('Data not available');
          return res.json();
        })))
        .then(([forecastData, uvData, airQualityData]) => {
          console.log('Weather data received successfully');
          
          // Add UV and Air Quality data to current weather data
          currentData.uv = uvData;
          currentData.airQuality = airQualityData;
          
          // Add a small delay before hiding loading to show "Almost ready..." message
          setTimeout(() => {
            hideLoading();
            displayWeather(currentData);
            displayForecast(forecastData);
            displayWeatherTips(currentData);
            displayWeatherWidgets(currentData);
          }, 1000);
        })
        .catch(error => {
          console.error('Weather fetch error:', error);
          hideLoading();
          showError(error.message);
        });
      })
      .catch(error => {
        console.error('Weather fetch error:', error);
        hideLoading();
        showError(error.message);
      });
  }, 1500); // Increased delay for better loading experience
}

// Enhanced display weather function with background
function displayWeather(data) {
  const resultDiv = document.getElementById("weatherResult");
  const unitSymbol = getUnitSymbol();
  const speedUnit = getSpeedUnit();
  
  // Apply weather-based background
  applyWeatherBackground(data);
  
  // Convert sunrise/sunset times
  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Calculate feels like temperature (simplified)
  const feelsLike = data.main.feels_like || data.main.temp;

  // Get UV Index and Air Quality information
  const uvValue = data.uv ? data.uv.value : null;
  const uvInfo = uvValue ? getUVInfo(uvValue) : null;
  const aqi = data.airQuality ? data.airQuality.list[0].main.aqi : null;
  const airQualityInfo = aqi ? getAirQualityInfo(aqi) : null;

  const weather = `
    <h2><i class="fas fa-map-marker-alt"></i> ${data.name}, ${data.sys.country}</h2>
    
    <div class="weather-icon weather-icon-3d" onclick="playWeatherSoundOnIcon('${data.weather[0].main.toLowerCase()}', ${data.main.temp})" style="cursor: pointer;" title="Click to hear weather sound">
      <i class="${getWeatherIcon(data.weather[0].icon)}"></i>
    </div>
    
    <div class="weather-info">
      <div class="weather-item">
        <i class="fas fa-thermometer-half"></i>
        <strong>Temperature</strong>
        <span>${data.main.temp} ${unitSymbol}</span>
      </div>
      
      <div class="weather-item">
        <i class="fas fa-thermometer-half"></i>
        <strong>Feels Like</strong>
        <span>${feelsLike} ${unitSymbol}</span>
      </div>
      
      <div class="weather-item">
        <i class="fas fa-cloud"></i>
        <strong>Condition</strong>
        <span>${data.weather[0].main}</span>
      </div>
      
      <div class="weather-item">
        <i class="fas fa-tint"></i>
        <strong>Humidity</strong>
        <span>${data.main.humidity}%</span>
      </div>
      
      <div class="weather-item">
        <i class="fas fa-wind"></i>
        <strong>Wind Speed</strong>
        <span>${data.wind.speed} ${speedUnit}</span>
      </div>
      
      <div class="weather-item">
        <i class="fas fa-compress-arrows-alt"></i>
        <strong>Pressure</strong>
        <span>${data.main.pressure} hPa</span>
      </div>
      
      <div class="weather-item">
        <i class="fas fa-eye"></i>
        <strong>Visibility</strong>
        <span>${(data.visibility / 1000).toFixed(1)} km</span>
      </div>
      
      ${uvValue ? `
      <div class="weather-item uv-item" style="border-left: 4px solid ${uvInfo.color};">
        <i class="fas fa-sun"></i>
        <strong>UV Index</strong>
        <span style="color: ${uvInfo.color}; font-weight: bold;">${uvValue} (${uvInfo.level})</span>
      </div>
      ` : ''}
      
      ${aqi ? `
      <div class="weather-item aqi-item" style="border-left: 4px solid ${airQualityInfo.color};">
        <i class="fas fa-wind"></i>
        <strong>Air Quality</strong>
        <span style="color: ${airQualityInfo.color}; font-weight: bold;">${aqi} (${airQualityInfo.level})</span>
      </div>
      ` : ''}
      
      <div class="weather-item">
        <i class="fas fa-sun"></i>
        <strong>Sunrise</strong>
        <span>${sunrise}</span>
      </div>
      
      <div class="weather-item">
        <i class="fas fa-moon"></i>
        <strong>Sunset</strong>
        <span>${sunset}</span>
      </div>
    </div>
    
    ${(uvInfo || airQualityInfo) ? `
    <div class="health-info">
      <h3><i class="fas fa-heartbeat"></i> Health Recommendations</h3>
      <div class="health-recommendations">
        ${uvInfo ? `
        <div class="health-item uv-recommendation">
          <div class="health-header">
            <i class="fas fa-sun" style="color: ${uvInfo.color};"></i>
            <strong>UV Protection</strong>
          </div>
          <p>${uvInfo.recommendation}</p>
        </div>
        ` : ''}
        
        ${airQualityInfo ? `
        <div class="health-item aqi-recommendation">
          <div class="health-header">
            <i class="fas fa-lungs" style="color: ${airQualityInfo.color};"></i>
            <strong>Air Quality</strong>
          </div>
          <p>${airQualityInfo.recommendation}</p>
        </div>
        ` : ''}
      </div>
    </div>
    ` : ''}
  `;

  resultDiv.innerHTML = weather;
  resultDiv.classList.remove("hidden");
  
  // Trigger scroll animation after a short delay
  setTimeout(() => {
    resultDiv.classList.add('animate-in');
  }, 100);
  
  // Add backup event listener for weather icon
  setTimeout(() => {
    const weatherIcon = document.querySelector('.weather-icon-3d');
    if (weatherIcon) {
      weatherIcon.addEventListener('click', function() {
        console.log('Backup click event triggered');
        const condition = data.weather[0].main.toLowerCase();
        const temp = data.main.temp;
        playWeatherSoundOnIcon(condition, temp);
      });
    }
  }, 100);
  
  // Store current weather data for widgets
  window.currentWeatherData = data;
  
  // Display smart features
  displaySmartFeatures(data);
  
  // Display weather enhancements
  displayWeatherEnhancements(data);
  
  // Display weather widgets
  displayWeatherWidgets(data);
}

// Display weather tips
function displayWeatherTips(data) {
  const tipsDiv = document.getElementById("weatherTips");
  const tipsContent = document.getElementById("tipsContent");
  
  const temp = data.main.temp;
  const condition = data.weather[0].main.toLowerCase();
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const uvValue = data.uv ? data.uv.value : null;
  const aqi = data.airQuality ? data.airQuality.list[0].main.aqi : null;
  
  let tips = [];
  
  // Temperature-based tips
  if (temp < 0) {
    tips.push({
      title: "❄️ Cold Weather",
      tip: "Bundle up! Wear warm layers, gloves, and a hat. Consider thermal underwear for extra warmth."
    });
  } else if (temp < 10) {
    tips.push({
      title: "🧥 Cool Weather",
      tip: "Wear a jacket or coat. Consider bringing an umbrella in case of rain."
    });
  } else if (temp < 20) {
    tips.push({
      title: "🌤️ Mild Weather",
      tip: "Light jacket or sweater should be sufficient. Perfect weather for outdoor activities!"
    });
  } else if (temp < 30) {
    tips.push({
      title: "☀️ Warm Weather",
      tip: "Light clothing recommended. Stay hydrated and consider sunscreen if spending time outdoors."
    });
  } else {
    tips.push({
      title: "🔥 Hot Weather",
      tip: "Stay cool! Wear light, loose clothing. Stay hydrated and avoid strenuous activities during peak hours."
    });
  }
  
  // UV Index tips
  if (uvValue) {
    const uvInfo = getUVInfo(uvValue);
    tips.push({
      title: `☀️ UV Index: ${uvValue} (${uvInfo.level})`,
      tip: uvInfo.recommendation
    });
  }
  
  // Air Quality tips
  if (aqi) {
    const airQualityInfo = getAirQualityInfo(aqi);
    tips.push({
      title: `🌬️ Air Quality: ${aqi} (${airQualityInfo.level})`,
      tip: airQualityInfo.recommendation
    });
  }
  
  // Condition-based tips
  if (condition.includes('rain')) {
    tips.push({
      title: "🌧️ Rainy Weather",
      tip: "Bring an umbrella or raincoat. Wear waterproof shoes and be careful of slippery surfaces."
    });
  } else if (condition.includes('snow')) {
    tips.push({
      title: "❄️ Snowy Weather",
      tip: "Wear warm, waterproof boots. Drive carefully and allow extra time for travel."
    });
  } else if (condition.includes('storm')) {
    tips.push({
      title: "⛈️ Stormy Weather",
      tip: "Stay indoors if possible. Avoid open areas and tall objects. Keep emergency supplies ready."
    });
  } else if (condition.includes('fog')) {
    tips.push({
      title: "🌫️ Foggy Weather",
      tip: "Drive with extra caution. Use low-beam headlights and maintain safe following distance."
    });
  }
  
  // Humidity tips
  if (humidity > 80) {
    tips.push({
      title: "💧 High Humidity",
      tip: "Stay hydrated and wear breathable clothing. Consider using a dehumidifier indoors."
    });
  } else if (humidity < 30) {
    tips.push({
      title: "🏜️ Low Humidity",
      tip: "Use moisturizer and stay hydrated. Consider using a humidifier to prevent dry skin."
    });
  }
  
  // Wind tips
  if (windSpeed > 20) {
    tips.push({
      title: "💨 Strong Winds",
      tip: "Secure loose objects outdoors. Be cautious of falling branches and debris."
    });
  }
  
  // Limit to 6 tips to avoid overwhelming the user
  tips = tips.slice(0, 6);
  
  const tipsHTML = tips.map(tip => `
    <div class="tip-item">
      <h4>${tip.title}</h4>
      <p>${tip.tip}</p>
    </div>
  `).join('');
  
  tipsContent.innerHTML = tipsHTML;
  tipsDiv.classList.remove("hidden");
  
  // Trigger scroll animation
  setTimeout(() => {
    tipsDiv.classList.add('animate-in');
  }, 200);
}

// Display weather widgets section
function displayWeatherWidgets(data) {
  console.log('Displaying weather widgets for:', data.name);
  
  const widgetsDiv = document.getElementById("weatherWidgets");
  if (!widgetsDiv) {
    console.error('Weather widgets div not found!');
    return;
  }
  
  widgetsDiv.classList.remove("hidden");
  
  // Trigger scroll animation
  setTimeout(() => {
    widgetsDiv.classList.add('animate-in');
  }, 300);
  
  // Store current weather data for widget creation
  window.currentWeatherData = data;
  
  console.log('Weather widgets section displayed successfully');
}

// Create weather widget
function createWidget() {
  if (!window.currentWeatherData) {
    alert('Please get weather data first before creating a widget!');
    return;
  }
  
  const data = window.currentWeatherData;
  const unitSymbol = getUnitSymbol();
  const speedUnit = getSpeedUnit();
  
  // Create widget HTML with animations
  const widgetHTML = `
    <div class="weather-widget animated">
      <div class="widget-location">
        <i class="fas fa-map-marker-alt location-icon"></i>
        ${data.name}, ${data.sys.country}
      </div>
      <div class="widget-icon-container">
        <div class="widget-icon">
          <i class="${getWeatherIcon(data.weather[0].icon)}"></i>
        </div>
        <div class="icon-glow"></div>
      </div>
      <div class="widget-temp">${data.main.temp}${unitSymbol}</div>
      <div class="widget-condition">${data.weather[0].main}</div>
      <div class="widget-details">
        <div class="widget-detail">
          <i class="fas fa-tint humidity-icon"></i> 
          <span>${data.main.humidity}%</span>
        </div>
        <div class="widget-detail">
          <i class="fas fa-wind wind-icon"></i> 
          <span>${data.wind.speed} ${speedUnit}</span>
        </div>
      </div>
      <div class="widget-footer">
        <i class="fas fa-cloud-sun"></i> Weather Info App
      </div>
    </div>
  `;
  
  // Update widget preview
  const widgetCard = document.getElementById('widgetCard');
  widgetCard.innerHTML = widgetHTML;
  
  // Show info section and enable download button
  document.getElementById('widgetInfo').style.display = 'block';
  document.getElementById('downloadBtn').disabled = false;
  
  // Scroll to widgets section
  document.getElementById('weatherWidgets').scrollIntoView({ behavior: 'smooth' });
}

// Download widget as animated image
function downloadWidget() {
  if (!window.currentWeatherData) {
    alert('Please create a widget first!');
    return;
  }
  
  const data = window.currentWeatherData;
  
  // Create canvas for the widget
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 300;
  
  // Set background gradient
  const gradient = ctx.createLinearGradient(0, 0, 400, 300);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 300);
  
  // Add animated elements
  drawAnimatedWidget(ctx, data);
  
  // Convert to blob and download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-widget-${data.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// Draw animated widget on canvas
function drawAnimatedWidget(ctx, data) {
  const unitSymbol = getUnitSymbol();
  const speedUnit = getSpeedUnit();
  
  // Add subtle animation frame
  const time = Date.now() * 0.001;
  
  // Draw animated background particles
  for (let i = 0; i < 20; i++) {
    const x = (i * 37) % 400;
    const y = (i * 23 + time * 10) % 300;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + 0.05 * Math.sin(time + i)})`;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw location text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 18px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(`${data.name}, ${data.sys.country}`, 200, 40);
  
  // Draw animated weather icon
  const iconSize = 60;
  const iconY = 120;
  const iconX = 200;
  
  // Icon glow effect
  const glowIntensity = 0.3 + 0.2 * Math.sin(time * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconSize + 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw weather icon (simplified representation)
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconSize, 0, Math.PI * 2);
  ctx.fill();
  
  // Add icon details based on weather
  if (data.weather[0].main.toLowerCase().includes('cloud')) {
    // Cloud effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(iconX - 15, iconY - 10, 15, 0, Math.PI * 2);
    ctx.arc(iconX + 15, iconY - 10, 15, 0, Math.PI * 2);
    ctx.arc(iconX, iconY, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (data.weather[0].main.toLowerCase().includes('rain')) {
    // Rain effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const x = iconX - 20 + i * 5;
      const y = iconY + 20;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 2, y + 15);
      ctx.stroke();
    }
  }
  
  // Draw temperature with animation
  const tempText = `${data.main.temp}${unitSymbol}`;
  ctx.fillStyle = 'white';
  ctx.font = 'bold 36px Segoe UI';
  ctx.textAlign = 'center';
  
  // Temperature glow effect
  const tempGlow = 0.2 + 0.1 * Math.sin(time * 3);
  ctx.fillStyle = `rgba(255, 255, 255, ${tempGlow})`;
  ctx.fillText(tempText, 200, 200);
  
  ctx.fillStyle = 'white';
  ctx.fillText(tempText, 200, 200);
  
  // Draw weather condition
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '16px Segoe UI';
  ctx.fillText(data.weather[0].main, 200, 225);
  
  // Draw details with icons
  const detailsY = 250;
  
  // Humidity
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '14px Segoe UI';
  ctx.textAlign = 'left';
  ctx.fillText(`💧 ${data.main.humidity}%`, 80, detailsY);
  
  // Wind
  ctx.textAlign = 'right';
  ctx.fillText(`💨 ${data.wind.speed} ${speedUnit}`, 320, detailsY);
  
  // Footer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '12px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('Powered by Weather Info App', 200, 285);
}

// Display forecast
function displayForecast(data) {
  const forecastDiv = document.getElementById("forecastResult");
  
  // Get daily forecasts (every 8th item, as data is in 3-hour intervals)
  // Start from index 0 to get 5 days (0, 8, 16, 24, 32)
  const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
  
  console.log('Forecast data:', data.list.length, 'items');
  console.log('Daily forecasts:', dailyForecasts.length, 'days');
  
  let forecastHTML = '<h3><i class="fas fa-calendar-alt"></i> 5-Day Forecast</h3><div class="forecast-grid">';
  
  dailyForecasts.forEach((forecast, index) => {
    const date = formatDate(forecast.dt);
    const temp = forecast.main.temp;
    const icon = getWeatherIcon(forecast.weather[0].icon);
    const description = forecast.weather[0].description;
    
    console.log(`Day ${index + 1}:`, date, temp, description);
    
    forecastHTML += `
      <div class="forecast-item" style="animation-delay: ${index * 0.2}s;">
        <div class="day">${date}</div>
        <div class="icon weather-icon-3d"><i class="${icon}"></i></div>
        <div class="temp">${temp} ${getUnitSymbol()}</div>
        <div class="description">${description}</div>
      </div>
    `;
  });
  
  forecastHTML += '</div>';
  forecastDiv.innerHTML = forecastHTML;
  forecastDiv.classList.remove("hidden");
  
  // Trigger scroll animation
  setTimeout(() => {
    forecastDiv.classList.add('animate-in');
  }, 700);
  
  // Display weather charts
  displayWeatherCharts(data);
  
  // Display smart features
  displaySmartFeatures(currentData);
}

// Show error message
function showError(message) {
  hideLoading(); // Hide loading spinner when showing error
  const resultDiv = document.getElementById("weatherResult");
  resultDiv.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
  resultDiv.classList.remove("hidden");
  document.getElementById("forecastResult").classList.add("hidden");
  document.getElementById("weatherTips").classList.add("hidden");
  document.getElementById("weatherWidgets").classList.add("hidden");
  document.getElementById("weatherCharts").classList.add("hidden");
  document.getElementById("smartFeatures").classList.add("hidden");
  document.getElementById("weatherEnhancements").classList.add("hidden");
}

// Get UV Index information and recommendations
function getUVInfo(uvValue) {
  let level, color, recommendation;
  
  if (uvValue <= 2) {
    level = "Low";
    color = "#4CAF50";
    recommendation = "No protection required. You can safely stay outside.";
  } else if (uvValue <= 5) {
    level = "Moderate";
    color = "#FF9800";
    recommendation = "Take precautions. Wear sunscreen, protective clothing, and seek shade during midday hours.";
  } else if (uvValue <= 7) {
    level = "High";
    color = "#FF5722";
    recommendation = "Protection required. Reduce time in the sun between 10 a.m. and 4 p.m. Wear protective clothing and sunscreen.";
  } else if (uvValue <= 10) {
    level = "Very High";
    color = "#9C27B0";
    recommendation = "Extra protection required. Minimize sun exposure during midday hours. Apply sunscreen every 2 hours.";
  } else {
    level = "Extreme";
    color = "#F44336";
    recommendation = "Avoid sun exposure. Take all precautions. Unprotected skin will burn quickly.";
  }
  
  return { level, color, recommendation };
}

// Get Air Quality information and recommendations
function getAirQualityInfo(aqi) {
  let level, color, recommendation;
  
  if (aqi <= 50) {
    level = "Good";
    color = "#4CAF50";
    recommendation = "Air quality is satisfactory. No health risks for the general population.";
  } else if (aqi <= 100) {
    level = "Moderate";
    color = "#FF9800";
    recommendation = "Air quality is acceptable. Sensitive individuals may experience minor health effects.";
  } else if (aqi <= 150) {
    level = "Unhealthy for Sensitive Groups";
    color = "#FF5722";
    recommendation = "People with heart or lung disease, older adults, and children should limit outdoor activities.";
  } else if (aqi <= 200) {
    level = "Unhealthy";
    color = "#9C27B0";
    recommendation = "Everyone may begin to experience health effects. Sensitive groups should avoid outdoor activities.";
  } else if (aqi <= 300) {
    level = "Very Unhealthy";
    color = "#F44336";
    recommendation = "Health alert. Everyone may experience more serious health effects. Avoid outdoor activities.";
  } else {
    level = "Hazardous";
    color = "#8B0000";
    recommendation = "Health warning of emergency conditions. Everyone should avoid all outdoor activities.";
  }
  
  return { level, color, recommendation };
}

// Chart.js configuration and data
let weatherChart = null;
let currentChartData = null;

// Initialize chart with default theme colors
function initializeChart() {
  const ctx = document.getElementById('weatherChart');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (weatherChart) {
    weatherChart.destroy();
  }

  weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperature',
        data: [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#3B82F6',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
            font: {
              size: 11
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      elements: {
        point: {
          hoverBackgroundColor: '#3B82F6',
          hoverBorderColor: '#ffffff'
        }
      }
    }
  });
}

// Process forecast data for charts
function processChartData(forecastData, dataType) {
  const data = [];
  const labels = [];
  const colors = {
    temperature: { border: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)' },
    humidity: { border: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)' },
    wind: { border: '#10B981', background: 'rgba(16, 185, 129, 0.1)' },
    pressure: { border: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }
  };

  forecastData.list.forEach((item, index) => {
    const date = new Date(item.dt * 1000);
    const time = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    labels.push(time);
    
    switch(dataType) {
      case 'temperature':
        data.push(item.main.temp);
        break;
      case 'humidity':
        data.push(item.main.humidity);
        break;
      case 'wind':
        data.push(item.wind.speed);
        break;
      case 'pressure':
        data.push(item.main.pressure);
        break;
    }
  });

  return {
    labels,
    data,
    color: colors[dataType]
  };
}

// Update chart with new data
function updateChart(chartData, dataType) {
  if (!weatherChart) return;

  const labels = {
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    wind: 'Wind Speed (m/s)',
    pressure: 'Pressure (hPa)'
  };

  weatherChart.data.labels = chartData.labels;
  weatherChart.data.datasets[0].data = chartData.data;
  weatherChart.data.datasets[0].label = labels[dataType];
  weatherChart.data.datasets[0].borderColor = chartData.color.border;
  weatherChart.data.datasets[0].backgroundColor = chartData.color.background;
  weatherChart.data.datasets[0].pointBackgroundColor = chartData.color.border;

  weatherChart.update('active');

  // Update statistics
  updateChartStats(chartData.data);
}

// Update chart statistics
function updateChartStats(data) {
  const avg = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1);
  const high = Math.max(...data).toFixed(1);
  const low = Math.min(...data).toFixed(1);

  document.getElementById('avgValue').textContent = avg;
  document.getElementById('highValue').textContent = high;
  document.getElementById('lowValue').textContent = low;
}

// Chart button functions
function showTemperatureChart() {
  if (!currentChartData) return;
  
  setActiveButton('tempChartBtn');
  const chartData = processChartData(currentChartData, 'temperature');
  updateChart(chartData, 'temperature');
}

function showHumidityChart() {
  if (!currentChartData) return;
  
  setActiveButton('humidityChartBtn');
  const chartData = processChartData(currentChartData, 'humidity');
  updateChart(chartData, 'humidity');
}

function showWindChart() {
  if (!currentChartData) return;
  
  setActiveButton('windChartBtn');
  const chartData = processChartData(currentChartData, 'wind');
  updateChart(chartData, 'wind');
}

function showPressureChart() {
  if (!currentChartData) return;
  
  setActiveButton('pressureChartBtn');
  const chartData = processChartData(currentChartData, 'pressure');
  updateChart(chartData, 'pressure');
}

// Set active button
function setActiveButton(activeId) {
  // Remove active class from all buttons
  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to clicked button
  document.getElementById(activeId).classList.add('active');
}

// Display weather charts
function displayWeatherCharts(forecastData) {
  const chartsDiv = document.getElementById("weatherCharts");
  
  if (!chartsDiv) return;
  
  // Store forecast data for chart switching
  currentChartData = forecastData;
  
  // Initialize chart
  initializeChart();
  
  // Show temperature chart by default
  showTemperatureChart();
  
  // Show charts section
  chartsDiv.classList.remove("hidden");
  
  // Trigger scroll animation
  setTimeout(() => {
    chartsDiv.classList.add('animate-in');
  }, 600);
}

// Smart Features - Weather-based recommendations
function generateSmartRecommendations(weatherData) {
  const temp = weatherData.main.temp;
  const condition = weatherData.weather[0].main.toLowerCase();
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const uvValue = weatherData.uv ? weatherData.uv.value : null;
  const aqi = weatherData.airQuality ? weatherData.airQuality.list[0].main.aqi : null;
  
  const recommendations = [];
  
  // Clothing recommendations
  if (temp < 0) {
    recommendations.push({
      icon: '🧥',
      iconBg: '#3B82F6',
      title: 'Winter Clothing',
      text: 'Bundle up with heavy winter coat, thermal underwear, gloves, scarf, and warm hat. Consider waterproof boots for snow.'
    });
  } else if (temp < 10) {
    recommendations.push({
      icon: '🧥',
      iconBg: '#06B6D4',
      title: 'Cold Weather Gear',
      text: 'Wear a warm jacket or coat, long pants, and closed-toe shoes. Consider a light scarf and gloves.'
    });
  } else if (temp < 20) {
    recommendations.push({
      icon: '👕',
      iconBg: '#10B981',
      title: 'Light Layers',
      text: 'Perfect for light jacket or sweater. Comfortable for outdoor activities and casual wear.'
    });
  } else if (temp < 30) {
    recommendations.push({
      icon: '👕',
      iconBg: '#F59E0B',
      title: 'Summer Clothing',
      text: 'Light, breathable clothing recommended. Shorts, t-shirts, and comfortable footwear are ideal.'
    });
  } else {
    recommendations.push({
      icon: '🏖️',
      iconBg: '#EF4444',
      title: 'Hot Weather Gear',
      text: 'Light, loose clothing. Stay hydrated and consider sun protection. Avoid dark colors.'
    });
  }
  
  // Activity recommendations
  if (condition.includes('rain') || condition.includes('storm')) {
    recommendations.push({
      icon: '🏠',
      iconBg: '#8B5CF6',
      title: 'Indoor Activities',
      text: 'Perfect day for indoor activities. Consider movies, reading, cooking, or indoor sports.'
    });
  } else if (condition.includes('snow')) {
    recommendations.push({
      icon: '⛷️',
      iconBg: '#3B82F6',
      title: 'Winter Sports',
      text: 'Great for skiing, snowboarding, or building snowmen. Dress warmly and stay safe!'
    });
  } else if (temp > 20 && !condition.includes('storm')) {
    recommendations.push({
      icon: '🏃‍♂️',
      iconBg: '#10B981',
      title: 'Outdoor Activities',
      text: 'Excellent weather for hiking, cycling, picnics, or outdoor sports. Enjoy the fresh air!'
    });
  }
  
  // Health recommendations
  if (uvValue && uvValue > 5) {
    recommendations.push({
      icon: '☀️',
      iconBg: '#F59E0B',
      title: 'Sun Protection',
      text: 'High UV index. Wear sunscreen (SPF 30+), protective clothing, and seek shade during peak hours.'
    });
  }
  
  if (aqi && aqi > 100) {
    recommendations.push({
      icon: '😷',
      iconBg: '#EF4444',
      title: 'Air Quality Alert',
      text: 'Poor air quality. Limit outdoor activities, especially for sensitive individuals. Consider indoor exercise.'
    });
  }
  
  // Transportation recommendations
  if (condition.includes('rain') || condition.includes('snow')) {
    recommendations.push({
      icon: '🚗',
      iconBg: '#6B7280',
      title: 'Travel Safety',
      text: 'Wet/slippery conditions. Drive carefully, allow extra time, and consider public transportation.'
    });
  }
  
  return recommendations.slice(0, 6); // Limit to 6 recommendations
}

// Display smart recommendations
function displaySmartRecommendations(weatherData) {
  console.log('Displaying smart recommendations...');
  
  const recommendationsDiv = document.getElementById('smartRecommendations');
  
  if (!recommendationsDiv) {
    console.error('Recommendations div not found!');
    return;
  }
  
  const recommendations = generateSmartRecommendations(weatherData);
  console.log('Generated recommendations:', recommendations.length);
  
  const recommendationsHTML = recommendations.map(rec => `
    <div class="recommendation-card">
      <div class="recommendation-header">
        <div class="recommendation-icon" style="background-color: ${rec.iconBg};">
          ${rec.icon}
        </div>
        <div class="recommendation-title">${rec.title}</div>
      </div>
      <div class="recommendation-text">${rec.text}</div>
    </div>
  `).join('');
  
  recommendationsDiv.innerHTML = recommendationsHTML;
  console.log('Recommendations HTML set');
}

// Favorite Cities Management - Global variable
let favoriteCities = JSON.parse(localStorage.getItem('favoriteCities') || '[]');

function addToFavorites() {
  if (!window.currentWeatherData) {
    showError('No weather data available to add to favorites');
    return;
  }
  
  const cityName = window.currentWeatherData.name;
  const cityCountry = window.currentWeatherData.sys.country;
  const cityKey = `${cityName}, ${cityCountry}`;
  
  // Check if already in favorites
  if (favoriteCities.some(city => city.key === cityKey)) {
    showError('City is already in your favorites!');
    return;
  }
  
  const favoriteCity = {
    key: cityKey,
    name: cityName,
    country: cityCountry,
    temp: window.currentWeatherData.main.temp,
    condition: window.currentWeatherData.weather[0].main,
    icon: window.currentWeatherData.weather[0].icon,
    timestamp: Date.now()
  };
  
  favoriteCities.push(favoriteCity);
  localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  
  displayFavoriteCities();
  updateAddFavoriteButton();
  
  // Show success message
  const addBtn = document.getElementById('addFavoriteBtn');
  const originalText = addBtn.innerHTML;
  addBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
  addBtn.classList.add('disabled');
  
  setTimeout(() => {
    addBtn.innerHTML = originalText;
    addBtn.classList.remove('disabled');
  }, 2000);
}

function removeFromFavorites(cityKey) {
  favoriteCities = favoriteCities.filter(city => city.key !== cityKey);
  localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  displayFavoriteCities();
  updateAddFavoriteButton();
}

function displayFavoriteCities() {
  const favoritesGrid = document.getElementById('favoritesGrid');
  
  if (favoriteCities.length === 0) {
    favoritesGrid.innerHTML = `
      <div class="favorite-city" style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">
        <div class="city-name">No favorite cities yet</div>
        <div class="city-temp">Add cities to see them here</div>
      </div>
    `;
    return;
  }
  
  const favoritesHTML = favoriteCities.map(city => `
    <div class="favorite-city" onclick="loadFavoriteCity('${city.key}')">
      <button class="remove-btn" onclick="event.stopPropagation(); removeFromFavorites('${city.key}')" title="Remove from favorites">
        <i class="fas fa-times"></i>
      </button>
      <div class="city-name">${city.name}</div>
      <div class="city-temp">${city.temp} ${getUnitSymbol()}</div>
      <div class="city-condition">${city.condition}</div>
    </div>
  `).join('');
  
  favoritesGrid.innerHTML = favoritesHTML;
}

function loadFavoriteCity(cityKey) {
  const city = favoriteCities.find(c => c.key === cityKey);
  if (city) {
    document.getElementById('cityInput').value = city.name;
    getWeather();
  }
}

function updateAddFavoriteButton() {
  const addBtn = document.getElementById('addFavoriteBtn');
  if (!window.currentWeatherData) {
    addBtn.classList.add('disabled');
    return;
  }
  
  const cityName = window.currentWeatherData.name;
  const cityCountry = window.currentWeatherData.sys.country;
  const cityKey = `${cityName}, ${cityCountry}`;
  
  if (favoriteCities.some(city => city.key === cityKey)) {
    addBtn.classList.add('disabled');
  } else {
    addBtn.classList.remove('disabled');
  }
}

function manageFavorites() {
  // Simple management - could be expanded with a modal
  if (favoriteCities.length === 0) {
    showError('No favorite cities to manage');
    return;
  }
  
  const cityList = favoriteCities.map(city => city.name).join(', ');
  alert(`Your favorite cities: ${cityList}\n\nClick the X button on any city card to remove it.`);
}

// Weather Comparison
async function compareCities() {
  const city1 = document.getElementById('city1Input').value.trim();
  const city2 = document.getElementById('city2Input').value.trim();
  
  if (!city1 || !city2) {
    showError('Please enter both city names');
    return;
  }
  
  if (city1.toLowerCase() === city2.toLowerCase()) {
    showError('Please enter different cities');
    return;
  }
  
  const comparisonResults = document.getElementById('comparisonResults');
  comparisonResults.innerHTML = '<div style="text-align: center; color: var(--text-secondary);">Loading comparison...</div>';
  
  try {
    const unit = getSelectedUnit();
    const [weather1, weather2] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city1)}&appid=${apiKey}&units=${unit}`).then(res => res.json()),
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city2)}&appid=${apiKey}&units=${unit}`).then(res => res.json())
    ]);
    
    if (weather1.cod !== 200 || weather2.cod !== 200) {
      throw new Error('One or both cities not found');
    }
    
    const comparisonHTML = `
      <h4>Weather Comparison</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
        <div class="comparison-city">
          <h5>${weather1.name}, ${weather1.sys.country}</h5>
          <div class="comparison-temp">${weather1.main.temp} ${getUnitSymbol()}</div>
          <div class="comparison-condition">${weather1.weather[0].main}</div>
          <div class="comparison-details">
            <div>Humidity: ${weather1.main.humidity}%</div>
            <div>Wind: ${weather1.wind.speed} ${getSpeedUnit()}</div>
            <div>Pressure: ${weather1.main.pressure} hPa</div>
          </div>
        </div>
        <div class="comparison-city">
          <h5>${weather2.name}, ${weather2.sys.country}</h5>
          <div class="comparison-temp">${weather2.main.temp} ${getUnitSymbol()}</div>
          <div class="comparison-condition">${weather2.weather[0].main}</div>
          <div class="comparison-details">
            <div>Humidity: ${weather2.main.humidity}%</div>
            <div>Wind: ${weather2.wind.speed} ${getSpeedUnit()}</div>
            <div>Pressure: ${weather2.main.pressure} hPa</div>
          </div>
        </div>
      </div>
      <div class="comparison-summary" style="margin-top: 15px; padding: 10px; background: var(--bg-secondary); border-radius: 8px;">
        <strong>Summary:</strong> ${getComparisonSummary(weather1, weather2)}
      </div>
    `;
    
    comparisonResults.innerHTML = comparisonHTML;
    
  } catch (error) {
    comparisonResults.innerHTML = `<div style="color: #ef4444;">Error: ${error.message}</div>`;
  }
}

function getComparisonSummary(weather1, weather2) {
  const tempDiff = weather1.main.temp - weather2.main.temp;
  const tempDiffAbs = Math.abs(tempDiff);
  
  if (tempDiffAbs < 2) {
    return `Both cities have similar temperatures (${tempDiffAbs.toFixed(1)}° difference)`;
  } else if (tempDiff > 0) {
    return `${weather1.name} is ${tempDiff.toFixed(1)}° warmer than ${weather2.name}`;
  } else {
    return `${weather2.name} is ${tempDiffAbs.toFixed(1)}° warmer than ${weather1.name}`;
  }
}

// Travel Planning
async function planTravel() {
  const destination = document.getElementById('destinationInput').value.trim();
  const travelDate = document.getElementById('travelDateInput').value;
  
  if (!destination || !travelDate) {
    showError('Please enter both destination and travel date');
    return;
  }
  
  const travelResults = document.getElementById('travelResults');
  travelResults.innerHTML = '<div style="text-align: center; color: var(--text-secondary);">Planning your trip...</div>';
  
  try {
    const unit = getSelectedUnit();
    const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(destination)}&appid=${apiKey}&units=${unit}`).then(res => res.json());
    
    if (weather.cod !== 200) {
      throw new Error('Destination not found');
    }
    
    const travelAdvice = generateTravelAdvice(weather, travelDate);
    
    const travelHTML = `
      <h4>Trip to ${weather.name}, ${weather.sys.country}</h4>
      <div style="margin-top: 15px;">
        <div class="travel-weather">
          <div class="travel-temp">${weather.main.temp} ${getUnitSymbol()}</div>
          <div class="travel-condition">${weather.weather[0].main}</div>
        </div>
        <div class="travel-advice" style="margin-top: 15px;">
          <h5>Travel Recommendations:</h5>
          <ul style="margin-top: 10px; padding-left: 20px;">
            ${travelAdvice.map(advice => `<li>${advice}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    
    travelResults.innerHTML = travelHTML;
    
  } catch (error) {
    travelResults.innerHTML = `<div style="color: #ef4444;">Error: ${error.message}</div>`;
  }
}

function generateTravelAdvice(weather, travelDate) {
  const temp = weather.main.temp;
  const condition = weather.weather[0].main.toLowerCase();
  const humidity = weather.main.humidity;
  const advice = [];
  
  // Temperature-based advice
  if (temp < 0) {
    advice.push('Pack warm winter clothing including heavy coat, gloves, and thermal wear');
    advice.push('Consider winter activities like skiing or snowboarding');
  } else if (temp < 15) {
    advice.push('Bring layers and a medium-weight jacket');
    advice.push('Good weather for sightseeing and outdoor activities');
  } else if (temp < 25) {
    advice.push('Perfect weather for outdoor activities and sightseeing');
    advice.push('Pack comfortable walking shoes and light clothing');
  } else {
    advice.push('Pack light, breathable clothing and stay hydrated');
    advice.push('Consider indoor activities during peak heat hours');
  }
  
  // Condition-based advice
  if (condition.includes('rain')) {
    advice.push('Bring waterproof clothing and umbrella');
    advice.push('Plan indoor activities as backup');
  } else if (condition.includes('snow')) {
    advice.push('Pack winter boots and warm accessories');
    advice.push('Check transportation availability');
  } else if (condition.includes('clear')) {
    advice.push('Great weather for outdoor activities and photography');
    advice.push('Don\'t forget sunscreen and sunglasses');
  }
  
  // Humidity advice
  if (humidity > 80) {
    advice.push('High humidity - pack moisture-wicking clothing');
  } else if (humidity < 30) {
    advice.push('Low humidity - bring moisturizer and stay hydrated');
  }
  
  return advice.slice(0, 5); // Limit to 5 pieces of advice
}

// Weather History (simulated)
function loadWeatherHistory() {
  const city = document.getElementById('historyCitySelect').value;
  const period = document.getElementById('historyPeriodSelect').value;
  
  if (!city) {
    showError('Please select a city');
    return;
  }
  
  const historyResults = document.getElementById('historyResults');
  historyResults.innerHTML = '<div style="text-align: center; color: var(--text-secondary);">Loading weather history...</div>';
  
  // Simulate weather history data (in a real app, this would come from an API)
  setTimeout(() => {
    const historyData = generateMockWeatherHistory(city, period);
    
    const historyHTML = `
      <h4>Weather History for ${city}</h4>
      <div style="margin-top: 15px;">
        <div class="history-summary">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
            <div class="history-stat">
              <div class="stat-label">Average Temp</div>
              <div class="stat-value">${historyData.avgTemp}°C</div>
            </div>
            <div class="history-stat">
              <div class="stat-label">Rainy Days</div>
              <div class="stat-value">${historyData.rainyDays}</div>
            </div>
            <div class="history-stat">
              <div class="stat-label">Sunny Days</div>
              <div class="stat-value">${historyData.sunnyDays}</div>
            </div>
          </div>
        </div>
        <div class="history-trend">
          <h5>Trend Analysis:</h5>
          <p>${historyData.trend}</p>
        </div>
      </div>
    `;
    
    historyResults.innerHTML = historyHTML;
  }, 1000);
}

function generateMockWeatherHistory(city, period) {
  const periods = {
    '7': { avgTemp: 18, rainyDays: 2, sunnyDays: 5, trend: 'Generally mild weather with occasional rain showers.' },
    '30': { avgTemp: 16, rainyDays: 8, sunnyDays: 22, trend: 'Good weather overall with some rainy periods.' },
    '90': { avgTemp: 14, rainyDays: 25, sunnyDays: 65, trend: 'Seasonal weather patterns with gradual temperature changes.' }
  };
  
  return periods[period] || periods['7'];
}

// Weather Sound Effects using Web Audio API
let audioContext = null;
let currentOscillator = null;
let currentGainNode = null;
let isPlaying = false;

// Initialize audio context
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}





// Stop weather sound
function stopWeatherSound() {
  if (currentOscillator) {
    currentOscillator.stop();
    currentOscillator = null;
  }
  if (currentGainNode) {
    currentGainNode = null;
  }
  isPlaying = false;
  console.log('Weather sound stopped');
}

// Show message when audio permission is needed
function showAudioPermissionMessage() {
  const message = 'Click anywhere on the page to enable audio, then try the sound button again.';
  console.log(message);
  // You could also show this as a user-friendly notification
}

// Show sound notification
function showSoundNotification(soundType) {
  // Remove existing notification
  const existingNotification = document.getElementById('soundNotification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.id = 'soundNotification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(16, 185, 129, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  
  const soundEmojis = {
    'rain': '🌧️',
    'thunder': '⛈️',
    'wind': '💨',
    'snow': '❄️',
    'summer': '☀️',
    'winter': '❄️',
    'clear': '☀️'
  };
  
  notification.innerHTML = `${soundEmojis[soundType] || '🔊'} Playing ${soundType} sound...`;
  document.body.appendChild(notification);
}

// Hide sound notification
function hideSoundNotification() {
  const notification = document.getElementById('soundNotification');
  if (notification) {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

// Play weather sound when icon is clicked (auto-stops after 4 seconds)
function playWeatherSoundOnIcon(weatherCondition, temperature) {
  console.log('Weather icon clicked! Condition:', weatherCondition, 'Temperature:', temperature);
  console.log('Audio context state:', audioContext ? audioContext.state : 'not initialized');
  
  // Add visual feedback
  const weatherIcon = document.querySelector('.weather-icon-3d');
  if (weatherIcon) {
    weatherIcon.classList.add('playing');
    setTimeout(() => {
      weatherIcon.classList.remove('playing');
    }, 500);
  }
  
  // Determine sound type based on weather condition and temperature
  let soundType = 'clear';
  
  if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
    soundType = 'rain';
  } else if (weatherCondition.includes('thunder') || weatherCondition.includes('storm')) {
    soundType = 'thunder';
  } else if (weatherCondition.includes('snow')) {
    soundType = 'snow';
  } else if (weatherCondition.includes('cloud')) {
    soundType = 'wind';
  } else if (temperature > 30) {
    soundType = 'summer';
  } else if (temperature < 10) {
    soundType = 'winter';
  }
  
  console.log('Playing sound type:', soundType);
  
  // Stop any currently playing sound
  stopWeatherSound();
  
  // Check if audio context is suspended
  if (!audioContext) {
    console.log('Initializing audio context...');
    initAudioContext();
  }
  
  if (audioContext && audioContext.state === 'suspended') {
    console.log('Resuming suspended audio context...');
    audioContext.resume().then(() => {
      generateWeatherSoundWithTimer(soundType);
    }).catch(e => {
      console.log('Failed to resume audio context:', e);
    });
  } else {
    console.log('Generating weather sound...');
    generateWeatherSoundWithTimer(soundType);
  }
}

// Generate weather sound with automatic stop timer
function generateWeatherSoundWithTimer(weatherType) {
  initAudioContext();
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Set volume
  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
  
  switch (weatherType) {
    case 'rain':
      // Rain sound - gentle pitter-patter
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, audioContext.currentTime);
      filter.Q.setValueAtTime(0.3, audioContext.currentTime);
      break;
      
    case 'thunder':
      // Thunder sound - deep rumble
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(40, audioContext.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, audioContext.currentTime);
      break;
      
    case 'wind':
      // Wind sound - gentle breeze
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(300, audioContext.currentTime);
      break;
      
    case 'snow':
      // Snow sound - soft and gentle
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, audioContext.currentTime);
      break;
      
    case 'summer':
      // Summer sound - warm and bright
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioContext.currentTime);
      break;
      
    case 'winter':
      // Winter sound - cold and crisp
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, audioContext.currentTime);
      break;
      
    default:
      // Clear weather sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, audioContext.currentTime);
  }
  
  // Start the sound
  oscillator.start();
  
  // Store references
  currentOscillator = oscillator;
  currentGainNode = gainNode;
  isPlaying = true;
  
  console.log('Weather sound started for:', weatherType);
  
  // Show notification
  showSoundNotification(weatherType);
  
  // Auto-stop after 2 seconds
  setTimeout(() => {
    if (currentOscillator === oscillator) {
      stopWeatherSound();
      console.log('Weather sound auto-stopped after 2 seconds');
      hideSoundNotification();
    }
  }, 2000);
}

// Weather-based Music Suggestions
function getWeatherMusic(weatherData) {
  const temp = weatherData.main.temp;
  const condition = weatherData.weather[0].main.toLowerCase();
  
  const musicSuggestions = {
    'rain': [
      { title: 'Rainy Day Vibes', artist: 'Chill Lo-Fi', genre: 'Lo-Fi Hip Hop' },
      { title: 'Stormy Weather', artist: 'Jazz Classics', genre: 'Jazz' },
      { title: 'Raindrops', artist: 'Ambient Sounds', genre: 'Ambient' }
    ],
    'snow': [
      { title: 'Winter Wonderland', artist: 'Classical', genre: 'Classical' },
      { title: 'Snowfall', artist: 'Piano Melodies', genre: 'Instrumental' },
      { title: 'Frozen Dreams', artist: 'Electronic', genre: 'Electronic' }
    ],
    'clear': [
      { title: 'Sunny Day', artist: 'Pop Hits', genre: 'Pop' },
      { title: 'Blue Skies', artist: 'Indie Folk', genre: 'Folk' },
      { title: 'Bright Side', artist: 'Upbeat Rock', genre: 'Rock' }
    ],
    'clouds': [
      { title: 'Cloudy Thoughts', artist: 'Indie', genre: 'Indie' },
      { title: 'Grey Skies', artist: 'Alternative', genre: 'Alternative' },
      { title: 'Overcast', artist: 'Post-Rock', genre: 'Post-Rock' }
    ]
  };
  
  // Temperature-based suggestions
  if (temp < 0) {
    return musicSuggestions.snow;
  } else if (temp < 15) {
    return musicSuggestions.clouds;
  } else if (temp > 25) {
    return musicSuggestions.clear;
  }
  
  // Condition-based suggestions
  if (condition.includes('rain')) {
    return musicSuggestions.rain;
  } else if (condition.includes('snow')) {
    return musicSuggestions.snow;
  } else if (condition.includes('clear')) {
    return musicSuggestions.clear;
  } else {
    return musicSuggestions.clouds;
  }
}

// Weather Quotes and Sayings
function getWeatherQuote(weatherData) {
  const temp = weatherData.main.temp;
  const condition = weatherData.weather[0].main.toLowerCase();
  
  const quotes = {
    'rain': [
      "Life isn't about waiting for the storm to pass, it's about learning to dance in the rain.",
      "The best thing one can do when it's raining is to let it rain.",
      "Rain is grace; rain is the sky descending to the earth; without rain, there would be no life."
    ],
    'snow': [
      "In the midst of winter, I found there was, within me, an invincible summer.",
      "Snow falling soundlessly in the middle of the night will always fill my heart with sweet clarity.",
      "Winter is not a season, it's a celebration."
    ],
    'sunny': [
      "Keep your face always toward the sunshine—and shadows will fall behind you.",
      "The sun is a daily reminder that we too can rise again from the darkness.",
      "Wherever you go, no matter what the weather, always bring your own sunshine."
    ],
    'cloudy': [
      "Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.",
      "Every cloud has a silver lining.",
      "The sky is not less blue because the blind man does not see it."
    ]
  };
  
  let category = 'cloudy';
  if (condition.includes('rain')) category = 'rain';
  else if (condition.includes('snow')) category = 'snow';
  else if (condition.includes('clear') && temp > 15) category = 'sunny';
  
  const categoryQuotes = quotes[category];
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}

// Weather-based Emoji Reactions
function getWeatherEmoji(weatherData) {
  const temp = weatherData.main.temp;
  const condition = weatherData.weather[0].main.toLowerCase();
  
  if (temp < 0) return '🥶';
  if (temp < 10) return '🧥';
  if (temp < 20) return '😊';
  if (temp < 30) return '😎';
  if (temp >= 30) return '🥵';
  
  if (condition.includes('rain')) return '🌧️';
  if (condition.includes('snow')) return '❄️';
  if (condition.includes('storm')) return '⛈️';
  if (condition.includes('clear')) return '☀️';
  if (condition.includes('clouds')) return '☁️';
  
  return '🌤️';
}

// Enhanced Weather Achievement System
let userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
let userStats = JSON.parse(localStorage.getItem('userStats') || '{"citiesVisited": [], "totalSearches": 0, "firstSearch": null}');

function checkAndAwardAchievements(weatherData) {
  console.log('Checking achievements for:', weatherData.name);
  
  const newAchievements = [];
  const cityName = weatherData.name;
  const temp = weatherData.main.temp;
  const condition = weatherData.weather[0].main.toLowerCase();
  
  // Update user stats
  if (!userStats.citiesVisited.includes(cityName)) {
    userStats.citiesVisited.push(cityName);
  }
  userStats.totalSearches++;
  if (!userStats.firstSearch) {
    userStats.firstSearch = new Date().toISOString();
  }
  
  // Save updated stats
  localStorage.setItem('userStats', JSON.stringify(userStats));
  
  console.log('User stats:', userStats);
  console.log('Current achievements:', userAchievements.length);
  
  // Helper function to check if achievement already exists
  const hasAchievement = (id) => userAchievements.some(a => a.id === id);
  
  // 1. First Weather Check Achievement
  if (!hasAchievement('first_check')) {
    newAchievements.push({
      id: 'first_check',
      title: 'Weather Explorer',
      description: 'Checked your first weather data!',
      icon: '🌦️',
      color: '#10B981'
    });
  }
  
  // 2. City Explorer Achievements
  if (!hasAchievement('city_explorer_1') && userStats.citiesVisited.length >= 1) {
    newAchievements.push({
      id: 'city_explorer_1',
      title: 'City Explorer',
      description: 'Checked weather in your first city',
      icon: '🏙️',
      color: '#3B82F6'
    });
  }
  
  if (!hasAchievement('city_explorer_3') && userStats.citiesVisited.length >= 3) {
    newAchievements.push({
      id: 'city_explorer_3',
      title: 'Multi-City Explorer',
      description: 'Checked weather in 3 different cities',
      icon: '🌆',
      color: '#8B5CF6'
    });
  }
  
  if (!hasAchievement('city_explorer_5') && userStats.citiesVisited.length >= 5) {
    newAchievements.push({
      id: 'city_explorer_5',
      title: 'World Traveler',
      description: 'Checked weather in 5+ different cities',
      icon: '🌍',
      color: '#10B981'
    });
  }
  
  if (!hasAchievement('city_explorer_10') && userStats.citiesVisited.length >= 10) {
    newAchievements.push({
      id: 'city_explorer_10',
      title: 'Global Weather Expert',
      description: 'Checked weather in 10+ different cities',
      icon: '🌐',
      color: '#F59E0B'
    });
  }
  
  // 3. Search Count Achievements
  if (!hasAchievement('search_master_5') && userStats.totalSearches >= 5) {
    newAchievements.push({
      id: 'search_master_5',
      title: 'Weather Enthusiast',
      description: 'Made 5 weather searches',
      icon: '🔍',
      color: '#06B6D4'
    });
  }
  
  if (!hasAchievement('search_master_10') && userStats.totalSearches >= 10) {
    newAchievements.push({
      id: 'search_master_10',
      title: 'Weather Master',
      description: 'Made 10 weather searches',
      icon: '🎯',
      color: '#EF4444'
    });
  }
  
  if (!hasAchievement('search_master_25') && userStats.totalSearches >= 25) {
    newAchievements.push({
      id: 'search_master_25',
      title: 'Weather Addict',
      description: 'Made 25 weather searches',
      icon: '🔥',
      color: '#DC2626'
    });
  }
  
  // 4. Temperature-based Achievements
  if (temp < 0 && !hasAchievement('arctic_explorer')) {
    newAchievements.push({
      id: 'arctic_explorer',
      title: 'Arctic Explorer',
      description: 'Checked weather below freezing',
      icon: '🧊',
      color: '#3B82F6'
    });
  }
  
  if (temp < 10 && !hasAchievement('cold_weather_fan')) {
    newAchievements.push({
      id: 'cold_weather_fan',
      title: 'Cold Weather Fan',
      description: 'Checked weather in cold temperatures',
      icon: '❄️',
      color: '#06B6D4'
    });
  }
  
  if (temp > 30 && !hasAchievement('desert_wanderer')) {
    newAchievements.push({
      id: 'desert_wanderer',
      title: 'Desert Wanderer',
      description: 'Checked weather in hot temperatures',
      icon: '🏜️',
      color: '#F59E0B'
    });
  }
  
  if (temp > 25 && !hasAchievement('summer_lover')) {
    newAchievements.push({
      id: 'summer_lover',
      title: 'Summer Lover',
      description: 'Checked weather in warm temperatures',
      icon: '☀️',
      color: '#F59E0B'
    });
  }
  
  // 5. Weather Condition Achievements
  if (condition.includes('rain') && !hasAchievement('rain_lover')) {
    newAchievements.push({
      id: 'rain_lover',
      title: 'Rain Lover',
      description: 'Checked weather during rain',
      icon: '🌧️',
      color: '#3B82F6'
    });
  }
  
  if (condition.includes('storm') && !hasAchievement('storm_chaser')) {
    newAchievements.push({
      id: 'storm_chaser',
      title: 'Storm Chaser',
      description: 'Checked weather during storms',
      icon: '⛈️',
      color: '#8B5CF6'
    });
  }
  
  if (condition.includes('snow') && !hasAchievement('snow_enthusiast')) {
    newAchievements.push({
      id: 'snow_enthusiast',
      title: 'Snow Enthusiast',
      description: 'Checked weather during snow',
      icon: '⛷️',
      color: '#06B6D4'
    });
  }
  
  if (condition.includes('cloud') && !hasAchievement('cloud_watcher')) {
    newAchievements.push({
      id: 'cloud_watcher',
      title: 'Cloud Watcher',
      description: 'Checked weather during cloudy conditions',
      icon: '☁️',
      color: '#6B7280'
    });
  }
  
  if (condition.includes('clear') && !hasAchievement('sun_seeker')) {
    newAchievements.push({
      id: 'sun_seeker',
      title: 'Sun Seeker',
      description: 'Checked weather during clear skies',
      icon: '☀️',
      color: '#F59E0B'
    });
  }
  
  // 6. Special City Achievements
  const specialCities = {
    'london': { title: 'London Explorer', icon: '🇬🇧', color: '#DC2626' },
    'new york': { title: 'NYC Explorer', icon: '🗽', color: '#3B82F6' },
    'paris': { title: 'Paris Explorer', icon: '🗼', color: '#8B5CF6' },
    'tokyo': { title: 'Tokyo Explorer', icon: '🗾', color: '#DC2626' },
    'sydney': { title: 'Sydney Explorer', icon: '🦘', color: '#10B981' },
    'mumbai': { title: 'Mumbai Explorer', icon: '🏛️', color: '#F59E0B' },
    'delhi': { title: 'Delhi Explorer', icon: '🕌', color: '#10B981' },
    'noida': { title: 'Noida Explorer', icon: '🏢', color: '#3B82F6' }
  };
  
  const cityKey = cityName.toLowerCase();
  if (specialCities[cityKey] && !hasAchievement(`special_${cityKey}`)) {
    newAchievements.push({
      id: `special_${cityKey}`,
      title: specialCities[cityKey].title,
      description: `Explored weather in ${cityName}`,
      icon: specialCities[cityKey].icon,
      color: specialCities[cityKey].color
    });
  }
  
  // Add new achievements to user's collection
  newAchievements.forEach(achievement => {
    userAchievements.push(achievement);
  });
  
  // Save to localStorage
  localStorage.setItem('userAchievements', JSON.stringify(userAchievements));
  
  console.log('New achievements awarded:', newAchievements.length);
  return newAchievements;
}

// Display weather enhancements
function displayWeatherEnhancements(weatherData) {
  console.log('Displaying weather enhancements for:', weatherData.name);
  
  const enhancementsDiv = document.getElementById('weatherEnhancements');
  if (!enhancementsDiv) {
    console.error('Weather enhancements div not found!');
    return;
  }
  
  console.log('Weather enhancements div found, generating content...');
  
  const musicSuggestions = getWeatherMusic(weatherData);
  const weatherQuote = getWeatherQuote(weatherData);
  const weatherEmoji = getWeatherEmoji(weatherData);
  const newAchievements = checkAndAwardAchievements(weatherData);
  
  const enhancementsHTML = `
    <div class="enhancements-container">
      <!-- Weather Emoji Reaction -->
      <div class="weather-emoji-section">
        <div class="weather-emoji">${weatherEmoji}</div>
        <div class="emoji-text">How's the weather feeling?</div>
      </div>
      
      <!-- Weather Quote -->
      <div class="weather-quote-section">
        <div class="quote-icon">💭</div>
        <div class="quote-text">"${weatherQuote}"</div>
      </div>
      
      <!-- Music Suggestions -->
      <div class="music-suggestions-section">
        <h4>🎵 Music for this weather:</h4>
        <div class="music-list">
          ${musicSuggestions.map(song => `
            <div class="music-item">
              <div class="music-title">${song.title}</div>
              <div class="music-artist">${song.artist} • ${song.genre}</div>
            </div>
          `).join('')}
        </div>
      </div>
      

      
      <!-- New Achievements -->
      ${newAchievements.length > 0 ? `
        <div class="achievements-section">
          <h4>🏆 New Achievements Unlocked!</h4>
          <div class="achievements-list">
            ${newAchievements.map(achievement => `
              <div class="achievement-item" style="border-left: 4px solid ${achievement.color};">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                  <div class="achievement-title">${achievement.title}</div>
                  <div class="achievement-description">${achievement.description}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- All Achievements -->
      <div class="achievements-section">
        <h4>🏆 Your Achievements</h4>
        <div class="achievements-list" id="allAchievementsList">
          <!-- All achievements will be populated by JavaScript -->
        </div>
      </div>
    </div>
  `;
  
  enhancementsDiv.innerHTML = enhancementsHTML;
  enhancementsDiv.classList.remove('hidden');
  
  // Trigger scroll animation
  setTimeout(() => {
    enhancementsDiv.classList.add('animate-in');
  }, 400);
  
  // Display all achievements
  displayAllAchievements();
  
  console.log('Weather enhancements displayed successfully');
  console.log('Music suggestions:', musicSuggestions.length);
  console.log('New achievements:', newAchievements.length);
}

// Display all user achievements
function displayAllAchievements() {
  const achievementsList = document.getElementById('allAchievementsList');
  if (!achievementsList) return;
  
  const userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
  const userStats = JSON.parse(localStorage.getItem('userStats') || '{"citiesVisited": [], "totalSearches": 0}');
  
  let achievementsHTML = '';
  
  // Add user stats section
  achievementsHTML += `
    <div class="achievement-stats" style="background: rgba(102, 126, 234, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #667eea;">
      <h5 style="margin: 0 0 10px 0; color: #667eea;">📊 Your Weather Stats</h5>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; font-size: 0.9rem;">
        <div style="text-align: center;">
          <div style="font-weight: bold; color: #3B82F6;">${userStats.totalSearches || 0}</div>
          <div style="color: #6B7280;">Total Searches</div>
        </div>
        <div style="text-align: center;">
          <div style="font-weight: bold; color: #10B981;">${userStats.citiesVisited ? userStats.citiesVisited.length : 0}</div>
          <div style="color: #6B7280;">Cities Visited</div>
        </div>
        <div style="text-align: center;">
          <div style="font-weight: bold; color: #F59E0B;">${userAchievements.length}</div>
          <div style="color: #6B7280;">Achievements</div>
        </div>
      </div>
    </div>
  `;
  
  if (userAchievements.length === 0) {
    achievementsHTML += `
      <div class="achievement-item" style="border-left: 4px solid #6B7280;">
        <div class="achievement-icon">🎯</div>
        <div class="achievement-info">
          <div class="achievement-title">No Achievements Yet</div>
          <div class="achievement-description">Start exploring weather data to unlock achievements! Try searching for different cities.</div>
        </div>
      </div>
    `;
  } else {
    // Sort achievements by category
    const sortedAchievements = userAchievements.sort((a, b) => {
      const categoryOrder = {
        'first_check': 1,
        'city_explorer': 2,
        'search_master': 3,
        'arctic_explorer': 4,
        'cold_weather_fan': 4,
        'desert_wanderer': 4,
        'summer_lover': 4,
        'rain_lover': 5,
        'storm_chaser': 5,
        'snow_enthusiast': 5,
        'cloud_watcher': 5,
        'sun_seeker': 5,
        'special_': 6
      };
      
      const aCategory = Object.keys(categoryOrder).find(cat => a.id.startsWith(cat)) || 'other';
      const bCategory = Object.keys(categoryOrder).find(cat => b.id.startsWith(cat)) || 'other';
      
      return (categoryOrder[aCategory] || 999) - (categoryOrder[bCategory] || 999);
    });
    
    achievementsHTML += sortedAchievements.map(achievement => `
      <div class="achievement-item" style="border-left: 4px solid ${achievement.color};">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <div class="achievement-title">${achievement.title}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
      </div>
    `).join('');
  }
  
  achievementsList.innerHTML = achievementsHTML;
}

// Setup scroll animations
function setupScrollAnimations() {
  // Create intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        console.log('Animation triggered for:', entry.target.className);
      }
    });
  }, observerOptions);

  // Observe all scroll-animate elements
  const animateElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-bounce, .scroll-animate-flip');
  animateElements.forEach(el => {
    observer.observe(el);
    console.log('Observing element for scroll animation:', el.className);
  });

  // Add smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Trigger scroll animations for newly added elements
function triggerScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        console.log('Animation triggered for:', entry.target.className);
      }
    });
  }, observerOptions);

  // Observe newly added elements
  const animateElements = document.querySelectorAll('.scroll-animate:not(.animate-in), .scroll-animate-left:not(.animate-in), .scroll-animate-right:not(.animate-in), .scroll-animate-scale:not(.animate-in), .scroll-animate-bounce:not(.animate-in), .scroll-animate-flip:not(.animate-in)');
  animateElements.forEach(el => {
    observer.observe(el);
  });
}

// Debug function to show all sections
function showAllSections() {
  console.log('Showing all sections for debugging...');
  
  // Show all main sections
  const sections = [
    'weatherResult',
    'weatherTips', 
    'weatherEnhancements',
    'smartFeatures',
    'weatherCharts',
    'weatherWidgets',
    'forecastResult'
  ];
  
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.remove('hidden');
      console.log(`Showed section: ${sectionId}`);
    } else {
      console.log(`Section not found: ${sectionId}`);
    }
  });
  
  // If we have weather data, populate sections
  if (window.currentWeatherData) {
    console.log('Populating sections with current weather data...');
    displayWeatherEnhancements(window.currentWeatherData);
    displaySmartFeatures(window.currentWeatherData);
    displayAllAchievements();
  } else {
    console.log('No current weather data available');
  }
}



// Display smart features
function displaySmartFeatures(weatherData) {
  console.log('Displaying smart features for:', weatherData.name);
  
  const smartFeaturesDiv = document.getElementById("smartFeatures");
  
  if (!smartFeaturesDiv) {
    console.error('Smart features div not found!');
    return;
  }
  
  console.log('Smart features div found, displaying content...');
  
  // Display smart recommendations
  displaySmartRecommendations(weatherData);
  
  // Display favorite cities
  displayFavoriteCities();
  
  // Update add favorite button state
  updateAddFavoriteButton();
  
  // Populate history city select with current city and favorites
  populateHistoryCitySelect(weatherData);
  
  // Trigger scroll animation
  setTimeout(() => {
    smartFeaturesDiv.classList.add('animate-in');
  }, 500);
  
  // Show smart features section
  smartFeaturesDiv.classList.remove("hidden");
  console.log('Smart features section should now be visible');
}



function populateHistoryCitySelect(weatherData) {
  const historySelect = document.getElementById('historyCitySelect');
  const currentCity = `${weatherData.name}, ${weatherData.sys.country}`;
  
  // Clear existing options except the first one
  historySelect.innerHTML = '<option value="">Select a city...</option>';
  
  // Add current city
  const currentOption = document.createElement('option');
  currentOption.value = currentCity;
  currentOption.textContent = currentCity;
  historySelect.appendChild(currentOption);
  
  // Add favorite cities
  favoriteCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city.key;
    option.textContent = city.key;
    historySelect.appendChild(option);
  });
}
