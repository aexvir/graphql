// @flow

import { GraphQLID, GraphQLNonNull } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import FAQCategory from '../types/outputs/FAQCategory';
import FAQSection from '../types/enums/FAQSection';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import type { FAQCategoryItem } from '../dataloaders/FAQCategories';
import { sectionToCategories } from '../dataloaders/FAQCategories';

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

const sectionCategories = new Set(Object.values(sectionToCategories));
const omitSectionCategories = category => ({
  ...category,
  ancestors: category.ancestors.filter(c => !sectionCategories.has(c.id)),
  subcategories: category.subcategories.map(omitSectionCategories),
});

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
  resolve: async (
    ancestor: mixed,
    { id }: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    const categoryId = Number(fromGlobalId(id).id);
    // dataloader needs to be called with value, that's why {}
    const categories = await dataLoader.FAQCategories.load({});

    const category = findCategory(categories, categoryId);

    if (!category) {
      throw new Error(`No FAQ category found with ID ${id}`);
    }

    return omitSectionCategories(category);
  },
};
