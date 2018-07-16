// @flow

import idx from 'idx';
import { DateTime } from 'luxon';
import type { CheckinClosingTimelineEvent as CheckinClosingType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';

export default function generateCheckinClosingEvent(
  booking: Booking,
): ?CheckinClosingType {
  const departureTime = idx(booking.departure, _ => _.when.local);
  const onlineCheckinIsAvailable = idx(
    booking,
    _ => _.onlineCheckinIsAvailable,
  );
  if (onlineCheckinIsAvailable && departureTime) {
    const timestamp = DateTime.fromJSDate(departureTime, {
      zone: 'UTC',
    })
      .minus({ hours: 72 })
      .toJSDate();

    return {
      timestamp,
      type: 'CheckinClosingTimelineEvent',
    };
  }
  return null;
}
