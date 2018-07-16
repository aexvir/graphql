// @flow

import generateTimeToCheckinEvent from '../../bookingTimeline/timeToCheckin';
import type { Booking } from '../../../Booking';
import { sanitizeDetail } from '../../../dataloaders/ApiSanitizer';
import Booking2707251 from '../../../datasets/booking-2707251.json';

const booking: Booking = sanitizeDetail(Booking2707251);

describe('generateTimeToCheckinEvent', () => {
  it('should generate TimeToCheckin event if online checkin is available', () => {
    expect(
      generateTimeToCheckinEvent({
        ...booking,
        onlineCheckinIsAvailable: true,
      }),
    ).toEqual({
      timestamp: new Date('2017-09-06T22:10:00.000+02:00'),
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
