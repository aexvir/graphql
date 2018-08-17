// @flow

import { getCurrency } from '../RefundInsurance';

describe('getCurrency', () => {
  it('should return the right currency', () => {
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

    expect(getCurrency(insurancePrices)).toBe('EUR');
  });

  it('should throw error is currencies are mixed', () => {
    const insurancePrices = [
      {
        type: 'travel_plus',
        price: { amount: 29.14, currency: 'CZK' },
      },
      {
        type: 'travel_basic',
        price: { amount: 13.14, currency: 'EUR' },
      },
      { type: 'none', price: null },
    ];

    expect(() => getCurrency(insurancePrices)).toThrow(
      new Error('Impossible to compute the price with different currencies.'),
    );
  });
});
