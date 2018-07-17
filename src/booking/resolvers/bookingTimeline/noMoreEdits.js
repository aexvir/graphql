// @flow

import idx from 'idx';
import { DateTime } from 'luxon';

import type { NoMoreEditsTimelineEvent as NoMoreEditsType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';

export default function generateNoMoreEditsEvent(
  booking: Booking,
): ?NoMoreEditsType {
  const departureTime = idx(booking.departure, _ => _.when.local);
  const allowdToChangeFlights = idx(booking, _ => _.allowedToChangeFlights);
  if (departureTime && allowdToChangeFlights) {
    const noMoreEditsTime = DateTime.fromJSDate(departureTime, {
      zone: 'UTC',
    })
      .minus({ hours: allowdToChangeFlights })
      .toJSDate();
    return {
      timestamp: noMoreEditsTime,
      type: 'NoMoreEditsTimelineEvent',
    };
  }
  return null;
}
