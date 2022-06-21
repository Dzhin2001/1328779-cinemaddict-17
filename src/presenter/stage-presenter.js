import {render, remove, RenderPosition} from '../framework/render.js';
import {sortByDateUp, sortByDateDown, sortByRatingUp, sortByRatingDown} from '../utils/film.js';
import {SortType, UserAction, UpdateType, FilterType} from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {filterAction} from '../utils/filter.js';
import SortListView from '../view/sort-list-view.js';
import ButtonMoreView from '../view/button-more-view.js';
import StageView from '../view/stage-view.js';
import EmptyListView from '../view/empty-list-view.js';
import LoadingView from '../view/loading-view.js';
import FilmsTopView from '../view/films-top-view.js';
import FilmsDiscussView from '../view/films-discuss-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmPresenter from '../presenter/film-presenter.js';

const FILM_COUNT_PER_STEP = 5;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class StagePresenter {
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmListSortType = SortType.DEFAULT;
  #filmListFilterType = FilterType.ALL;
  #isLoading = true;

  #filmPresenter = new Map();
  #openedFilmPresenter = null;

  #mainContainer = null;
  #filmsListContainer = null;
  #filmsContainer = null;
  #topFilmsContainer = null;
  #discussFilmsContainer = null;

  #sortListView = null;
  #emptyListView = null;
  #loadingView = new LoadingView();
  #filmsListView = null;
  #filmsTopView = null;
  #filmsDiscussView = null;
  #stageView = null;
  #btnMoreView = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(siteMainElement, filmsModel, commentsModel, filterModel) {
    this.#mainContainer = siteMainElement;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films () {
    this.#filmListFilterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filterAction[this.#filmListFilterType](films);

    switch (this.#filmListSortType) {
      case SortType.DATE_UP:
        return [...filteredFilms].sort(sortByDateUp);
      case SortType.DATE_DOWN:
        return [...filteredFilms].sort(sortByDateDown);
      case SortType.RATING_UP:
        return [...filteredFilms].sort(sortByRatingUp);
      case SortType.RATING_DOWN:
        return [...filteredFilms].sort(sortByRatingDown);
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

  #renderLoading = () => {
    render(this.#loadingView, this.#filmsListContainer);
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
    this.#renderStageContainer();
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const films = this.films;
    const filmCount = films.length;
    if (filmCount === 0) {
      this.#renderEmptyList();
      return;
    }
    remove(this.#stageView);
    this.#renderSortList();
    this.#renderStageContainer();
    this.#renderFilmList();
    this.#renderTopFilmList();
    this.#renderDiscussFilmList();
    if(this.#openedFilmPresenter) {
      this.#openedFilmPresenter.init(this.#filmsModel.films.filter((element) => element.id === this.#openedFilmPresenter.film.id)[0], this.#commentsModel);
    }
  };

  #clearStage = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;
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
    remove(this.#loadingView);
    remove(this.#btnMoreView);
    remove(this.#filmsListView);
    remove(this.#filmsTopView);
    remove(this.#filmsDiscussView);
    remove(this.#stageView);
    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }
    if (resetSortType) {
      this.#filmListSortType = SortType.DEFAULT;
    }
  };

  #clearFilmPopup = () => {
    if(this.#openedFilmPresenter) {
      this.#openedFilmPresenter.popupClose();
      this.#openedFilmPresenter = null;
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

  #setSortType = (newSortType) => {
    if (newSortType === SortType.DATE_UP && this.#filmListSortType === SortType.DATE_UP) {
      this.#filmListSortType = SortType.DATE_DOWN;
    } else if (newSortType === SortType.RATING_UP && this.#filmListSortType === SortType.RATING_UP) {
      this.#filmListSortType = SortType.RATING_DOWN;
    } else {
      this.#filmListSortType = newSortType;
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach(
      (presenters) => presenters.forEach((presenter) => presenter.popupClose())
    );
    this.#clearFilmPopup();
  };

  #handleViewAction = (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update)
          .catch(() => {
            if (this.#openedFilmPresenter) {
              this.#openedFilmPresenter.setAbortingPopup();
              this.#filmPresenter
                .get(update.id)
                .forEach((presenter) => presenter.setAbortingCardNoShake());
            } else {
              this.#filmPresenter
                .get(update.id)
                .forEach((presenter) => presenter.setAbortingCard());
            }
          });
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update)
          .then(({data, cb}) => {
            this.#filmsModel.updateLocalFilm(data);
            cb();
          })
          .catch(() => {
            this.#openedFilmPresenter.setAbortingPopup();
          });
        break;

      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update)
          .then(({cb}) => {
            const data = {
              film: update.film,
              filmExternal: null,
            };
            this.#filmsModel.updateLocalFilm(data);
            cb();
          })
          .catch(() => {
            this.#openedFilmPresenter.setAbortingPopup();
          });
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingView);
        remove(this.#stageView);
        this.#renderStage();
        break;
      case UpdateType.POPUP:
        if (!this.#openedFilmPresenter) {
          this.#openedFilmPresenter = [].concat(...Array.from(this.#filmPresenter.values())).filter((presenter) => presenter.isOpenPopup())[0];
        }
        this.#openedFilmPresenter.initPopup();
        break;
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
}
