import {render, RenderPosition} from "./utils/render";
import RouteAndCostView from "./view/route-and-cost";
import MenuView from "./view/menu";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip";
import EventsModel from "./model/events";
import FilterModel from "./model/filter.js";
import {generateEvent} from "./mock/event";

const EVENTS_COUNT = 22;

const events = Array.from({length: EVENTS_COUNT}, generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const addEventButton = document.querySelector(`.trip-main__event-add-btn`);
const siteTripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);

render(siteTripMainElement, new RouteAndCostView(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new MenuView());

const siteMainElement = document.querySelector(`.page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel);
const tripPresenter = new TripPresenter(siteTripEventsElement, eventsModel, filterModel);

filterPresenter.init();
tripPresenter.init();

addEventButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createNewEvent();
});
