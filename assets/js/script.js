var searchForm = document.querySelector('#search-form');
var inputCitySearch = document.querySelector('#search-city');
var historyContainer = document.querySelector('#history-container');
var todayForecast = document.querySelector('#today-forecast');
var fiveDayForecast = document.querySelector('#five-day-forecast');

var apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
var searchTerm = "q=";
var apiKeyTerm = "&appid=";
var apiKey = "dacfab95576f6aec206ec9cde08bd9db";
var unitsTerm = "&units=imperial"
var testUrl = "https://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=dacfab95576f6aec206ec9cde08bd9db"
var latAndLon = []; //latitude and longitude

/* Trying to store lat and lon in individual variables caused issues with those variables getting reset
after the function. So they're in an area, and to account for multiple searches, the array can be
access by say [length - 2] and [length - 1] to get latitude and longitude respectively */
function getCityCoords(inputCity) {
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
    var limitTerm = "&limit=1"
    var fullUrl = geoApiUrl + inputCity + limitTerm + apiKeyTerm + apiKey
    fetch(fullUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (turkey) {
        latAndLon.push(turkey[0].lat, turkey[0].lon)
    });
}

function getApiFiveDay() {
    var fiveDayUrl = "api.openweathermap.org/data/2.5/forecast?"
    console.log(latAndLon);
    console.log("Lat: ", latAndLon[0])
    console.log("Lon: ", latAndLon[1])
    console.log(latAndLon);
    var latTerm = "lat=" + latAndLon[latAndLon.length - 2];
    var lonTerm = "&lon=" + latAndLon[latAndLon.length - 1];
    var fullFiveDayUrl = fiveDayUrl + latTerm + lonTerm + apiKeyTerm + apiKey;
    console.log(fullFiveDayUrl);
    fetch(fullFiveDayUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (turkey) {
        console.log(turkey);
    });
}

function getApiToday(searchUrl) {
    fetch(searchUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (turkey) {
        console.log(turkey);
    });
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
    divKey.textContent = localStorage.getItem(localStorage.key(localStorage.length - 1));
    historyContainer.appendChild(divKey);
}

function citySearch (event) {
    event.preventDefault();
    var searchedCity = inputCitySearch.value;
    getCityCoords(inputCitySearch.value);
    console.log(latAndLon);
    var searchUrl = apiUrl + searchTerm + searchedCity + apiKeyTerm + apiKey + unitsTerm
    // console.log(searchUrl);
    localStorage.setItem(searchedCity, searchedCity);
    // console.log('starbucks');
    getApiToday(searchUrl); //Function call, function invocation
    getApiFiveDay();
    loadHistory();
}

loadFullHistory();
searchForm.addEventListener("submit", citySearch);