// @flow

import { GraphQLObjectType, GraphQLList } from 'graphql';

import HotelServiceRelevantLocation from './HotelServiceRelevantLocation';

type AncestorType = {|
  +relevantLocationCodes: $ReadOnlyArray<string>,
|};

export default new GraphQLObjectType({
  name: 'HotelService',
  fields: {
    relevantLocations: {
      type: GraphQLList(HotelServiceRelevantLocation),
      resolve: ({ relevantLocationCodes }: AncestorType) =>
        relevantLocationCodes,
    },
  },
});
