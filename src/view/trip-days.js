import AbstractView from "./abstract";

export default class SiteMenu extends AbstractView {
  _getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
