import {EVENT_TYPES} from "../const";
import {getRandomArrayElement, getRandomInteger, generateId} from "../utils/common";

const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
export const CITIES = [`Los Angeles`, `New York`, `Lauterbrunnen`, `Dublin`, `Bled`];
const OFFERS = [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`, `Travel by train`];

const generateDates = () => {
  const timestamp = Date.now();
  const startDate = new Date(Math.random() * 1000 * 60 * 60 * 24 * 10 + timestamp);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + getRandomInteger(1, 4));
  endDate.setMinutes(getRandomInteger(0, 60));
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

const generateOffers = () => {
  const offers = OFFERS.slice(0, getRandomInteger(1, 6));
  return offers.map((name) => ({
    name,
    price: getRandomInteger(20, 200),
    isChecked: Boolean(getRandomInteger(0, 1))
  }));
};

export const generateEvent = () => {
  const {transfers, arrivals} = EVENT_TYPES;
  const {startDate, endDate} = generateDates();

  return {
    id: generateId(),
    type: getRandomArrayElement([...transfers, ...arrivals]),
    destination: getRandomArrayElement(CITIES),
    startDate,
    endDate,
    price: getRandomInteger(0, 300),
    offers: generateOffers(),
    description: getRandomArrayElement(TEXT.split(`.`)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    photos: Array.from({length: getRandomInteger(0, 5)}, () => `http://picsum.photos/248/152?r=${Math.random()}`),
  };
};
