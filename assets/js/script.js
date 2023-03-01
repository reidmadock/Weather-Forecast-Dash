var searchForm = document.querySelector('#search-form');
var historyContainer = document.querySelector('#history-container');
var todayForecast = document.querySelector('#today-forecast');
var fiveDayForecast = document.querySelector('#five-day-forecast');

var apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
var searchTerm = "q=";
var apiKeyTerm = "&appid=";
var apiKey = "dacfab95576f6aec206ec9cde08bd9db";
var testUrl = "https://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=dacfab95576f6aec206ec9cde08bd9db"

function getApi() {
    fetch(testUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (turkey) {
        console.log(turkey);
    });
}

function loadHistory() {

}

function citySearch (event) {
    event.preventDefault();
    console.log('starbucks');
    getApi();
}

searchForm.addEventListener("submit", citySearch);