// @flow

import { GraphQLNonNull, GraphQLString } from 'graphql';

import GraphQLAirHelpPlusOffer from '../types/outputs/AirHelpPlusOffer';

import type { AirHelpPlusOfferType } from '../types/flow/AirHelpPlusOffer';

export default {
  type: GraphQLAirHelpPlusOffer,
  description: 'AirHelp+ offer that can be purchased with booking',
  args: {
    bookingId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (): Promise<AirHelpPlusOfferType> => {
    // No API call needed for this MVP so far
    return {
      isPossible: true,
      pricePerPerson: {
        amount: 4.9,
        currency: 'EUR',
      },
    };
  },
};
