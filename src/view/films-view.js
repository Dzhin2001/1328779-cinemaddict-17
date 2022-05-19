import AbstractView from '../framework/view/abstract-view.js';

const filmsListTemplate = () => `
  <section class="films">
  </section>
  `;

export default class FilmsListView extends AbstractView {
  get template() {
    return filmsListTemplate();
  }
}
