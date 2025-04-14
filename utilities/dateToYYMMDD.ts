export const dateToYYMMDD = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${year.slice(2)}-${month}-${day}`;
};
