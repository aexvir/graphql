// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

import type { OperatingAirline } from '../../Flight';

export default new GraphQLObjectType({
  name: 'OperatingAirline',
  fields: {
    iata: {
      type: GraphQLString,
      description: 'IATA code of the operating airline.',
      resolve: ({ iata }: OperatingAirline): string => iata,
    },
    name: {
      type: GraphQLString,
      resolve: ({ name }: OperatingAirline): string => name,
    },
  },
});
