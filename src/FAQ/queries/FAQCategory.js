// @flow

import { GraphQLID, GraphQLNonNull } from 'graphql';

import FAQCategory from '../types/outputs/FAQCategory';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';

export default {
  type: FAQCategory,
  description:
    'Retrieve specific FAQ category and its subcategories & articles.',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'ID of FAQ category to retrieve.',
    },
  },
  resolve: (
    ancestor: mixed,
    { id }: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    return dataLoader.FAQCategories.loadOneById(id);
  },
};
