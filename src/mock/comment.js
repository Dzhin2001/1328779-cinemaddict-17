import {getRandomArrayElement, getRandomDate, getRandomInteger} from '../utils.js';
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

let idComment = 0;

const getIdComment = () => ++idComment;


const generateComment = () => ({
  idComment: getIdComment(),
  comment: getRandomArrayElement(COMMENTS),
  author: getRandomArrayElement(NAMES),
  datetime: getRandomDate(dayjs().format('YYYY'))
});

export const generateComments = (commentsCount) => Array.from({length: commentsCount}, generateComment );