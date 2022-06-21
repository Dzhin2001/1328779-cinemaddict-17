import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const getPopupNames = (names) => names.join(', ');


const getFilmCardControls = (userDetails, isDisabled) => `
          <div class="film-card__controls">
            <button
                class="film-card__controls-item ${userDetails.watchlist ? 'film-card__controls-item--active' : ''} film-card__controls-item--add-to-watchlist"
                type="button"
                ${isDisabled ? ' disabled' : ''}
            >Add to watchlist</button>
            <button
                class="film-card__controls-item ${userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''} film-card__controls-item--mark-as-watched"
                type="button"
                ${isDisabled ? ' disabled' : ''}
            >Mark as watched</button>
            <button
                class="film-card__controls-item ${userDetails.favorite ? 'film-card__controls-item--active' : ''} film-card__controls-item--favorite"
                type="button"
                ${isDisabled ? ' disabled' : ''}
            >Mark as favorite</button>
          </div>
`;

const getFilmTemplate = (state) => `
        <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${state.title}</h3>
            <p class="film-card__rating">${state.totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${state.release.date.getFullYear()}</span>
              <span class="film-card__duration">${state.runtime}</span>
              <span class="film-card__genre">${getPopupNames(state.genre)}</span>
            </p>
            <img src="${state.poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${state.description}</p>
            <span class="film-card__comments">${state.comments.length} comments</span>
          </a>
          ${getFilmCardControls(state.userDetails, state.isDisabled)}
        </article>
 `;

export default class FilmView extends AbstractStatefulView {
  _state = null;
  #film = null;

  constructor(film) {
    super();
    this._state = FilmView.parseFilmToState(film);
    this.#film = film;
    this.#setInnerHandlers();
  }

  get template() {
    return getFilmTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setClickHandler(this._callback.formClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.addEventListener('click', this.#clickHandler);
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoritesClickHandler);
  };

  setClickHandler = (callback) => {
    this._callback.formClick = callback;
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
  };

  setFavoritesClickHandler = (callback) => {
    this._callback.favoritesClick = callback;
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClick(FilmView.parseStateToFilm(this._state));
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.updateElement({
      isDisabled: true,
    });
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.updateElement({
      isDisabled: true,
    });
    this._callback.watchedClick();
  };

  #favoritesClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.updateElement({
      isDisabled: true,
    });
    this._callback.favoritesClick();
  };

  static parseFilmToState = (film) => (
    {
      ...film,
      isDisabled: false,
    });

  static parseStateToFilm = (state) => {
    const film = {...state};
    delete film.isDisabled;
    return film;
  };
}
