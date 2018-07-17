// @flow

import generateTimeToCheckinEvent from '../../bookingTimeline/timeToCheckin';
import { booking } from '../BookingTimeline.test';

describe('generateTimeToCheckinEvent', () => {
  it('should generate TimeToCheckin event if online checkin is available', () => {
    expect(
      generateTimeToCheckinEvent({
        ...booking,
        onlineCheckinIsAvailable: true,
      }),
    ).toEqual({
      timestamp: new Date('2017-09-06T20:10:00.000Z'),
      type: 'TimeToCheckinTimelineEvent',
    });
  });
  it('should return null if online checkin is not available or departure time is not available', () => {
    expect(
      generateTimeToCheckinEvent({
        ...booking,
        onlineCheckinIsAvailable: false,
      }),
    ).toBe(null);
    expect(
      generateTimeToCheckinEvent({
        ...booking,
        departure: {
          ...booking.departure,
          when: null,
        },
      }),
    ).toBe(null);
  });
});
