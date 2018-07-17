// @flow

import idx from 'idx';

import type { EnterDetailsTimelineEvent as EnterDetailsType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';

export default function generateEnterDetailsEvent(
  booking: Booking,
): ?EnterDetailsType {
  const passengers = idx(booking, _ => _.passengers) || [];
  const isSomePassengerMissingId = passengers.some(
    passenger => !idx(passenger, _ => _.travelDocument.idNumber),
  );
  if (isSomePassengerMissingId) {
    return {
      timestamp: new Date(Date.now()),
      type: 'EnterDetailsTimelineEvent',
    };
  }
  return null;
}
