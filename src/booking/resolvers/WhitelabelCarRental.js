// @flow

import { DateTime } from 'luxon';
import idx from 'idx';

import type { BookingsItem } from '../Booking';
import type { CarRentalServiceType } from '../types/outputs/services/CarRentalService';

type AncestorType = {|
  +booking: BookingsItem,
|};

const lastLocationCode = array => {
  return array[array.length - 1].arrival.where.code;
};

const addHours = (date, hours) => {
  return DateTime.fromJSDate(date, { zone: 'utc' })
    .plus({ hours })
    .toJSDate();
};

export default async ({
  booking,
}: AncestorType): Promise<CarRentalServiceType> => {
  // we are interested in the IATAs at the end of the trips (arrivals only, no transfers)
  // car rental is then interesting only for the time you are outside of the airport

  const ONE_WEEK = 7 * 24;
  const locationCodes = new Map();

  if (booking.type === 'BookingOneWay') {
    const arrivalTime = idx(booking, _ => _.arrival.when.utc) || new Date();

    locationCodes.set(lastLocationCode(booking.legs), {
      pickup: arrivalTime,
      dropoff: addHours(arrivalTime, ONE_WEEK),
    });
  } else if (booking.type === 'BookingReturn') {
    const outboundLegs = booking.outbound ? booking.outbound.legs : [];
    const inboundLegs = booking.inbound ? booking.inbound.legs : [];
    const outboundArrival =
      idx(booking, _ => _.outbound.arrival.when.utc) || new Date();
    const inboundDeparture =
      idx(booking, _ => _.inbound.departure.when.utc) || new Date();
    const inboundArrival =
      idx(booking, _ => _.inbound.arrival.when.utc) || new Date();

    locationCodes.set(lastLocationCode(outboundLegs), {
      pickup: outboundArrival,
      dropoff: addHours(inboundDeparture, -3),
    });
    locationCodes.set(lastLocationCode(inboundLegs), {
      pickup: inboundArrival,
      dropoff: addHours(inboundArrival, ONE_WEEK),
    });
  } else if (booking.type === 'BookingMulticity') {
    const trips = booking.trips || [];
    trips.forEach(trip => {
      const arrivalTime = idx(trip, _ => _.arrival.when.utc) || new Date();

      return locationCodes.set(lastLocationCode(trip.legs), {
        pickup: arrivalTime,
        dropoff: addHours(arrivalTime, ONE_WEEK), // should be actually next departure of the next trip
      });
    });
  }

  return locationCodes;
};
