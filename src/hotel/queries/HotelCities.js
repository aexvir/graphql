// @flow

import { GraphQLString } from 'graphql';
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromPromisedArray,
} from 'graphql-relay';

import GraphQLHotelCity from '../types/outputs/HotelCity';
import GraphQLCoordinatesInput from '../../common/types/inputs/CoordinatesInput';

import type { GraphqlContextType } from '../../common/services/GraphqlContext';

const { connectionType: HotelCitiesConnection } = connectionDefinitions({
  nodeType: GraphQLHotelCity,
});

export default {
  type: HotelCitiesConnection,
  description: `
All cities where you can find the hotels. This query can be used for
suggestions of relevant cities (search for example). Cities can be filtered
by prefix with typo tolerance. Items are sorted by prefix matching and a
number of hotels (desc). When the prefix is omitted top cities are returned.
`.trim(),
  args: {
    prefix: {
      type: GraphQLString,
      description: 'First few letters.',
    },
    position: {
      type: GraphQLCoordinatesInput,
      description: 'Search for cities around a given position.',
    },
    ...connectionArgs,
  },
  resolve: async (
    ancestor: mixed,
    { prefix, position, ...pagination }: Object,
    context: GraphqlContextType,
  ) => {
    const dataLoader = context.dataLoader.hotel.cities;
    const cities = position
      ? dataLoader.loadByLatLng(position.lat, position.lng)
      : dataLoader.loadByPrefix(prefix || '', context.locale.language);
    return connectionFromPromisedArray(cities, pagination);
  },
};
