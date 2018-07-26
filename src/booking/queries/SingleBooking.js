// @flow

import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

import GraphQLBookingInterface from '../types/outputs/BookingInterface';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import type { BookingInterfaceData } from '../types/outputs/BookingInterface';

export default {
  type: GraphQLBookingInterface,
  description: 'Find booking by its id and its simple access token.',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description:
        'Database ID (human readable ID) of the booking. ' +
        'You should use "node" query if you want to use opaque ID.',
    },
    authToken: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Simple auth token that lets you fetch a unique booking.',
    },
  },
  resolve: async (
    ancestor: mixed,
    { id, authToken }: Object,
    { dataLoader }: GraphqlContextType,
  ): Promise<BookingInterfaceData> => {
    return dataLoader.singleBooking.load({ id, authToken });
  },
};
