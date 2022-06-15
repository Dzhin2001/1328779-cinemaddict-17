import {ModeFilmPresentor, UserAction, UpdateType} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import FilmView from '../view/film-view.js';
import PopupView from '../view/popup-view.js';
import {generateComment} from '../mock/comment.js';


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

    const prevPopupView = this.#popupView;
    this.#popupView = new PopupView(this.film, this.#commentsModel.getComments(this.film.comments), prevPopupView ? prevPopupView.prevScrollTop : 0);
    this.#popupView.setCloseClickHandler(this.#handlePopupBtnCloseClick);
    this.#popupView.setWatchlistClickHandler(this.#handleWatchClick);
    this.#popupView.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupView.setFavoritesClickHandler(this.#handleFavoritesClick);
    this.#popupView.setCommentDeleteHandler(this.#handleCommentDelete);
    this.#popupView.setFormSubmitHandler(this.#handleFormSubmit);

    if (!prevFilmView) {
      render(this.#filmView, this.#filmsContainer);
      return;
    }
    replace(this.#filmView, prevFilmView);
    remove(prevFilmView);

    if (this.#mode === ModeFilmPresentor.POPUP) {
      if (!prevPopupView) {
        render(this.#popupView, document.body);
        this.#popupView.restoreScroll();
        return;
      }
      replace(this.#popupView, prevPopupView);
      this.#popupView.restoreScroll();
      remove(prevPopupView);
    }
  }

  isOpenPopup = () => (this.#mode === ModeFilmPresentor.POPUP);

  #popupOpen = () => {
    this.#changeMode();
    this.#mode = ModeFilmPresentor.POPUP;
    render(this.#popupView, document.body);
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

  #handleFormSubmit = ({film, updateCommentData}) => {
    // пока добавление так происходит
    const newComment = {...generateComment(),...updateCommentData};
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      newComment,
    );
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...film,
        comments:[
          ...film.comments
          ,newComment.id
        ]
      });
  };

  #handleCommentDelete = ({film, updateCommentData}) => {
    // пока добавление так происходит
    console.log(updateCommentData);
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      updateCommentData,
    );
    console.log(film.comments);
    console.log(film.comments.filter((id) => id!==updateCommentData.id));
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...film,
        comments:film.comments.filter((id) => id!==updateCommentData.id)
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
