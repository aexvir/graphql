// @flow

import type { BookedFlightTimelineEvent as BookedFlightType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';

export default function generateBookedFlightEvent(
  booking: Booking,
): BookedFlightType {
  return {
    timestamp: booking.created,
    type: 'BookedFlightTimelineEvent',
    arrival: booking.arrival,
  };
}
