import {render, remove} from '../framework/render.js';
import NavListView from '../view/nav-list-view';
import SortListView from '../view/sort-list-view';
import ButtonMoreView from '../view/button-more-view';
import FilmView from '../view/film-view.js';
import FilmsListView from '../view/films-list-view';
import EmptyListView from '../view/empty-list-view';
import PopupView from '../view/popupView';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #listFilms = null;
  #filmsListView = null;
  #filmsView = null;
  #btnMoreElement = null;
  #btnMoreView = null;
  #filmsContainer = null;
  #popupView = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(siteMainElement, filmsModel) {
    this.#filmContainer = siteMainElement;
    this.#filmsModel = filmsModel;
  }

  init () {
    this.#listFilms = [...this.#filmsModel.films];

    this.#filmsListView = new FilmsListView();
    this.#btnMoreElement = this.#filmsListView.element;
    this.#filmsContainer = this.#filmsListView.element.querySelector('.films-list__container');
    this.#btnMoreView = new ButtonMoreView();

    render(new NavListView(), this.#filmContainer);
    this.#renderFilmList();

  }

  #renderFilmList = () => {
    if (this.#listFilms.length === 0) {
      render(new EmptyListView(), this.#filmContainer);
      return;
    }
    render(new SortListView(), this.#filmContainer);
    render(this.#filmsListView, this.#filmContainer);

    for (let i=0; i <  Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#listFilms[i]);
    }

    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      render(this.#btnMoreView, this.#btnMoreElement);
      this.#btnMoreView.setClickHandler(this.#handleBtnMoreClick);
    }
  };

  #renderFilm = (film) => {
    this.#filmsView = new FilmView(film);
    render(this.#filmsView, this.#filmsContainer);
    this.#filmsView.setClickHandler(this.#popupOpen);
  };

  #popupOpen = (film) => {
    this.#popupView = new PopupView(film, this.#filmsModel.getComments(film));
    render(this.#popupView, document.body);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onPopupEscKeyDown);
    this.#popupView.setCloseClickHandler(this.#handlePopupBtnCloseClick);
  };

  #popupClose() {
    document.removeEventListener('keydown', this.#onPopupEscKeyDown);
    document.body.classList.remove('hide-overflow');
    this.#popupView.element.remove();
  }

  #onPopupEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#popupClose();
    }
  };

  #handlePopupBtnCloseClick = () => {
    this.#popupClose();
  };

  #handleBtnMoreClick = () => {
    this.#listFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listFilms.length) {
      remove(this.#btnMoreView);
    }
  };

}
