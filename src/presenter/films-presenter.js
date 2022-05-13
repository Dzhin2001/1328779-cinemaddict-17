import {render} from '../render.js';
import NavListView from '../view/nav-list-view';
import SortListView from '../view/sort-list-view';
import ButtonMoreView from '../view/button-more-view';
import FilmView from '../view/film-view.js';
import FilmsListView from '../view/films-list-view';
import PopupView from '../view/popupView';

export default class FilmsPresenter {

  init (siteMainElement, filmsModel) {


    this.filmsModel = filmsModel;
    this.listFilms = [...this.filmsModel.films];

    this.filmsListView = new FilmsListView();

    render(new NavListView(), siteMainElement);
    render(new SortListView(), siteMainElement);
    render(this.filmsListView, siteMainElement);

    this.buttonMoreElement = this.filmsListView.getElement();
    this.filmsContainer = this.filmsListView.getElement().querySelector('.films-list__container');

    render(new ButtonMoreView(), this.buttonMoreElement);

    for (const film of this.listFilms) {
      const filmsView = new FilmView(film);
      render(filmsView, this.filmsContainer);

      const onFilmsClick = () => {
        render(new PopupView(film,this.filmsModel.getComments(film)), document.body);
      };

      filmsView.getElement().addEventListener('click',onFilmsClick);
    }

  }
}
