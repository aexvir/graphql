// @flow

import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import FAQCategory from './../types/outputs/FAQCategory';
import FAQSection from '../types/enums/FAQSection';
import { connectionFromArray } from '../../common/services/ArrayConnection';

const { connectionType: FaqCategoriesConnection } = connectionDefinitions({
  nodeType: FAQCategory,
});

export default {
  type: FaqCategoriesConnection,
  description: 'Retrieve list of FAQ categories.',
  args: {
    section: {
      type: FAQSection,
      description:
        'Fetch only subsection of FAQ based on the current situation of customer.',
    },
    ...connectionArgs,
  },
  resolve: async (
    ancestor: mixed,
    { section, ...args }: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    const results = await dataLoader.FAQCategories.loadAllBySection(section);

    return connectionFromArray(results, args);
  },
};
