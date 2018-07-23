// @flow

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
} from 'graphql';

import type { Baggage } from '../../Baggage';

const BaggageCategory = new GraphQLEnumType({
  name: 'BaggageCategory',
  values: {
    CHECKED: { value: 'hold_bag' },
    PERSONAL_ITEM: { value: 'personal_item' },
    CABIN_BAG: { value: 'cabin_bag' },
  },
});

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
      type: BaggageCategory,
      resolve: ({ category }: Baggage) => category,
    },

    isPending: {
      type: GraphQLBoolean,
      resolve: ({ isPending }: Baggage) => isPending,
    },
  },
});
