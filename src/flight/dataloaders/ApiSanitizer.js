// @flow

import type { Flight, Leg } from '../Flight';
import { sanitizeRoute } from './RouteSanitizer';

export function sanitizeApiResponse(
  flight: Object,
  currency: string,
  passengers: number,
): Flight {
  return {
    id: flight.id,
    airlines: flight.airlines,
    arrival: sanitizeRoute({
      utc: flight.aTimeUTC,
      local: flight.aTime,
      code: flight.flyTo,
      cityName: flight.cityTo,
      cityId: flight.cityId,
    }),
    departure: sanitizeRoute({
      utc: flight.dTimeUTC,
      local: flight.dTime,
      code: flight.flyFrom,
      cityName: flight.cityFrom,
      cityId: flight.cityId,
    }),
    legs: flight.route.map((leg): Leg => ({
      id: leg.id,
      recheckRequired: leg.bags_recheck_required,
      isReturn: flight.return === 1,
      flightNo: leg.flight_no,
      departure: sanitizeRoute({
        utc: leg.dTimeUTC,
        local: leg.dTime,
        code: leg.flyFrom,
        cityName: leg.cityFrom,
        cityId: flight.cityId,
      }),
      arrival: sanitizeRoute({
        utc: leg.aTimeUTC,
        local: leg.aTime,
        code: leg.flyTo,
        cityName: leg.cityTo,
        cityId: flight.cityId,
      }),
      airlineCode: leg.airline,
      vehicleType: leg.vehicle_type,
      guarantee: leg.guarantee,
      vehicle: flight.vehicle,
      operatingAirline: flight.operating_airline,
      pnr: flight.reservation_number,
    })),
    price: {
      amount: flight.price,
      currency: currency,
    },
    bookingToken: flight.booking_token,
    passengers: passengers,
  };
}
