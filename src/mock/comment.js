import {getRandomArrayElement, getRandomDate} from '../utils/random.js';
import {EMOTIONS} from '../const.js';
import dayjs  from 'dayjs';

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

const COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

let idComment = 841830;

const getIdComment = () => ++idComment;


const generateComment = () => ({
  id: getIdComment().toString(),
  author: getRandomArrayElement(NAMES),
  comment: getRandomArrayElement(COMMENTS),
  date: getRandomDate(dayjs().subtract(6, 'month')),
  emotion: getRandomArrayElement(EMOTIONS),
});

const generateComments = (commentsCount) => Array.from({length: commentsCount}, generateComment );

export {generateComments, generateComment, getIdComment};
