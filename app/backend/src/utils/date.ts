import dayjs from 'dayjs';

export const calculateNights = (checkIn: Date, checkOut: Date) => {
  const inDate = dayjs(checkIn);
  const outDate = dayjs(checkOut);
  const diff = outDate.startOf('day').diff(inDate.startOf('day'), 'day');
  return diff > 0 ? diff : 1;
};

