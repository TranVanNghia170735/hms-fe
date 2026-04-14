const arrayToCSV = (arr: string[]) => {
   if (!arr || arr.length === 0) return "";
   return arr.join(",");
};

const capitalizeFirstLetter = (str: string) => {
   if (!str) return "";
   return str.charAt(0).toUpperCase() + str.slice(1)?.toLowerCase();
};

export { arrayToCSV, capitalizeFirstLetter };
