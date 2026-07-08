import { describe, expect, it } from 'vitest';
import { chunkArray } from '../src/utils/batch.js';

describe('chunkArray', () => {
  it('chunks data into batches', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});