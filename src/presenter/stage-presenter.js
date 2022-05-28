import {render, remove, RenderPosition} from '../framework/render.js';
import {updateItem} from '../utils.js';
import dayjs  from 'dayjs';
import {SortType} from '../const.js';
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
  #topListFilms = null;
  #discussListFilms = null;
  #sourcedListFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

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
  #filmListSortType = SortType.DEFAULT;

  constructor(siteMainElement, filmsModel) {
    this.#mainContainer = siteMainElement;
    this.#filmsModel = filmsModel;
  }

  init () {
    this.#listFilms = [...this.#filmsModel.films];
    this.#sourcedListFilms = [...this.#filmsModel.films];
    this.#topListFilms = [...this.#filmsModel.topRatedFilms()];
    this.#discussListFilms = [...this.#filmsModel.mostCommentedFilms()];

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

  #sortByDateUp = (film1, film2) => {
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

  #sortByDateDown = (film1, film2) => ((-1) * this.#sortByDateUp(film1, film2));

  #sortByRatingUp = (film1, film2) => {
    if (film1.totalRating < film2.totalRating) {
      return 1;
    } else if (film1.totalRating > film2.totalRating) {
      return -1;
    } else {
      return 0;
    }
  };

  #sortByRatingDown = (film1, film2) => ((-1) * this.#sortByRatingUp(film1, film2));

  #setSortType = (sortType) => {
    if (sortType === SortType.DATE_UP && this.#filmListSortType === SortType.DATE_UP) {
      this.#filmListSortType = SortType.DATE_DOWN;
    } else if (sortType === SortType.RATING_UP && this.#filmListSortType === SortType.RATING_UP) {
      this.#filmListSortType = SortType.RATING_DOWN;
    } else {
      this.#filmListSortType = sortType;
    }
  };

  #sortFilmList = () => {
    switch (this.#filmListSortType) {
      case SortType.DATE_UP:
        this.#listFilms = [...this.#sourcedListFilms].sort(this.#sortByDateUp);
        break;
      case SortType.DATE_DOWN:
        this.#listFilms = [...this.#sourcedListFilms].sort(this.#sortByDateDown);
        break;
      case SortType.RATING_UP:
        this.#listFilms = [...this.#sourcedListFilms].sort(this.#sortByRatingUp);
        break;
      case SortType.RATING_DOWN:
        this.#listFilms = [...this.#sourcedListFilms].sort(this.#sortByRatingDown);
        break;
      default:
        this.#listFilms = [...this.#sourcedListFilms];
    }
  };

  #handleSortTypeChange = (newSortType) => {
    const prevSortType = this.#filmListSortType;
    this.#setSortType(newSortType);
    if (this.#filmListSortType === prevSortType) {
      return;
    }
    this.#sortFilmList();
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

  #getFilmKey = (film) => (`${film.id}`);

  #getTopFilmKey = (film) => (`top-${film.id}`);

  #getDiscussFilmKey = (film) => (`discuss-${film.id}`);

  #renderFilms = (from, to) => {
    this.#listFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, this.#filmsContainer, this.#getFilmKey));
  };

  #renderFilmList = () => {
    render(this.#filmsListView, this.#filmsListContainer, RenderPosition.AFTERBEGIN);
    this.#renderFilms(0,Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP));
    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderBtnMore();
    }
  };

  #clearFilmList = () => {
    this.#listFilms
      .forEach((film) => {
        const key = this.#getFilmKey(film);
        const presenter = this.#filmPresenter.get(key);
        if (presenter) {
          presenter.destroy();
          this.#filmPresenter.delete(key);
        }
      });
    remove(this.#btnMoreView);
  };

  #renderTopFilmList= () => {
    render(this.#filmsTopView, this.#filmsListContainer);
    this.#topListFilms.forEach((film) => this.#renderFilm(film, this.#topFilmsContainer, this.#getTopFilmKey));
  };

  #renderDiscussFilmList = () => {
    render(this.#filmsDiscussView, this.#filmsListContainer);
    this.#discussListFilms.forEach((film) => this.#renderFilm(film, this.#discussFilmsContainer, this.#getDiscussFilmKey));
  };

  #handleBtnMoreClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.#listFilms.length) {
      remove(this.#btnMoreView);
    }
  };

  #renderFilm = (film, container, getKey) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(film, this.#filmsModel.getComments(film));
    this.#filmPresenter.set(getKey(film), filmPresenter);
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.popupClose());
  };

  #initPresenterByKey = (key, updatedFilm) => {
    const presenter = this.#filmPresenter.get(key);
    if (presenter) {
      presenter.init(updatedFilm, this.#filmsModel.getComments(updatedFilm));
    }
  };

  #handleFilmChange = (updatedFilm) => {

    this.#listFilms = updateItem(this.#listFilms, updatedFilm);
    this.#sourcedListFilms = updateItem(this.#sourcedListFilms, updatedFilm);
    this.#initPresenterByKey(this.#getFilmKey(updatedFilm), updatedFilm);

    this.#topListFilms = updateItem(this.#topListFilms, updatedFilm);
    this.#initPresenterByKey(this.#getTopFilmKey(updatedFilm), updatedFilm);

    this.#discussListFilms = updateItem(this.#discussListFilms, updatedFilm);
    this.#initPresenterByKey(this.#getDiscussFilmKey(updatedFilm), updatedFilm);
  };
}
