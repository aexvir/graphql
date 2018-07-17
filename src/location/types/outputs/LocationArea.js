// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

import type { LocationArea } from '../../Location';

export default new GraphQLObjectType({
  name: 'LocationArea',
  fields: {
    locationId: {
      type: GraphQLString,
      resolve: ({ locationId }: LocationArea): string => locationId,
    },
    name: {
      type: GraphQLString,
      resolve: ({ name }: LocationArea): string => name,
    },
    slug: {
      type: GraphQLString,
      resolve: ({ slug }: LocationArea): string => slug,
    },
    code: {
      type: GraphQLString,
      resolve: ({ code }: LocationArea): string => code,
    },
  },
});
