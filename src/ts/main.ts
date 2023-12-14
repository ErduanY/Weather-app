import './../scss/style.scss'
import { getWeather } from './weather'
import { ICON_MAP } from './iconMap'

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather).catch(e => {
  console.error(e)
  alert("Could not get weather, please try again later!");
})

function renderWeather({current, daily, hourly}) {
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  //renderHourlyWeather(hourly)
  document.body.classList.remove("blurred")
}

function setValue(selector, value, {parent = document }: {parent?: ParentNode | null} ={}) {
  if (parent) {
  parent.querySelector(`[data-${selector}]`)!.textContent = value;
  }
}


function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]") as HTMLImageElement;
function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
  
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {weekday: "long"})
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template") as HTMLTemplateElement;
function renderDailyWeather(daily) {
  dailySection!.innerHTML = "";
  daily.forEach(day => {
    const element = dayCardTemplate?.content.cloneNode(true) as HTMLTemplateElement;
    setValue("temp", day.maxTemp, {parent: element?.parentNode})
    setValue("date", DAY_FORMATTER.format(day.timestamp), {parent: element?.parentNode})
    const iconElement = element.querySelector("[data-icon]") as HTMLImageElement;
    iconElement.src = getIconUrl(day.iconCode);

    dailySection?.append(element)
    dailySection?.append(iconElement)
  })
}