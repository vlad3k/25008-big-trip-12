export const humanizeDate = (date) => {
  return date.toLocaleString(`en-GB`, {timeStyle: `short`});
};

const formatTimeZero = (time, type) => time < 10 ? `0${time}${type} ` : `${time}${type} `;


export const humanizeDuration = (ms) => {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / (3600 * 24));
  const h = Math.floor(s % (3600 * 24) / 3600);
  const m = Math.floor(s % 3600 / 60);

  const dDisplay = d > 0 ? formatTimeZero(d, `D`) : ``;
  const hDisplay = h > 0 ? formatTimeZero(h, `H`) : ``;
  const mDisplay = m > 0 ? formatTimeZero(m, `M`) : ``;
  return dDisplay + hDisplay + mDisplay;
};
