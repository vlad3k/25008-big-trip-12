import {render, RenderPosition, replace, remove} from "./utils/render";
import {generateEvent} from "./mock/event";
import TripDayView from "./view/trip-day";
import TripDaysView from "./view/trip-days";
import SortView from "./view/sort";
import RouteAndCostView from "./view/route-and-cost";
import MenuView from "./view/menu";
import FilterView from "./view/filter";
import EventFormView from "./view/event-form";
import EventView from "./view/event";
import NoEventsView from "./view/no-events";

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
    replace(eventEditComponent, eventComponent);
  };

  const replaceFormToCard = () => {
    console.log('!!!!')
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  }

  eventComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent);
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteTripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);

render(siteTripMainElement, new RouteAndCostView(), RenderPosition.AFTERBEGIN);
render(siteTripControlsElement, new MenuView());
render(siteTripControlsElement, new FilterView());

const siteMainElement = document.querySelector(`.page-main`);
const siteTripEventsElement = siteMainElement.querySelector(`.trip-events`);

render(siteTripEventsElement, new SortView());
render(siteTripEventsElement, new TripDaysView());

const siteTripDaysElement = siteTripEventsElement.querySelector(`.trip-days`);

if (Object.keys(groupedEvents).length === 0) {
  render(siteTripEventsElement, new NoEventsView());
} else {
  const sortedGroupedEvents = Object.entries(groupedEvents)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]));

  sortedGroupedEvents.forEach((dates, index) => {
    const [day, events] = dates;
    const dayComponent = new TripDayView(day, index);
    const eventsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    render(siteTripDaysElement, dayComponent);

    for (const event of events) {
      renderEvent(eventsList, event);
    }
  });
}
