// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

import type { CustomerSupportNumber } from '../CustomerSupportNumber';

export default new GraphQLObjectType({
  name: 'CustomerSupportNumber',
  fields: {
    localeTerritory: {
      type: GraphQLString,
      description: 'Customer Support phone number locale territory',
      resolve: ({ id }: CustomerSupportNumber): string => id,
    },

    number: {
      type: GraphQLString,
      description: 'Customer Support phone number',
      resolve: ({ number }: CustomerSupportNumber): string => number,
    },
  },
});
