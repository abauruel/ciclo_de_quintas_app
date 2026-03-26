/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KeyData {
  root: string;
  major: string[]; // I, IV, V
  minor: string[]; // ii, iii, vi
  diminished: string; // vii°
}

export const CIRCLE_OF_FIFTHS = [
  "C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"
];

// Data for the 3 rings on the wheel
export const getRingData = () => {
  const inner = CIRCLE_OF_FIFTHS;
  const middle = CIRCLE_OF_FIFTHS.map((_, i) => CIRCLE_OF_FIFTHS[(i + 3) % 12]);
  const outer = CIRCLE_OF_FIFTHS.map((_, i) => CIRCLE_OF_FIFTHS[(i + 5) % 12]);
  return { inner, middle, outer };
};

export const getChordsForKey = (rootIndex: number): KeyData => {
  const { inner, middle, outer } = getRingData();
  
  // When rootIndex is at 12 o'clock:
  // Major: IV (index-1), I (index), V (index+1)
  const I = inner[rootIndex];
  const IV = inner[(rootIndex - 1 + 12) % 12];
  const V = inner[(rootIndex + 1) % 12];

  // Minor: ii (middle index-1), vi (middle index), iii (middle index+1)
  const vi = middle[rootIndex];
  const ii = middle[(rootIndex - 1 + 12) % 12];
  const iii = middle[(rootIndex + 1) % 12];
  
  // Diminished: vii° (outer index)
  const viiDim = outer[rootIndex];

  return {
    root: I,
    major: [I, IV, V],
    minor: [ii, iii, vi],
    diminished: viiDim
  };
};
