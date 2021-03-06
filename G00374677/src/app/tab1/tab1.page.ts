import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  background: string = "";
  public toggleF: boolean = false;

  constructor(private geolocation: Geolocation,
    private weatherService: WeatherService,
    private mapsAPILoader: MapsAPILoader,
    private platform: Platform,
    private storage: Storage
  ) { }
  // lat and long information
  coords: {
    latitude: number;
    longitude: number;
  }
  // incoming weather data from weather API 
  weatherData = {
    name: "",
    region: "",
    country: "",
    localtime: "",
    temp_c: "",
    temp_f: "",
    conditionText: "",
    conditionIcon: "",
    wind_direction: "",
    pressure_mb: "",
    humidity: "",
    feelsLike_c: "",
    feelsLike_f: "",
    uvIndex: "",
    faren: "°F",
    celsius: "°C",
  }

  ionViewDidEnter() {
    // verify if toggle is true or false, and assign value. 
    this.storage.get('toggleF').then((value) => {
      this.toggleF = value;
      console.log(this.toggleF);
    })
    // retreives searched location from storage, and gets current data for searched area 
    this.storage.get('location').then((value) => {
      if (value != null) {
        this.coords = JSON.parse(value);
        this.getCurrentWeatherData(this.coords.latitude, this.coords.longitude);
      } else {
        // get current location
        this.geolocation.getCurrentPosition().then((pos) => {
          this.coords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }
          console.log(this.coords);
          this.getCurrentWeatherData(this.coords.latitude, this.coords.longitude);
        })
      }
    })
  }// end of ionViewDidEnter

  // subscribes to my weather api and store the incoming data for display
  getCurrentWeatherData(latitude, longitude) {
    this.weatherService.GetCurrentTemperature(latitude, longitude).subscribe((tempData) => {
      this.weatherData.name = tempData.location.name;
      this.weatherData.region = tempData.location.region;
      this.weatherData.country = tempData.location.country;
      this.weatherData.localtime = tempData.location.localtime;
      this.weatherData.temp_c = tempData.current.temp_c;
      this.weatherData.temp_f = tempData.current.temp_f;
      this.weatherData.conditionText = tempData.current.condition.text;
      this.weatherData.conditionIcon = tempData.current.condition.icon;
      this.weatherData.wind_direction = tempData.current.wind_dir;
      this.weatherData.pressure_mb = tempData.current.pressure_mb;
      this.weatherData.humidity = tempData.current.humidity;
      this.weatherData.feelsLike_c = tempData.current.feelslike_c;
      this.weatherData.feelsLike_f = tempData.current.feelslike_f;
      this.weatherData.uvIndex = tempData.current.uv;
      // if temperature toggle true or false , then change the temperature units accordingly 
      this.displayTempUnit();
      // gets the current background according to the condition text
      this.GetCurrentdescription(this.weatherData.conditionText);
    })
  }
  // temperature unit display
  displayTempUnit() {
    if (this.toggleF == true) {
      this.weatherData.temp_c = this.weatherData.temp_f + this.weatherData.faren;
      this.weatherData.feelsLike_c = this.weatherData.feelsLike_f + this.weatherData.faren;
    } else {
      this.weatherData.temp_c = this.weatherData.temp_c + this.weatherData.celsius;
      this.weatherData.feelsLike_c = this.weatherData.feelsLike_c + this.weatherData.celsius;
    }
  }

  // dynamic background
  GetCurrentdescription(description) {
    console.log(description)
    if (description == "Cloudy" || description == "Overcast") {
      this.background = "cloudy-weather";
      this.storage.set('background', this.background);
    }
    if (description == "Clear" || description == "Sunny" || description == "Partly cloudy") {
      this.background = "clear-weather";
      this.storage.set('background', this.background);
    }

    if (description == "Mist" || description == "Fog" || description == "Freezing fog") {
      this.background = "foggy-weather";
      this.storage.set('background', this.background);
    }

    if (description == "Snow" || description == "Light sleet showers"
      || description == "Moderate or heavy sleet showers" || description == "Light snow showers"
      || description == "Moderate or heavy snow showers" || description == "Patchy snow possible"
      || description == "Patchy sleet possible" || description == "Blowing snow"
      || description == "Blizzard" || description == "Light sleet" || description == "Moderate or heavy sleet"
      || description == "Patchy light snow" || description == "Light snow" || description == "Patchy moderate snow"
      || description == "Moderate snow" || description == "Patchy heavy snow"
      || description == "Heavy snow" || description == "Ice pellets" || description == "Patchy light snow with thunder"
      || description == "Moderate or heavy snow with thunder") {
      this.background = "snow-weather";
      this.storage.set('background', this.background);
    }

    if (description == "Rain" || description == "Patchy rain possible"
      || description == "Patchy freezing drizzle possible"
      || description == "Patchy light drizzle" || description == "Light drizzle"
      || description == "Freezing drizzle" || description == "Heavy freezing drizzle"
      || description == "Patchy light rain" || description == "Light rain"
      || description == "Moderate rain at times" || description == "Moderate rain"
      || description == "Heavy rain at times" || description == "Heavy rain"
      || description == "Light freezing rain" || description == "Moderate or heavy freezing rain"
      || description == "Light rain shower" || description == "Moderate or heavy rain shower"
      || description == "Torrential rain shower") {
      this.background = "rain-weather";
      this.storage.set('background', this.background);
    }

    if (description == "Thundery outbreaks possible" || description == "Patchy light rain with thunder"
      || description == "Moderate or heavy rain with thunder") {
      this.background = "windy-weather";
      this.storage.set('background', this.background);
    }
  }




}
