const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

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

  #sortByDateUp = (film1, film2) => {
    if (film1.totalRating < film2.totalRating) {
      return 1;
    } else if (film1.totalRating > film2.totalRating) {
      return -1;
    } else {
      return 0;
    }
  };

  #sortByCommentedUp = (film1, film2) => {
    if (film1.comments.length < film2.comments.length) {
      return 1;
    } else if (film1.comments.length > film2.comments.length) {
      return -1;
    } else {
      return 0;
    }
  };

  topRatedFilms() {
    return [...this.#films].sort(this.#sortByDateUp).slice(0,TOP_RATED_COUNT);
  }

  mostCommentedFilms() {
    return [...this.#films].sort(this.#sortByCommentedUp).slice(0,MOST_COMMENTED_COUNT );
  }

  getFilm(id) {
    return this.#films.find( (film) => film.id === id);
  }

  getComments(film) {
    return [...film.comments].map((id) => this.#comments.find( (comment) => comment.id === id));
  }
}
