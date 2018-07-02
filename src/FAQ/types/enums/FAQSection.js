// @flow

import { GraphQLEnumType } from 'graphql';

export default new GraphQLEnumType({
  name: 'FAQSection',
  values: {
    BEFORE_BOOKING: { value: 'beforeBooking' },
    UPCOMING_BOOKING: { value: 'upcomingBooking' },
    URGENT_BOOKING: { value: 'urgentBooking' },
    PAST_BOOKING: { value: 'pastBooking' },
  },
});
