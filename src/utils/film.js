import dayjs from "dayjs";

const sortByCommentedUp = (film1, film2) => {
  if (film1.comments.length < film2.comments.length) {
    return 1;
  } else if (film1.comments.length > film2.comments.length) {
    return -1;
  } else {
    return 0;
  }
};

const sortByCommentedDown = (film1, film2) => ((-1) * sortByCommentedUp(film1, film2));

const sortByDateUp = (film1, film2) => {
  const date1 = dayjs(film1.release.date);
  const date2 = dayjs(film2.release.date);
  if (date1.isBefore(date2)) {
    return 1;
  } else if (date1.isAfter(date2)) {
    return -1;
  } else {
    return 0;
  }
};

const sortByDateDown = (film1, film2) => ((-1) * sortByDateUp(film1, film2));

const sortByRatingUp = (film1, film2) => {
  if (film1.totalRating < film2.totalRating) {
    return 1;
  } else if (film1.totalRating > film2.totalRating) {
    return -1;
  } else {
    return 0;
  }
};

const sortByRatingDown = (film1, film2) => ((-1) * sortByRatingUp(film1, film2));

export {
  sortByCommentedUp,
  sortByCommentedDown,
  sortByDateUp,
  sortByDateDown,
  sortByRatingUp,
  sortByRatingDown,
};
