import {render, replace, remove} from '../framework/render.js';
import NavListView from '../view/nav-list-view.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #mainContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #navListView = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#mainContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevNavListView = this.#navListView;

    this.#navListView = new NavListView(filters, this.#filterModel.filter);
    this.#navListView.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevNavListView === null) {
      render(this.#navListView, this.#mainContainer);
      return;
    }

    replace(this.#navListView, prevNavListView);
    remove(prevNavListView);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
