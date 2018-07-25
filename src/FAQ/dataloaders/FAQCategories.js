// @flow

import Dataloader from 'dataloader';
import { fromGlobalId } from 'graphql-relay';

import { get } from '../../common/services/HttpRequest';

export type FAQArticleItem = $ReadOnly<{|
  id: number,
  url: string,
  title: string,
  perex: string,
  upvotes: number,
  downvotes: number,
|}>;

export type FAQCategoryItem = $ReadOnly<{
  id: number,
  title: string,
  perex: string,
  subcategories: $ReadOnlyArray<FAQCategoryItem>,
  FAQs: $ReadOnlyArray<FAQArticleItem>,
  ancestors: $ReadOnlyArray<FAQCategoryItem>,
}>;

type FAQSectionType =
  | 'beforeBooking'
  | 'upcomingBooking'
  | 'urgentBooking'
  | 'pastBooking';

type Args = {
  section?: FAQSectionType,
};

const sectionToCategories: { [FAQSectionType]: number } = {
  beforeBooking: 76,
  upcomingBooking: 77,
  urgentBooking: 78,
  pastBooking: 100,
};

const fetchFAQCategories = async (
  section: FAQSectionType | 'all',
  language: string,
  rootCategoryId: string,
): Promise<FAQCategoryItem[]> => {
  let categories = await get(
    `https://api.skypicker.com/knowledgebase/api/v1/categories/${rootCategoryId}`,
    null,
    {
      'Accept-Language': language,
    },
  );

  if (section !== 'all' && sectionToCategories[section]) {
    const sectionId = sectionToCategories[section];
    const category = categories.find(category => category.id === sectionId);

    categories = category && category.childrens ? category.childrens : [];
  }

  return categories
    .map(sanitizeCategory)
    .map(category => addAncestors(category));
};

const batchLoad = async (
  args: $ReadOnlyArray<Args>,
  language: string,
  rootCategoryId: string,
) => {
  const promises = args.map(args =>
    fetchFAQCategories(
      (args && args.section) || 'all',
      language,
      rootCategoryId,
    ),
  );

  return Promise.all(promises);
};

const sanitizeCategory = category => ({
  id: category.id,
  title: category.title,
  perex: category.perex,
  subcategories: category.childrens
    ? category.childrens.map(sanitizeCategory)
    : [],
  FAQs: category.articles || [],
  ancestors: [],
});

const addAncestors = (category, ancestor = null) => {
  return {
    ...category,
    ancestors: ancestor
      ? category.ancestors.concat([ancestor])
      : category.ancestors,
    subcategories: category.subcategories.map(subcategory =>
      addAncestors(subcategory, category),
    ),
  };
};

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
const omitSectionCategories = (category: FAQCategoryItem): FAQCategoryItem => ({
  ...category,
  ancestors: category.ancestors.filter(c => !sectionCategories.has(c.id)),
  subcategories: category.subcategories.map(omitSectionCategories),
});

export default class FAQCategoriesLoader {
  dataLoader: Dataloader<Args, FAQCategoryItem[]>;

  constructor(language: string, rootCategoryId: string) {
    this.dataLoader = new Dataloader(queries =>
      batchLoad(queries, language, rootCategoryId),
    );
  }

  loadOneById = async (id: string) => {
    const categoryId = Number(fromGlobalId(id).id);
    // dataloader needs to be called with value, that's why {}
    const categories = await this.dataLoader.load({});
    const category = findCategory(categories, categoryId);

    if (!category) {
      throw new Error(`No FAQ category found with ID ${id}`);
    }

    return omitSectionCategories(category);
  };

  loadAllBySection = (section?: FAQSectionType) => {
    return this.dataLoader.load({
      section: section,
    });
  };
}
