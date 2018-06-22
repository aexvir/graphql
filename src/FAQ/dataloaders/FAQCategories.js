// @flow

import Dataloader from 'dataloader';
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

export type FAQSectionType =
  | 'beforeBooking'
  | 'upcomingBooking'
  | 'urgentBooking'
  | 'pastBooking';

export type Args = {|
  section: FAQSectionType | 'all',
|};

const sectionToCategories: { [FAQSectionType]: number } = {
  beforeBooking: 76,
  upcomingBooking: 77,
  urgentBooking: 78,
  pastBooking: 100,
};

const listFAQ = async (
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
  const promises = args.map(({ section }) =>
    listFAQ(section, language, rootCategoryId),
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

export default function createFAQLoader(
  language: string,
  rootCategoryId: string,
) {
  return new Dataloader(queries =>
    batchLoad(queries, language, rootCategoryId),
  );
}
