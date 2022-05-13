import {FILMS_COUNT, COMMENTS_COUNT} from '../const.js';
import {generateFilms} from '../mock/film.js';
import {generateComments} from '../mock/comment.js';

export default class FilmModel {

  #films = null;
  #comments = null;

  get comments() {
    if(!this.#comments) {
      this.#comments = generateComments(COMMENTS_COUNT);
    }
    return this.#comments;
  }

  get films() {
    if(!this.#films) {
      this.#films = generateFilms(FILMS_COUNT, this.comments);
    }
    return this.#films;
  }

  getComments(film) {
    return [...film.comments].map((id) => this.#comments.find( (comment) => comment.idComment === id));
  }

}
