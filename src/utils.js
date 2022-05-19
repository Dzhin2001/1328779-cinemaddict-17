import dayjs  from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (elements) => (elements[getRandomInteger(0, elements.length - 1)]);

const getRandomDate = (dateFrom = dayjs('1900','YYYY'), dateTo = dayjs()) => (
  dateFrom.add(getRandomInteger(0, dateTo.diff(dateFrom, 'second')), 'second').toDate()
);

const getRandomPosNeg = () => (Math.random() - 0.5);
const getRandomBoolean = () => (getRandomPosNeg() < 0);

export {getRandomInteger, getRandomArrayElement, getRandomPosNeg, getRandomDate, getRandomBoolean};
