import {render, remove, RenderPosition} from '../framework/render.js';
import {updateItem} from '../utils.js';
import {SortFilm, SortType} from '../sort/sort-film.js';
import NavListView from '../view/nav-list-view.js';
import SortListView from '../view/sort-list-view.js';
import ButtonMoreView from '../view/button-more-view.js';
import StageView from '../view/stage-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FilmsTopView from '../view/films-top-view.js';
import FilmsDiscussView from '../view/films-discuss-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmPresenter from '../presenter/film-presenter.js';

const FILM_COUNT_PER_STEP = 5;
const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;
const PresenterType = {
  MAIN: 'main',
  TOP: 'top',
  DISCUSS: 'discuss',
};

export default class StagePresenter {
  #filmsModel = null;
  #sortFilm = null;
  #listFilms = [];
  #topListFilms = [];
  #discussListFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmListSortType = SortType.DEFAULT;

  #filmPresenter = new Map();

  #mainContainer = null;
  #filmsListContainer = null;
  #filmsContainer = null;
  #topFilmsContainer = null;
  #discussFilmsContainer = null;
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
    this.#sortFilm = new SortFilm(this.#listFilms);
    this.#topListFilms = this.#sortFilm.getSortedFilmList(SortType.RATING_UP).slice(0,TOP_RATED_COUNT);
    this.#discussListFilms = this.#sortFilm.getSortedFilmList(SortType.COMMENTS_UP).slice(0,MOST_COMMENTED_COUNT);

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
    this.#topFilmsContainer = this.#filmsTopView.element.querySelector('.films-list__container');
    this.#discussFilmsContainer = this.#filmsDiscussView.element.querySelector('.films-list__container');

    this.#renderStage();

  }

  #renderNavList = () => {
    render(this.#navListView, this.#mainContainer);
  };

  #renderSortList = () => {
    render(this.#sortListView, this.#mainContainer);
    this.#sortListView.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #setSortType = (newSortType) => {
    if (newSortType === SortType.DATE_UP && this.#filmListSortType === SortType.DATE_UP) {
      this.#filmListSortType = SortType.DATE_DOWN;
    } else if (newSortType === SortType.RATING_UP && this.#filmListSortType === SortType.RATING_UP) {
      this.#filmListSortType = SortType.RATING_DOWN;
    } else {
      this.#filmListSortType = newSortType;
    }
  };

  #handleSortTypeChange = (newSortType) => {
    const prevSortType = this.#filmListSortType;
    this.#setSortType(newSortType);
    if (this.#filmListSortType === prevSortType) {
      return;
    }
    this.#listFilms = this.#sortFilm.getSortedFilmList(this.#filmListSortType);
    this.#clearFilmList();
    this.#renderFilmList();
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
    this.#renderTopFilmList();
    this.#renderDiscussFilmList();
  };

  #renderEmptyList = () => {
    render(this.#emptyListView, this.#filmsListContainer);
  };

  #renderFilms = (from, to) => {
    this.#listFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, this.#filmsContainer, PresenterType.MAIN));
  };

  #renderFilmList = () => {
    render(this.#filmsListView, this.#filmsListContainer, RenderPosition.AFTERBEGIN);
    this.#renderFilms(0,Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP));
    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderBtnMore();
    }
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach(
      (presenters) => {
        const presenter = presenters.get(PresenterType.MAIN);
        if (presenter !== undefined) {
          presenter.destroy();
        }
        presenters.delete(PresenterType.MAIN);
      }
    );
    remove(this.#btnMoreView);
  };

  #renderTopFilmList= () => {
    render(this.#filmsTopView, this.#filmsListContainer);
    this.#topListFilms.forEach((film) => this.#renderFilm(film, this.#topFilmsContainer, PresenterType.TOP));
  };

  #renderDiscussFilmList = () => {
    render(this.#filmsDiscussView, this.#filmsListContainer);
    this.#discussListFilms.forEach((film) => this.#renderFilm(film, this.#discussFilmsContainer, PresenterType.DISCUSS));
  };

  #handleBtnMoreClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.#listFilms.length) {
      remove(this.#btnMoreView);
    }
  };

  #renderFilm = (film, container, key) => {
    const newFilmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#handleModeChange);
    newFilmPresenter.init(film, this.#filmsModel.getComments(film));
    let presenters = this.#filmPresenter.get(film.id);
    if (presenters === undefined) {
      presenters = new Map();
    }
    presenters.set(key, newFilmPresenter);
    this.#filmPresenter.set(film.id, presenters);
  };

  #handleModeChange = () => {
    this.#filmPresenter
      .forEach(
        (presenters) => presenters.forEach((presenter) => presenter.popupClose())
      );
  };

  #handleFilmChange = (updatedFilm) => {
    this.#listFilms = updateItem(this.#listFilms, updatedFilm);
    this.#sortFilm.filmList = updateItem(this.#sortFilm.filmList, updatedFilm);
    this.#topListFilms = updateItem(this.#topListFilms, updatedFilm);
    this.#discussListFilms = updateItem(this.#discussListFilms, updatedFilm);
    this.#filmPresenter
      .get(updatedFilm.id)
      .forEach(
        (presenter) => presenter.init(updatedFilm, this.#filmsModel.getComments(updatedFilm))
      );
  };
}
