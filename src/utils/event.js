import {FilterType} from "../const";
import moment from "moment";

const formatTimeZero = (time, type) => time < 10 ? `0${time}${type} ` : `${time}${type} `;

export const humanizeDuration = (time) => {
  const s = Math.floor(time / 1000);
  const d = Math.floor(s / (3600 * 24));
  const h = Math.floor(s % (3600 * 24) / 3600);
  const m = Math.floor(s % 3600 / 60);

  const dDisplay = d > 0 ? formatTimeZero(d, `D`) : ``;
  const hDisplay = h > 0 ? formatTimeZero(h, `H`) : ``;
  const mDisplay = m > 0 ? formatTimeZero(m, `M`) : ``;
  return dDisplay + hDisplay + mDisplay;
};

export const humanizeDate = (date) => {
  return date.toLocaleString(`en-GB`, {timeStyle: `short`});
};

export const getDateFormated = (d) => {
  const date = d.toLocaleString(`en-GB`, {day: `2-digit`, month: `2-digit`, year: `2-digit`});
  const time = d.toLocaleString(`en-GB`, {hour: `numeric`, minute: `numeric`});
  return `${date} ${time}`;
};

export const calculateTimeDuration = (event) => {
  return new Date(event.endDate) - new Date(event.startDate);
};

export const getFilterRule = (filterType) => {
  switch (filterType) {
    case FilterType.FUTURE:
      return (event) => moment().isBefore(event.startDate);
    case FilterType.PAST:
      return (event) => moment().isAfter(event.endDate);
    default:
      return () => true;
  }
};
