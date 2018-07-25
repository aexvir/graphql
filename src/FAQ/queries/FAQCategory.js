// @flow

import { GraphQLID, GraphQLNonNull } from 'graphql';

import FAQCategory from '../types/outputs/FAQCategory';
import FAQSection from '../types/enums/FAQSection';
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
    section: {
      type: FAQSection,
      description:
        'DEPRECATED: Subsection of FAQ is handled automatically now, this has no effect.' +
        'Fetch only subsection of FAQ based on the current situation of customer.',
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
