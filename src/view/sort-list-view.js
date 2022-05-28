import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

const sortListTemplate = () => `
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE_UP}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING_UP}">Sort by rating</a></li>
  </ul>
  `;

export default class SortListView extends AbstractView {
  get template() {
    return sortListTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#setSortTypeChangeHandler );
  };

  #setSortTypeChangeHandler  = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
