// @flow

import { GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';

import type {
  BookingAssets,
  BoardingPass as BoardingPassType,
} from '../../Booking';
import BoardingPass from './BoardingPass';

export default new GraphQLObjectType({
  name: 'BookingAssets',
  fields: {
    ticketUrl: {
      type: GraphQLString,
      description:
        'URL of the electronic ticket. Ticket may not be available yet (returns null).',
      resolve: ({ ticketUrl }: BookingAssets): ?string => ticketUrl,
    },

    invoiceUrl: {
      type: GraphQLString,
      description: 'URL of the invoice.',
      resolve: ({ invoiceUrl }: BookingAssets): ?string => invoiceUrl,
    },

    boardingPasses: {
      type: new GraphQLList(BoardingPass),
      description: 'Boarding passes for flights in this booking',
      resolve: ({ boardingPasses }: BookingAssets): BoardingPassType[] =>
        boardingPasses,
    },
  },
});
