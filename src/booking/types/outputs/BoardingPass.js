// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';
import Leg from '../../../flight/types/outputs/Leg';

export default new GraphQLObjectType({
  name: 'BoardingPass',
  fields: () => ({
    // using a thunk here to avoid cryptic errors caused by circular dependency
    flightNumber: {
      type: GraphQLString,
      resolve: ({ flightNumber }) => flightNumber,
    },
    boardingPassUrl: {
      type: GraphQLString,
      resolve: ({ boardingPassUrl }) => boardingPassUrl,
    },
    leg: {
      type: Leg,
      description: 'The leg for the boarding pass',
      resolve: ({ leg }) => leg,
    },
    availableAt: {
      type: GraphQLDate,
      description:
        'The date when the boarding pass will be available for download',
      reslove: ({ availableAt }) => availableAt,
    },
  }),
});
