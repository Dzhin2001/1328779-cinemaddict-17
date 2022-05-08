import {render} from '../render.js';
import NavListView from '../view/nav-list-view';
import SortListView from '../view/sort-list-view';
import ButtonMoreView from '../view/button-more-view';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view';
import PopupView from '../view/popupView';

const onFilmsClick = () => {
  render(new PopupView(), document.body);
};

export default class FilmsPresenter {

  init (siteMainElement) {

    this.filmsListView = new FilmsListView();

    render(new NavListView(), siteMainElement);
    render(new SortListView(), siteMainElement);
    render(this.filmsListView, siteMainElement);

    this.buttonMoreElement = this.filmsListView.getElement();
    this.filmsContainer = this.filmsListView.getElement().querySelector('.films-list__container');

    render(new ButtonMoreView(), this.buttonMoreElement);

    for (let i = 0; i < 5; i++) {
      const filmsView = new FilmsView();
      render(filmsView, this.filmsContainer);
      filmsView.getElement().addEventListener('click',onFilmsClick);
    }

  }
}
