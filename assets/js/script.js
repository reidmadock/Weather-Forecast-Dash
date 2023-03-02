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

function getApi(searchUrl) {
    fetch(searchUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (turkey) {
        console.log(turkey);
    });
}

function loadHistory() {
    for (var i = 0; i < localStorage.length; i++) {
        var divKey = document.createElement('div');
        divKey.textContent = localStorage.getItem(localStorage.key(i));
        historyContainer.appendChild(divKey);
    }
}

function citySearch (event) {
    event.preventDefault();
    var searchedCity = inputCitySearch.value
    var searchUrl = apiUrl + searchTerm + searchedCity + apiKeyTerm + apiKey + unitsTerm
    // console.log(searchUrl);
    localStorage.setItem(searchedCity, searchedCity);
    // console.log('starbucks');
    getApi(searchUrl); //Function call, function invocation
    loadHistory();
}

loadHistory();
searchForm.addEventListener("submit", citySearch);