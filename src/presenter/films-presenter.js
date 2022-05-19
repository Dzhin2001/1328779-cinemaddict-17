import {render, remove} from '../framework/render.js';
import NavListView from '../view/nav-list-view';
import SortListView from '../view/sort-list-view';
import ButtonMoreView from '../view/button-more-view';
import FilmsView from '../view/films-view.js';
import EmptyListView from '../view/empty-list-view';
import FilmsTopView from '../view/films-top-view';
import FilmsDiscussView from '../view/films-discuss-view';
import FilmsListView from '../view/films-list-view';
import FilmView from '../view/film-view.js';
import PopupView from '../view/popupView';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsModel = null;
  #listFilms = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #mainContainer = null;
  #filmsListContainer = null;
  #filmsContainer = null;
  #btnMoreElement = null;

  #navListView = null;
  #sortListView = null;
  #filmView = null;
  #filmsListView = null;
  #filmsTopView = null;
  #filmsDiscussView = null;
  #filmsView = null;
  #btnMoreView = null;
  #popupView = null;

  constructor(siteMainElement, filmsModel) {
    this.#mainContainer = siteMainElement;
    this.#filmsModel = filmsModel;
  }

  init () {
    this.#listFilms = [...this.#filmsModel.films];

    this.#navListView = new NavListView(this.#listFilms);
    this.#sortListView = new SortListView();
    this.#filmsView = new FilmsView();
    this.#filmsListView = new FilmsListView();
    this.#filmsTopView = new FilmsTopView();
    this.#filmsDiscussView = new FilmsDiscussView();
    this.#btnMoreView = new ButtonMoreView();

    this.#filmsListContainer = this.#filmsView.element;
    this.#btnMoreElement = this.#filmsListView.element;
    this.#filmsContainer = this.#filmsListView.element.querySelector('.films-list__container');

    render(this.#navListView, this.#mainContainer);
    this.#renderFilmList();

  }

  #renderFilmList = () => {
    if (this.#listFilms.length === 0) {
      render(this.#filmsListView, this.#mainContainer);
      render(new EmptyListView(), this.#filmsListContainer);
      return;
    }
    render(this.#sortListView, this.#mainContainer);
    render(this.#filmsView, this.#mainContainer);
    render(this.#filmsListView, this.#filmsListContainer);

    for (let i=0; i <  Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#listFilms[i]);
    }

    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      render(this.#btnMoreView, this.#btnMoreElement);
      this.#btnMoreView.setClickHandler(this.#handleBtnMoreClick);
    }

    render(this.#filmsTopView, this.#filmsListContainer);
    render(this.#filmsDiscussView, this.#filmsListContainer);
  };

  #renderFilm = (film) => {
    this.#filmView = new FilmView(film);
    render(this.#filmView, this.#filmsContainer);
    this.#filmView.setClickHandler(this.#popupOpen);
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
