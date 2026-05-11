import { BarColor, FrameWithLine } from "./types";

export function recordBubbleSort(input: number[]): FrameWithLine[] {
  const array = [...input];
  const frames: FrameWithLine[] = [];
  let comparisons = 0;
  let swaps = 0;

  const pushFrame = (
    highlights: Record<number, BarColor>,
    message: string,
    line?: number
  ) => {
    frames.push({
      array: [...array],
      highlights,
      comparisons,
      swaps,
      message,
      line
    });
  };

  const markAllSorted = () => {
    const sortedHighlights: Record<number, BarColor> = {};
    for (let i = 0; i < array.length; i += 1) {
      sortedHighlights[i] = "sorted";
    }
    return sortedHighlights;
  };

  pushFrame({}, "Starting array", 32);

  for (let i = 0; i < array.length; i += 1) {
    // Bubble the largest value to the end of the unsorted section.
    for (let j = 0; j < array.length - i - 1; j += 1) {
      comparisons += 1;
      pushFrame(
        { [j]: "comparing", [j + 1]: "comparing" },
        `Comparing indices ${j} and ${j + 1}`,
        37
      );

      if (array[j] > array[j + 1]) {
        swaps += 1;
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        pushFrame(
          { [j]: "swapping", [j + 1]: "swapping" },
          `Swapped indices ${j} and ${j + 1}`,
          45
        );
      }
    }

    const sortedIndex = array.length - i - 1;
    pushFrame(
      { [sortedIndex]: "sorted" },
      `Index ${sortedIndex} is in final position`,
      55
    );
  }

  pushFrame(markAllSorted(), "Array sorted", 63);

  return frames;
}
