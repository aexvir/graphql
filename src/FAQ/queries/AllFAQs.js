// @flow

import { GraphQLString } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import FAQArticle from '../types/outputs/FAQArticle';
import LanguageInput from '../../common/types/inputs/LanguageInput';
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
    language: {
      type: LanguageInput,
      description:
        'DEPRECATED - use "Accept-Language" HTTP header to specify locale.' +
        'Language in which the search is made and the answer is returned',
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
