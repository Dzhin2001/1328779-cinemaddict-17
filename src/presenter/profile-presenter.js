import AbstractView from '../framework/view/abstract-view.js';
import ProfileView from '../view/profile-view.js';
import { render, replace, remove } from '../framework/render.js';

const profileMap = {
  'novice': [0, 10],
  'fan': [11, 20],
  'Movie Buff': [21, Infinity]
};

export default class ProfilePresenter extends AbstractView {
  #profileContainer = null;
  #filmModel = null;
  #profileView = null;
  #watchedFilmsCount = null;
  #profileName = null;

  constructor (profileContainer, filmModel) {
    super();
    this.#profileContainer = profileContainer;
    this.#filmModel = filmModel;
  }

  init = () => {
    this.#watchedFilmsCount = this.#getWatchedFilmsCount(this.#filmModel.films);
    this.#profileName = this.#getProfileName(this.#watchedFilmsCount)[0];
    const prevProfileElement = this.#profileView;
    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#profileView = new ProfileView(this.#profileName);
    if (prevProfileElement === null) {
      render(this.#profileView, this.#profileContainer);
      return;
    }
    replace(this.#profileView, prevProfileElement);
    remove(prevProfileElement);
  };

  #getWatchedFilmsCount = (films) => (
    films.filter( (film) => film.userDetails.alreadyWatched ).length
  );

  #getProfileName = (length) => (
    Object.entries(profileMap)
      .filter(([, value]) => length >= value[0] && length <= value[1])
      .flat()
  );

  #handleModelEvent = () => {
    this.init();
  };
}
