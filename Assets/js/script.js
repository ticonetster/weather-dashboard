var inputEl = document.getElementById("input");
var searchEl = document.getElementById("searchBn");
var nameEl = document.getElementById("cityName");
var statusEl = document.getElementById("statusPic");
var tempEl = document.getElementById("cityTemp");
var humidityEl = document.getElementById("cityHum");4
var windEl = document.getElementById("cityWind");
var UVEl = document.getElementById("cityUv");
var recentEl = document.getElementById("recent");
let recentHistory = JSON.parse(localStorage.getItem("recent")) || [];

var APIKey = "73ff4cc45e21dd1b66bd067358dbb8a3";

function getWeather(cityName) {
    //Get current weather
    var url = "https://api.openweathermap.org/data/2.5/weather?" 
    fetch(`${url}q=${cityName}&appid=${APIKey}`)
        .then((response) => {
            return response.json();
        }).then((data) => {
            //Current Date
            var currentDate = moment().format('(M/D/YYYY)');
            nameEl.innerHTML = data.name + " " + currentDate;
            var weatherIcon = data.weather[0].icon;
            statusEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
            statusEl.setAttribute("alt",data.weather[0].description);
            tempEl.innerHTML = "Temp: " + k2f(data.main.temp) + " &#176F";
            windEl.innerHTML = "Wind: " + data.wind.speed + " MPH";
            humidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
            //Get UV Index
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?"
            fetch(`${uvUrl}lat=${lat}&lon=${lon}&appid=${APIKey}`)
            .then((response) => {
                return response.json();
            }).then((uviData) => {
                var UVIndex = document.createElement("span");
                UVIndex.setAttribute("class","badge badge-danger");
                UVIndex.innerHTML = uviData.current.uvi;
                UVEl.innerHTML = "UV Index: ";
                UVEl.append(UVIndex);
            });

    //5 Day Forecast
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?"
    fetch(`${forecastUrl}lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then((response) => {
        return response.json();
    }).then(function(data){
        var forecastEls = document.querySelectorAll(".forecast");
        var today = moment();
        for (i=0; i<forecastEls.length; i++) {
            forecastEls[i].innerHTML = "";
            var forecastIndex = i * 8 + 4;
            var forecastDate = today.add(1, 'days').format('(M/D/YYYY)');
            var forecastDateEl = document.createElement("p");
            forecastDateEl.setAttribute("class","forecast-date");
            forecastDateEl.innerHTML = forecastDate;
            forecastEls[i].append(forecastDateEl);
            var forecastWeatherEl = document.createElement("img");
            forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
            forecastWeatherEl.setAttribute("alt",data.list[forecastIndex].weather[0].description);
            forecastEls[i].append(forecastWeatherEl);
            var forecastTempEl = document.createElement("p");
            forecastTempEl.innerHTML = "Temp: " + k2f(data.list[forecastIndex].main.temp) + " &#176F";
            forecastEls[i].append(forecastTempEl);
            var forecastWindEl = document.createElement("p");
            forecastWindEl.innerHTML = `Wind: ${data.list[forecastIndex].wind.speed} MPH`;
            forecastEls[i].append(forecastWindEl);
            var forecastHumidityEl = document.createElement("p");
            forecastHumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
            forecastEls[i].append(forecastHumidityEl);
            }
        })
    });  
}
//Search
searchEl.addEventListener("click",function() {
    var searchTerm = inputEl.value;
    getWeather(searchTerm);
    recentHistory.push(searchTerm);
    localStorage.setItem("recent",JSON.stringify(recentHistory));
    showHistory();
})

function showHistory(){
    recentEl.innerHTML = "";
    for (var i=0; i < recentHistory.length; i++) {
        var historyItem = document.createElement("button");
        historyItem.setAttribute("type","button");
        historyItem.textContent = recentHistory[i];
        historyItem.setAttribute("class", "btn btn-light border border-info col-12 mb-2");
        recentEl.append(historyItem);
        historyItem.addEventListener("click",function() {
            getWeather(event.target.textContent);
            inputEl.setAttribute("Placeholder", event.target.textContent)
        })
        
    }
}
//Temperature Converter Kelvins to Fahrenheit
function k2f(K) {
    return Math.floor((K - 273.15) *1.8 +32);
}
showHistory()