
export const dateToYYMMDD = (dateString: string) => {
  try {
    // Предполагаем, что dateString может быть полной ISO строкой или YYYY-MM-DD
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    if (year && month && day && year.length >= 4) {
      return `${year.slice(-2)}-${month}-${day}`; // Возвращает YY-MM-DD
    }
  } catch (e) {
    console.error("Error in dateToYYMMDD with input:", dateString, e);
  }
  // Возвращаем исходную строку или ее часть в случае ошибки или неверного формата
  return dateString.split("T")[0]; // Возвращаем хотя бы дату YYYY-MM-DD
};

export const normolizeDate = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Месяцы UTC от 0 до 11
  const day = date.getUTCDate().toString().padStart(2, "0"); // День UTC

  return `${year}-${month}-${day}`;
};

export const normolizeDateType = (str: string) => {
  const datePart = str.split('T')[0];
  return new Date(datePart + "T00:00:00Z");
}

export const normolizeDateForStatistic = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};