// @flow

import idx from 'idx';
import { DateTime } from 'luxon';
import { GraphQLString } from 'graphql';

import { groupBookings } from './AllBookingsFilters';
import BookingInterface from '../types/outputs/BookingInterface';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import type { BookingsItem } from '../Booking';

export default {
  type: BookingInterface,
  description:
    'Find most relevant booking relative to current time. ' +
    'That is a booking with the smallest difference between current time ' +
    'and arrival time of one of its Legs. If no future booking is found, ' +
    'then the nearest past booking is returned.',
  args: {
    brand: {
      type: GraphQLString,
      description: 'Brand at which booking was made'
    }
  },
  resolve: async (
    ancestor: mixed,
    args: Object,
    { dataLoader }: GraphqlContextType,
  ): Promise<?BookingsItem> => {
    const bookings = await dataLoader.bookings.load(args.brand || "kiwicom");
    const { future, past } = groupBookings(bookings);

    if (future.length) {
      return findNearestBooking(future, true);
    } else if (past.length) {
      return findNearestBooking(past);
    }

    return null;
  },
};

const getTimeToClosestArrival = onlyFuture => (acc, leg) => {
  const date = idx(leg, _ => _.arrival.when.utc);

  if (!date) {
    return acc;
  }

  const timeDelta = DateTime.fromJSDate(date, { zone: 'utc' }).diffNow(
    'milliseconds',
  ).milliseconds;

  if (acc === null || Math.abs(acc) > Math.abs(timeDelta)) {
    if (onlyFuture && timeDelta < 0) {
      return null;
    }

    return timeDelta;
  }

  return acc;
};

export function findNearestBooking(
  bookings: BookingsItem[],
  onlyFuture: boolean = false,
) {
  const sortedBookings = [...bookings].sort((bookingA, bookingB) => {
    const deltaA = bookingA.legs.reduce(
      getTimeToClosestArrival(onlyFuture),
      null,
    );
    const deltaB = bookingB.legs.reduce(
      getTimeToClosestArrival(onlyFuture),
      null,
    );

    if (deltaA === null) {
      return 1;
    }

    if (deltaB === null) {
      return -1;
    }

    return Math.abs(deltaA) - Math.abs(deltaB);
  });
  const nearestBooking = sortedBookings[0] ? sortedBookings[0] : null;

  if (onlyFuture && nearestBooking) {
    const delta = nearestBooking.legs.reduce(
      getTimeToClosestArrival(onlyFuture),
      null,
    );
    if (delta === null) {
      return null;
    }
  }

  return nearestBooking;
}
