export type Algorithm = "bubble" | "merge" | "quick";

export type BarColor =
  | "default"
  | "comparing"
  | "swapping"
  | "pivot"
  | "merging"
  | "sorted";

export interface Frame {
  array: number[];
  highlights: Record<number, BarColor>;
  comparisons: number;
  swaps: number;
  message: string;
}

export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface AlgorithmInfo {
  id: Algorithm;
  name: string;
  slug: string;
  complexity: ComplexityInfo;
  description: string;
  useCases: string;
  stable: boolean;
  code: string;
  shortDescription: string;
}

export interface FrameWithLine extends Frame {
  line?: number;
}
