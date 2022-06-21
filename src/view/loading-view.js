import AbstractView from '../framework/view/abstract-view.js';


const getLoadingTemplate = () => `
    <section class="films-list">
        <h2 class="films-list__title">Loading...</h2>
    </section>
  `;

export default class LoadingView extends AbstractView {
  #filterType = null;

  get template() {
    return getLoadingTemplate(this.#filterType);
  }
}
