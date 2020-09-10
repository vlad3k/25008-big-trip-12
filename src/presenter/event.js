import EventView from "../view/event";
import EventFormView from "../view/event-form";
import {replace} from "../utils/render";

export default class Event {
  constructor(eventListContainer) {
    this._eventListContainer = eventListContainer;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    this._eventComponent = new EventView(this._event);
    this._eventEditForm = new EventFormView(this._event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventEditForm.setSubmitHandler(this._handleFormSubmit);
  }

  _replaceEventToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleEditClick() {
    this._replaceEventToForm()
  }

  _handleFormSubmit() {
    this._replaceFormToEvent();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
