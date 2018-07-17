// @flow

import idx from 'idx';
import { DateTime } from 'luxon';

import type { AirportArrivalTimelineEvent as AirportArrivalType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';
import type { TripData } from '../../types/outputs/Trip';

export default function generateAirportArrivalEvent(
  booking: Booking | TripData,
): ?AirportArrivalType {
  const localDepartureTime = idx(booking.departure, _ => _.when.local);
  if (localDepartureTime) {
    const AiportArrivalTime = DateTime.fromJSDate(localDepartureTime, {
      zone: 'UTC',
    })
      .minus({
        hours: 2,
      })
      .toJSDate();
    return {
      timestamp: AiportArrivalTime,
      type: 'AirportArrivalTimelineEvent',
      departure: booking.departure,
    };
  }
  return null;
}
