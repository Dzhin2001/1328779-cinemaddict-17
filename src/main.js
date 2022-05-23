import {render} from './framework/render.js';
import {generateFilms} from './mock/film.js';
import {generateComments} from './mock/comment.js';
import {FILMS_COUNT, COMMENTS_COUNT} from './const.js';
import FilmModel from './model/films-model';
import AvatarView from './view/avatar-view.js';
import StatisticsView from './view/statistics-view.js';
import StagePresenter from './presenter/stage-presenter';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmModel(generateFilms(FILMS_COUNT, COMMENTS_COUNT), generateComments(COMMENTS_COUNT));
const stagePresenter = new StagePresenter(siteMainElement, filmsModel);

render(new AvatarView(), siteHeaderElement);
render(new StatisticsView(), siteFooterStatisticsElement);

stagePresenter.init();
