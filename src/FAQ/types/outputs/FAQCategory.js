// @flow

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import FAQArticle from './FAQArticle';
import { globalIdField } from '../../../common/services/OpaqueIdentifier';
import type { FAQCategoryItem } from '../../dataloaders/FAQCategories';

const FAQCategory = new GraphQLObjectType({
  name: 'FAQCategory',
  fields: () => ({
    id: globalIdField('FAQCategory', ({ id }: FAQCategoryItem) => String(id)),
    originalId: {
      type: GraphQLInt,
      description: 'Original numeric id of the FAQ category',
      resolve: ({ id }: FAQCategoryItem) => id,
    },
    title: {
      type: GraphQLString,
      description: 'Title of the FAQ category',
      resolve: ({ title }: FAQCategoryItem) => title,
    },
    perex: {
      type: GraphQLString,
      description: 'Perex of the FAQ category',
      resolve: ({ perex }: FAQCategoryItem) => perex,
    },
    subcategories: {
      type: new GraphQLList(FAQCategory),
      description: 'List of subcategories',
      resolve: ({ subcategories }: FAQCategoryItem) => subcategories,
    },
    ancestors: {
      type: new GraphQLList(FAQCategory),
      description: 'List of ancestor categories in the tree from the root.',
      resolve: ({ ancestors }: FAQCategoryItem) => ancestors,
    },
    FAQs: {
      type: new GraphQLList(FAQArticle),
      description: 'List of FAQ articles',
      resolve: ({ FAQs }: FAQCategoryItem) => FAQs,
    },
  }),
});

export default FAQCategory;
