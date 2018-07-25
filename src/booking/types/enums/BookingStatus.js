// @flow

import { GraphQLEnumType } from 'graphql';

const deprecationReason =
  'Never valid value for Booking Status, only for Booking Extra Status';

export default new GraphQLEnumType({
  name: 'BookingStatus',
  values: {
    CLOSED: { value: 'closed' },
    CONFIRMED: { value: 'confirmed' },
    REFUNDED: { value: 'refunded' },

    // TODO: Remove deprecated after some deprecation period
    NEW: { value: 'open', deprecationReason },
    PENDING: { value: 'pending', deprecationReason },
    CANCELLED: { value: 'cancelled', deprecationReason },
    DELETED: { value: 'deleted', deprecationReason },
    EXPIRED: { value: 'expired', deprecationReason },
  },
});
