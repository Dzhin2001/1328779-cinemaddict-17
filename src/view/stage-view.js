import AbstractView from '../framework/view/abstract-view.js';

const filmsListTemplate = () => `
  <section class="films">
  </section>
  `;

export default class StageView extends AbstractView {
  get template() {
    return filmsListTemplate();
  }
}
