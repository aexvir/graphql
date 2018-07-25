// @flow

import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';

export default new GraphQLInputObjectType({
  name: 'PassengerInput',
  fields: {
    passengerId: {
      type: GraphQLNonNull(GraphQLInt),
    },
    documentExpiry: {
      type: GraphQLDate,
      description: 'Expiry date of travel document',
    },
    documentNumber: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Number of travel document',
    },
  },
});
