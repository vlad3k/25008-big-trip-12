import {generateEvent} from "../mock/event";
import {render, RenderPosition, replace} from "../utils/render";
import {calculateTimeDuration} from "../utils/event";
import EventView from "../view/event";
import EventFormView from "../view/event-form";
import NoEventsView from "../view/no-events";
import SortView from "../view/sort";
import TripDayView from "../view/trip-day";
import TripDaysView from "../view/trip-days";
import {SortType} from "../const";

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._currentSortType = SortType.DEFAULT;
    this._tripDaysComponent = new TripDaysView();
    this._sortComponent = new SortView();
    this._noEventsComponent = new NoEventsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(count) {
    this._days = this._generateDates(count);
    this._sortDays();
    this._sourcedEvents = this._sortedDays.slice();
    if (this._sortedDays.length === 0) {
      this._renderNoEvents();
      return;
    }
    this._renderDaysContainer();
    this._renderSort();
    this._renderDays();
  }

  _generateDates(count) {
    const eventsArr = Array.from({length: count}, generateEvent);
    this._events = eventsArr;

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

  _renderDaysContainer() {
    render(this._tripContainer, this._tripDaysComponent);
  }

  _renderNoEvents() {
    render(this._tripContainer, this._noEventsComponent);
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

  _handleSortTypeChange(sortType) {
    this._sortEvents(sortType);
    this._clearDayList();
    this._renderTrip();
  }

  _renderTrip() {
    if (this._currentSortType !== SortType.DEFAULT) {
      const dayComponent = new TripDayView(null, null);
      render(this._tripDaysComponent, dayComponent);
      this._events.forEach((event) => {
        this._renderEvent(dayComponent.getEventsContainer(), event);
      });
    } else {
      this._renderDays();
    }
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.DEFAULT:
        this._events.sort((a, b) => a.startDate - b.startDate);
        break;
      case SortType.TIME:
        this._events.sort((a, b) => calculateTimeDuration(b) - calculateTimeDuration(a));
        break;
      case SortType.PRICE:
        this._events.sort((a, b) => b.price - a.price);
        break;
      default:
        this._events = this._sourcedEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearDayList() {
    this._tripDaysComponent.getElement().innerHTML = ``;
  }
}
