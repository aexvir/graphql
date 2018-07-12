// @flow

import { GraphQLObjectType } from 'graphql';

import BookingInterface, {
  commonFields,
  type BookingInterfaceData,
} from './BookingInterface';
import Trip, { type TripData } from './Trip';
import { nodeInterface } from '../../../node/node';
import { register } from '../../../node/typeStore';

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
      resolve: ({
        departure,
        arrival,
        legs,
        id,
      }: BookingOneWayData): TripData => {
        return {
          departure,
          arrival,
          legs,
          bid: id,
        };
      },
    },
  },
});

register('BookingOneWay', BookingOneWay);

export default BookingOneWay;
