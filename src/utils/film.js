import dayjs from 'dayjs';

const sortByCommentedUp = (film1, film2) => (film2.comments.length - film1.comments.length);

const sortByDateUp = (film1, film2) => (dayjs(film2.release.date).diff(dayjs(film1.release.date),'seconds'));

const sortByDateDown = (film1, film2) => ((-1) * sortByDateUp(film1, film2));

const sortByRatingUp = (film1, film2) => (film2.totalRating - film1.totalRating);

const sortByRatingDown = (film1, film2) => ((-1) * sortByRatingUp(film1, film2));

export {
  sortByCommentedUp,
  sortByDateUp,
  sortByDateDown,
  sortByRatingUp,
  sortByRatingDown,
};
