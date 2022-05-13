import dayjs  from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (elements) => (elements[getRandomInteger(0, elements.length - 1)]);

const getRandomDate = (yearMin, yearMax = new Date().getFullYear()) => new Date(
  getRandomInteger(yearMin, yearMax),
  getRandomInteger(0,11),
  getRandomInteger(0,31),
  getRandomInteger(0,23),
  getRandomInteger(0,59),
  getRandomInteger(0,59),
  getRandomInteger(0,999)
);

const getRandomPosNeg = () => (Math.random() - 0.5);

export {getRandomInteger, getRandomArrayElement, getRandomPosNeg, getRandomDate};
