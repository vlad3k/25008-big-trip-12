export const MOVE_TYPE = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
};

export const ACTIVITY_TYPE = {
  CHECK_IN: `Check-in`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`,
};

export const EVENT_TYPES = {
  transfers: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
  arrivals: [`Check-in`, `Sightseeing`, `Restaurant`]
};

export const SortType = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};
