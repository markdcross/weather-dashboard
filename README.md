# Weather Dashboard

Using OpenWeather API to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS. Local Storage will store persistent data.

# Usage

https://markdcross.github.io/weather-dashboard/

![Screenshot](./assets/img/Screenshot.png)

The Weather Dashboard uses the OpenWeather API to display current and forecasted weather for a given city. When the user searches for a city, the city name is used to pull the current weather for that city. The five-day forecast and UV index are populated using the lat/long returned from the current city weather API call, which is passed into a subsequent API call for the additional data. The UV Index is color coded based on the value returned.

# Local Storage

When the user searches for a city, the city name is saved to local storage and a button is created in the search history element below the search bar. The user can simply click the button corresponding to a previously searched city to see that weather again. If the page is reloaded, the search history persists and the most recent search is populated on screen. If the user searches for an invalid city, an error is thrown and no button is created.
