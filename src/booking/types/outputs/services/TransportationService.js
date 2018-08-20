// @flow

import { GraphQLList, GraphQLObjectType } from 'graphql';

import TransportationServiceRelevantLocations from './TransportationServiceRelevantLocations';

export default new GraphQLObjectType({
  name: 'TransportationService',
  fields: {
    relevantLocations: {
      type: GraphQLList(TransportationServiceRelevantLocations),
      resolve: ancestor => {
        return ancestor;
      },
    },
  },
});
