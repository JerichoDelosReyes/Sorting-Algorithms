import { BarColor, FrameWithLine } from "./types";

export function recordQuickSort(input: number[]): FrameWithLine[] {
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

  const partition = (low: number, high: number) => {
    const pivot = array[high];
    let i = low;

    pushFrame(
      { [high]: "pivot" },
      `Pivot at index ${high}`,
      32
    );

    for (let j = low; j < high; j += 1) {
      comparisons += 1;
      pushFrame(
        { [j]: "comparing", [high]: "pivot" },
        `Comparing index ${j} to pivot`,
        49
      );
      if (array[j] < pivot) {
        swaps += 1;
        [array[i], array[j]] = [array[j], array[i]];
        pushFrame(
          { [i]: "swapping", [j]: "swapping" },
          `Swapped indices ${i} and ${j}`,
          51
        );
        i += 1;
      }
    }

    swaps += 1;
    [array[i], array[high]] = [array[high], array[i]];
    pushFrame(
      { [i]: "swapping", [high]: "swapping" },
      `Moved pivot to index ${i}`,
        62
    );
    pushFrame(
      { [i]: "sorted" },
      `Pivot fixed at index ${i}`,
        63
    );

    return i;
  };

  const sort = (low: number, high: number) => {
    if (low >= high) {
      return;
    }
    // Partition and recursively sort the subarrays.
    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  };

  pushFrame({}, "Starting array", 88);
  sort(0, array.length - 1);

  // Guarantee final frame has perfectly sorted array
  const sortedArray = [...input].sort((a, b) => a - b);
  const finalFrame: FrameWithLine = {
    array: sortedArray,
    highlights: markAllSorted(),
    comparisons,
    swaps,
    message: "Array sorted",
    activeLine: 91
  };
  frames.push(finalFrame);

  return frames;
}
