window.currentPosition = {};
const weatherContent = document.querySelector(".weatherContent");

async function getLocation() {
    if (navigator.geolocation) {

        // setTimeout(() => {
        navigator.geolocation.getCurrentPosition(setWeatherByPosition, function (error) {
            alert("Your data is not loaded");
        });
        // }, 1000);
    } else {
        weatherContent.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//Input field and button
const input = document.getElementById("weatherInput");
const searchButton = document.getElementById("searchButton");

//Load data according to geo position
async function setWeatherByPosition(position) {
    const res = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=f06e09d7f145979f8db2e2153a916104");
    const weather = await res.json();
    setHtml(weather);
}


//search button functionality
searchButton.addEventListener("click", function () {
    const city = input.value;
    if (city) {
        const weather = setWeatherByCityName(city);
        console.log("city", weather, typeof (weather));
        if (weather) {
            weather.then(data => {
                setHtml(data);
            });
        }
    } else {
        alert("Enter a valid city name.");
    }
});

//Load data using City Name
async function setWeatherByCityName(cityName) {
    const res = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=f06e09d7f145979f8db2e2153a916104");
    const weather = await res.json();
    return weather;
};

//Set HTML values
function setHtml(data) {
    document.getElementById("location").innerHTML = data.name;
    document.getElementById("weather-summery").innerHTML = data.weather[0].main;
    document.getElementById("temperature").innerHTML = Math.round(data.main.temp - 273);

    // Converting the unix timestamp
    const unixTimeStamp = data.dt;
    const timeInMilliseconds = unixTimeStamp * 1000;
    const dateObject = new Date(timeInMilliseconds);

    const day = dateObject.toLocaleString("en-US", {
        weekday: "long"
    });
    const month = dateObject.toLocaleString("en-US", {
        month: "long"
    });
    const dayNumber = dateObject.toLocaleString("en-US", {
        day: "numeric"
    });
    const timeHr = dateObject.toLocaleString("en-US", {
        hour: "numeric"
    });
    const timeMin = dateObject.toLocaleString("en-US", {
        minute: "numeric"
    });



    document.getElementById("weekday").innerHTML = day;
    document.getElementById("date").innerHTML = dayNumber + ", " + month;
    document.getElementById("time").innerHTML = timeHr.replace(" ", ":" + timeMin + " ");

    document.querySelector("#feel span").innerText = Math.round(data.main.feels_like - 273);
    document.querySelector("#humidity span").innerText = data.main.humidity;
    document.querySelector("#wind span").innerText = (data.wind.speed * 1.852).toFixed(1);

    //Setting image source
    const summeryImg = document.getElementById("summery-img").src;
    debugger;
    console.log(typeof (data.weather[0].main));
    if (data.weather[0].main == "Clear") {
        debugger;
        summeryImg = "images/clear.svg"
    } else if (data.weather[0].main == "Clouds") {
        summeryImg = "images/partly_cloudy.png"
    } else if (data.weather[0].main == "Drizzle") {
        summeryImg = "images/rain_s_cloudy.png"
    } else {
        summeryImg = "images/thunderstorms.png"
    }
}