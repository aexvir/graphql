// @flow

import { GraphQLObjectType } from 'graphql';

import BookingInterface, {
  commonFields,
  type BookingInterfaceData,
} from './BookingInterface';
import Trip, { type TripData } from './Trip';
import { nodeInterface } from '../../../node/node';
import { register } from '../../../node/typeStore';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';

export type BookingOneWayData = BookingInterfaceData & {};

const BookingOneWay = new GraphQLObjectType({
  name: 'BookingOneWay',
  description:
    'Booking with simple trip from origin to destination, with possible stopovers.',
  interfaces: [BookingInterface, nodeInterface],
  fields: {
    ...commonFields,
    trip: {
      type: Trip,
      resolve: async (
        { id }: BookingOneWayData,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<TripData> => {
        const { departure, arrival, legs } = await dataLoader.booking.load(id);

        return {
          departure,
          arrival,
          legs,
        };
      },
    },
  },
});

register('BookingOneWay', BookingOneWay);

export default BookingOneWay;
