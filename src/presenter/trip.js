import {render, remove, RenderPosition} from "../utils/render";
import {getFilterRule} from "../utils/event";
import EventPresenter from "../presenter/event";
import EventNewPresenter from "./event-new.js";
import NoEventsView from "../view/no-events";
import SortView from "../view/sort";
import TripDayView from "../view/trip-day";
import TripDaysView from "../view/trip-days";
import {SortType, UpdateType, UserAction, FilterType} from "../const";
import moment from "moment";

export default class Trip {
  constructor(tripContainer, eventsModel, filterModel) {
    this._eventsModel = eventsModel;
    this._tripContainer = tripContainer;
    this._filterModel = filterModel;

    this._currentSortType = SortType.DEFAULT;
    this._tripDaysComponent = new TripDaysView();
    this._sortComponent = null;
    this._noEventsComponent = new NoEventsView();
    this._eventPresenter = {};
    this._dayElements = {};

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._handleViewAction);
  }

  init() {
    if (this._getEvents().length === 0) {
      this._renderNoEvents();
      return;
    }
    this._renderDaysContainer();
    this._renderSort();
    this._renderDays();
  }

  createNewEvent() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this._eventNewPresenter.init();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = events.filter(getFilterRule(filterType));

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredEvents.sort((a, b) => {
          const durationA = moment(a.endDate).diff(moment(a.startDate));
          const durationB = moment(b.endDate).diff(moment(b.startDate));
          return durationB - durationA;
        });
      case SortType.PRICE:
        return filtredEvents.sort((a, b) => b.price - a.price);
    }

    return filtredEvents.sort((a, b) => moment(a.startDate) - moment(b.startDate));
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvents(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handleEventChange(updatedEvent) {
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _renderEvent(eventListContainer, event) {
    const eventPresenter = new EventPresenter(eventListContainer, this._handleViewAction, this._handleModeChange);
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

    for (const event of this._getEvents()) {
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
    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderTrip() {
    if (this._currentSortType !== SortType.DEFAULT) {
      const dayComponent = new TripDayView(null, null);
      this._dayElements[null] = dayComponent;
      render(this._tripDaysComponent, dayComponent);
      this._renderSort();
      this._getEvents().forEach((event) => {
        this._renderEvent(dayComponent.getEventsContainer(), event);
      });
    } else {
      this._renderSort();
      this._renderDays();
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();

    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    Object
      .values(this._dayElements)
      .forEach((element) => remove(element));
    this._dayElements = {};

    remove(this._sortComponent);
    remove(this._noEventsComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
