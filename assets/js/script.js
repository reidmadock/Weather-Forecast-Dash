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

// function giveWeatherEmoji(code) {
//     if (code == '01') {
//         return '☀';
//     } else if ()
// }

// function giveWeatherEmoji(code) {
//     console.log(code)
//     switch (code) { 
//         case code == '01': //01 clear sky
//             return '☀';
//         case code == '02': //02 few clouds
//             return '⛅';
//         case code == '03': //03 scattered clouds
//             return '⛅';
//         case code == '04': //04 broken clouds
//             return '⛅';
//         case code == '09': //09 shower rain
//             return '🌧';
//         case code == '10': //10 rain
//             return '🌧';
//         case code == '11': //11 thunderstorm
//             return '⚡';
//         case code == '13': //13 snow
//             return '🌨';
//         case code == '50': //50 mist
//             return '🌫';
//         default:
//             return 'problem';
//     }
// }

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
// const iconArr = ["☁","⛅","⛈","🌧","🌨","❄","⚡","☀","🌫"]
function makeIconEl(icon) {
    var iconEl = document.createElement('img');
    // var iconEl = document.createElement('div');
    // iconEl.textContent = giveWeatherEmoji(icon.slice(0,2));
    iconEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    iconEl.className = "card-data";
    return iconEl;
}

function makeTempEl(temp) {
    var tempEl = document.createElement('div')
    tempEl.textContent = temp + "°F";
    tempEl.className = "card-data";
    return tempEl;
}

function makeHumidEl(humid) {
    var humidEl = document.createElement('div')
    humidEl.textContent = humid + " %";
    humidEl.className = "card-data";
    return humidEl;
}

function makeWindEl(wind) {
    var windEl = document.createElement('div')
    windEl.textContent = wind + " MPH";
    windEl.className = "card-data";
    return windEl;
}

// function makeCardEl(prop) {
//     var cardEl = document.createElement('div');
//     cardEl.textContent = prop;
//     cardEl.className = "card-data";
//     return cardEl
// }

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

function getWeatherData(inputCity) {
    var fullGeoUrl = geoApiUrl + inputCity + limitTerm + apiKeyTerm + apiKey
    
    fetch(fullGeoUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (weather) {
        return(weather[0]);
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
    localStorage.setItem(localStorage.length, cityName)
    for (var i = 0; i < 6; i++) {
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

function clearPreviousForecast() {
    // console.log(forecastContainers[0].childNodes)
    if (forecastContainers[0].childNodes.length > 0) {
        forecastContainers[0].removeChild(forecastContainers[0].firstChild)
        clearPreviousForecast();
    }
    if (forecastContainers[1].childNodes.length > 0) {
        forecastContainers[1].removeChild(forecastContainers[1].firstChild)
        clearPreviousForecast();
    }
}

function citySearch (event) {
    event.preventDefault();
    loadRecentSearch(inputCitySearch.value);
    if (inputCitySearch.value === "") { return; }
    clearPreviousForecast();
    getWeatherData(inputCitySearch.value);
}

loadFullHistory();
searchForm.addEventListener("submit", citySearch);