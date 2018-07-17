// @flow

import generateTransportFromAirportEvent from '../../bookingTimeline/transportFromAirport';
import { booking } from '../BookingTimeline.test';

describe('generateTransportFromAirportEvent', () => {
  it('returns TransportFromAirport event if arrival.when.local is set', () => {
    expect(generateTransportFromAirportEvent(booking)).toEqual({
      timestamp: new Date('2017-09-09T23:45:00.000Z'),
      type: 'TransportFromAirportTimelineEvent',
    });
  });
  it('returns null if arrival.when.local is set', () => {
    expect(
      generateTransportFromAirportEvent({
        ...booking,
        arrival: { ...booking.arrival, when: null },
      }),
    ).toBe(null);
  });
});
