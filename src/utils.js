const formatTimeZero = (time, type) => time < 10 ? `0${time}${type} ` : `${time}${type} `;

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeDate = (date) => {
  return date.toLocaleString(`en-GB`, {timeStyle: `short`});
};

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

export const getDateFormated = (d) => {
  const date = d.toLocaleString(`en-GB`, {day: `2-digit`, month: `2-digit`, year: `2-digit`});
  const time = d.toLocaleString(`en-GB`, {hour: `numeric`, minute: `numeric`});
  return `${date} ${time}`;
};

export const getRandomArrayElement = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);
  return arr[randomIndex];
};
