import {generateEvent} from "../mock/event";
import {render, RenderPosition, replace} from "../utils/render";
import EventView from "../view/event";
import EventFormView from "../view/event-form";
import NoEventsView from "../view/no-events";
import SortView from "../view/sort";
import TripDayView from "../view/trip-day";
import TripDaysView from "../view/trip-days";

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._tripDaysComponent = new TripDaysView();
    this._sortViewComponent = new SortView();
    this._noEventsComponent = new NoEventsView();
  }

  init(count) {
    this._days = this._generateDates(count);
    this._sortDays();
    if (this._sortedDays.length === 0) {
      render(this._tripContainer, this._noEventsComponent);
      return;
    }
    render(this._tripContainer, this._tripDaysComponent);
    render(this._tripContainer, this._sortViewComponent, RenderPosition.AFTERBEGIN);
    this._renderDays();
  }

  _generateDates(count) {
    const eventsArr = Array.from({length: count}, generateEvent);

    const groupedEvents = {};

    for (const event of eventsArr) {
      const date = new Date(event.startDate);
      const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(String).map((str) => str.padStart(`0`, 2)).join(`-`);
      groupedEvents[day] = groupedEvents[day] || [];
      groupedEvents[day].push(event);
    }

    return groupedEvents;
  }

  _renderEvent(eventListElement, event) {
    const eventComponent = new EventView(event);
    const eventEditComponent = new EventFormView(event);

    const replaceCardToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToCard = () => {
      replace(eventComponent, eventEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(eventListElement, eventComponent);
  }

  _renderDay(dates, index) {
    const [day, events] = dates;
    const dayComponent = new TripDayView(day, index);
    render(this._tripDaysComponent, dayComponent);

    for (const event of events) {
      this._renderEvent(dayComponent.getEventsContainer(), event);
    }
  }

  _renderDays() {
    this._sortedDays.forEach((dates, index) => {
      this._renderDay(dates, index);
    });
  }

  _sortDays() {
    const daysInArray = Object.entries(this._days);
    this._sortedDays = daysInArray
     .sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }
}
