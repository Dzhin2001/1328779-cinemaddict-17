import Observable from '../framework/observable.js';
import {sortByCommentedUp, sortByRatingUp} from '../utils/film.js';

const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

export default class FilmModel extends Observable {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get films() {
    return this.#films;
  }

  getTopRatedFilms() {
    return [...this.#films].sort(sortByRatingUp).slice(0, TOP_RATED_COUNT);
  }

  getMostCommentedFilms() {
    return [...this.#films].sort(sortByCommentedUp).slice(0, MOST_COMMENTED_COUNT);
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addFilm = (updateType, update) => {
    this.#films = [
      update,
      ...this.#films,
    ];

    this._notify(updateType, update);
  };

  deleteFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType);
  };

}
