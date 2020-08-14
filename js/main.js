window.currentPosition = {};
const weatherContent = document.querySelector(".weatherContent");

//Function for getting current location
async function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setWeatherByPosition, function (
      err
    ) {
      if (err.code == 1) {
        alert("Error: Access is denied!");
      } else if (err.code == 2) {
        alert("Error: Position is unavailable!");
      }
    });
  } else {
    weatherContent.innerHTML = "Geolocation is not supported by this browser.";
  }
}

//Input field and button
const input = document.getElementById("weatherInput");
const searchButton = document.getElementById("searchButton");

//Load data according to geo position
async function setWeatherByPosition(position) {
  const res = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    position.coords.latitude +
    "&lon=" +
    position.coords.longitude +
    "&appid=f06e09d7f145979f8db2e2153a916104"
  );
  const weather = await res.json();
  setValues(weather);
}

//search button functionality
searchButton.addEventListener("click", async function () {
  const city = input.value;
  if (city) {
    const weather = setWeatherByCityName(city);
    console.log("city", weather, typeof weather);
    if (weather) {
      weather.then((data) => {
        if (data.name) {
          setValues(data);
        } else {
          alert("Enter a valid city name.");
        }
      });
    }
  } else {
    alert("Enter a valid city name.");
  }
});

//Load data using City Name
async function setWeatherByCityName(cityName) {
  const res = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=f06e09d7f145979f8db2e2153a916104"
  );
  const weather = await res.json();
  return weather;
}

//Set HTML values
function setValues(data) {
  //Setting country Info
  let flagImg = document.getElementById("flagImg");
  flagImg.src =
    "https://www.countryflags.io/" + data.sys.country + "/flat/64.png";

  document.getElementById("lat").innerText = data.coord.lat;
  document.getElementById("long").innerText = data.coord.lon;

  document.getElementById("state").innerHTML =
    data.name + ", " + data.sys.country;

  document.getElementById("sunrise").innerText = unixToLocalTime(
    data.sys.sunrise
  ).toLocaleTimeString();

  document.getElementById("sunset").innerText = unixToLocalTime(
    data.sys.sunset
  ).toLocaleTimeString();

  //Setting weather info
  document.getElementById("location").innerHTML = data.name;
  document.getElementById("weather-summery").innerHTML = data.weather[0].main;
  document.getElementById("temperatureCel").innerHTML = Math.round(
    data.main.temp - 273.15
  );
  document.getElementById("temperatureFer").innerHTML = Math.round(
    ((data.main.temp - 273.15) * 9) / 5 + 32
  );

  // Converting the unix timestamp
  const dateObj = unixToLocalTime(data.dt);

  const day = dateObj.toLocaleString("en-US", {
    weekday: "long",
  });
  const month = dateObj.toLocaleString("en-US", {
    month: "long",
  });
  const dayNumber = dateObj.toLocaleString("en-US", {
    day: "numeric",
  });

  document.getElementById("weekday").innerHTML = day;
  document.getElementById("date").innerHTML = dayNumber + ", " + month;
  document.getElementById("time").innerHTML = dateObj.toLocaleTimeString();

  document.querySelector("#feel span").innerText = Math.round(
    data.main.feels_like - 273
  );
  document.querySelector("#humidity span").innerText = data.main.humidity;
  document.querySelector("#wind span").innerText = (
    data.wind.speed * 1.852
  ).toFixed(1);

  //Setting weather icon image source
  let summeryImg = document.getElementById("summery-img");
  summeryImg.src =
    "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
}

//Function to change unix timestamp to local datestring
function unixToLocalTime(unixTime) {
  const unixTimeStamp = unixTime;
  const timeInMilliseconds = unixTimeStamp * 1000;
  const dateObject = new Date(timeInMilliseconds);
  return dateObject;
}