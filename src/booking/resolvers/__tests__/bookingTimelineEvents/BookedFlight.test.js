// @flow

import generateBookedFlightEvent from '../../bookingTimeline/bookedFlight';
import { booking } from '../BookingTimeline.test';

describe('generateBookedFlightEvent', () => {
  it('returns BookedFlightEvent', () => {
    expect(generateBookedFlightEvent(booking)).toEqual({
      timestamp: new Date('2017-03-30T07:28:55.000Z'),
      type: 'BookedFlightTimelineEvent',
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
});
