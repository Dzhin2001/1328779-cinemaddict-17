import {render, remove, RenderPosition} from '../framework/render.js';
import {sortByDateUp, sortByDateDown, sortByRatingUp, sortByRatingDown} from '../utils/film.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';
import SortListView from '../view/sort-list-view.js';
import ButtonMoreView from '../view/button-more-view.js';
import StageView from '../view/stage-view.js';
import EmptyListView from '../view/empty-list-view.js';
import FilmsTopView from '../view/films-top-view.js';
import FilmsDiscussView from '../view/films-discuss-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmPresenter from '../presenter/film-presenter.js';

const FILM_COUNT_PER_STEP = 5;

export default class StagePresenter {
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmListSortType = SortType.DEFAULT;
  #filmListFilterType = FilterType.ALL;

  #filmPresenter = new Map();
  #openedFilmPresenter = null;

  #mainContainer = null;
  #filmsListContainer = null;
  #filmsContainer = null;
  #topFilmsContainer = null;
  #discussFilmsContainer = null;

  #sortListView = null;
  #emptyListView = null;
  #filmsListView = null;
  #filmsTopView = null;
  #filmsDiscussView = null;
  #stageView = null;
  #btnMoreView = null;

  constructor(siteMainElement, filmsModel, commentsModel, filterModel) {
    this.#mainContainer = siteMainElement;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films () {
    this.#filmListFilterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filmListFilterType](films);

    switch (this.#filmListSortType) {
      case SortType.DATE_UP:
        return filteredFilms.sort(sortByDateUp);
      case SortType.DATE_DOWN:
        return filteredFilms.sort(sortByDateDown);
      case SortType.RATING_UP:
        return filteredFilms.sort(sortByRatingUp);
      case SortType.RATING_DOWN:
        return filteredFilms.sort(sortByRatingDown);
      default:
        return filteredFilms;
    }
  }

  init () {
    this.#renderStage();
  }

  #renderSortList = () => {
    this.#sortListView = new SortListView(this.#filmListSortType);
    this.#sortListView.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortListView, this.#mainContainer);
  };

  #renderStageContainer = () => {
    this.#stageView = new StageView();
    render(this.#stageView, this.#mainContainer);
    this.#filmsListContainer = this.#stageView.element;
  };

  #renderEmptyList = () => {
    this.#emptyListView = new EmptyListView(this.#filmListFilterType);
    render(this.#emptyListView, this.#filmsListContainer);
  };

  #renderBtnMore = () => {
    this.#btnMoreView = new ButtonMoreView();
    this.#btnMoreView.setClickHandler(this.#handleBtnMoreClick);
    render(this.#btnMoreView, this.#filmsListView.element);
  };

  #renderStage = () => {
    const films = this.films;
    const filmCount = films.length;
    if (filmCount === 0) {
      this.#renderStageContainer();
      this.#renderEmptyList();
      return;
    }
    this.#renderSortList();
    this.#renderStageContainer();
    this.#renderFilmList();
    this.#renderTopFilmList();
    this.#renderDiscussFilmList();
    if(this.#openedFilmPresenter) {
      this.#openedFilmPresenter.init(this.films.filter( (film) => film.id === this.#openedFilmPresenter.film.id )[0], this.#commentsModel);
    }
  };

  #clearStage = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;
    // ловим презентор с открытым Попап
    //this.#openedFilmPresenter = [].concat(...Array.from(this.#filmPresenter.values())).filter((presenter) => presenter.isOpenPopup())[0];
    this.#filmPresenter.forEach((presenters) => presenters.forEach( (presenter) => {
      if(presenter.destroy()) {
        this.#openedFilmPresenter = presenter;
      }
    }));
    this.#filmPresenter.clear();
    remove(this.#sortListView);
    if (this.#emptyListView) {
      remove(this.#emptyListView);
    }
    remove(this.#filmsListView);
    remove(this.#filmsTopView);
    remove(this.#filmsDiscussView);
    remove(this.#btnMoreView);
    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }
    if (resetSortType) {
      this.#filmListSortType = SortType.DEFAULT;
    }
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film, this.#filmsContainer));
  };

  #renderFilmList = () => {
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));
    this.#filmsListView = new FilmsListView();
    render(this.#filmsListView, this.#filmsListContainer, RenderPosition.AFTERBEGIN);
    this.#filmsContainer = this.#filmsListView.element.querySelector('.films-list__container');
    this.#renderFilms(films);
    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderBtnMore();
    }
  };

  #renderTopFilmList= () => {
    const films = this.#filmsModel.getTopRatedFilms();
    if (films.length === 0) {
      return;
    }
    this.#filmsTopView = new FilmsTopView();
    render(this.#filmsTopView, this.#filmsListContainer);
    this.#topFilmsContainer = this.#filmsTopView.element.querySelector('.films-list__container');
    films.forEach((film) => this.#renderFilm(film, this.#topFilmsContainer));
  };

  #renderDiscussFilmList = () => {
    const films = this.#filmsModel.getMostCommentedFilms();
    if (films.length === 0) {
      return;
    }
    this.#filmsDiscussView = new FilmsDiscussView();
    render(this.#filmsDiscussView, this.#filmsListContainer);
    this.#discussFilmsContainer = this.#filmsDiscussView.element.querySelector('.films-list__container');
    films.forEach((film) => this.#renderFilm(film, this.#discussFilmsContainer));
  };

  #handleBtnMoreClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount , newRenderedFilmCount);
    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;
    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#btnMoreView);
    }
  };

  #renderFilm = (film, container) => {
    const newFilmPresenter = new FilmPresenter(container, this.#handleViewAction, this.#handleModeChange);
    newFilmPresenter.init(film, this.#commentsModel);

    let presenters = this.#filmPresenter.get(film.id);
    if (presenters === undefined) {
      presenters = [];
    }
    presenters.push(newFilmPresenter);
    this.#filmPresenter.set(film.id, presenters);
  };

  #clearFilmPopup = () => {
    if(this.#openedFilmPresenter) {
      this.#openedFilmPresenter.popupClose();
      this.#openedFilmPresenter = null;
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach(
      (presenters) => presenters.forEach((presenter) => presenter.popupClose())
    );
    this.#clearFilmPopup();
  };

  #handleViewAction = (actionType, updateType, update) => {
    //console.log(actionType, updateType, update);

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_FILM:
        this.#filmsModel.addFilm(updateType, update);
        break;
      case UserAction.DELETE_FILM:
        this.#filmsModel.deleteFilm(updateType, update);
        break;
      case UserAction.UPDATE_COMMENT:
        this.#commentsModel.updateComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    //console.log(updateType, data);

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#filmPresenter
          .get(data.id)
          .forEach( (presenter) => presenter.init(data, this.#commentsModel));
        break;
      case UpdateType.MINOR:
        this.#clearStage();
        this.#renderStage();
        break;
      case UpdateType.MAJOR:
        this.#clearStage({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderStage();
        break;
    }
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
    this.#clearStage({resetRenderedFilmCount: true});
    this.#renderStage();
  };
}
