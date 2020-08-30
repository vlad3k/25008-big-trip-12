import AbstractView from "./abstract";

export default class NoEvents extends AbstractView {
  _getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
