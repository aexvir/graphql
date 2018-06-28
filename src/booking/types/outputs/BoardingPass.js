// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'BoardingPass',
  fields: {
    flightNumber: {
      type: GraphQLString,
      resolve: ({ flightNumber }) => flightNumber,
    },
    boardingPassUrl: {
      type: GraphQLString,
      resolve: ({ boardingPassUrl }) => boardingPassUrl,
    },
  },
});
