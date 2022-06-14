const FILMS_COUNT = 20;
const COMMENTS_COUNT = 25;

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const SortType = {
  DEFAULT: 'default',
  RATING_UP: 'by-rating-up',
  RATING_DOWN: 'by-rating-down',
  DATE_UP: 'by-date-up',
  DATE_DOWN: 'by-date-down',
  COMMENTS_UP: 'by-comments-up',
  COMMENTS_DOWN: 'by-comments-down',
};

const ModeFilmPresentor = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_FILM: 'ADD_FILM',
  DELETE_FILM: 'DELETE_FILM',
  UPDATE_COMMENT: 'UPDATE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export {FILMS_COUNT, COMMENTS_COUNT, SortType, ModeFilmPresentor, UserAction, UpdateType, EMOTIONS, FilterType};
