import AbstractView from '../framework/view/abstract-view.js';

const popupNames = (names) => names.join(', ');


const filmCardControls = (userDetails) => `
          <div class="film-card__controls">
            <button class="film-card__controls-item ${userDetails.watchlist ? 'film-card__controls-item--active' : ''} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item ${userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item ${userDetails.favorite ? 'film-card__controls-item--active' : ''} film-card__controls-item--favorite" type="button">Mark as favorite</button>
          </div>
`;

const filmTemplate = (film) => `
        <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${film.title}</h3>
            <p class="film-card__rating">${film.totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${film.release.date.getFullYear()}</span>
              <span class="film-card__duration">${film.runtime}</span>
              <span class="film-card__genre">${popupNames(film.genre)}</span>
            </p>
            <img src="${film.poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${film.description}</p>
            <span class="film-card__comments">${film.comments.length} comments</span>
          </a>
          ${filmCardControls(film.userDetails)}
        </article>
 `;

export default class FilmView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return filmTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(this.#film);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  setFavoritesClickHandler = (callback) => {
    this._callback.favoritesClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoritesClickHandler);
  };

  #favoritesClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoritesClick();
  };
}
