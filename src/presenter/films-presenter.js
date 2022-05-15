import {render} from '../render.js';
import NavListView from '../view/nav-list-view';
import SortListView from '../view/sort-list-view';
import ButtonMoreView from '../view/button-more-view';
import FilmView from '../view/film-view.js';
import FilmsListView from '../view/films-list-view';
import PopupView from '../view/popupView';

export default class FilmsPresenter {
  #filmsModel = null;
  #listFilms = null;
  #filmsListView = null;
  #buttonMoreElement = null;
  #filmsContainer = null;
  #popupView = null;
  #btnClosePopup = null;

  init (siteMainElement, filmsModel) {

    this.#filmsModel = filmsModel;
    this.#listFilms = [...this.#filmsModel.films];

    this.#filmsListView = new FilmsListView();

    render(new NavListView(), siteMainElement);
    render(new SortListView(), siteMainElement);
    render(this.#filmsListView, siteMainElement);

    this.#buttonMoreElement = this.#filmsListView.element;
    this.#filmsContainer = this.#filmsListView.element.querySelector('.films-list__container');

    render(new ButtonMoreView(), this.#buttonMoreElement);

    for (const film of this.#listFilms) {
      const filmsView = new FilmView(film);
      render(filmsView, this.#filmsContainer);

      const onEscKeyDown = (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          document.removeEventListener('keydown', onEscKeyDown);
          document.body.classList.remove('hide-overflow');
          document.body.lastChild.remove();
        }
      };

      const onBtnCloseClick = () => {
        document.removeEventListener('keydown', onEscKeyDown);
        document.body.classList.remove('hide-overflow');
        document.body.lastChild.remove();
      };

      const onFilmsClick = () => {
        document.body.classList.add('hide-overflow');
        this.#popupView = new PopupView(film, this.#filmsModel.getComments(film));
        render(this.#popupView, document.body);
        this.#btnClosePopup = document.body.querySelector('.film-details__close-btn');
        this.#btnClosePopup.addEventListener('click',onBtnCloseClick);
        document.addEventListener('keydown', onEscKeyDown);
      };

      filmsView.element.addEventListener('click',onFilmsClick);
    }

  }
}
