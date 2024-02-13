const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const port = process.env.PORT;

app.get("/", function (req, res) {
  //res.sendFile(__dirname + "/index.html");
  res.render("weather", {
    containerHeight: "100px",
    foundLocation: "hidden",
    notFound: "hidden",
    location: "City Name",
    imageSrc: "images/rain.png",
    temperature: "0",
    cloudsState: "Weather State",
    humidityPercentage: "0",
    windSpeedKM: "0",
  });
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit +
    "";
  https.get(url, function (response) {
    console.log(response.statusCode);
    if (response.statusCode === 404) {
      res.render("weather", {
        containerHeight: "400px",
        foundLocation: "hidden",
        notFound: "visible",
        location: "",
        imageSrc: "images/404.png",
        temperature: "",
        cloudsState: "",
        humidityPercentage: "",
        windSpeedKM: "",
      });
      return;
    }
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      var imageURL = "";
      switch (weatherData.weather[0].main) {
        case "Clouds":
          imageURL = "images/cloud.png";
          break;
        case "Clear":
          imageURL = "images/clear.png";
          break;
        case "Rain":
          imageURL = "images/rain.png";
          break;
        case "Snow":
          imageURL = "images/snow.png";
          break;
        case "Haze":
          imageURL = "images/mist.png";
          break;
        default:
          imageURL = "images/rain.png";
      }
      res.render("weather", {
        containerHeight: "555px",
        foundLocation: "visible",
        notFound: "hidden",
        location: query,
        imageSrc: imageURL,
        temperature: temp,
        cloudsState: weatherDescription,
        humidityPercentage: humidity,
        windSpeedKM: windSpeed,
      });
    });
  });
});
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
