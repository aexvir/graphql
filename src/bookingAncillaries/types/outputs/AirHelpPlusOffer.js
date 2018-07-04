// @flow

import { GraphQLObjectType, GraphQLBoolean } from 'graphql';

import GraphQLPrice from '../../../common/types/outputs/Price';

import type { AirHelpPlusOfferType } from '../flow/AirHelpPlusOffer';

export default new GraphQLObjectType({
  name: 'AirHelpPlusOffer',
  description: 'AirHelp+ offer as a booking ancillary',
  fields: {
    isPossible: {
      type: GraphQLBoolean,
      resolve: ({ isPossible }: AirHelpPlusOfferType) => isPossible,
    },
    pricePerPerson: {
      description: 'Price per passenger',
      type: GraphQLPrice,
      resolve: ({ pricePerPerson }: AirHelpPlusOfferType) => pricePerPerson,
    },
  },
});
