import { ElementManger, HTMLElementBuilder } from "general-module-testing";

export default class DOM {
  constructor(celcius) {
    this.celcius = celcius;
    this.container = ElementManger.byId("content");
  }
  generateCurrentUI(data) {
    this.data = data;
    const temperature = this.celcius
      ? `${data.current.temp_c} °C`
      : `${data.current.temp_f} °F`;

    const feelsLike = this.celcius
      ? `${data.current.feelslike_c}°C`
      : `${data.current.feelslike_f}°F`;

    this.container.innerHTML = "";
    this.current = data.current;
    const title = new HTMLElementBuilder("span")
      .setText(data.location.name)
      .setClass(
        "text-slate-800 bg-blue-200 p-1 rounded-lg md:row-start-1 md:col-span-4 text-center",
      )
      .build();
    const wrapper = createWrapper();
    wrapper.appendChild(title);
    const itemContainer = createItemContainer();
    const currentCondition = createCurrentConditionText(data);
    const tempWithImg = temperatureWithImageContainer(
      data.current.condition,
      temperature,
    );
    const weatherTableInfo = weatherInfoTable(data.current, feelsLike);
    itemContainer.appendChild(currentCondition);
    itemContainer.appendChild(tempWithImg);
    itemContainer.appendChild(weatherTableInfo);

    wrapper.appendChild(itemContainer);
    return wrapper;
  }
  generateForecastUI(data) {
    const forecastday = data.forecast.forecastday;
    const wrapper = createWrapper(true);
    const title = new HTMLElementBuilder("span")
      .setText("Forecasts For the next 6 days")
      .setClass(
        "text-slate-800 bg-green-500 p-1 rounded-lg md:row-start-1 md:col-span-4 text-center",
      )
      .build();
    const today = new Date();

    // Format the date in US day format (e.g., Monday, 2024-05-06)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero if necessary
    const day = String(today.getDate()).padStart(2, "0");

    const todayDate = year + "-" + month + "-" + day;
    const forecastItemsContainer = new HTMLElementBuilder("div")
      .setClass("grid gap-2 grid-rows-2 forecast-items-container-col")
      .setId("forecast-items-container")
      .build();
    wrapper.appendChild(title);
    wrapper.appendChild(forecastItemsContainer);

    forecastday.forEach((forecastday) => {
      if (todayDate !== forecastday.date) {
        forecastItemsContainer.appendChild(this.buildFutureItems(forecastday));
      }
    });
    return wrapper;
  }
  buildFutureItems(data) {
    const maxtemp = this.celcius
      ? `${data.day.maxtemp_c}°C`
      : `${data.day.maxtemp_f}°F`;
    const mintemp = this.celcius
      ? `${data.day.mintemp_c}°C`
      : `${data.day.mintemp_f}°F`;
    const avgtemp = this.celcius
      ? `${data.day.avgtemp_c}°C`
      : `${data.day.avgtemp_f}°F`;
    const itemContainer = createItemContainer();
    const currentCondition = createCurrentConditionText(data, true);
    const tempWithImg = temperatureWithImageContainer(
      data.day.condition,
      avgtemp,
      true,
    );
    const weatherTable = weatherInfoTable(data.day, maxtemp, mintemp);

    itemContainer.appendChild(currentCondition);
    itemContainer.appendChild(tempWithImg);
    itemContainer.appendChild(weatherTable);
    return itemContainer;
  }
  buildAQITableWithAccordian(data) {
    const aqiContainer = createAqiContainer(data.current.air_quality);
    const container = ElementManger.byId("item-wrapper");
    const div = new HTMLElementBuilder("div")
      .setId("aqi-container")
      .setClass("md:block md:col-start-1")
      .build();
    div.appendChild(aqiContainer);
    container.appendChild(div);
  }
}

function createWrapper(isForeCast) {
  const container = new HTMLElementBuilder("div").setId("item-wrapper");
  container.setClass(
    "my-1 w-11/12 row-start-1 mx-auto md:col-start-1 gap-2 flex flex-col text-center",
  );

  if (isForeCast) {
    container.setClass("md:flex md:flex-col md:gap-2 md:col-start-2");
  }
  return container.build();
}
function createItemContainer() {
  const item = new HTMLElementBuilder("div")
    .setId("item-container")
    .setClass(
      "prose prose-zinc bg-sky-50 gap-2 mx-auto w-full rounded-lg p-2 leading-4 flex flex-col prose-h3:m-0 md:text-sm",
    )
    .build();
  return item;
}
function createCurrentConditionText(data, isForeCast) {
  const currentText = new HTMLElementBuilder("span")
    .setId("current-weather-condition-text")
    .setClass("text-center");
  const today = new Date();
  const timeDelta = new Date(data.date) - today;
  const dayName = new Date(today.getTime() + timeDelta).toLocaleDateString(
    "en-UK",
    { weekday: "long" },
  );
  const container = new HTMLElementBuilder("div")
    .setId("textAndDate-container")
    .build();
  const date = new HTMLElementBuilder("p");
  if (isForeCast) {
    currentText.setText(`${data.day.condition.text}`);
    date.setText(`${dayName}`);
  } else {
    currentText.setText(`${data.current.condition.text}`);
    date.setText(today.toLocaleString("en-US", { weekday: "long" }));
  }
  container.appendChild(currentText.build());
  container.appendChild(date.build());
  return container;
}
function temperatureWithImageContainer(condition, temp, isForeCast) {
  const div = new HTMLElementBuilder("div")
    .setClass("flex items-center justify-between pr-3")
    .setId("temperatureContainer")
    .build();
  const img = new HTMLElementBuilder("img")
    .setAttribute("alt", "Weather condition image")
    .setClass("w-20 h-20 m-0 p-1")
    .setAttribute("src", condition.icon)
    .build();
  const temperature = new HTMLElementBuilder("span").setClass(
    "text-sky-800 text-3xl md:text-xl",
  );
  div.appendChild(img);

  if (isForeCast) {
    temperature.setText(`${temp}`);
    div.appendChild(temperature.build());
  } else {
    temperature.setText(temp);
    div.appendChild(temperature.build());
  }
  return div;
}

function weatherInfoTable(current, feelslike, isForeCast) {
  const table = new HTMLElementBuilder("table").setClass("table-auto").build();
  if (isForeCast) {
    table.innerHTML = `
                <caption>DayTime</caption>
                <tr>
                  <th>Max Temperature</th>
                  <td>${feelslike}</td>
                </tr>
                <tr>
                  <th>Min Temperature</th>
                  <td>${isForeCast}</td>
                </tr>
                <tr>
                  <th>Max Wind</th>
                  <td>${current.maxwind_mph} mph</td>
                </tr>
                <tr>
                  <th>Average Humidity</th>
                  <td>${current.avghumidity}%</td>
                </tr>
                <tr>
                  <th>Chance of Raining</th>
                  <td>${current.daily_chance_of_rain}%</td>
                </tr>
                <tr>
                  <th>Chance of Snowing</th>
                  <td>${current.daily_chance_of_snow}%</td>
                </tr>
                <tr>
                  <th>UV</th>
                  <td>${current.uv} mb</td>
                </tr>`;
  } else {
    table.innerHTML = `
                <tr>
                  <th>Feels like</th>
                  <td>${feelslike}</td>
                </tr>
                <tr>
                  <th>Humidiy</th>
                  <td>${current.humidity}%</td>
                </tr>
                <tr>
                  <th>UV</th>
                  <td>${current.uv}</td>
                </tr>
                <tr>
                  <th>Gust</th>
                  <td>${current.gust_mph} mph</td>
                </tr>
                <tr>
                  <th>Wind Direction</th>
                  <td>${current.wind_dir}</td>
                </tr>
                <tr>
                  <th>Precipitation</th>
                  <td>${current.precip_mm} mm</td>
                </tr>
                <tr>
                  <th>Pressure</th>
                  <td>${current.pressure_mb} mb</td>
                </tr>
                <tr>
                  <th>AQI</th>
                  <td>${current.air_quality["us-epa-index"]}</td>
                </tr>`;
  }

  return table;
}

function createAccordianButton() {
  const div = new HTMLElementBuilder("div")
    .setClass("p-3 flex justify-center")
    .build();
  div.innerHTML = `<button class="bg-blue-500 p-2 rounded-lg text-slate-50 hover:bg-slate-50 hover:text-blue-600  active:translate-x-1 translate-y-1 hover:ring-1">Show AQI Table</button>
`;
  return div;
}

function createAqiContainer(airquality) {
  const div = new HTMLElementBuilder("div")
    .setId("aqi-container")
    .setClass("mx-auto flex flex-col p-20 items-center bg-slate-50 rounded-lg")
    .build();
  div.innerHTML = `
            <table class="table-auto border-collapse border bordersl  text-center ">
              <caption>Air Quality Table</caption>
              <thead>
                <tr >
                  <th class = "p-3 border border-slate-500">CO</th>
                  <th class = "p-3 border border-slate-500">NO<sub>2</sub> </th>
                  <th class = "p-3 border border-slate-500">O<sub>3</sub></th>
                  <th class = "p-3 border border-slate-500">SO<sub>2</sub></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td class="p-3 border border-slate-500">${Number(airquality.co).toFixed(1)}</td>
                  <td class="p-3 border border-slate-500">${Number(airquality.no2).toFixed(1)}</td>
                  <td class="p-3 border border-slate-500">${Number(airquality.o3).toFixed(1)}</td>
                  <td class="p-3 border border-slate-500">${Number(airquality.so2).toFixed(1)}</td>
                </tr>
              </tbody>
            </table>`;
  return div;
}
