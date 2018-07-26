// @flow

import sanitizeBaggageData from '../BagApiSanitizer';
import bags from './__datasets__/bags.json';

describe('BagApiSanitizer', () => {
  it('should group bags by category', () => {
    const result = sanitizeBaggageData(bags);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      quantity: 2,
      passengers: [11751828, 11751827],
      bag: expect.objectContaining({ category: 'hold_bag' }),
      bookingId: 7708368,
    });
  });
});
