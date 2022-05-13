import {getRandomArrayElement, getRandomInteger, getRandomPosNeg, getRandomDate} from '../utils.js';

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

const generateComments = (comments) => {
  const {min, max} = COMMENT_COUNT;
  return [...Array(getRandomInteger(min, max))]
    .map( () => getRandomArrayElement(comments).idComment );
};

const generateGenres = () => {
  const {min, max} = GENRES_COUNT;
  return [...GENRES]
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

const generateFilm = (comments) => ({
  idFilm: getIdFilm(),
  title: getRandomArrayElement(TITLES),
  originalTitle: getRandomArrayElement(TITLES),
  cover: `./images/posters/${getRandomArrayElement(COVERS)}`,
  rating: getRandomInteger(1, 100)/10,
  director: getRandomArrayElement(NAMES),
  writer: getRandomArrayElement(NAMES),
  cast: getRandomArrayElement(NAMES),
  releaseDate: getRandomDate(1930),
  duration:  getDuration(getRandomInteger(1, 8)*15),
  country: getRandomArrayElement(COUNTRIES),
  genres: generateGenres(),
  description: generateDescription(),
  fullDescription: generateDescription(),
  ageRating: getRandomInteger(0, 18),
  comments: generateComments(comments),
});

const generateFilms = (filmCount, comments) => Array.from({length: filmCount}, () => generateFilm(comments) );

export {generateFilms};