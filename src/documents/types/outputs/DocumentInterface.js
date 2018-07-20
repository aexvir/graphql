// @flow

import { GraphQLInterfaceType, GraphQLString } from 'graphql';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';
import type { Document } from '../../Document';

export const commonFields = {
  url: {
    type: GraphQLString,
    description: 'URL of the document',
    resolve: (
      { urls }: Document,
      args: {},
      context: GraphqlContextType,
    ): string => {
      const language = context.locale.language;
      const url = urls[language];
      if (url) {
        return url;
      }
      return urls.default;
    },
  },
};

export default new GraphQLInterfaceType({
  name: 'DocumentInterface',
  resolveType: ({ type }) => type,
  fields: commonFields,
});
