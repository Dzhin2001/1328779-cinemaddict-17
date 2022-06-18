import {ModeFilmPresentor, UserAction, UpdateType} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import FilmView from '../view/film-view.js';
import PopupView from '../view/popup-view.js';


export default class FilmPresenter {
  #commentsModel = null;
  #filmsContainer = null;
  #filmView = null;
  #popupView = null;
  #changeData = null;
  #changeMode  = null;
  #mode = ModeFilmPresentor.DEFAULT;

  constructor(filmsContainer, changeData, changeMode ) {
    this.#filmsContainer = filmsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode ;
  }

  init (film, commentsModel) {

    this.film = film;
    this.#commentsModel = commentsModel;

    const prevFilmView = this.#filmView;
    this.#filmView = new FilmView(this.film);
    this.#filmView.setClickHandler(this.#popupOpen);
    this.#filmView.setWatchlistClickHandler(this.#handleWatchClick);
    this.#filmView.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmView.setFavoritesClickHandler(this.#handleFavoritesClick);
    if (!prevFilmView) {
      render(this.#filmView, this.#filmsContainer);
      return;
    }
    replace(this.#filmView, prevFilmView);
    remove(prevFilmView);

    if (this.#mode === ModeFilmPresentor.POPUP) {
      this.#commentsModel.init(this.film.id);
      this.initPopup();
    }
  }

  initPopup = () => {
    const prevPopupView = this.#popupView;
    this.#popupView = new PopupView(this.film, this.#commentsModel.comments, prevPopupView ? prevPopupView.prevScrollTop : 0);
    this.#popupView.setCloseClickHandler(this.#handlePopupBtnCloseClick);
    this.#popupView.setWatchlistClickHandler(this.#handleWatchClick);
    this.#popupView.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupView.setFavoritesClickHandler(this.#handleFavoritesClick);
    this.#popupView.setCommentDeleteHandler(this.#handleCommentDelete);
    this.#popupView.setFormSubmitHandler(this.#handleFormSubmit);
    if (!prevPopupView) {
      render(this.#popupView, document.body);
      this.#popupView.restoreScroll();
      return;
    }
    replace(this.#popupView, prevPopupView);
    this.#popupView.restoreScroll();
    remove(prevPopupView);
  };

  isOpenPopup = () => (this.#mode === ModeFilmPresentor.POPUP);

  #popupOpen = () => {
    this.#changeMode();
    this.#mode = ModeFilmPresentor.POPUP;
    this.#commentsModel.init(this.film.id);
    this.#popupView = null;
    this.initPopup();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onPopupEscKeyDown);
  };

  popupClose() {
    if (this.#mode === ModeFilmPresentor.POPUP) {
      document.removeEventListener('keydown', this.#onPopupEscKeyDown);
      document.body.classList.remove('hide-overflow');
      this.#popupView.element.remove();
      this.#mode = ModeFilmPresentor.DEFAULT;
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
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,{
        ...this.film,
        userDetails:{
          ...this.film.userDetails,
          watchlist: !this.film.userDetails.watchlist,
        }
      });
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.film,
        userDetails:{
          ...this.film.userDetails,
          alreadyWatched: !this.film.userDetails.alreadyWatched,
        }
      });
  };

  #handleFavoritesClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.film,
        userDetails:{
          ...this.film.userDetails,
          favorite: !this.film.userDetails.favorite,
        }
      });
  };

  #handleFormSubmit = (updateCommentData) => {
    // пока добавление так происходит
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        filmId: this.film.id,
        comment: updateCommentData,
      },
    );
  };

  #handleCommentDelete = (commentId) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {
        film: {
          ...this.film,
          comments: this.film.comments.filter((id) => id !== commentId),
        },
        commentId: commentId,
      });
  };

  destroy = () => {
    remove(this.#filmView);
    if (!this.isOpenPopup()) {
      remove(this.#popupView);
      return false;
    }
    return true;
  };
}
