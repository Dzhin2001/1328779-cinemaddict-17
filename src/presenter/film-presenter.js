import {render, replace, remove} from '../framework/render.js';
import FilmView from '../view/film-view.js';
import PopupView from '../view/popupView';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmPresenter {
  #film = null;
  #comments = null;
  #filmsContainer = null;
  #filmView = null;
  #popupView = null;
  #changeData = null;
  #changeMode  = null;
  #mode = Mode.DEFAULT;

  constructor(filmsContainer, changeData, changeMode ) {
    this.#filmsContainer = filmsContainer;
    this.#changeData = changeData;
    this.#changeMode  = changeMode ;
  }

  init (film, comments) {

    const prevFilmView = this.#filmView;
    const prevPopupView = this.#popupView;

    this.#film = film;
    this.#comments = comments;
    this.#filmView = new FilmView(film);
    this.#popupView = new PopupView(film, this.#comments);
    this.#filmView.setClickHandler(this.#popupOpen);
    this.#filmView.setWatchlistClickHandler(this.#handleWatchClick);
    this.#filmView.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmView.setFavoritesClickHandler(this.#handleFavoritesClick);

    if (prevFilmView === null) {
      render(this.#filmView, this.#filmsContainer);
      return;
    }
    replace(this.#filmView, prevFilmView);
    remove(prevFilmView);

    this.#renderPopup(prevPopupView);
  }


  #renderPopup = (prevPopupView) => {
    if (prevPopupView === null || prevPopupView === undefined) {
      render(this.#popupView, document.body);
      document.body.classList.add('hide-overflow');
    } else {
      replace(this.#popupView, prevPopupView);
      remove(prevPopupView);
    }
    document.addEventListener('keydown', this.#onPopupEscKeyDown);
    this.#popupView.setCloseClickHandler(this.#handlePopupBtnCloseClick);
    this.#popupView.setWatchlistClickHandler(this.#handleWatchClick);
    this.#popupView.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupView.setFavoritesClickHandler(this.#handleFavoritesClick);
  };

  #popupOpen = () => {
    this.#changeMode();
    this.#renderPopup();
    this.#mode = Mode.POPUP;
  };

  popupClose() {
    document.removeEventListener('keydown', this.#onPopupEscKeyDown);
    document.body.classList.remove('hide-overflow');
    this.#popupView.element.remove();
    this.#mode = Mode.DEFAULT;
  }

  #onPopupEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.popupClose();
    }
  };

  #handlePopupBtnCloseClick = () => {
    this.popupClose();
  };

  #handleWatchClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails:{
        watchlist: !this.#film.userDetails.watchlist,
        alreadyWatched: this.#film.userDetails.alreadyWatched,
        watchingDate: this.#film.userDetails.watchingDate,
        favorite: this.#film.userDetails.favorite,
      }
    });
  };

  #handleWatchedClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails:{
        watchlist: this.#film.userDetails.watchlist,
        alreadyWatched: !this.#film.userDetails.alreadyWatched,
        watchingDate: this.#film.userDetails.watchingDate,
        favorite: this.#film.userDetails.favorite,
      }
    });
  };

  #handleFavoritesClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails:{
        watchlist: this.#film.userDetails.watchlist,
        alreadyWatched: this.#film.userDetails.alreadyWatched,
        watchingDate: this.#film.userDetails.watchingDate,
        favorite: !this.#film.userDetails.favorite,
      }
    });
  };
}
