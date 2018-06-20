// @flow

import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import GraphQLBookingTimeline from '../types/outputs/BookingTimeline';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import type { BookingTimelineData } from '../BookingTimeline';

import generateEventsFrom from '../resolvers/BookingTimeline';

export default {
  type: GraphQLBookingTimeline,
  description: 'Get the timeline for your booking.',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Only Booking id can be used as ID.',
    },
  },
  resolve: async (
    ancestor: mixed,
    { id, brand }: Object,
    { dataLoader }: GraphqlContextType,
  ): Promise<BookingTimelineData> => {
    const { id: originalId, type } = fromGlobalId(id);

    if (
      ![
        'Booking',
        'BookingOneWay',
        'BookingReturn',
        'BookingMulticity',
      ].includes(type)
    ) {
      throw new Error(
        `Booking ID mishmash. You cannot query Booking with ID ` +
          `'${id}' because this ID is not ID of the Booking. ` +
          `Please use opaque ID of the Booking.`,
      );
    }

    const booking = await dataLoader.booking.load({id: originalId, brand});

    const events = generateEventsFrom(booking);

    return { events };
  },
};
