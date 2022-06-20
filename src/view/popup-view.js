import he from 'he';
import dayjs  from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const defautShakeClassListName = '.film-details__controls';

const dateComment = (date) => {
  const dayjs1 = dayjs(date);
  const days =  Math.abs(dayjs().diff(dayjs1,'day'));
  if( days === 0 ) {
    return 'Today';
  }
  if( days < 10 ) {
    return `${days} days ago`;
  }
  return dayjs1.format('DD/MM/YYYY hh:mm');
};

const popupDetailsControls = (userDetails, isDisabled) => `
      <section class="film-details__controls">
        <button
            type="button"
            class="film-details__control-button ${userDetails.watchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist"
            id="watchlist"
            name="watchlist"
            ${isDisabled ? ' disabled' : ''}
        >Add to watchlist</button>
        <button
            type="button"
            class="film-details__control-button ${userDetails.alreadyWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched"
            id="watched"
            name="watched"
            ${isDisabled ? ' disabled' : ''}
        >Already watched</button>
        <button
            type="button"
            class="film-details__control-button ${userDetails.favorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite"
            id="favorite"
            name="favorite"
            ${isDisabled ? ' disabled' : ''}
        >Add to favorites</button>
      </section>
`;

const getEmotion = (emotion) => (emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">` : '');

const popupNewComment = (comment, emotion, isDisabled) => `
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
              ${getEmotion(emotion)}
          </div>

          <label class="film-details__comment-label">
            <textarea
                class="film-details__comment-input"
                placeholder="Select reaction below and write comment here"
                name="comment"
                ${isDisabled ? ' disabled' : ''}
            >${comment ? he.encode(comment) : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input
                class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"
                ${emotion === 'smile' ? 'checked' : ''}
                ${isDisabled ? ' disabled' : ''}
            >
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input
                class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"
                ${emotion === 'sleeping' ? 'checked' : ''}
                ${isDisabled ? ' disabled' : ''}
            >
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input
                class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke"
                ${emotion === 'puke' ? 'checked' : ''}
                ${isDisabled ? ' disabled' : ''}
            >
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input
                class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"
                ${emotion === 'angry' ? 'checked' : ''}
                ${isDisabled ? ' disabled' : ''}
            >
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
`;

const popupComment = (comment, isDisabled, deletingCommentId) => `
          <li class="film-details__comment" id="commentId${comment.id}">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${dateComment(comment.date)}</span>
                <button
                    class="film-details__comment-delete"
                    data-comment-id="${comment.id}"
                    ${isDisabled ? ' disabled' : ''}
                >
                    ${comment.id===deletingCommentId ? 'Deleting...' :'Delete'}
                </button>
              </p>
            </div>
          </li>
`;

const popupComments = (comments, isDisabled, deletingCommentId) => [...comments]
  .map((comment) => popupComment(comment, isDisabled, deletingCommentId))
  .join('');

const popupGenres = (genres) => [...genres]
  .map((e) => `<span class="film-details__genre">${e}</span>`)
  .join('');

const popupNames = (names) => names.join(', ');

const popupTemplate = (_state) => `
<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${_state.poster}" alt="">

          <p class="film-details__age">${_state.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${_state.title}</h3>
              <p class="film-details__title-original">${_state.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${_state.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${_state.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${popupNames(_state.writers)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${popupNames(_state.actors)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(_state.release.date).format('DD MMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${_state.runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${_state.release.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${popupGenres(_state.genre)}
                </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${_state.description}
          </p>
        </div>
      </div>

      ${popupDetailsControls(_state.userDetails, _state.isDisabled)}
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${_state.comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${popupComments(_state.comments, _state.isDisabled ,_state.deletingCommentId )}
        </ul>

        ${popupNewComment(_state.newComment,_state.newEmotion, _state.isDisabled)}
      </section>
    </div>
  </form>
</section>
  `;

export default class PopupView extends AbstractStatefulView {
  _state = null;

  constructor(film, comments, prevScrollTop) {
    super();
    this._state = PopupView.parseFilmToState(film, comments);
    this.prevScrollTop = prevScrollTop;
    this.#setInnerHandlers();
  }

  static parseFilmToState = (film, comments) => (
    {
      ...film,
      comments,
      newComment: null,
      newEmotion: null,
      ...PopupView.initStateAddon(),
    });

  static initStateAddon = () => (
    {
      isDisabled: false,
      deletingCommentId: false,
      shakeClassName: defautShakeClassListName,
    });

  static parseStateToFilm = (state) => {
    const comments = state.comments.map((e) => e.id);
    const film = {...state, comments};
    delete film.newComment;
    delete film.newEmotion;
    delete film.isDisabled;
    delete film.deletingCommentId;
    delete film.shakeClassName;
    let updateCommentData = null;
    if ((state.newComment || '').length > 0 && state.newEmotion) {
      updateCommentData = {
        comment: state.newComment,
        date: new Date(),
        emotion: state.newEmotion,
      };
    }
    return {film, updateCommentData};
  };

  get template() {
    return popupTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setCloseClickHandler(this._callback.btnCloseClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
    this.setCommentDeleteHandler(this._callback.deleteCommentClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.#setInnerHandlers();
    this.restoreScroll();
  };

  #setInnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-item')
      .forEach((e) => e.addEventListener('click', this.#emojiItemHandler));
    this.element
      .querySelectorAll('.film-details__comment-delete')
      .forEach((e) => e.addEventListener('click', this.#deleteCommentHandler));
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#onCtrlEnterDown);
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#btnCloseClickHandler);
    this.element
      .querySelector('#watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element
      .querySelector('#watched')
      .addEventListener('click', this.#watchedClickHandler);
    this.element
      .querySelector('#favorite')
      .addEventListener('click', this.#favoritesClickHandler);
  };

  setCloseClickHandler = (callback) => {
    this._callback.btnCloseClick = callback;
  };

  #btnCloseClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.btnCloseClick();
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.prevScrollTop = this.element.scrollTop;
    this.updateElement({
      isDisabled: true,
      shakeClassName: '.film-details__controls',
    });
    this._callback.watchlistClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.prevScrollTop = this.element.scrollTop;
    this.updateElement({
      isDisabled: true,
      shakeClassName: '.film-details__controls',
    });
    this._callback.watchedClick();

  };

  setFavoritesClickHandler = (callback) => {
    this._callback.favoritesClick = callback;
  };

  #favoritesClickHandler = (evt) => {
    evt.preventDefault();
    this.prevScrollTop = this.element.scrollTop;
    this.updateElement({
      isDisabled: true,
      shakeClassName: '.film-details__controls',
    });
    this._callback.favoritesClick();

  };

  setCommentDeleteHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
  };

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    this.prevScrollTop = this.element.scrollTop;
    this.updateElement({
      isDisabled: true,
      deletingCommentId: evt.target.dataset.commentId,
      shakeClassName: `#commentId${evt.target.dataset.commentId}`,
    });
    this._callback.deleteCommentClick(this._state.deletingCommentId);
  };


  #emojiItemHandler = (evt) => {
    evt.preventDefault();
    this.prevScrollTop = this.element.scrollTop;
    this.updateElement({
      newEmotion: evt.target.value,
    });
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      newComment: evt.target.value,
    });
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
  };

  #onCtrlEnterDown = (evt) => {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      this.prevScrollTop = this.element.scrollTop;
      this.updateElement({
        isDisabled: true,
        shakeClassName: '.film-details__new-comment',
      });
      this._callback.formSubmit(
        PopupView.parseStateToFilm(this._state).updateCommentData
      );
    }
  };

  restoreScroll = () => {
    this.element.scrollTop = this.prevScrollTop;
  };

}
