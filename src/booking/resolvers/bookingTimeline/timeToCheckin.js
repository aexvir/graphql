// @flow

import idx from 'idx';
import { DateTime } from 'luxon';
import type { TimeToCheckinTimelineEvent as TimeToCheckinType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';

export default function generateTimeToCheckinEvent(
  booking: Booking,
): ?TimeToCheckinType {
  const departureTime = idx(booking.departure, _ => _.when.local);
  const onlineCheckinIsAvailable = idx(
    booking,
    _ => _.onlineCheckinIsAvailable,
  );
  if (onlineCheckinIsAvailable && departureTime) {
    const timestamp = DateTime.fromJSDate(departureTime, {
      zone: 'UTC',
    })
      .minus({ hours: 73 })
      .toJSDate();

    return {
      timestamp,
      type: 'TimeToCheckinTimelineEvent',
    };
  }
  return null;
}
