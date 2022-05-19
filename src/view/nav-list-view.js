import AbstractView from '../framework/view/abstract-view.js';

const navListTemplate = (measures) => `
  <nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${measures.watchlist}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${measures.history}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${measures.favorites}</span></a>
  </nav>
  `;

export default class NavListView extends AbstractView {
  #measures = {
    watchlist: 0,
    history: 0,
    favorites: 0,
  };

  constructor(films) {
    super();
    this.#measures = films.reduce((measures, film) => {
      measures.watchlist += film.userDetails.watchlist ? 1 : 0;
      measures.history += film.userDetails.alreadyWatched ? 1 : 0;
      measures.favorites += film.userDetails.favorite ? 1 : 0;
      return measures;
    },this.#measures);
  }


  get template() {
    return navListTemplate(this.#measures);
  }
}
