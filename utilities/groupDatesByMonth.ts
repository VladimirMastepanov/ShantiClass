const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const groupDatesByMonth = (dates: string[]) => {
  const grouped: Record<string, string[]> = {};

  dates.forEach((dateStr) => {
    const date = new Date(dateStr);

    const monthName = date.toLocaleString("ru-RU", { month: "long" });
    const yearShort = date.getFullYear().toString().slice(-2); // '25'
    const key = `${capitalizeFirstLetter(monthName)} ${yearShort}`;

    const day = String(date.getDate()).padStart(2, "0"); // '01'

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(day);
  });

  return grouped;
};