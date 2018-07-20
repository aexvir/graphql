// @flow

import { GraphQLObjectType, GraphQLBoolean } from 'graphql';

export default new GraphQLObjectType({
  name: 'UpdatePassenger',
  fields: {
    success: {
      type: GraphQLBoolean,
    },
  },
});
