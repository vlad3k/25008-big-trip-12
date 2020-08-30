import {render, RenderPosition} from "./utils/render";
import {generateEvent} from "./mock/event";
import RouteAndCostView from "./view/route-and-cost";
import MenuView from "./view/menu";
import FilterView from "./view/filter";
import TripPresenter from "./presenter/trip";

const EVENTS_COUNT = 22;

const eventsArr = Array.from({length: EVENTS_COUNT}, generateEvent);

const groupedEvents = {};

for (const event of eventsArr) {
  const date = new Date(event.startDate);
  const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(String).map((str) => str.padStart(`0`, 2)).join(`-`);
  groupedEvents[day] = groupedEvents[day] || [];
  groupedEvents[day].push(event);
}

const siteHeaderElement = document.querySelector(`.page-header`);
const siteTripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);

render(siteTripMainElement, new RouteAndCostView(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new MenuView());
render(siteTripControlsElement, new FilterView());

const siteMainElement = document.querySelector(`.page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteTripEventsElement);

tripPresenter.init(groupedEvents);
