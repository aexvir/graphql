// @flow

import idx from 'idx';
import { DateTime } from 'luxon';

import type { TransportFromAirportTimelineEvent as TransportFromAirportType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';
import type { TripData } from '../../types/outputs/Trip';

export default function generateTransportFromAirportEvent(
  booking: Booking | TripData,
): ?TransportFromAirportType {
  const arrivalTime = idx(booking.arrival, _ => _.when.local);
  if (arrivalTime) {
    const transportFromAirportTime = DateTime.fromJSDate(arrivalTime, {
      zone: 'UTC',
    })
      .plus({ minutes: 15 })
      .toJSDate();
    return {
      timestamp: transportFromAirportTime,
      type: 'TransportFromAirportTimelineEvent',
    };
  }
  return null;
}
