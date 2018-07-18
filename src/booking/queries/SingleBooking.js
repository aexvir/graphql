// @flow

import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';

import GraphQLBooking from '../types/outputs/Booking';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import type { BookingsItem } from '../Booking';

export default {
  type: GraphQLBooking,
  description: 'Find booking by its id and its simple access token.',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description:
        'Database ID (human readable ID) of the booking. ' +
        'You should use "node" query if you want to use opaque ID.',
    },
    simpleToken: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Simple Token that lets you fetch a unique booking.',
    },
  },
  resolve: async (
    ancestor: mixed,
    { id, simpleToken }: Object,
    { dataLoader }: GraphqlContextType,
  ): Promise<BookingsItem> => {
    return dataLoader.singleBooking.load({ id, simpleToken });
  },
};
