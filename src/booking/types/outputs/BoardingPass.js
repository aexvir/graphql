// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import Leg from '../../../flight/types/outputs/Leg';

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
    leg: {
      type: Leg,
      resolve: ({ legs, flightNumber }) =>
        legs.filter(leg => leg.id === flightNumber)[0],
    },
  },
});
