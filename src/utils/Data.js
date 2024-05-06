import URLKeys from "./URLKeys";

export class WeatherData {
  constructor(url) {
    this.url = url;
  }
  async getData() {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  async getLocation() {
    const {
      location: { name, region, country, tz_id, localtime },
    } = await this.getData();
    return { name, region, country, tz_id, localtime };
  }
}

export class CurrentData extends WeatherData {
  constructor(location) {
    super(URLKeys.currentUrl(location));
  }
  async currentData() {
    const data = await this.getData();
    const current = data.current;
    return {
      temp_c: current.temp_c,
      is_day: current.is_day,
      condition: current.condition,
      humidity: current.humidity,
      cloud: current.cloud,
      feelslike_c: current.feelslike_c,
      feelslike_f: current.feelslike_f,
      uv: current.uv,
      air_quality: current.air_quality,
    };
  }
}
export class ForeCastData extends WeatherData {
  constructor(location, days) {
    super(URLKeys.foreCastUrl(location, days));
    this.location = location;
  }
  async forecastData() {
    const data = await this.getData();
    const forecast = data.forecast;
    return forecast;
  }
  getCurrentLocation() {
    return this.location;
  }
}

export class Search extends WeatherData {
  constructor(location) {
    super(URLKeys.search(location));
  }
  async searchResult() {
    const data = await this.getData();
    return data;
  }
}
