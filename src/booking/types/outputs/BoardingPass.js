// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
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
      resolve: ({ legs, flightNumber }) =>
        legs.filter(leg => leg.id === flightNumber)[0] || null,
    },
  }),
});
