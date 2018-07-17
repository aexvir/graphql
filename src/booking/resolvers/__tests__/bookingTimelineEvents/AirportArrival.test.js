// @flow

import { DateTime } from 'luxon';

import generateAirportArrivalEvent from '../../bookingTimeline/airportArrival';
import { booking } from '../BookingTimeline.test';

describe('generateAirportArrivalEvent', () => {
  it('returns AirportArrival event if departure.when.local is set', () => {
    expect(generateAirportArrivalEvent(booking)).toEqual({
      timestamp: DateTime.fromJSDate(
        booking.departure.when && booking.departure.when.local,
      )
        .minus({ hours: 2 })
        .toJSDate(),
      type: 'AirportArrivalTimelineEvent',
      departure: booking.departure,
    });
  });
  it('returns null if departure.when.local is not set', () => {
    expect(
      generateAirportArrivalEvent({
        ...booking,
        departure: {
          ...booking.departure,
          when: null,
        },
      }),
    ).toBe(null);
  });
});
