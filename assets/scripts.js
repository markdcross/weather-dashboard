$(document).ready(function () {
    //----------------------------------------------------------
    // Searching for a city, calling the API, and mapping values
    //----------------------------------------------------------

    // When the form is submitted (search bar or search history button click), run the call function
    $('form').on('submit', function (event) {
        event.preventDefault();
        call();
    });

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
            var cityID = response.id;
            // Lists the city in the Jumbotron
            $('#cityName').text(response.name);
            //TODO: Fix image import below
            $('#currentImg').attr(
                'src',
                `http://openweathermap.org/img/wn/${response.weather.icon}.png`
            );
            $('#tempData').html(`${response.main.temp} &#8457;`);
            $('#humidData').html(`${response.main.humidity}%`);
            $('#windData').html(`${response.wind.speed} mph`);
            $('#windArrow').css({
                transform: `rotate(${response.wind.deg}deg)`,
            });

            uvCall(lon, lat);
            fiveDay(cityID);
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
            //TODO: Color code UV Index
        });
    }

    // Gets the 5-day forecast
    //TODO: Why is there an API key error here??
    function fiveDay(cityID) {
        var fiveQueryURL = `https://api.openweathermap.org/data/2.5/forecast/daily?id=${cityID}&cnt=5&units=imperial&appid=77cb488591d883bec900753d1136d81c`;
        // http://api.openweathermap.org/data/2.5/forecast/daily?q=Richmond&cnt=5&appid=77cb488591d883bec900753d1136d81c
        $.ajax({
            url: fiveQueryURL,
            method: 'GET',
        }).then(function (fiveResponse) {
            for (var k = 0; k < 5; k++) {
                //TODO: Add image from API
                $(`#${k - 1}temp`).html(
                    `Temp: ${fiveResponse.list[k].temp.day} &#8457;`
                );
                $(`#${k - 1}humid`).html(
                    `Humidity: ${fiveResponse.list[k].humidity}%`
                );
            }
        });
    }

    //TODO: Save city name to local storage as button

    //-------------------------------
    // Dates pulled in from Moment.js
    //-------------------------------
    // Today's date
    var momentDay = moment().format('dddd, MMMM Do');
    $('.todayDate').text(momentDay);

    // Generate dates for the 5-day forecast
    for (var i = 1; i < 6; i++) {
        $(`#${i}Date`).text(moment().add(i, 'd').format('dddd, MMMM Do'));
    }
});
