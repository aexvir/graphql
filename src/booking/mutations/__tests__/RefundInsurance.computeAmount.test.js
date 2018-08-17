// @flow

import { computeAmount } from '../RefundInsurance';

const insurancePrices = [
  {
    type: 'travel_plus',
    price: { amount: 29.14, currency: 'EUR' },
  },
  {
    type: 'travel_basic',
    price: { amount: 13.14, currency: 'EUR' },
  },
  { type: 'none', price: null },
];

describe('computeAmount', () => {
  it('should return the right amount', () => {
    const changes = [
      {
        passengerId: 123,
        from: 'travel_basic',
        to: 'travel_plus',
      },
      {
        passengerId: 1234,
        from: 'travel_plus',
        to: 'none',
      },
    ];

    expect(computeAmount(changes, insurancePrices)).toBe(-13.14);
  });
  it('should return 0 if no changes', () => {
    const changes = [
      {
        passengerId: 123,
        from: 'travel_basic',
        to: 'travel_basic',
      },
      {
        passengerId: 1234,
        from: 'travel_plus',
        to: 'travel_plus',
      },
    ];

    expect(computeAmount(changes, insurancePrices)).toBe(0);
  });

  it('should return 0 if changes is empty array', () => {
    const changes = [];

    expect(computeAmount(changes, insurancePrices)).toBe(0);
  });
});
