import {humanizeDate} from "../utils";
import {humanizeDuration} from "../utils";

const prepositionsMap = {
  movement: `to`,
  arrival: `in`,
};

const createOffersTemplate = (offers) => {
  return offers.map(({name, price}) => (`<li class="event__offer">
    <span class="event__offer-title">${name}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
   </li>`));
};

export const createSiteEventTemplate = (event) => {
  const {
    type: {name, category},
    destination,
    start,
    end,
    price,
    offers,
  } = event;

  const startDate = new Date(start);
  const endDate = new Date(end);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${name}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${name} ${prepositionsMap[category]} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${start}">${humanizeDate(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${end}">${humanizeDate(endDate)}</time>
          </p>
          <p class="event__duration">${humanizeDuration(endDate - startDate)}</p>
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

