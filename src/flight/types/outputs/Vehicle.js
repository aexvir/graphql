// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

import type { Vehicle } from '../../Flight';

export default new GraphQLObjectType({
  name: 'Vehicle',
  fields: {
    manufacturer: {
      type: GraphQLString,
      resolve: ({ manufacturer }: Vehicle): string => manufacturer,
    },

    model: {
      type: GraphQLString,
      resolve: ({ model }: Vehicle): string => model,
    },
  },
});
