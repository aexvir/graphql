// @flow

import generateBookingConfirmedEvent from '../../bookingTimeline/bookingConfirmed';

import { booking } from '../BookingTimeline.test';

describe('generateBookingConfirmedEvent', () => {
  it('returns BookingConfirmed event only when booking status is confirmed', () => {
    expect(
      generateBookingConfirmedEvent({
        ...booking,
        status: 'confirmed',
      }),
    ).toEqual({
      timestamp: new Date('2017-03-30T07:28:55.000Z'),
      type: 'BookingConfirmedTimelineEvent',
    });
    expect(
      generateBookingConfirmedEvent({
        ...booking,
        status: 'cancelled',
      }),
    ).toBe(null);
  });
});
