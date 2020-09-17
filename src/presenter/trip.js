import {generateEvent} from "../mock/event";
import {render, remove, RenderPosition} from "../utils/render";
import {calculateTimeDuration} from "../utils/event";
import {generateId, updateItem} from "../utils/common";
import EventPresenter from "../presenter/event";
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
    this._eventPresenter = {};
    this._dayElements = {};

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(count) {
    this._generateEvents(count);
    this._sourcedEvents = this._events.slice();
    if (this._events.length === 0) {
      this._renderNoEvents();
      return;
    }
    this._renderDaysContainer();
    this._renderSort();
    this._renderDays();
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sourcedEvents = updateItem(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _generateEvents(count) {
    const eventsArr = Array.from({length: count}, generateEvent);
    this._events = eventsArr;
  }

  _renderEvent(eventListContainer, event) {
    const eventPresenter = new EventPresenter(eventListContainer, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderDay(dates, index) {
    const [day, events] = dates;
    const dayComponent = new TripDayView(day, index);
    this._dayElements[day] = dayComponent;
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
    const groupedEvents = {};

    for (const event of this._events) {
      const date = new Date(event.startDate);
      const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(String).map((str) => str.padStart(`0`, 2)).join(`-`);
      groupedEvents[day] = groupedEvents[day] || [];
      groupedEvents[day].push(event);
    }

    this._days = groupedEvents;

    this._sortDays();

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
      this._dayElements[generateId()] = dayComponent;
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
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());

    this._eventPresenter = {};

    Object
      .values(this._dayElements)
      .forEach((element) => remove(element));

    this._dayElements = {};
  }
}
