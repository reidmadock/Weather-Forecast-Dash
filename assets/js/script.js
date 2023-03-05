var searchForm = document.querySelector('#search-form');
var inputCitySearch = document.querySelector('#search-city');
var historyContainer = document.querySelector('#history-container');
var forecastContainer = document.querySelector('#forecasts');

var searchTerm = "q=";
var apiKeyTerm = "&appid=";
var apiKey = "dacfab95576f6aec206ec9cde08bd9db";
var unitsTerm = "&units=imperial"
var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?"
var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
var limitTerm = "&limit=1"

function makeCityEl(cityName) {
    var cityEl = document.createElement('h3');
    cityEl.textContent = cityName;
    cityEl.className = "card-data"
    cityEl.setAttribute('id','city-name');
    return cityEl;
}

function makeDateEl(date) {
    var dateEl = document.createElement('div');
    dateEl.textContent = date;
    dateEl.className = "card-data"
    return dateEl;
}

function makeIconEl(icon) {
    var iconEl = document.createElement('div');
    iconEl.textContent = icon;
    iconEl.className = "card-data";
    return iconEl;
}

function makeTempEl(temp) {
    var tempEl = document.createElement('div')
    tempEl.textContent = temp;
    tempEl.className = "card-data";
    return tempEl;
}

function makeHumidEl(humid) {
    var humidEl = document.createElement('div')
    humidEl.textContent = humid;
    hunidEl.className = "card-data";
    return humidEl;
}

function makeWindEl(wind) {
    var windEl = document.createElement('div')
    windEl.textContent = temp;
    tempEl.className = "card-data";
    return tempEl;
}

function makeCardEl(prop) {
    var cardEl = document.createElement('div');
    cardEl.textContent = prop;
    cardEl.className = "card-data";
    return cardEl
}

function renderForecast(cityName, date, icon, temp, humid, wind) {
    var forecastCard = document.createElement('div');
    forecastCard.className = "card";
    if (cityName.length > 0) {
        forecastCard.append(makeCityEl(cityName))
    } 
    forecastCard.append(makeCardEl(date), makeCardEl(icon), makeCardEl(temp), makeCardEl(humid), makeCardEl(wind));
    forecastContainer.append(forecastCard);
}


// function renderForecast(cityName, date, icon, temp, humid, wind) {
//     var forecastCard = document.createElement('div');
//     forecastCard.className = "card";
//     var infoList = document.createElement('ul');
//     var dateEl = document.createElement('li');
//     var iconEl = document.createElement('li');
//     var tempEl = document.createElement('li');
//     var humidEl = document.createElement('li');
//     var windEl = document.createElement('li');
//     if (cityName.length > 0) {
//         var cityEl = document.createElement('li');
//         cityEl.textContent = cityName;
//         infoList.append(cityEl);
//     } 
//     dateEl.textContent = date;
//     iconEl.textContent = icon;
//     tempEl.textContent = temp;
//     humidEl.textContent = humid;
//     windEl.textContent = wind;
//     infoList.append(dateEl, iconEl, tempEl, humidEl, windEl);
//     forecastCard.append(infoList)
//     forecastContainer.append(forecastCard);
// }

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
    // console.log(cityName)
    localStorage.setItem(localStorage.length, cityName)
    for (var i = 0; i < 6; i++) {
        // console.log(result.list[i])
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

function clearPreviousForecast() {
    console.log(forecastContainer.childNodes)
    if (forecastContainer.childNodes.length > 0) {
        forecastContainer.removeChild(forecastContainer.firstChild)
        clearPreviousForecast();
    }
}

function citySearch (event) {
    event.preventDefault();
    if (inputCitySearch.value === "") { return; }
    clearPreviousForecast();
    getWeatherData(inputCitySearch.value);
}

loadFullHistory();
searchForm.addEventListener("submit", citySearch);