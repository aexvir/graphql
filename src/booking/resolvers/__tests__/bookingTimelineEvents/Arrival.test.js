// @flow

import generateArrivalEvent from '../../bookingTimeline/arrival';
import { leg } from '../BookingTimeline.test';

describe('generateArrivalEvent', () => {
  it('returns Arrival event if arrival.when.local is set', () => {
    expect(generateArrivalEvent(leg)).toEqual({
      timestamp: new Date('2017-09-09T23:30:00.000Z'),
      type: 'ArrivalTimelineEvent',
      arrival: {
        when: {
          utc: new Date('2017-09-09T21:30:00.000Z'),
          local: new Date('2017-09-09T23:30:00.000Z'),
        },
        where: {
          code: 'CDG',
          cityName: 'Paris',
          cityId: 'paris_fr',
          terminal: '2',
        },
        bid: 2707251,
        authToken: 'token-lol',
      },
    });
  });
  it('returns null if arrival.when.local is not set', () => {
    expect(
      generateArrivalEvent({
        ...leg,
        arrival: { ...leg.arrival, when: null },
      }),
    ).toBe(null);
  });
});
