import {render, RenderPosition} from "./utils/render";
import RouteAndCostView from "./view/route-and-cost";
import MenuView from "./view/menu";
import FilterView from "./view/filter";
import TripPresenter from "./presenter/trip";

const EVENTS_COUNT = 22;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteTripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);

render(siteTripMainElement, new RouteAndCostView(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new MenuView());
render(siteTripControlsElement, new FilterView());

const siteMainElement = document.querySelector(`.page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteTripEventsElement);

tripPresenter.init(EVENTS_COUNT);
