import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FilmApiService extends ApiService {

  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {
      id: film.id,
      comments: film.comments,
      'film_info':{
        actors: film.actors,
        'age_rating': film.ageRating,
        'alternative_title': film.alternativeTitle,
        description: film.description,
        director: film.director,
        genre: film.genre,
        poster: film.poster,
        release: {
          date: film.release.date instanceof Date ? film.release.date.toISOString() : null,
          'release_country': film.release.releaseCountry,
        },
        runtime: film.runtime,
        title: film.title,
        'total_rating': film.totalRating,
        writers: film.writers,
      },
      'user_details': {
        'already_watched': film.userDetails.alreadyWatched,
        favorite: film.userDetails.favorite,
        'watching_date': film.userDetails.watchingDate instanceof Date ? film.userDetails.watchingDate.toISOString() : null,
        watchlist: film.userDetails.watchlist,
      }
    };

    return adaptedFilm;
  };
}
