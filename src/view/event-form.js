import SmartView from "./smart.js";
import {EVENT_TYPES, MOVE_TYPE, ACTIVITY_TYPE} from "../const";
import {getDateFormated} from "../utils/event";

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

const createSiteFormEvent = (event) => {
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
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-${destination}" value="${destination}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateFormated(start)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateFormated(end)}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-${id}" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}">
          <label class="event__favorite-btn" for="event-favorite-${id}">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
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
      </form>
    </li>`
  );
};

export default class SiteFormView extends SmartView {
  constructor(event) {
    super();
    this._data = event;
    this._favoriteInputElement = this.getElement().querySelector(`.event__favorite-checkbox`);
    this._submitHandler = this._submitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typeClickHandler = this._typeClickHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(event) {
    this.updateData(event);
  }

  _getTemplate() {
    return createSiteFormEvent(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
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

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._submitHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favorite = callback;
    this._favoriteInputElement.addEventListener(`change`, this._favoriteClickHandler);
    this._setCurrentFavorite();
  }
}
