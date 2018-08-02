// @flow

import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
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
    authToken: {
      type: GraphQLString,
    },
  },
  resolve: async (
    ancestor: mixed,
    { id, authToken }: Object,
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
    // This should be changed to use only singleBooking when client is changed accordingly
    let booking = {};

    if (authToken == null) {
      booking = await dataLoader.booking.load(originalId);
    } else {
      booking = await dataLoader.singleBooking.load({
        id: parseInt(originalId),
        authToken: authToken,
      });
    }

    const events = generateEventsFrom(booking);

    return { events };
  },
};
