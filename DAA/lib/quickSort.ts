import { BarColor, FrameWithLine } from "./types";

export function recordQuickSort(input: number[]): FrameWithLine[] {
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

  const partition = (low: number, high: number) => {
    const pivot = array[high];
    let i = low;

    pushFrame(
      { [high]: "pivot" },
      `Pivot at index ${high}`,
      36
    );

    for (let j = low; j < high; j += 1) {
      comparisons += 1;
      pushFrame(
        { [j]: "comparing", [high]: "pivot" },
        `Comparing index ${j} to pivot`,
        43
      );
      if (array[j] < pivot) {
        swaps += 1;
        [array[i], array[j]] = [array[j], array[i]];
        pushFrame(
          { [i]: "swapping", [j]: "swapping" },
          `Swapped indices ${i} and ${j}`,
          50
        );
        i += 1;
      }
    }

    swaps += 1;
    [array[i], array[high]] = [array[high], array[i]];
    pushFrame(
      { [i]: "swapping", [high]: "swapping" },
      `Moved pivot to index ${i}`,
      61
    );
    pushFrame(
      { [i]: "sorted" },
      `Pivot fixed at index ${i}`,
      62
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

  pushFrame({}, "Starting array", 87);
  sort(0, array.length - 1);
  pushFrame(markAllSorted(), "Array sorted", 89);

  return frames;
}
