// @flow

import generateCheckinClosingEvent from '../../bookingTimeline/checkinClosing';
import { booking } from '../BookingTimeline.test';

describe('generateCheckinClosingEvent', () => {
  it('should generate CheckinClosing event if online checkin is available', () => {
    expect(
      generateCheckinClosingEvent({
        ...booking,
        onlineCheckinIsAvailable: true,
      }),
    ).toEqual({
      timestamp: new Date('2017-09-06T21:10:00.000Z'),
      type: 'CheckinClosingTimelineEvent',
    });
  });
  it('should return null if online checkin is not available or departure time is not available', () => {
    expect(
      generateCheckinClosingEvent({
        ...booking,
        onlineCheckinIsAvailable: false,
      }),
    ).toBe(null);
    expect(
      generateCheckinClosingEvent({
        ...booking,
        departure: {
          ...booking.departure,
          when: null,
        },
      }),
    ).toBe(null);
  });
});
