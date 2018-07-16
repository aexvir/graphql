// @flow

import generateCheckinClosingEvent from '../../bookingTimeline/checkinClosing';
import type { Booking } from '../../../Booking';
import { sanitizeDetail } from '../../../dataloaders/ApiSanitizer';
import Booking2707251 from '../../../datasets/booking-2707251.json';

const booking: Booking = sanitizeDetail(Booking2707251);

describe('generateCheckinClosingEvent', () => {
  it('should generate CheckinClosing event if online checkin is available', () => {
    expect(
      generateCheckinClosingEvent({
        ...booking,
        onlineCheckinIsAvailable: true,
      }),
    ).toEqual({
      timestamp: new Date('2017-09-06T23:10:00.000+02:00'),
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
