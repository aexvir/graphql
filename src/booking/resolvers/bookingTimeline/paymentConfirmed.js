// @flow

import type { PaymentConfirmedTimelineEvent as PaymentConfirmedType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';

export default function generatePaymentConfirmedEvent(
  booking: Booking,
): ?PaymentConfirmedType {
  if (booking.status) {
    return {
      timestamp: booking.created,
      type: 'PaymentConfirmedTimelineEvent',
    };
  }
  return null;
}
