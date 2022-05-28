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
    this.#changeMode = changeMode ;
  }

  init (film, comments) {

    this.#film = film;
    this.#comments = comments;

    const prevFilmView = this.#filmView;
    this.#filmView = new FilmView(this.#film);
    this.#filmView.setClickHandler(this.#popupOpen);
    this.#filmView.setWatchlistClickHandler(this.#handleWatchClick);
    this.#filmView.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmView.setFavoritesClickHandler(this.#handleFavoritesClick);

    const prevPopupView = this.#popupView;
    this.#popupView = new PopupView(this.#film, this.#comments);
    this.#popupView.setCloseClickHandler(this.#handlePopupBtnCloseClick);
    this.#popupView.setWatchlistClickHandler(this.#handleWatchClick);
    this.#popupView.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupView.setFavoritesClickHandler(this.#handleFavoritesClick);

    if (!prevFilmView) {
      render(this.#filmView, this.#filmsContainer);
      return;
    }
    replace(this.#filmView, prevFilmView);
    remove(prevFilmView);

    if (this.#mode === Mode.POPUP) {
      replace(this.#popupView, prevPopupView);
      remove(prevPopupView);
    }
  }

  #popupOpen = () => {
    this.#changeMode();
    this.#mode = Mode.POPUP;
    render(this.#popupView, document.body);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onPopupEscKeyDown);
  };

  popupClose() {
    if (this.#mode === Mode.POPUP) {
      document.removeEventListener('keydown', this.#onPopupEscKeyDown);
      document.body.classList.remove('hide-overflow');
      this.#popupView.element.remove();
      this.#mode = Mode.DEFAULT;
    }
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
        ...this.#film.userDetails,
        watchlist: !this.#film.userDetails.watchlist,
      }
    });
  };

  #handleWatchedClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails:{
        ...this.#film.userDetails,
        alreadyWatched: !this.#film.userDetails.alreadyWatched,
      }
    });
  };

  #handleFavoritesClick = () => {
    this.#changeData({
      ...this.#film,
      userDetails:{
        ...this.#film.userDetails,
        favorite: !this.#film.userDetails.favorite,
      }
    });
  };

  destroy = () => {
    remove(this.#filmView);
    if (this.#mode === Mode.POPUP) {
      remove(this.#popupView);
    }
  };
}
