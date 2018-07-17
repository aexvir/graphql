// @flow

import type { BookingConfirmedTimelineEvent as BookingConfirmedType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';

export default function generateBookingConfirmedEvent(
  booking: Booking,
): ?BookingConfirmedType {
  if (booking.status === 'confirmed') {
    return {
      timestamp: booking.created,
      type: 'BookingConfirmedTimelineEvent',
    };
  }
  return null;
}
