import {
  ElementManger,
  HTMLElementBuilder,
  InputManager,
} from "general-module-testing";
import { Search } from "./Data";
import { changeContents, current } from "../../main";

let celcius = true;

const searchFrom = new HTMLElementBuilder(ElementManger.byId("searchform"));
searchFrom.addEvent("submit", (e) => {
  e.preventDefault();
});

const locationInput = new InputManager(ElementManger.byId("searchlocation"));

const checkbox = new HTMLElementBuilder(
  ElementManger.byId("toggle-temperature"),
).build();

checkbox.addEventListener("change", function () {
  celcius = !celcius;
  changeContents(celcius, current);
});

export class SearchManger {
  static getList() {
    return searchResults();
  }
}
async function searchResults() {
  const searcResult = await new Search(locationInput.getValue()).searchResult();
  let list = [];
  searcResult.forEach((location) => {
    const country = location.country;
    const name = location.name;
    const region = location.region;
    list.push(`${name}, ${region}, ${country}`);
  });
  return list;
}
const div = new HTMLElementBuilder("div")
  .setClass(
    "absolute p-1 bg-slate-300 text-slate-800 mt-4 flex flex-col gap-2 rounded-lg max-h-40 overflow-y-scroll",
  )
  .setId("search-container")
  .build();
div.style.width = locationInput.getElement().clientWidth + "px";
locationInput.addListener("blur", () => {
  setTimeout(() => {
    div.style.display = "none";
  }, 500);
});
locationInput.addListener("input", async () => {
  div.innerHTML = "";
  div.style.display = "flex";

  const value = locationInput.getValue();
  if (value.length <= 0) {
    return;
  }
  const list = await searchResults();

  list.forEach((result) => {
    const item = new HTMLElementBuilder("div")
      .setId("search-items")
      .setClass(
        "p-1 bg-green-50 text-sm hover:bg-sky-500 rounded-lg hover:text-slate-50 cursor-pointer",
      )
      .setText(result)
      .addEvent("click", () => {
        locationInput.getElement().value = item.textContent;
        changeContents(celcius, item.textContent);
        div.innerHTML = "";
      })
      .build();
    div.appendChild(item);
  });
  locationInput.getElement().parentNode.appendChild(div);
});
