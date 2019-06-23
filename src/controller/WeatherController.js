import WeatherView from "../view/WeatherView";
import { WeatherEnum } from "../util/helpers";

export default class WeatherController {
    constructor() {
        this.apiKey = "eb8f9435dbb4a898ac6ab70ee6bf405e";
        this.view = new WeatherView();

        document.body.append(this.view);
    }

    async getWeather(city) {
        if (this.getWeatherOverride()) {
            return this.getWeatherOverride();
        }
        return this.getJson(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
                this.apiKey
            }`
        ).then(response => {
            return {
                weather: response.weather[0].main,
                icon: response.weather[0].icon
            };
        });
    }

    async getJson(url) {
        return fetch(url).then(response => response.json());
    }

    setWeather(weather) {
        this.view.setWeather(weather.weather, weather.icon);
    }

    /**
     * Change the return value to override the weather.
     */
    getWeatherOverride() {
        return undefined;
        // return {
        //     weather: WeatherEnum.rain,
        //     icon: "01d"
        // };
    }
}
