import Observable from '../framework/observable.js';
import {sortByCommentedUp, sortByRatingUp} from '../utils/film.js';
import {UpdateType} from '../const.js';
import {getRandomArrayElement} from '../utils/random.js';

const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

export default class FilmModel extends Observable {
  #films = [];
  #filmsApiService = null;

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async () => {
    this.#films = [];
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
      this._notify(UpdateType.INIT);
    } catch(err) {
      throw new Error(err.message);
    }
  };

  get films() {
    return this.#films;
  }

  getTopRatedFilms() {
    let topRatedFilms = [];
    const films = [...this.#films]
      .filter((film) => film.totalRating !== 0)
      .sort(sortByRatingUp);
    const ratings = [...new Set(films.map((film) => film.totalRating))].slice(0, TOP_RATED_COUNT);
    if (ratings.length === 1) {
      topRatedFilms = films.slice(0, TOP_RATED_COUNT);
    } else {
      topRatedFilms = ratings.map(
        (rating) => getRandomArrayElement(films.filter((film) => film.totalRating === rating))
      );
    }
    return topRatedFilms;
  }

  getMostCommentedFilms() {
    let mostCommentedFilms = [];
    const films = [...this.#films]
      .filter((film) => film.comments.length!== 0)
      .sort(sortByCommentedUp);
    const commentCounts = [...new Set(films.map((film) => film.comments.length))].slice(0, MOST_COMMENTED_COUNT);
    if (commentCounts.length === 1) {
      mostCommentedFilms = films.slice(0, MOST_COMMENTED_COUNT);
    } else {
      mostCommentedFilms = commentCounts.map(
        (commentCount) => getRandomArrayElement( films.filter((film) => film.comments.length === commentCount) )
      );
    }
    return mostCommentedFilms;
  }

  updateFilm = async (updateType, update) => {
    let data = null;
    try {
      const response = await this.#filmsApiService.updateFilm(update);
      data = {
        film: this.#adaptToClient(response),
        filmExternal: null,
      };
      this.updateLocalFilm(data);
      this._notify(updateType);
    } catch(err) {
      throw new Error(err.message);
    }
  };

  updateLocalFilm = (data) => {
    const update = data.film ? data.film : this.#adaptToClient(data.filmExternal);
    const index = this.#films.findIndex((film) => film.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }
    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {
      id: film.id,
      comments: film.comments,
      ...film['film_info'],
      alternativeTitle: film['film_info']['alternative_title'],
      ageRating: film['film_info']['age_rating'],
      totalRating: film['film_info']['total_rating'],
      release: {
        date: film['film_info']['release']['date'] !== null ? new Date(film['film_info']['release']['date']) : null,
        releaseCountry: film['film_info']['release']['release_country'],
      },
      userDetails: {
        ...film['user_details'],
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date'] !== null ? new Date(film['user_details']['watching_date']) : null,
      }
    };
    delete adaptedFilm['alternative_title'];
    delete adaptedFilm['age_rating'];
    delete adaptedFilm['total_rating'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];
    return adaptedFilm;
  };
}
