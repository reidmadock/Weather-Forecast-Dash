var searchForm = document.querySelector('#search-form');
var inputCitySearch = document.querySelector('#search-city');
var historyContainer = document.querySelector('#history-container');
var todayForecast = document.querySelector('#today-forecast');
var fiveDayForecast = document.querySelector('#five-day-forecast');

var searchTerm = "q=";
var apiKeyTerm = "&appid=";
var apiKey = "dacfab95576f6aec206ec9cde08bd9db";
var unitsTerm = "&units=imperial"
var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?"
var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
var limitTerm = "&limit=1"

function Forecast(cityName, date, icon, temp, humid, wind) {
    this.cityName = cityName;
    this.date = date;
    this.icon = icon;
    this.temp = temp;
    this.humid = humid;
    this.wind = wind;
}

function renderForecast(cityName, date, icon, temp, humid, wind) {
    var forecastCard = document.createElement('div');
    forecastCard.className = "card";
    var infoList = document.createElement('ul');
    var dateEl = document.createElement('li');
    var iconEl = document.createElement('li');
    var tempEl = document.createElement('li');
    var humidEl = document.createElement('li');
    var windEl = document.createElement('li');
    if (cityName.length > 0) {
        var cityEl = document.createElement('li');
        cityEl.textContent = cityName;
        infoList.append(cityEl);
    } 
    dateEl.textContent = date;
    iconEl.textContent = icon;
    tempEl.textContent = temp;
    humidEl.textContent = humid;
    windEl.textContent = wind;
    infoList.append(dateEl, iconEl, tempEl, humidEl, windEl);
    forecastCard.append(infoList)
    fiveDayForecast.append(forecastCard);
}

function getWeatherData(inputCity) {
    var fullGeoUrl = geoApiUrl + inputCity + limitTerm + apiKeyTerm + apiKey
    
    fetch(fullGeoUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (turkey) {
        return(turkey[0]);
    })
    .then(function (data) {        
        var latTerm = "lat=" + data.lat;
        var lonTerm = "&lon=" + data.lon;
        var fullForecastUrl = forecastUrl + latTerm + lonTerm + apiKeyTerm + apiKey + unitsTerm;

        asyncApiCall(fullForecastUrl);
    });
}

async function asyncApiCall(url) {
    const result = await fetch(url)
    .then (function (response) {
        return response.json();
    })
    var cityName = result.city.name 
    console.log(cityName)
    localStorage.setItem(cityName, cityName)
    for (var i = 0; i < 6; i++) {
        console.log(result.list[i])
        var name = ""
        if (i === 0) { name = result.city.name; }
        renderForecast(
            name,
            result.list[i].dt,
            result.list[i].weather[0].icon,
            result.list[i].main.temp,
            result.list[i].main.humidity,
            result.list[i].wind.speed)
    }
}

function loadFullHistory() {
    for (var i = 0; i < localStorage.length; i++) {
        var divKey = document.createElement('div');
        divKey.textContent = localStorage.getItem(localStorage.key(i));
        historyContainer.appendChild(divKey);
    }
}

function loadHistory() {
    var divKey = document.createElement('div');
    divKey.textContent = localStorage.getItem(localStorage.key(0));
    historyContainer.appendChild(divKey);
}

function citySearch (event) {
    event.preventDefault();
    // var searchedCity = inputCitySearch.value;
    // if (searchedCity === localStorage.getItem(localStorage.key(0))) { return; }
    getWeatherData(inputCitySearch.value);
    // localStorage.setItem(searchedCity, searchedCity);
    // loadHistory();
}

loadFullHistory();
searchForm.addEventListener("submit", citySearch);