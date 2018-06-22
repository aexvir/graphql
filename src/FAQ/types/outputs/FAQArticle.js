// @flow

import { GraphQLInt, GraphQLString, GraphQLObjectType } from 'graphql';

import { globalIdField } from '../../../common/services/OpaqueIdentifier';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';
import type { FAQArticleDetail } from '../../dataloaders/getFAQArticle';
import type { FAQArticleItem } from '../../dataloaders/getFAQCategory';
import type { ArticleFromSearch } from '../../dataloaders/searchFAQ';

type FAQArticleResponse = FAQArticleItem | FAQArticleDetail | ArticleFromSearch;

export type FAQArticleType = {|
  id: number,
  originalId: number,
  title: string,
  perex: string,
  content: string,
  upvotes: number,
  downvotes: number,
|};

export default new GraphQLObjectType({
  name: 'FAQArticle',
  fields: {
    id: globalIdField('FAQArticle', (response: FAQArticleResponse) =>
      String(response.id),
    ),
    originalId: {
      type: GraphQLInt,
      description: 'Original numeric id of the article',
      resolve: ({ id }: FAQArticleResponse): number => id,
    },
    title: {
      type: GraphQLString,
      description: 'Title of the article',
      resolve: ({ title }: FAQArticleResponse): string => title,
    },
    perex: {
      type: GraphQLString,
      description: 'Perex of the article',
      resolve: ({ perex }: FAQArticleResponse): string => perex,
    },
    content: {
      type: GraphQLString,
      description: 'Content of the article',
      resolve: async (
        response: FAQArticleResponse,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<string> => {
        // "content" is present only for FAQArticleDetail
        const article = await dataLoader.FAQArticle.load({
          originalId: String(response.id),
        });
        return article.content;
      },
    },
    upvotes: {
      type: GraphQLInt,
      description: 'Upvotes about the utility of the article',
      resolve: ({ upvotes }: FAQArticleResponse): number => upvotes,
    },
    downvotes: {
      type: GraphQLInt,
      description: 'Downvotes about the utility of the article',
      resolve: ({ downvotes }: FAQArticleResponse): number => downvotes,
    },
  },
});
