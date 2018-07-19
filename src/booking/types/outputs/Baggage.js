// @flow

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import type { Baggage } from '../../Baggage';

export default new GraphQLObjectType({
  name: 'Baggage',
  fields: {
    height: {
      type: GraphQLInt,
      resolve: ({ height }: Baggage) => height,
    },

    length: {
      type: GraphQLInt,
      resolve: ({ length }: Baggage) => length,
    },

    width: {
      type: GraphQLInt,
      resolve: ({ width }: Baggage) => width,
    },

    weight: {
      type: GraphQLInt,
      resolve: ({ weight }: Baggage) => weight,
    },

    note: {
      type: GraphQLString,
      resolve: ({ note }: Baggage) => note,
    },

    dimensionSum: {
      type: GraphQLInt,
      description: 'Maximum allowed sum of weight, length and width',
      resolve: ({ dimensionSum }: Baggage) => dimensionSum,
    },

    category: {
      type: GraphQLString,
      resolve: ({ category }: Baggage) => category,
    },

    isPending: {
      type: GraphQLBoolean,
      resolve: ({ isPending }: Baggage) => isPending,
    },
  },
});
