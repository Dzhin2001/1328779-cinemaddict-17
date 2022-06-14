import {render} from './framework/render.js';
import {generateFilms} from './mock/film.js';
import {generateComments} from './mock/comment.js';
import {FILMS_COUNT, COMMENTS_COUNT} from './const.js';
import FilmModel from './model/films-model';
import CommentModel from './model/comments-model';
import FilterModel from './model/filter-model.js';
import AvatarView from './view/avatar-view.js';
import StatisticsView from './view/statistics-view.js';
import StagePresenter from './presenter/stage-presenter';
import FilterPresenter from './presenter/filter-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmModel(generateFilms(FILMS_COUNT, COMMENTS_COUNT));
const commentModel =new CommentModel(generateComments(COMMENTS_COUNT));
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const stagePresenter = new StagePresenter(siteMainElement, filmsModel, commentModel, filterModel);

render(new AvatarView(), siteHeaderElement);
render(new StatisticsView(), siteFooterStatisticsElement);

filterPresenter.init();
stagePresenter.init();
