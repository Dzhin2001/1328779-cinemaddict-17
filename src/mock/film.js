import {getRandomArrayElement, getRandomInteger, getRandomPosNeg, getRandomDate, getRandomBoolean} from '../utils.js';
import dayjs  from 'dayjs';

const DESCRIPTION_COUNT = {
  min: 1,
  max: 5
};

const COMMENT_COUNT = {
  min: 1,
  max: 20
};

const GENRES_COUNT = {
  min: 1,
  max: 3
};

const NAMES_COUNT = {
  min: 1,
  max: 3
};

const NAMES = [
  'Арсен',
  'Ринат',
  'Аврора',
  'Аделаида',
  'Коловарот',
  'Алан',
  'Кеша',
  'Драздаперма',
  'Рикардо',
  'Анатолий',
  'Кенни',
  'Васька'
];

const GENRES = [
  'Боевик',
  'Вестерн',
  'Гангстерский фильм',
  'Детектив',
  'Драма',
  'Исторический фильм',
  'Комедия',
  'Мелодрама'
];

const COUNTRIES = [
  'Россия',
  'Канада',
  'США',
  'Китай',
  'Бразилия',
  'Австралия',
  'Индия',
  'Аргентина',
  'Казахстан',
  'Алжир',
  'Конго',
  'Гренландия',
  'Саудовская Аравия',
  'Мексика',
];

const COVERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const TITLES = [
  'Made for each other',
  'Popeye meets sinbad',
  'Sagebrush trail',
  'Santa claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm',
  'Крепкий орешек 4',
  '2049 продолжение',
  'Любовь и голуби 2',
  'Семейка Адамс (музикл)',
  'Годзила против',
  'Кладбище домашних животных переезжает',
  'Космос (10 сезон)',
  'Шрек выходит из запоя',
  'Тимур и его командос',
  'Терминатор',
  'Семнадцать мгновений мечты',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
  'Музей в Питере',
  'Фонтан и монета на счастье.',
  'Мария на пляже в Абхазии.',
  'Сплав на байдарках.',
  'Виктор и его коллекция колокольчиков.',
  'Камчатские вулканы.',
  'Леонид на своем первом мальчишнике.',
  'Студент спит, пара идет.',
  'Просто портрет.'
];

let idFilm = 0;

const getIdFilm = () => ++idFilm;

const generateDescription = () => {
  const {min, max} = DESCRIPTION_COUNT;
  return [...Array(getRandomInteger(min, max))]
    .map( () => getRandomArrayElement(DESCRIPTIONS) )
    .join(' ');
};

const generateComments = (commentsCount) => {
  const {min, max} = COMMENT_COUNT;
  return [...Array(getRandomInteger(min, max))]
    .map( () => getRandomInteger(1, commentsCount) );
};

const generateGenres = () => {
  const {min, max} = GENRES_COUNT;
  return [...GENRES]
    .sort(() => (getRandomPosNeg()))
    .slice(0, getRandomInteger(min, max));
};

const generateNames = () => {
  const {min, max} = NAMES_COUNT;
  return [...NAMES]
    .sort(() => (getRandomPosNeg()))
    .slice(0, getRandomInteger(min, max));
};

const getDuration = (minutes) => {
  const duration = {
    hours : Math.round(minutes/60),
    minutes : minutes % 60,
  };
  return (duration.hours ? `${duration.hours}h ` : '')  + (duration.minutes ? `${duration.minutes}m` : '');
};

const generateFilm = (commentsCount) => ({
  id: getIdFilm(),
  comments: generateComments(commentsCount),
  title: getRandomArrayElement(TITLES),
  alternativeTitle: getRandomArrayElement(TITLES),
  totalRating: getRandomInteger(1, 100)/10,
  poster: `./images/posters/${getRandomArrayElement(COVERS)}`,
  ageRating: getRandomInteger(0, 18),
  director: getRandomArrayElement(NAMES),
  writers: generateNames(),
  actors: generateNames(),
  release: {
    date: getRandomDate(dayjs('1930','YYYY')),
    releaseCountry: getRandomArrayElement(COUNTRIES),
  },
  runtime:  getDuration(getRandomInteger(1, 8)*15),
  genre: generateGenres(),
  description: generateDescription(),
  userDetails: {
    watchlist: getRandomBoolean(),
    alreadyWatched: getRandomBoolean(),
    watchingDate: getRandomDate(dayjs().subtract(12, 'month')),
    favorite: getRandomBoolean(),
  },
});

const generateFilms = (filmsCount, commentsCount) => Array.from({length: filmsCount}, () => generateFilm(commentsCount) );

export {generateFilms};
