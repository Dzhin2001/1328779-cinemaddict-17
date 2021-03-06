import AbstractView from '../framework/view/abstract-view.js';

const getNavItemCountTemplate = (filter) => `
        <span class="main-navigation__item-count">${filter.count}</span>
  `;

const getNavItemTemplate = (filter, currentFilterType) => `
    <a href="#"
        class="main-navigation__item ${filter.type===currentFilterType?'main-navigation__item--active':''}"
         data-filter-type="${filter.type}">
        ${filter.name}
        ${filter.type!=='all'? getNavItemCountTemplate(filter):''}
    </a>
  `;

const getNavListTemplate = (filters, currentFilterType) => `
  <nav class="main-navigation">
    ${filters.map((filter) => getNavItemTemplate(filter, currentFilterType)).join('')}
  </nav>
  `;

export default class NavListView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return getNavListTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };

}
