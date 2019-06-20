import WeatherView from "../view/WeatherView";

export default class WeatherController {
    constructor() {
        this.apiKey = "eb8f9435dbb4a898ac6ab70ee6bf405e";
        this.view = new WeatherView();

        document.body.append(this.view);
    }

    async getWeather(city) {
        return this.getJson(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`)
            .then((response) => {
                if (!this.getWeatherOverride()) {
                    return {
                        weather: response.weather[0].main,
                        icon: response.weather[0].icon
                    };
                } else {
                    return this.getWeatherOverride();
                }
            });
    }

    async getJson(url) {
        return fetch(url)
            .then((response) => response.json());
    }

    setWeather(weather) {
        this.view.setWeather(weather.weather, weather.icon);
    }

    /**
     * Change the return value to override the weather.
     */
    getWeatherOverride() {
        return undefined;
        // return  {
        //     weather: "Clear",
        //     icon: "01d"
        // };
    }
}
