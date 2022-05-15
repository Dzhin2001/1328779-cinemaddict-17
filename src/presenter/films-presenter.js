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
  #film = null;
  #filmsListView = null;
  #filmsView = null
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
      this.#filmsView = new FilmView(film);
      render(this.#filmsView, this.#filmsContainer);
      this.#filmsView.element.addEventListener('click',this.#onPopupFilmClick);
    }

  }

  #popupClose() {
    document.removeEventListener('keydown', this.#onPopupEscKeyDown);
    document.body.classList.remove('hide-overflow');
    document.body.lastChild.remove();
  }

  #onPopupEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#popupClose();
    }
  };

  #onPopupBtnCloseClick = () => {
    this.#popupClose();
  };

  #onPopupFilmClick = (evt) => {
    const filmId = +evt.target.closest('article').id;
    const film = this.#filmsModel.getFilm(filmId);
    this.#popupView = new PopupView(film, this.#filmsModel.getComments(film));
    render(this.#popupView, document.body);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onPopupEscKeyDown);
    this.#btnClosePopup = this.#popupView.element.querySelector('.film-details__close-btn');
    this.#btnClosePopup.addEventListener('click',this.#onPopupBtnCloseClick);
  };

}
