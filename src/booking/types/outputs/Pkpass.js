// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import GraphQLPassenger from './Passenger';

export default new GraphQLObjectType({
  name: 'Pkpass',
  description: 'Url needed for apple wallet integration',
  fields: () => ({
    flightNumber: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
      description: 'The url to the pkpass file', //https://fileinfo.com/extension/pkpass
    },
    passenger: {
      type: GraphQLPassenger,
    },
  }),
});
