var searchForm = document.querySelector('#search-form');
var inputCitySearch = document.querySelector('#search-city');
var historyContainer = document.querySelector('#history-container');
// var forecastContainer = document.querySelector('#forecasts');
var forecastContainers = [document.querySelector('#today'), document.querySelector('#five-day')];

var searchTerm = "q=";
var apiKeyTerm = "&appid=";
var apiKey = "dacfab95576f6aec206ec9cde08bd9db";
var unitsTerm = "&units=imperial"
var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?"
var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
var limitTerm = "&limit=1"

function makeCityEl(cityName) {
    var cityEl = document.createElement('h2');
    cityEl.textContent = cityName;
    cityEl.className = "card-data"
    cityEl.setAttribute('id','city-name');
    return cityEl;
}

function makeDateEl(date) {
    var dateEl = document.createElement('h3');
    dateEl.textContent = dayjs.unix(date).format('MM/DD/YYYY');
    dateEl.className = "card-data"
    return dateEl;
}

function makeIconEl(icon) {
    var iconEl = document.createElement('img');
    iconEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    iconEl.className = "card-data";
    return iconEl;
}

function makeTempEl(temp) {
    var tempEl = document.createElement('div')
    tempEl.textContent = "Temperature: " + temp + "°F";
    tempEl.className = "card-data";
    return tempEl;
}

function makeHumidEl(humid) {
    var humidEl = document.createElement('div')
    humidEl.textContent = "Humidity: " + humid + " %";
    humidEl.className = "card-data";
    return humidEl;
}

function makeWindEl(wind) {
    var windEl = document.createElement('div')
    windEl.textContent = "Wind Speed: " + wind + " MPH";
    windEl.className = "card-data";
    return windEl;
}

function renderForecast(cityName, date, icon, temp, humid, wind) {
    var forecastCard = document.createElement('div');
    var forecastContainer = forecastContainers[1];
    forecastCard.className = "card";
    if (cityName.length > 0) {
        forecastContainer = forecastContainers[0];
        forecastCard.append(makeCityEl(cityName))
    } 
    forecastCard.append(makeDateEl(date), makeIconEl(icon), makeTempEl(temp), makeHumidEl(humid), makeWindEl(wind));
    forecastContainer.append(forecastCard);
}
/* 5 day forecast requires latitude and longitude so first API call is to grab the city
cooridinates from OpenWeather's geo api  */
function getWeatherData(inputCity) {
    var fullGeoUrl = geoApiUrl + inputCity + limitTerm + apiKeyTerm + apiKey
    
    fetch(fullGeoUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (location) {
        return(location[0]); // Accessing latitude and longitude element
    })
    .then(function (data) { //an async function call would probably be better than the triple then but this works
        var latTerm = "lat=" + data.lat;
        var lonTerm = "&lon=" + data.lon;
        var fullForecastUrl = forecastUrl + latTerm + lonTerm + apiKeyTerm + apiKey + unitsTerm ;
        console.log(fullForecastUrl)
        asyncApiCall(fullForecastUrl);
    });
}

async function asyncApiCall(url) {
    const result = await fetch(url)
    .then (function (response) {
        return response.json();
    }) //this call is returns a forecast for every 3 hours, which means only every 8 indicies are different days
    var cityName = result.city.name 
    localStorage.setItem(localStorage.length, cityName)
    var count = 1;
    console.log(result)
    //Loop 6 times but grab every 18 hours using the count variable.
    for (var i = 0; i < 6; i++) {
        var name = ""
        if (i === 0) { name = result.city.name; }
        renderForecast(
            name,
            result.list[count].dt,
            result.list[count].weather[0].icon,
            result.list[count].main.temp,
            result.list[count].main.humidity,
            result.list[count].wind.speed)
            count += 6; //increment count by 6 to make sure the next result is 18 hours from current
    }
}

function loadRecentSearch(search) {
    var divkey = document.createElement('div');
    divkey.textContent = search;
    historyContainer.append(divkey);
}

function loadFullHistory() {
    for (var i = 0; i < localStorage.length; i++) {
        var divKey = document.createElement('div');
        divKey.textContent = localStorage.getItem(localStorage.key(i));
        historyContainer.appendChild(divKey);
    }
}
/* Clear out the top and bottom elements of the weather area */
function clearPreviousForecast() {
    if (forecastContainers[0].childNodes.length > 0) {
        forecastContainers[0].removeChild(forecastContainers[0].firstChild)
        clearPreviousForecast();
    }
    if (forecastContainers[1].childNodes.length > 0) {
        forecastContainers[1].removeChild(forecastContainers[1].firstChild)
        clearPreviousForecast();
    }
}
/* Prevent page from refreshing otherwise Promise is broken in API call, load a div with the search you made
prevent functions from firing if nothing was searched, clear out previous search, then
make API call */
function citySearch (event) {
    event.preventDefault();
    if (inputCitySearch.value === "") { return; }
    loadRecentSearch(inputCitySearch.value);
    clearPreviousForecast();
    getWeatherData(inputCitySearch.value);
}

loadFullHistory();
searchForm.addEventListener("submit", citySearch);