import {render, RenderPosition} from "./utils";
import {generateEvent} from "./mock/event";
import TripDayView from "./view/trip-day";
import TripDaysView from "./view/trip-days";
import SortView from "./view/sort";
import RouteAndCostView from "./view/route-and-cost";
import MenuView from "./view/menu";
import FilterView from "./view/filter";
import EventFormView from "./view/event-form";
import EventView from "./view/event";

const eventsArr = new Array(22).fill().map(generateEvent);

const groupedEvents = {};

for (const event of eventsArr) {
  const date = new Date(event.startDate);
  const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(String).map((str) => str.padStart(`0`, 2)).join(`-`);
  groupedEvents[day] = groupedEvents[day] || [];
  groupedEvents[day].push(event);
}

const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventFormView(event);

  const replaceCardToForm = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToCard = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const rollUpButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  rollUpButton.addEventListener(`click`, () => {
    replaceCardToForm();
  });

  const eventFormElement = eventEditComponent.getElement().querySelector(`form`);
  eventFormElement.addEventListener(`submit`, () => {
    replaceFormToCard();
  });

  render(eventListElement, eventComponent.getElement());
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteTripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);

render(siteTripMainElement, new RouteAndCostView().getElement(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new MenuView().getElement());
render(siteTripControlsElement, new FilterView().getElement());

const siteMainElement = document.querySelector(`.page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(siteTripEventsElement, new SortView().getElement());
render(siteTripEventsElement, new TripDaysView().getElement());

const siteTripDaysElement = siteTripEventsElement.querySelector(`.trip-days`);

const sortedGroupedEvents = Object.entries(groupedEvents)
  .sort((a, b) => new Date(a[0]) - new Date(b[0]));

sortedGroupedEvents.forEach((dates, index) => {
  const [day, events] = dates;
  const dayComponent = new TripDayView(day, index);
  render(siteTripDaysElement, dayComponent.getElement());

  for (const event of events) {
    let eventsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    renderEvent(eventsList, event);
  }
});
