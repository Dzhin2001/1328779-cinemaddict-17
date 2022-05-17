import {render} from './render.js';
import AvatarView from './view/avatar-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter';
import {FILMS_COUNT, COMMENTS_COUNT} from './const.js';
import {generateFilms} from './mock/film.js';
import {generateComments} from './mock/comment.js';
import FilmModel from './model/films-model';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmModel(generateFilms(FILMS_COUNT, COMMENTS_COUNT), generateComments(COMMENTS_COUNT));
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel);

render(new AvatarView(), siteHeaderElement);
render(new StatisticsView(), siteFooterStatisticsElement);

filmsPresenter.init();
