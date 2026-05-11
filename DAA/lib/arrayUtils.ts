export function generateRandomArray(
  size: number,
  min = 20,
  max = 260
): number[] {
  const array: number[] = [];
  for (let i = 0; i < size; i += 1) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    array.push(value);
  }
  return array;
}
