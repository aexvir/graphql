// @flow

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
} from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import { globalIdField } from '../../../common/services/OpaqueIdentifier';
import GraphQLHotelRoomBedding from './HotelRoomBedding';
import GraphQLHotelRoomDescription from './HotelRoomDescription';
import GraphQLHotelPhoto from './HotelPhoto';
import { connectionFromArray } from '../../../common/services/ArrayConnection';

import type { HotelRoomType } from '../../dataloaders/flow/HotelRoomType';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';

export default new GraphQLObjectType({
  name: 'HotelRoom',
  fields: {
    id: globalIdField('hotelRoom', ({ id }: HotelRoomType) => id),

    type: {
      type: GraphQLString,
      description: 'Type of the hotel room.',
      resolve: ({ type }: HotelRoomType) => type,
    },

    maxPersons: {
      type: GraphQLInt,
      resolve: ({ maxPersons }: HotelRoomType) => maxPersons,
    },

    bedding: {
      type: new GraphQLList(GraphQLHotelRoomBedding),
      resolve: (
        { id: roomId, hotelId }: HotelRoomType,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ) => {
        return dataLoader.hotel.roomBedding.load({ hotelId, roomId });
      },
    },

    photos: {
      description: 'All available photos of the hotel room.',
      type: connectionDefinitions({
        name: 'HotelRoomPhoto',
        nodeType: GraphQLHotelPhoto,
      }).connectionType,
      args: connectionArgs,
      resolve: async ({ photos }: HotelRoomType, args: Object) => {
        if (!photos) {
          return [];
        }
        return connectionFromArray(photos, args);
      },
    },

    description: {
      type: GraphQLHotelRoomDescription,
      resolve: ({ descriptions }: HotelRoomType) =>
        descriptions.length > 0 ? descriptions[0] : null,
    },

    roomSize: {
      type: GraphQLFloat,
      description: 'The hotelroom size in square meters',
      resolve: ({ roomSize }: HotelRoomType) => roomSize,
    },
  },
});
