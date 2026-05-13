import { BarColor, FrameWithLine } from "./types";

export function recordBubbleSort(input: number[]): FrameWithLine[] {
  const array = [...input];
  const frames: FrameWithLine[] = [];
  let comparisons = 0;
  let swaps = 0;

  const pushFrame = (
    highlights: Record<number, BarColor>,
    message: string,
    activeLine: number
  ) => {
    frames.push({
      array: [...array],
      highlights,
      comparisons,
      swaps,
      message,
      activeLine
    });
  };

  const markAllSorted = () => {
    const sortedHighlights: Record<number, BarColor> = {};
    for (let i = 0; i < array.length; i += 1) {
      sortedHighlights[i] = "sorted";
    }
    return sortedHighlights;
  };

  pushFrame({}, "Starting array", 35);

  for (let i = 0; i < array.length; i += 1) {
    // Bubble the largest value to the end of the unsorted section.
    for (let j = 0; j < array.length - i - 1; j += 1) {
      comparisons += 1;
      pushFrame(
        { [j]: "comparing", [j + 1]: "comparing" },
        `Comparing indices ${j} and ${j + 1}`,
        47
      );

      if (array[j] > array[j + 1]) {
        swaps += 1;
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        pushFrame(
          { [j]: "swapping", [j + 1]: "swapping" },
          `Swapped indices ${j} and ${j + 1}`,
          49
        );
      }
    }

    const sortedIndex = array.length - i - 1;
    pushFrame(
      { [sortedIndex]: "sorted" },
      `Index ${sortedIndex} is in final position`,
        58
    );
  }

  // Guarantee final frame has perfectly sorted array
  const sortedArray = [...input].sort((a, b) => a - b);
  const finalFrame: FrameWithLine = {
    array: sortedArray,
    highlights: markAllSorted(),
    comparisons,
    swaps,
    message: "Array sorted",
    activeLine: 64
  };
  frames[frames.length - 1] = finalFrame;

  return frames;
}
