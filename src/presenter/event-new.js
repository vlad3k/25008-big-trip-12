import EventFormView from '../view/event-form.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {generateId} from "../utils/common";

export default class EventNew {
  constructor(changeData) {
    this._eventContainer = document.querySelector(`.trip-events__header`);
    this._changeData = changeData;

    this._editorComponent = null;

    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(event) {
    if (this._editorComponent !== null) {
      return;
    }

    this._editorComponent = new EventFormView(event, true);

    this._editorComponent.setSubmitHandler(this._handleFormSubmit);
    this._editorComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventContainer, this._editorComponent, RenderPosition.AFTER);

    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  destroy() {
    if (this._editorComponent === null) {
      return;
    }

    remove(this._editorComponent);
    this._editorComponent = null;

    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    document.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        Object.assign({}, point, {id: generateId()})
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
