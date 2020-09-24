$(document).ready(function () {
    var searchHistory = [];
    //----------------------------------------------------------
    // Searching for a city, calling the API, and mapping values
    //----------------------------------------------------------
    //TODO: Update comments
    init();
    // --------------------
    // Submit event on search form
    $('form').on('submit', function (event) {
        event.preventDefault();
        // Collects the value from the search field
        var city = $('input').val();
        // Returns if input is empty
        if (city === '') {
            return;
        }
        // Adds the searched city to the search history array
        searchHistory.push(city);

        // Runs function to store the search history array in local storage
        storeCities();

        // Runs function to create and display buttons of prior searched cities
        renderButtons();

        // Runs the function to call the API and display retrieved data
        call(city);

        $('form')[0].reset();
    });

    $('.searchHistoryEl').on('click', '.historyBtn', function (event) {
        event.preventDefault();
        // Collects the value from the search field
        var btnCityName = $(this).text();
        call(btnCityName);
    });
    // Pulls localStorage into searchHistory array

    function init() {
        // Get stored todos from localStorage
        // Parsing the JSON string to an object
        var storedCities = JSON.parse(localStorage.getItem('searchHistory'));

        // If todos were retrieved from localStorage, update the todos array to it
        if (storedCities !== null) {
            searchHistory = storedCities;
        }

        // Render todos to the DOM
        renderButtons();
    }

    //---------------
    // Add content of search to local storage on submit, and display search history buttons
    //---------------
    function storeCities() {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    //---------------
    // Creates and displays buttons for each city that is searched. Persists on refresh.
    //---------------
    function renderButtons() {
        // Clears the search history div
        $('.searchHistoryEl').html('');
        // For each item in the search history array
        for (var j = 0; j < searchHistory.length; j++) {
            // Store the search term (city) and create a button with the search term displayed
            var cityName1 = searchHistory[j];
            var historyBtn = $(
                '<button type="button" class="btn btn-primary btn-lg btn-block historyBtn">'
            ).text(cityName1);
            // Prepend the buttons to the search history div
            $('.searchHistoryEl').prepend(historyBtn);
        }
    }

    // If a button is clicked, pass that city name in as a parameter. Otherwise use the contents of the search bar
    function call(btnCityName) {
        var cityName = btnCityName || $('input').val();
        // Current weather conditions
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=77cb488591d883bec900753d1136d81c`;

        $.ajax({
            url: queryURL,
            method: 'GET',
        }).then(function (response) {
            var lon = response.coord.lon;
            var lat = response.coord.lat;
            // Lists the city in the Jumbotron
            $('#cityName').text(response.name);
            $('#currentImg').attr(
                'src',
                `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
            );
            $('#tempData').html(`${response.main.temp} &#8457;`);
            $('#humidData').html(`${response.main.humidity}%`);
            $('#windData').html(`${response.wind.speed} mph`);
            $('#windArrow').css({
                transform: `rotate(${response.wind.deg}deg)`,
            });

            uvCall(lon, lat);
            fiveDay(lon, lat);
        });
    }

    // Gets UV index from lat/long in current weather call
    function uvCall(lon, lat) {
        var uvQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&units=imperial&appid=77cb488591d883bec900753d1136d81c`;

        $.ajax({
            url: uvQueryURL,
            method: 'GET',
        }).then(function (uvResponse) {
            $('#uvData').html(`${uvResponse.value}`);
            if (uvResponse.value <= 2) {
                $('.uvRow').css('background-color', 'green');
            } else if (uvResponse.value > 2 && uvResponse.value <= 5) {
                $('.uvRow').css('background-color', 'yellow');
            } else if (uvResponse.value > 5 && uvResponse.value <= 7) {
                $('.uvRow').css('background-color', 'orange');
            } else if (uvResponse.value > 7 && uvResponse.value <= 10) {
                $('.uvRow').css('background-color', 'red');
            } else {
                $('.uvRow').css('background-color', 'violet');
            }
        });
    }

    // Gets the 5-day forecast
    function fiveDay(lon, lat) {
        var fiveQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=77cb488591d883bec900753d1136d81c`;

        $.ajax({
            url: fiveQueryURL,
            method: 'GET',
        }).then(function (fiveResponse) {
            for (var k = 1; k < 6; k++) {
                $(`#${k}img`).attr(
                    'src',
                    `http://openweathermap.org/img/wn/${fiveResponse.daily[k].weather[0].icon}@2x.png`
                );
                $(`#${k}temp`).html(
                    `Temp: ${fiveResponse.daily[k].temp.day} &#8457;`
                );
                $(`#${k}humid`).html(
                    `Humidity: ${fiveResponse.daily[k].humidity}%`
                );
            }
        });
    }

    //-------------------------------
    // Dates pulled in from Moment.js
    //-------------------------------
    // Today's date
    var momentDay = moment().format('dddd, MMMM Do');
    $('.todayDate').prepend(momentDay);

    // Generate dates for the 5-day forecast
    for (var i = 1; i < 6; i++) {
        $(`#${i}Date`).text(moment().add(i, 'd').format('dddd, MMMM Do'));
    }
});
