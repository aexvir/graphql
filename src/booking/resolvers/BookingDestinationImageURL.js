// @flow

import { isPastBooking } from '../queries/AllBookingsFilters';
import type { Booking } from '../Booking';

export function getCityId(legs: Object[]) {
  return legs[legs.length - 1].arrival.where.cityId;
}

export function castURL(
  dimensions: string,
  cityId: string,
  isPastBooking: boolean,
) {
  return `https://images.kiwi.com/photos/${dimensions}/${cityId}${isPastBooking
    ? '.grayscale'
    : ''}.jpg`;
}

export default (booking: Booking, args: { dimensions: string }): string => {
  const isPast = isPastBooking(booking);

  if (booking.type === 'BookingOneWay') {
    // destination of the last leg
    return castURL(args.dimensions, getCityId(booking.legs), isPast);
  } else if (booking.type === 'BookingReturn') {
    // destination of the last outbound leg
    const legs = booking.outbound ? booking.outbound.legs : [];

    return castURL(args.dimensions, getCityId(legs), isPast);
  } else if (booking.type === 'BookingMulticity') {
    // destination of the last leg of the last trip
    const trips = booking.trips;
    const legs = trips && trips.length ? trips[trips.length - 1].legs : [];
    return castURL(args.dimensions, getCityId(legs), isPast);
  }

  throw new Error('Unknown booking type.');
};
