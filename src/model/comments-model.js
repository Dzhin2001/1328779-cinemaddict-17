import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class CommentModel extends Observable {
  #comments = [];
  #commentsApiService = null;

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  init = async (filmId) => {
    this.#comments = [];
    try {
      const comments = await this.#commentsApiService.init(filmId);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      throw new Error(err.message);
    }
    this._notify(UpdateType.POPUP);
  };

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {
      ...comment,
      date: comment.date !== null ? new Date(comment.date) : null,
    };

    // Ненужные ключи мы удаляем
    return adaptedComment;
  };

  addComment = async (updateType, update) => {
    let data = null;
    try {
      const response = await this.#commentsApiService.addComment(update.filmId, update.comment);
      this.comments = response.comments;
      data = {
        film: null,
        filmExternal: response.movie,
      };
      return {data, cb: () => this._notify(updateType)};
    } catch(err) {
      throw new Error(err.message);
    }
  };

  deleteComment = async (updateType, update) => {
    try {
      await this.#commentsApiService.deleteComment(update.commentId);
      return {cb: () => this._notify(updateType)};
    } catch(err) {
      throw new Error(err.message);
    }
  };

}
