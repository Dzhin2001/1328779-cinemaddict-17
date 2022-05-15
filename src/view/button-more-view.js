import {createElement} from '../render.js';

const buttonMoreTemplate = () => `
    <button class="films-list__show-more">Show more</button>
  `;

export default class ButtonMoreView {
  #element = null;

  get template() {
    return buttonMoreTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
