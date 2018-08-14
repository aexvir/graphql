// @flow

import { connectionArgs, connectionDefinitions } from 'graphql-relay';
import { GraphQLEnumType } from 'graphql';

import { connectionFromArray } from '../../common/services/ArrayConnection';
import GraphQLBookingInterface from '../types/outputs/BookingInterface';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import { filterOnlyBookings } from '../services/AllBookingsFilters';
import { sortBookingsByDate } from './AllBookingsSort';

const { connectionType: AllBookingsConnection } = connectionDefinitions({
  nodeType: GraphQLBookingInterface,
});

const OnlyEnumValues = {
  FUTURE: { value: 'future' },
  PAST: { value: 'past' },
};

const OnlyEnum = new GraphQLEnumType({
  name: 'CustomerBookingsOnlyEnum',
  values: OnlyEnumValues,
});

export default {
  type: AllBookingsConnection,
  description: 'Search for your flight bookings.',
  args: {
    only: {
      type: OnlyEnum,
      description:
        'Allows to filter only future bookings or only past bookings but ' +
        'not both. You can skip this argument to fetch all bookings ' +
        '(future and past).',
    },
    ...connectionArgs,
  },
  resolve: async (
    ancestor: mixed,
    args: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    let bookings = await dataLoader.bookings.load();

    if (args.only !== undefined) {
      // argument "only" is optional
      bookings = filterOnlyBookings(args.only, bookings);
    }

    bookings = sortBookingsByDate(bookings);

    return connectionFromArray(bookings, args);
  },
};
