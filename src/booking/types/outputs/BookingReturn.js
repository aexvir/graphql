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

export type InboundOutboundData = {
  inbound?: TripData,
  outbound?: TripData,
};

export type BookingReturnData = BookingInterfaceData & InboundOutboundData;

const BookingReturn = new GraphQLObjectType({
  name: 'BookingReturn',
  description: 'Booking with return trip. A <-> B',
  interfaces: [BookingInterface, nodeInterface],
  fields: {
    ...commonFields,
    outbound: {
      type: Trip,
      description: 'Trip from origin to destination.',
      resolve: async (
        { id }: BookingReturnData,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<?TripData> => {
        const { outbound } = await dataLoader.booking.load(id);
        return outbound;
      },
    },
    inbound: {
      type: Trip,
      description: 'Return trip back from destination to origin.',
      resolve: async (
        { id }: BookingReturnData,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<?TripData> => {
        const { inbound } = await dataLoader.booking.load(id);
        return inbound;
      },
    },
  },
});

register('BookingReturn', BookingReturn);

export default BookingReturn;
