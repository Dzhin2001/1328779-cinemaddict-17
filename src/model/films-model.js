export default class FilmModel {
  #films = null;
  #comments = null;

  constructor(films, comments) {
    this.#films = films;
    this.#comments = comments;
  }

  get comments() {
    return this.#comments;
  }

  get films() {
    return this.#films;
  }

  getFilm(id) {
    return this.#films.find( (film) => film.idFilm === id);
  }

  getComments(film) {
    return [...film.comments].map((id) => this.#comments.find( (comment) => comment.idComment === id));
  }
}
