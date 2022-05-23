import {render, remove} from '../framework/render.js';
import {updateItem} from '../utils.js';
import NavListView from '../view/nav-list-view';
import SortListView from '../view/sort-list-view';
import ButtonMoreView from '../view/button-more-view';
import StageView from '../view/stage-view.js';
import EmptyListView from '../view/empty-list-view';
import FilmsTopView from '../view/films-top-view';
import FilmsDiscussView from '../view/films-discuss-view';
import FilmsListView from '../view/films-list-view';
import FilmPresenter from '../presenter/film-presenter.js';

const FILM_COUNT_PER_STEP = 5;

export default class StagePresenter {
  #filmsModel = null;
  #listFilms = [];
  #sourcedListFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #filmPresenter = new Map();

  #mainContainer = null;
  #filmsListContainer = null;
  #filmsContainer = null;
  #btnMoreElement = null;

  #navListView = null;
  #sortListView = null;
  #emptyListView = null;
  #filmsListView = null;
  #filmsTopView = null;
  #filmsDiscussView = null;
  #stageView = null;
  #btnMoreView = null;

  constructor(siteMainElement, filmsModel) {
    this.#mainContainer = siteMainElement;
    this.#filmsModel = filmsModel;
  }

  init () {
    this.#listFilms = [...this.#filmsModel.films];
    this.#sourcedListFilms = [...this.#filmsModel.films];

    this.#navListView = new NavListView(this.#listFilms);
    this.#sortListView = new SortListView();
    this.#stageView = new StageView();
    this.#emptyListView = new EmptyListView();
    this.#filmsListView = new FilmsListView();
    this.#filmsTopView = new FilmsTopView();
    this.#filmsDiscussView = new FilmsDiscussView();
    this.#btnMoreView = new ButtonMoreView();

    this.#filmsListContainer = this.#stageView.element;
    this.#btnMoreElement = this.#filmsListView.element;
    this.#filmsContainer = this.#filmsListView.element.querySelector('.films-list__container');

    this.#renderStage();

  }

  #renderNavList = () => {
    render(this.#navListView, this.#mainContainer);
  };

  #renderSortList = () => {
    render(this.#sortListView, this.#mainContainer);
  };

  #renderEmptyList = () => {
    render(this.#emptyListView, this.#filmsListContainer);
  };

  #renderFilmsTop= () => {
    render(this.#filmsTopView, this.#filmsListContainer);
  };

  #renderFilmsDiscuss = () => {
    render(this.#filmsDiscussView, this.#filmsListContainer);
  };

  #renderBtnMore = () => {
    render(this.#btnMoreView, this.#btnMoreElement);
    this.#btnMoreView.setClickHandler(this.#handleBtnMoreClick);
  };

  #renderStage = () => {
    this.#renderNavList();
    if (this.#listFilms.length === 0) {
      render(this.#stageView, this.#mainContainer);
      this.#renderEmptyList();
      return;
    }
    this.#renderSortList();
    render(this.#stageView, this.#mainContainer);
    this.#renderFilmList();
    this.#renderFilmsTop();
    this.#renderFilmsDiscuss();
  };

  #renderFilms = (from, to) => {
    this.#listFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  };

  #renderFilmList = () => {
    render(this.#filmsListView, this.#filmsListContainer);
    this.#renderFilms(0,Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP));
    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderBtnMore();
    }
  };

  #handleBtnMoreClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.#listFilms.length) {
      remove(this.#btnMoreView);
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsContainer, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(film, this.#filmsModel.getComments(film));
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.popupClose());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#listFilms = updateItem(this.#listFilms, updatedFilm);
    this.#sourcedListFilms = updateItem(this.#sourcedListFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#filmsModel.getComments(updatedFilm));
  };
}
