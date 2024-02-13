const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("images"));

const port = process.env.PORT;

app.get("/", function (req, res) {
  //res.sendFile(__dirname + "/index.html");
  res.render("weather", {
    imageSrc: "rain.png",
    temperature: "0",
    cloudsState: "Broken Clouds",
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
      res.redirect("/");
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
          imageURL = "cloud.png";
          break;
        case "Clear":
          imageURL = "clear.png";
          break;
        case "Rain":
          imageURL = "rain.png";
          break;
        case "Snow":
          imageURL = "snow.png";
          break;
        case "Haze":
          imageURL = "mist.png";
          break;
        default:
          imageURL = "rain.png";
      }
      res.render("weather", {
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
/*
      <div class="not-found">
        <div class="box">
          <img src="404.png" />
          <p>Oops! Location not found!</p>
        </div>
      </div> */
