// Key 
const headerArea = $(".weather-header");
const buttonArea = $("#history");
const todayReturn = $("#today");
const forecastReturn = $("#forecast");
const userInput = $("#search-input");
const userButton = $("#search-button");
const APIKey = "12786491ac6b5851aca9bc20462fd30e";

// Adding Style to HTML Elements
$(".input-group-append").css('cssText', 'display: block !important; width: 100%;')
userInput.css('cssText', 'display: block !important; width: 100%;')
userButton.css('cssText', 'margin-top: 5px !important; border-radius: 0.3rem !important; width: 100%;').attr({ class: 'button btn btn-primary btn-lg btn-block' });
headerArea.css('cssText', 'background: linear-gradient(to right, #3460B9, #200B4D);');

// Defining Containers 
let userSearch = '';
let searchHistory = [];
let latitude = "";
let longitude = "";

// Initialising Page and Button creation
function initPage() {
    let searchHistory = JSON.parse(localStorage.getItem('historyLocation'));
    if (searchHistory != null) {
        for (let i = 0; i < searchHistory.length; i++) {
            const historyButton = $('<button>').text(searchHistory[i]);
            historyButton.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
            $('#history').prepend(historyButton);
        }
    }
}

// Getting to Geo Location for inputted City
function getLoctionURL(loaction) {
    let geoQueryURL =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        loaction +
        "&limit=1&appid=" +
        APIKey;
    $.ajax({
        url: geoQueryURL,
        method: "GET",
    }).then(function (result) {
        returnedCity = result[0].name;
        latitude = result[0].lat.toFixed(2);
        longitude = result[0].lon.toFixed(2);
        let searchHistory = JSON.parse(localStorage.getItem("historyLocation")) || [];

        if (searchHistory === null || !searchHistory.includes(returnedCity)) {
            searchHistory.push(returnedCity);
            localStorage.setItem('historyLocation', JSON.stringify(searchHistory));
        }
        getForecastWeather()
        buttonArea.empty();
        initPage()

    });
}

// Weather Forcast for 6 days
function getForecastWeather() {
    let weatherQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=" +
        APIKey;

    $.ajax({
        url: weatherQueryURL,
        method: "GET",
    })
        .then(function (result) {
            todayReturn.empty();
            // Create the elements to store current Days weather.

            // creating tag
            let currentDate = moment().format('DD/MM/YYYY');
            let todayTempData = (result.list[0].main.temp - 273.15).toFixed(2);
            let todayWindData = (result.list[0].wind.speed * 2.23694).toFixed(1);
            let todayIconURL = 'https://openweathermap.org/img/wn/' + result.list[0].weather[0].icon + '@2x.png';
            // populating tag
            const todayIcon = $("<img>").attr('src', todayIconURL,).addClass('weather-icon').css('cssText', 'width: 70px; height: 70px');
            const todayTitle = $('<h3>').text(result.city.name + " " + currentDate).append(todayIcon);
            const todayTemp = $('<p>').text('Temp: ' + todayTempData + '℃');
            const todayWind = $('<p>').text('Wind: ' + todayWindData + ' kph')
            const todayHumidity = $('<p>').text('Humidity: ' + result.list[0].main.humidity + '%');
            // Appending Tag
            todayReturn.append(todayTitle, todayTemp, todayWind, todayHumidity)
            todayReturn.addClass('border border-dark rounded');

            const forecastTitleEl = $('<h3>').text('5-day Forecast:').attr('class', 'col-12', 'mt-3');
            $('#forecast').append(forecastTitleEl);

            // Use 'For loop' to create elements and show the forecasts to the webpage
            for (let i = 0; i < 5; i++) {
                let weatherReturn = i + 1 * 8;
                // creating tag
                let forecastTempData = (result.list[weatherReturn].main.temp - 273.15).toFixed(2);
                let forecastTindData = (result.list[weatherReturn].wind.speed * 2.23694).toFixed(1);
                let forecastIconURL = 'https://openweathermap.org/img/wn/' + result.list[weatherReturn].weather[0].icon + '@2x.png'
                let forecastDateData = moment().add('days', i + 1).format('DD/MM/YYYY');
                // populating tag
                const forecastCard = $('<div>').addClass('card col-2 bg-dark text-white justify-content-start');
                const forecastDate = $('<h5>').text(forecastDateData);
                const forecastIcon = $('<img>').attr('src', forecastIconURL,).addClass('weather-icon').css('cssText', 'width: 70px; height: 70px');
                const forecastTemp = $('<p>').text('Temp: ' + forecastTempData + '℃');
                const forecastWind = $('<p>').text('Wind: ' + forecastTindData + ' kph');
                const forecastHumidity = $('<p>').text('Humidity: ' + result.list[weatherReturn].main.humidity + ' %')
                // Appending Tag
                $('#forecast').addClass('d-flex justify-content-sm-around');
                forecastCard.append(forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity);
                $('#forecast').append(forecastCard);

            }
        });
}



initPage()
// Search Button on click functionality
userButton.on("click", function (event) {
    todayReturn.empty();
    forecastReturn.empty();
    userSearch = userInput.val()
    event.preventDefault();
    getLoctionURL(userSearch);
});


// History button search function
buttonArea.on('click', 'button', function (event) {
    todayReturn.empty();
    forecastReturn.empty();
    event.preventDefault();
    userSearch = event.target.innerText.trim();
    getLoctionURL(userSearch);
})
