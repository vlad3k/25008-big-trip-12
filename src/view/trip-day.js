import {createElement} from "../utils";

export const createSiteTripDayTemplate = (day, dayNumber) => {
  const dayDate = new Date(day).toLocaleString(`en-US`, {month: `short`, day: `2-digit`});

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayNumber + 1}</span>
        <time class="day__date" datetime="2019-03-18">${dayDate}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class tripDay {
  constructor(day, index) {
    this._dayNumber = index;
    this._day = day;
    this._element = null;
  }

  _getTemplate() {
    return createSiteTripDayTemplate(this._day, this._dayNumber);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
