// @flow

import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import FAQArticle from '../types/outputs/FAQArticle';
import LanguageInput from '../../common/types/inputs/LanguageInput';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';

export default {
  type: FAQArticle,
  description: 'Retrieve single FAQ article.',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'ID of FAQ article to retrieve.',
    },
    language: {
      type: LanguageInput,
      description:
        'DEPRECATED - use "Accept-Language" HTTP header to specify locale.' +
        'Language in which the text of the article is returned.',
    },
  },
  resolve: async (
    ancestor: mixed,
    { id }: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    const { id: originalId, type } = fromGlobalId(id);

    if (type !== 'FAQArticle') {
      throw new Error(
        `FAQArticle ID mishmash. You cannot query FAQ with ID ` +
          `'${id}' because this ID is not ID of the FAQArticle. ` +
          `Please use opaque ID of the FAQArticle.`,
      );
    }

    return dataLoader.FAQArticle.load({
      originalId,
    });
  },
};
