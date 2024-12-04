import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  tempF: number;
  icon: string;
  iconDescription: string;
  humidity: number;
  windSpeed: number;
  date: number;


  constructor(temperature: number, icon: string, iconDescription: string, humidity: number, wind: number, date: number) {
    this.tempF = temperature;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.humidity = humidity;
    this.windSpeed = wind;
    this.date = date;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private geoURL = 'https://api.openweathermap.org/geo/1.0/direct';
  private apiKey = process.env.API_KEY || '';
  private lastSearchedCity: string | null = null;
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates[]> {
    const url = this.buildGeocodeQuery(query);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching location data: ${response.statusText}`);
    }

    return response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error('Location not found.');
    }
    console.log(locationData);
    return { lat: locationData[0].lat, lon: locationData[0].lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.geoURL}?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`Error fetching weater data: ${response.statusText}`);
    }

    return response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    console.log(response);
    return response[0];
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(_currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray = [];
    for (let i = 0; i < weatherData.length; i++) {
      if (i === 0 || i % 7 === 0) {
        const item = weatherData[i];
        forecastArray.push(
          new Weather(item.main.temp, item.weather[0].icon, item.weather[0].description, item.main.humidity, item.wind.speed, item.dt_txt)
        );
      }
      // console.log(currentWeather)
    // forecastArray.unshift(currentWeather);
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string): Promise<Weather[]> {
    if (!this.apiKey) {
      throw new Error('API key is missing.');
    }

    this.lastSearchedCity = city;

    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData)
    const forecast = this.buildForecastArray(currentWeather, weatherData.list)

    return forecast;
  }

  public getLastSearchedCity(): string | null {
    return this.lastSearchedCity;
  }
}

export default new WeatherService();
