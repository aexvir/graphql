// @flow

import { GraphQLObjectType, GraphQLList, GraphQLInt } from 'graphql';

import HotelServiceRelevantLocation from './HotelServiceRelevantLocation';
import type { RelevantLocationData } from '../../../resolvers/HotelServices';

const ChildrenType = new GraphQLObjectType({
  name: 'ChildrenType',
  fields: {
    age: {
      type: GraphQLInt,
    },
  },
});

const RoomsConfiguration = new GraphQLObjectType({
  name: 'RoomsConfigurationOutput',
  description: 'Booking.com rooms configuration',
  fields: {
    adultsCount: {
      type: GraphQLInt,
    },
    children: {
      type: GraphQLList(ChildrenType),
    },
  },
});

export default new GraphQLObjectType({
  name: 'HotelService',
  fields: {
    relevantLocations: {
      type: GraphQLList(HotelServiceRelevantLocation),
      resolve: ({ relevantLocationData }: RelevantLocationData) =>
        relevantLocationData,
    },
    roomsConfiguration: {
      type: RoomsConfiguration,
    },
  },
});
