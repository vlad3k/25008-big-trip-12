import {createSiteTripDayTemplate} from './view/trip-day';
import {createSiteTripDaysTemplate} from './view/trip-days';
import {createSiteSortTemplate} from './view/sort';
import {createSiteRouteAndCostTemplate} from './view/route-and-cost';
import {createSiteMenuTemplate} from './view/menu';
import {createSiteFilterTemplate} from './view/filter';
import {createSiteFormEvent} from './view/event-form';
import {generateEvent} from "./mock/event";

const events = new Array(22).fill().map(generateEvent);

const groupedEvents = {};

for (const event of events) {
  const date = new Date(event.startDate);
  const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(String).map((str) => str.padStart(`0`, 2)).join(`-`);
  groupedEvents[day] = groupedEvents[day] || [];
  groupedEvents[day].push(event);
}

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteTripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);

render(siteTripMainElement, createSiteRouteAndCostTemplate(), `afterbegin`);
render(siteTripControlsElement, createSiteMenuTemplate());
render(siteTripControlsElement, createSiteFilterTemplate());

const siteMainElement = document.querySelector(`.page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(siteTripEventsElement, createSiteSortTemplate());
render(siteTripEventsElement, createSiteTripDaysTemplate());

const siteTripDaysElement = siteTripEventsElement.querySelector(`.trip-days`);

const sortedGroupedEvents = Object.entries(groupedEvents)
  .sort((a, b) => new Date(a[0]) - new Date(b[0]));
sortedGroupedEvents.forEach((dates, index) => {
  render(siteTripDaysElement, createSiteTripDayTemplate(dates, index));
});

const siteTripEventsList = siteTripDaysElement.querySelector(`.trip-events__list`);
render(siteTripEventsList, createSiteFormEvent(events[0]), `afterbegin`);
