export default class WeatherView extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });

        this.root.innerHTML = `
            <style>
                :host(weather-view) {
                    position: absolute;
                    right: 0;
                    top: 0;
                    background: lightgray;
                    display: flex;
                    align-items: center;
                    padding: .5rem;
                    border-radius: 0 0 0 5px;
                }

                :host(weather-view) h1 {
                    margin: 0;
                }
            </style>
        `;

        this.text = document.createElement("h1");
        this.image = new Image();
        this.root.append(this.text, this.image);
    }

    setWeather(name, icon) {
        this.text.innerText = name;
        this.image.src = `http://openweathermap.org/img/w/${icon}.png`;
    }
}

customElements.define("weather-view", WeatherView);
