import {createSiteEventTemplate} from "./event";

export const createSiteTripDayTemplate = (dates, index) => {
  const [date, events] = dates;
  const dayDate = new Date(date).toLocaleString(`en-US`, {month: `short`, day: `2-digit`});

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="2019-03-18">${dayDate}</time>
      </div>

      <ul class="trip-events__list">
        ${events.slice().sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
          .map(createSiteEventTemplate).join(``)}
      </ul>
    </li>`
  );
};
