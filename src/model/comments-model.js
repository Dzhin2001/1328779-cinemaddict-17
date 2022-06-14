
export default class CommentModel  {
  #comments = null;

  constructor(comments) {
    this.#comments = comments;
  }

  get comments() {
    return this.#comments;
  }

  getComments(commentIdList) {
    return [...commentIdList].map((id) => this.#comments.find( (comment) => comment.id === id));
  }

  updateComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      update,
      ...this.#comments.slice(index + 1),
    ];

  };

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

  };

}
