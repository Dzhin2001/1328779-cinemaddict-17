import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {

  init = (filmId) => (
    this._load({url: `comments/${filmId}`})
      .then(ApiService.parseResponse)
  );

  addComment = async (filmId, comment) => {
    const response = await this._load({
      url: `comments/${filmId}h`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  deleteComment = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}h`,
      method: Method.DELETE,
    });
    return response.status;
  };

  #adaptToServer = (comment) => {
    const adaptedComment = {
      ...comment,
      date: comment.date instanceof Date ? comment.date.toISOString() : null,
    };
    return adaptedComment;
  };
}
