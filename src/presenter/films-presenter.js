import {render} from '../render.js';
import NavListView from '../view/nav-list-view';
import SortListView from '../view/sort-list-view';
import ButtonMoreView from '../view/button-more-view';
import FilmView from '../view/film-view.js';
import FilmsListView from '../view/films-list-view';
import PopupView from '../view/popupView';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsModel = null;
  #listFilms = null;
  #filmsListView = null;
  #filmsView = null;
  #btnMoreElement = null;
  #btnMoreView = null;
  #filmsContainer = null;
  #popupView = null;
  #btnClosePopup = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  init (siteMainElement, filmsModel) {

    this.#filmsModel = filmsModel;
    this.#listFilms = [...this.#filmsModel.films];

    this.#filmsListView = new FilmsListView();
    this.#btnMoreView = new ButtonMoreView();

    this.#btnMoreElement = this.#filmsListView.element;
    this.#filmsContainer = this.#filmsListView.element.querySelector('.films-list__container');

    render(new NavListView(), siteMainElement);
    render(new SortListView(), siteMainElement);
    render(this.#filmsListView, siteMainElement);

    for (let i=0; i <  Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#listFilms[i]);
    }

    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      render(this.#btnMoreView, this.#btnMoreElement);
      this.#btnMoreView.element.addEventListener('click',this.#onBtnMoreClick);
    }
  }

  #renderFilm = (film) => {
    this.#filmsView = new FilmView(film);
    render(this.#filmsView, this.#filmsContainer);
    this.#filmsView.element.addEventListener('click',this.#onPopupFilmClick);
  };

  #popupOpen = (film) => {
    this.#popupView = new PopupView(film, this.#filmsModel.getComments(film));
    render(this.#popupView, document.body);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onPopupEscKeyDown);
    this.#btnClosePopup = this.#popupView.element.querySelector('.film-details__close-btn');
    this.#btnClosePopup.addEventListener('click',this.#onPopupBtnCloseClick);
  };

  #popupClose() {
    document.removeEventListener('keydown', this.#onPopupEscKeyDown);
    document.body.classList.remove('hide-overflow');
    this.#popupView.element.remove();
  }

  #onPopupFilmClick = (evt) => {
    const filmId = +evt.target.closest('article').id;
    const film = this.#filmsModel.getFilm(filmId);
    this.#popupOpen(film);
  };

  #onPopupEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#popupClose();
    }
  };

  #onPopupBtnCloseClick = () => {
    this.#popupClose();
  };

  #onBtnMoreClick = (evt) => {
    evt.preventDefault();

    this.#listFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listFilms.length) {
      this.#btnMoreView.element.remove();
      this.#btnMoreView.removeElement();
    }
  };

}
