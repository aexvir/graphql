// @flow

import { GraphQLEnumType } from 'graphql';

export default new GraphQLEnumType({
  name: 'BookingStatus',
  values: {
    CLOSED: { value: 'closed' },
    CONFIRMED: { value: 'confirmed' },
    REFUNDED: { value: 'refunded' },
    REFUNDING: { value: 'refunding' },
  },
});
