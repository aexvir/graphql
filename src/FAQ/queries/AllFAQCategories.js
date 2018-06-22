// @flow

import { GraphQLEnumType } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import FAQCategory from './../types/outputs/FAQCategory';
import LanguageInput from '../../common/types/inputs/LanguageInput';
import { connectionFromArray } from '../../common/services/ArrayConnection';

const { connectionType: FaqCategoriesConnection } = connectionDefinitions({
  nodeType: FAQCategory,
});

const FAQSection = new GraphQLEnumType({
  name: 'FAQSection',
  values: {
    BEFORE_BOOKING: { value: 'beforeBooking' },
    UPCOMING_BOOKING: { value: 'upcomingBooking' },
    URGENT_BOOKING: { value: 'urgentBooking' },
    PAST_BOOKING: { value: 'pastBooking' },
  },
});

export default {
  type: FaqCategoriesConnection,
  description: 'Retrieve list of FAQ categories.',
  args: {
    language: {
      type: LanguageInput,
      description:
        'DEPRECATED - use "Accept-Language" HTTP header to specify locale.' +
        'Language in which the titles and perexes of FAQ categories are returned.',
    },
    section: {
      type: FAQSection,
      description:
        'Fetch only subsection of FAQ based on the current situation of customer.',
    },
    ...connectionArgs,
  },
  resolve: async (
    ancestor: mixed,
    { language, section, ...args }: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    const results = await dataLoader.FAQCategories.load({
      // dataloader needs to be called with value => null can't be used as default
      section: section || 'all',
    });

    return connectionFromArray(results, args);
  },
};
