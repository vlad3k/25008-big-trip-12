import AbstractView from "./abstract";
import {EVENT_TYPES} from "../const";
import moment from 'moment';

const MAX_OFFERS_COUNT = 3;

const createOffersTemplate = (offers) => {
  return offers.slice(0, MAX_OFFERS_COUNT).map(({name, price}) => (`<li class="event__offer">
    <span class="event__offer-title">${name}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
   </li>`)).join(``);
};

export const createSiteEventTemplate = (event) => {
  const {
    type,
    destination,
    startDate,
    endDate,
    price,
    offers,
  } = event;

  const typeStr = EVENT_TYPES.arrivals.includes(type) ? `${type} in` : `${type} to`;
  const start = moment(startDate);
  const end = moment(endDate);
  const duration = end.diff(start);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeStr} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDate}">
              ${moment(event.startDate).format(`HH:mm`)}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${endDate}">
               ${moment(event.endDate).format(`HH:mm`)}
            </time>
          </p>
          <p class="event__duration">${moment(duration).format(`DD[D] HH[H] mm[M]`)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  _getTemplate() {
    return createSiteEventTemplate(this._event);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}
