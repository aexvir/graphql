// @flow

import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import FAQCategory, {
  type FAQCategoryType,
} from '../types/outputs/FAQCategory';
import LanguageInput from '../../common/types/inputs/LanguageInput';

const findCategory = (
  categories: FAQCategoryType[],
  categoryId: number,
): FAQCategoryType | null => {
  const parentCategory = categories.find(c => c.id === categoryId);

  if (parentCategory) {
    return parentCategory;
  }

  for (const category of categories) {
    const subcategories = category.subcategories || [];
    const subcategory = findCategory(subcategories, categoryId);

    if (subcategory) {
      return subcategory;
    }
  }

  return null;
};

export default {
  type: FAQCategory,
  description:
    'Retrieve specific FAQ category and its subcategories & articles.',
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'ID of FAQ category to retrieve.',
    },
    language: {
      type: LanguageInput,
      description:
        'DEPRECATED - use "Accept-Language" HTTP header to specify locale.' +
        'Language in which the titles and perexes of FAQ categories are returned.',
    },
  },
  resolve: async (
    ancestor: mixed,
    { id }: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    const categoryId = Number(fromGlobalId(id).id);
    const categories = await dataLoader.FAQCategories.load({ section: 'all' });

    const category = findCategory(categories, categoryId);

    if (!category) {
      throw new Error(`No FAQ category found with ID ${id}`);
    }

    return category;
  },
};
