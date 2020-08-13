import {createSiteTripDayTemplate} from './view/trip-day';
import {createSiteTripDaysTemplate} from './view/trip-days';
import {createSiteSortTemplate} from './view/sort';
import {createSiteRouteAndCostTemplate} from './view/route-and-cost';
import {createSiteMenuTemplate} from './view/menu';
import {createSiteFilterTemplate} from './view/filter';
import {createSiteEventTemplate} from './view/event';
import {createSiteEventEditTemplate} from './view/event-edit';
import {generateEvent} from "./mock/event";

const EVENTS_COUNT = 3;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

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

render(siteTripDaysElement, createSiteTripDayTemplate());

const siteTripEventsListElement = siteTripDaysElement.querySelector(`.trip-events__list`);

render(siteTripEventsListElement, createSiteEventEditTemplate());

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(siteTripEventsListElement, createSiteEventTemplate(events[i]));
}
