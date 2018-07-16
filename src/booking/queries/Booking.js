// @flow

import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import GraphQLBooking from '../types/outputs/Booking';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import type { BookingsItem } from '../Booking';

export default {
  type: GraphQLBooking, // may be null (doesn't exist)
  description: 'Find booking by its id or databaseId.',
  deprecationReason: 'Use "node" query instead.',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description:
        'Database ID (human readable ID) of the booking. ' +
        'You should use "node" query if you want to use opaque ID.',
    },
  },
  resolve: async (
    ancestor: mixed,
    { id }: Object,
    { dataLoader }: GraphqlContextType,
  ): Promise<BookingsItem> => {
    let databaseId = id;

    if (typeof id === 'string' && id.match(/^\d+$/) === null) {
      // ID correspond to Booking ID, not databaseId
      // Note: this branch is deprecated and should not be used

      const { id: originalId, type } = fromGlobalId(id);

      if (type !== 'Booking') {
        throw new Error(
          `Booking ID mishmash. You cannot query Booking with ID ` +
            `'${id}' because this ID is not ID of the Booking. ` +
            `Please use opaque ID of the Booking.`,
        );
      }

      databaseId = originalId;
    }

    return dataLoader.booking.load(databaseId);
  },
};
