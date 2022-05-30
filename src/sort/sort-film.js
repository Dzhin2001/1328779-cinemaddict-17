import dayjs  from 'dayjs';

const SortType = {
  DEFAULT: 'default',
  RATING_UP: 'by-rating-up',
  RATING_DOWN: 'by-rating-down',
  DATE_UP: 'by-date-up',
  DATE_DOWN: 'by-date-down',
  COMMENTS_UP: 'by-comments-up',
  COMMENTS_DOWN: 'by-comments-down',
};

class SortFilm {
  #sourcedListFilms = [];

  constructor(films) {
    this.filmList = films;
  }

  set filmList(films) {
    this.#sourcedListFilms = [...films];
  }

  get filmList() {
    return [...this.#sourcedListFilms];
  }

  static sortByCommentedUp = (film1, film2) => {
    if (film1.comments.length < film2.comments.length) {
      return 1;
    } else if (film1.comments.length > film2.comments.length) {
      return -1;
    } else {
      return 0;
    }
  };

  static sortByCommentedDown = (film1, film2) => ((-1) * SortFilm.sortByCommentedUp(film1, film2));

  static sortByDateUp = (film1, film2) => {
    const date1 = dayjs(film1.release.date);
    const date2 = dayjs(film2.release.date);
    if (date1.isBefore(date2)) {
      return 1;
    } else if (date1.isAfter(date2)) {
      return -1;
    } else {
      return 0;
    }
  };

  static sortByDateDown = (film1, film2) => ((-1) * SortFilm.sortByDateUp(film1, film2));

  static sortByRatingUp = (film1, film2) => {
    if (film1.totalRating < film2.totalRating) {
      return 1;
    } else if (film1.totalRating > film2.totalRating) {
      return -1;
    } else {
      return 0;
    }
  };

  static sortByRatingDown = (film1, film2) => ((-1) * SortFilm.sortByRatingUp(film1, film2));

  getSortedFilmList = (newSortType) => {
    switch (newSortType) {
      case SortType.DATE_UP:
        return this.filmList.sort(SortFilm.sortByDateUp);
      case SortType.DATE_DOWN:
        return this.filmList.sort(SortFilm.sortByDateDown);
      case SortType.RATING_UP:
        return this.filmList.sort(SortFilm.sortByRatingUp);
      case SortType.RATING_DOWN:
        return this.filmList.sort(SortFilm.sortByRatingDown);
      case SortType.COMMENTS_UP:
        return this.filmList.sort(SortFilm.sortByCommentedUp);
      case SortType.COMMENTS_DOWN:
        return this.filmList.sort(SortFilm.sortByCommentedDown);
      default:
        return this.filmList;
    }
  };
}

export {SortFilm, SortType};
