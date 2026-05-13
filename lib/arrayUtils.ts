export function generateRandomArray(
  size: number
): number[] {
  const array = Array.from({ length: size }, (_, index) => index + 1);

  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }

  return array;
}
