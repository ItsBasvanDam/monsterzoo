/**
 * This file contains helper methods and enumerations
 * to be used by the application.
 */

export const WeatherEnum = Object.freeze({
    thunderstorm: "Thunderstorm",
    clear: "Clear",
    snow: "Snow",
    rain: "Rain",
    drizzle: "Drizzle",
    clouds: "Clouds"
});

/**
 * Removes any dashes in strings, replaces them with
 * spaces and caplitalizes the first character.
 */
String.prototype.prep = function() {
    let spaceString = this.replace("-", " ");
    return spaceString.charAt(0).toUpperCase() + spaceString.slice(1);
};
