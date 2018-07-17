// @flow

import idx from 'idx';
import { DateTime } from 'luxon';

import type { LeaveForAirportTimelineEvent as LeaveForAirportType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';
import type { TripData } from '../../types/outputs/Trip';

export default function generateLeaveForAirportEvent(
  booking: Booking | TripData,
): ?LeaveForAirportType {
  const localDepartureTime = idx(booking.departure, _ => _.when.local);
  if (localDepartureTime) {
    const leaveForAiportTime = DateTime.fromJSDate(localDepartureTime, {
      zone: 'UTC',
    })
      .minus({
        hours: 4,
      })
      .toJSDate();
    return {
      timestamp: leaveForAiportTime,
      type: 'LeaveForAirportTimelineEvent',
    };
  }
  return null;
}
