import {render} from './render.js';
import AvatarView from './view/avatar-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter';
import FilmModel from './model/films-model';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmModel();
const filmsPresenter = new FilmsPresenter();

render(new AvatarView(), siteHeaderElement);
render(new StatisticsView(), siteFooterStatisticsElement);

filmsPresenter.init(siteMainElement, filmsModel);
