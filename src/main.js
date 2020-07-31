import {createSiteTripDayTemplate} from './view/trip-day';
import {createSiteTripDaysTemplate} from './view/trip-days';
import {createSiteSortTemplate} from './view/sort';
import {createSiteRouteAndCostTemplate} from './view/route-and-cost';
import {createSiteMenuTemplate} from './view/menu';
import {createSiteFilterTemplate} from './view/filter';
import {createSiteEventTemplate} from './view/event';
import {createSiteEventEditTemplate} from './view/event-edit';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteTripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);

render(siteTripMainElement, createSiteRouteAndCostTemplate(), `afterbegin`);
render(siteTripControlsElement, createSiteMenuTemplate(), `beforeend`);
render(siteTripControlsElement, createSiteFilterTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(siteTripEventsElement, createSiteSortTemplate(), `beforeend`);
render(siteTripEventsElement, createSiteTripDaysTemplate(), `beforeend`);

const siteTripDaysElement = siteTripEventsElement.querySelector(`.trip-days`);

render(siteTripDaysElement, createSiteTripDayTemplate(), `beforeend`);

const siteTripEventsListElement = siteTripDaysElement.querySelector(`.trip-events__list`);

render(siteTripEventsListElement, createSiteEventTemplate(), `beforeend`);
render(siteTripEventsListElement, createSiteEventEditTemplate(), `beforeend`);
render(siteTripEventsListElement, createSiteEventTemplate(), `beforeend`);
render(siteTripEventsListElement, createSiteEventTemplate(), `beforeend`);
