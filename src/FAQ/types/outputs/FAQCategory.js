// @flow

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import FAQArticle, { type FAQArticleType } from './FAQArticle';
import { globalIdField } from '../../../common/services/OpaqueIdentifier';

export type FAQCategoryType = {|
  id: number,
  originalId: number,
  title: string,
  perex: string,
  subcategories: FAQCategoryType[],
  ancestors: FAQCategoryType[],
  FAQs: FAQArticleType[],
|};

const FAQCategory = new GraphQLObjectType({
  name: 'FAQCategory',
  fields: () => ({
    id: globalIdField('FAQCategory', ({ id }: FAQCategoryType) => String(id)),
    originalId: {
      type: GraphQLInt,
      description: 'Original numeric id of the FAQ category',
      resolve: ({ id }): FAQCategoryType => id,
    },
    title: {
      type: GraphQLString,
      description: 'Title of the FAQ category',
      resolve: ({ title }: FAQCategoryType) => title,
    },
    perex: {
      type: GraphQLString,
      description: 'Perex of the FAQ category',
      resolve: ({ perex }: FAQCategoryType) => perex,
    },
    subcategories: {
      type: new GraphQLList(FAQCategory),
      description: 'List of subcategories',
      resolve: ({ subcategories }: FAQCategoryType) => subcategories,
    },
    ancestors: {
      type: new GraphQLList(FAQCategory),
      description: 'List of ancestor categories in the tree from the root.',
      resolve: ({ ancestors }: FAQCategoryType) => ancestors,
    },
    FAQs: {
      type: new GraphQLList(FAQArticle),
      description: 'List of FAQ articles',
      resolve: ({ FAQs }: FAQCategoryType) => FAQs,
    },
  }),
});

export default FAQCategory;
