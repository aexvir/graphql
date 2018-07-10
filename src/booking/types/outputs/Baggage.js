// @flow

import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';

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

    quantityBooked: {
      type: GraphQLInt,
      resolve: ({ quantity }: Baggage) => quantity,
    },
  },
});
