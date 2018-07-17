// @flow

import idx from 'idx';
import getFlightDurationInMinutes from '../../../flight/resolvers/FlightDuration';

import type { DepartureTimelineEvent as DepartureType } from '../../BookingTimeline';
import type { Leg } from '../../../flight/Flight';

export default function generateDepartureEvent(leg: Leg): ?DepartureType {
  const departureTime = idx(leg, _ => _.departure.when.local);
  const duration = getFlightDurationInMinutes(leg.departure, leg.arrival);
  const airlineCode = leg.airlineCode;
  const flightNumber = leg.flightNo;
  if (departureTime) {
    return {
      timestamp: departureTime,
      type: 'DepartureTimelineEvent',
      arrival: leg.arrival,
      duration: duration,
      airlineCode: airlineCode,
      flightNumber: flightNumber,
    };
  }
  return null;
}
