// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

import { globalIdField } from '../../../common/services/OpaqueIdentifier';
import GraphQLHotel from '../../../hotel/types/outputs/Hotel';
import GraphQLFlight from '../../../flight/types/outputs/Flight';
import GraphQLPrice from '../../../common/types/outputs/Price';

import type { DynamicPackageType } from '../flow/DynamicPackageType';

export default new GraphQLObjectType({
  name: 'DynamicPackage',
  description: 'Combination of flight and hotel',
  fields: {
    id: globalIdField(
      'dynamicPackage',
      ({ id }: DynamicPackageType): string => id,
    ),

    hotel: {
      description: 'Accommodation part of the package',
      type: GraphQLHotel,
      resolve: ({ hotel }: DynamicPackageType) => hotel,
    },

    flight: {
      description: 'Transport part of the package',
      type: GraphQLFlight,
      resolve: ({ flight }: DynamicPackageType) => {
        return flight;
      },
    },

    whitelabelUrl: {
      description:
        'URL to the whitelabel page where this dynamic package can be purchased',
      type: GraphQLString,
      resolve: ({ whitelabelUrl }: DynamicPackageType) => whitelabelUrl,
    },

    price: {
      description: 'Total price',
      type: GraphQLPrice,
      resolve: ({ hotel }: DynamicPackageType) => {
        return {
          amount: hotel.price,
          currency: hotel.currencyCode,
        };
      },
    },
  },
});
