// @flow

import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import FAQCategory from '../types/outputs/FAQCategory';
import FAQSection from '../types/enums/FAQSection';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import type { FAQCategoryItem } from '../dataloaders/FAQCategories';

const findCategory = (
  categories: $ReadOnlyArray<FAQCategoryItem>,
  categoryId: number,
): FAQCategoryItem | null => {
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
    section: {
      type: FAQSection,
      description:
        'Fetch only subsection of FAQ based on the current situation of customer.',
    },
  },
  resolve: async (
    ancestor: mixed,
    { id, section }: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    const categoryId = Number(fromGlobalId(id).id);
    const categories = await dataLoader.FAQCategories.load({
      // dataloader needs to be called with value => null can't be used as default
      section: section || 'all',
    });

    const category = findCategory(categories, categoryId);

    if (!category) {
      throw new Error(`No FAQ category found with ID ${id}`);
    }

    return category;
  },
};
