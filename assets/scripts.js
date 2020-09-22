$(document).ready(function () {
    function call(btnCityName) {
        var cityName = btnCityName || $('input').val();
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=77cb488591d883bec900753d1136d81c`;

        $.ajax({
            url: queryURL,
            method: 'GET',
        }).then(function (response) {
            $('#cityName').text(response.name);
        });
    }

    //TODO: Wrap this in a click event on the search button
    $('form').on('submit', function (event) {
        event.preventDefault();
        call();
    });

    //TODO: Save city name to local storage instead of URL

    // Dates pulled in from Moment.js
    var momentDay = moment().format('dddd, MMMM Do');
    $('.todayDate').text(momentDay);

    for (var i = 1; i < 6; i++) {
        $(`#${i}Date`).text(moment().add(i, 'd').format('dddd, MMMM Do'));
    }
});
