export default class URLKeys {
  static key() {
    return "ed331891148b4b4e81b122902240205";
  }
  static baseURL() {
    return "https://api.weatherapi.com/v1/";
  }
  static currentUrl(location) {
    return `https://api.weatherapi.com/v1/current.json?key=${this.key()}&q=${location}&aqi=yes`;
  }
  static foreCastUrl(location, days) {
    return `https://api.weatherapi.com/v1/forecast.json?key=${this.key()}&q=${location}&days=${days}&aqi=yes&alerts=yes`;
  }
  static search(location) {
    return `https://api.weatherapi.com/v1/search.json?key=${this.key()}&q=${location}`;
  }
}
