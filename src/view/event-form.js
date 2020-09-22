import SmartView from "./smart.js";
import {EVENT_TYPES, MOVE_TYPE, ACTIVITY_TYPE} from "../const";
import {generateId} from "../utils/common";
import {CITIES} from "../mock/event";
import flatpickr from "flatpickr";

import moment from 'moment';
import "flatpickr/dist/flatpickr.min.css";

const NEW_EVENT = {
  id: generateId(),
  type: EVENT_TYPES[`transfers`][0],
  destination: ``,
  startDate: new Date(),
  endDate: new Date(),
  price: 0,
  offers: [],
  description: ``,
  isFavorite: false,
  photos: [],
};

const createDestinationItemsTemplate = (currentDestination) => {
  const destinationOptions = CITIES
    .map((city) => (
      `<option value="${city}" ${currentDestination === city ? `selected` : ``}>
        ${city}
      </option>`));

  return destinationOptions.join(``);
};

const createEventTypesTemplate = (types, selected) => {
  const current = selected.toLowerCase();
  return Object.values(types).map((type) => {
    return (`<div class="event__type-item">
        <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" ${current === type.toLowerCase() ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${type.toLowerCase()}"
               for="event-type-${type.toLowerCase()}"
               data-type="${type}">
         ${type}
        </label>
      </div>`);
  }).join(``);
};

const createOffersTemplate = (offers, i) => {
  return offers.length > 0 ? offers.map(({name, price, isChecked}) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-${name.toLowerCase()}-${i}" type="checkbox" name="event-${name}" checked="${isChecked}">
      <label class="event__offer-label" for="event-${name.toLowerCase()}-${i}">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`).join(``) : ``;
};

const createPhotosTemplate = (photos) => {
  if (photos.length > 0) {
    const photosTemplate = photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`);
    return `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photosTemplate}
      </div>
    </div>`;
  }
  return ``;
};

const createDestinationTemplate = (photos, description) => {
  return (photos.length > 0 || description) ? `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${description ? `<p class="event__destination-description">${description}</p>` : ``}

    ${createPhotosTemplate(photos)}
  </section>` : ``;
};

const createRollupButtonTemplate = (isNewEvent) => {
  if (isNewEvent) {
    return ``;
  }

  return `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
};

const createFavoriteButtonTemplate = (id, isFavorite, isNewEvent) => {
  if (isNewEvent) {
    return ``;
  }

  return `<input id="event-favorite-${id}" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}">
    <label class="event__favorite-btn" for="event-favorite-${id}">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`;
};

const createSiteFormEvent = (event, isNewEvent) => {
  const {
    id,
    type,
    destination,
    startDate,
    endDate,
    offers,
    price,
    description,
    photos,
    isFavorite,
  } = event;

  const typeStr = EVENT_TYPES.arrivals.includes(type) ? `${type} in` : `${type} to`;
  const start = new Date(startDate);
  const end = new Date(endDate);

  return (
    `<form class="event event--edit trip-events__item" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>

                ${createEventTypesTemplate(MOVE_TYPE, type)}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

                ${createEventTypesTemplate(ACTIVITY_TYPE, type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${typeStr}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-${destination}" value="${destination}" list="destination-list">
            <datalist id="destination-list">
              ${createDestinationItemsTemplate(destination)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(start).format(`DD/MM/YY HH:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(end).format(`DD/MM/YY HH:mm`)}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" autocomplete="off">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          ${createFavoriteButtonTemplate(id, isFavorite, isNewEvent)}

          ${createRollupButtonTemplate(isNewEvent)}
        </header>

        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffersTemplate(offers)}
            </div>
          </section>

          ${createDestinationTemplate(photos, description)}
        </section>
      </form>`
  );
};

export default class SiteFormView extends SmartView {
  constructor(event = NEW_EVENT, isNewEvent = false) {
    super();
    this._data = event;
    this._isNewEvent = isNewEvent;
    this._startDatePicker = null;
    this._endDatePicker = null;

    this._favoriteInputElement = this.getElement().querySelector(`.event__favorite-checkbox`);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typeClickHandler = this._typeClickHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
  }

  reset(event) {
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.updateData(event);
  }

  _setDatepickers() {
    if (this._startDatePicker) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }

    if (this._endDatePicker) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }

    flatpickr(
        this.getElement().querySelector(`.event__input--time[name="event-start-time"]`),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.startDate,
          onChange: this._startDateChangeHandler
        }
    );

    flatpickr(
        this.getElement().querySelector(`.event__input--time[name="event-end-time"]`),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.endDate,
          minDate: this._data.startDate,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _getTemplate() {
    return createSiteFormEvent(this._data, this._isNewEvent);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();
    this.setSubmitHandler(this._callback.submit);
    this.setCloseClickHandler(this._callback.closeClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`input`, this._destinationInputHandler);

    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);

    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, this._typeClickHandler);
  }

  _typeClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains(`event__type-label`)) {
      this.updateData({
        type: evt.target.dataset.type
      }, false);
    }
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value
    }, true);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._data);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favorite();
  }

  _setCurrentFavorite() {
    this._favoriteInputElement.checked = this._data.isFavorite;
  }

  _startDateChangeHandler([date]) {
    if (date) {
      this.updateData(
          {
            startDate: date
          },
          true);
    }
  }

  _endDateChangeHandler([date]) {
    if (date) {
      this.updateData(
          {
            endDate: date
          },
          true);
    }
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener(`submit`, this._submitHandler);

  }

  setFavoriteClickHandler(callback) {
    this._callback.favorite = callback;
    this._favoriteInputElement.addEventListener(`change`, this._favoriteClickHandler);
    this._setCurrentFavorite();
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }
}
