import EventView from "../view/event";
import EventFormView from "../view/event-form";
import {remove, render, replace} from "../utils/render";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Event {
  constructor(eventListContainer, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(event) {
    this._event = event;
    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(this._event);
    this._eventEditComponent = new EventFormView(this._event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventEditComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditComponent.setCloseClickHandler(this._handleCloseClick);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this._eventListContainer, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }

  _handleEditClick() {
    this._replaceEventToForm();
  }

  _handleFormSubmit(update) {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        update
    );
    this._replaceFormToEvent();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._event,
            {
              isFavorite: !this._event.isFavorite
            }
        )
    );
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MAJOR,
        event
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this._eventEditComponent.reset(this._event);
    }
  }

  _handleCloseClick() {
    this._replaceFormToEvent();
    this._eventEditComponent.reset(this._event);
  }
}
