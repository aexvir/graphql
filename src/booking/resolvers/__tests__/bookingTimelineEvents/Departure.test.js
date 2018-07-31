// @flow

import generateDepartureEvent from '../../bookingTimeline/departure';
import { leg } from '../BookingTimeline.test';

describe('generateDepartureEvent', () => {
  it('returns Departure event if departure.when.local is set', () => {
    expect(generateDepartureEvent(leg)).toEqual({
      timestamp: new Date('2017-09-09T21:10:00.000Z'),
      type: 'DepartureTimelineEvent',
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
      duration: 80,
      airlineCode: 'VY',
      flightNumber: 8773,
    });
  });
  it('returns null if departure.when.local is not set', () => {
    expect(
      generateDepartureEvent({
        ...leg,
        departure: { ...leg.departure, when: null },
      }),
    ).toBe(null);
  });
});
