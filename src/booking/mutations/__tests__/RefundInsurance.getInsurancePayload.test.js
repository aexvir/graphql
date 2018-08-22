// @flow

import { getInsurancesPayload } from '../RefundInsurance';

describe('getInsurancesPayload', () => {
  it('should return the right payload (1)', () => {
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

    expect(getInsurancesPayload(changes)).toEqual([
      {
        passenger_id: 123,
        insurance_type: 'travel_plus',
      },
      {
        passenger_id: 1234,
        insurance_type: null,
      },
    ]);
  });
  it('should return the right payload (2)', () => {
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

    expect(getInsurancesPayload(changes)).toEqual([]);
  });
});
