// @flow

import { GraphQLString } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import FAQArticle from '../types/outputs/FAQArticle';
import { connectionFromArray } from '../../common/services/ArrayConnection';

import type { GraphqlContextType } from '../../common/services/GraphqlContext';

const { connectionType: FaqConnection } = connectionDefinitions({
  nodeType: FAQArticle,
});

export default {
  type: FaqConnection,
  description: 'Search for Frequently Asked Questions',
  args: {
    search: {
      type: GraphQLString,
      description: 'Keyword for the search',
    },
    ...connectionArgs,
  },
  resolve: async (
    ancestor: mixed,
    { search, ...args }: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    const results = await dataLoader.FAQ.load({
      search,
    });
    return connectionFromArray(results, args);
  },
};
