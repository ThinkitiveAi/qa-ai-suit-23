export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRandomDOB() {
  const startYear = 1960;
  const endYear = 2005;
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
}
