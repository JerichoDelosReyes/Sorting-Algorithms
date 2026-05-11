import { BarColor, FrameWithLine } from "./types";

export function recordMergeSort(input: number[]): FrameWithLine[] {
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

  const merge = (left: number, mid: number, right: number) => {
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    pushFrame(
      { [left]: "pivot", [right]: "pivot" },
      `Merging range ${left}-${right}`,
      37
    );

    while (i <= mid && j <= right) {
      comparisons += 1;
      pushFrame(
        { [i]: "comparing", [j]: "comparing" },
        `Comparing indices ${i} and ${j}`,
        44
      );
      if (array[i] <= array[j]) {
        temp.push(array[i]);
        i += 1;
      } else {
        temp.push(array[j]);
        j += 1;
      }
    }

    while (i <= mid) {
      temp.push(array[i]);
      i += 1;
    }

    while (j <= right) {
      temp.push(array[j]);
      j += 1;
    }

    for (let k = 0; k < temp.length; k += 1) {
      swaps += 1;
      array[left + k] = temp[k];
      pushFrame(
        { [left + k]: "merging" },
        `Writing index ${left + k}`,
        70
      );
    }
  };

  const sort = (left: number, right: number) => {
    if (left >= right) {
      return;
    }
    const mid = Math.floor((left + right) / 2);
    // Divide the array and merge the halves.
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  };

  pushFrame({}, "Starting array", 91);
  sort(0, array.length - 1);
  pushFrame(markAllSorted(), "Array sorted", 93);

  return frames;
}
