import { ElementManger } from "general-module-testing";
import DOM from "./src/layouts/DOM";
import { ForeCastData } from "./src/utils/Data";
import "./src/utils/header";

const forecast = new ForeCastData("Aizawl", 7);
const data = await forecast.getData();
const dom = new DOM(true);

const content = ElementManger.byId("content");
content.appendChild(dom.generateCurrentUI(data));
content.appendChild(dom.generateForecastUI(data));
dom.buildAQITableWithAccordian(data);

const current = forecast.getCurrentLocation();
export { current };

export async function changeContents(celcius, location) {
  const forecast = new ForeCastData(location, 7);
  const data = await forecast.getData();
  const dom = new DOM(celcius);

  const content = ElementManger.byId("content");
  content.appendChild(dom.generateCurrentUI(data));
  content.appendChild(dom.generateForecastUI(data));
  content.appendChild(dom.buildAQITableWithAccordian(data));
}
