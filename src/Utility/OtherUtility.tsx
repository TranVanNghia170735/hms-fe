const arrayToCSV = (arr: string[]) => {
   if (!arr || arr.length === 0) return "";
   return arr.join(",");
};

const capitalizeFirstLetter = (str: string) => {
   if (!str) return "";
   return str.charAt(0).toUpperCase() + str.slice(1)?.toLowerCase();
};

const addZeroMonths = (data: any[], monthKey: string, valueKey: string) => {
   const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];
   const result = months.map((month) => {
      const found = data.find((item) => item[monthKey] === month);
      return found ? found : { [monthKey]: month, [valueKey]: 0 };
   });
   return result;
};

const convertReasonChartData = (data: any[]) => {
   const colors = [
      "#4caf50",
      "#2196f3",
      "#ff9800",
      "#f44336",
      "#9c27b0",
      "#3f51b5",
      "#00bcd4",
      "#8bc34a",
      "#ffc107",
      "#e91e63",
   ];
   return data.map((item, index) => ({
      name: item.reason,
      value: item.count,
      color: colors[index % colors.length],
   }));
};
export { addZeroMonths, arrayToCSV, capitalizeFirstLetter, convertReasonChartData };
