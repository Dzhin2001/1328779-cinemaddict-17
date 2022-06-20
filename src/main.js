import {render} from './framework/render.js';
import FilmModel from './model/films-model';
import CommentModel from './model/comments-model';
import FilterModel from './model/filter-model.js';
import StatisticsView from './view/statistics-view.js';
import StagePresenter from './presenter/stage-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import ProfilePresenter from './presenter/profile-presenter.js';
import FilmsApiService from './films-api-service.js';
import CommentsApiService from './comments-api-service.js';

const AUTHORIZATION = 'Basic amigosjitaramba1';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentModel = new CommentModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const profilePresenter = new ProfilePresenter(siteHeaderElement, filmsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const stagePresenter = new StagePresenter(siteMainElement, filmsModel, commentModel, filterModel);

render(new StatisticsView(), siteFooterStatisticsElement);

profilePresenter.init();
filterPresenter.init();
stagePresenter.init();
filmsModel.init();
