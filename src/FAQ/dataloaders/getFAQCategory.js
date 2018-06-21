// @flow

import Dataloader from 'dataloader';
import Config from '../../../config/application';
import { get } from '../../common/services/HttpRequest';
import type { FAQCategoryType } from '../types/outputs/FAQCategory';

export type FAQArticleItem = $ReadOnly<{|
  id: number,
  url: string,
  title: string,
  perex: string,
  upvotes: number,
  downvotes: number,
|}>;

export type Args = {||};

const listFAQ = async (language: string): Promise<FAQCategoryType[]> => {
  const categories = await get(
    Config.restApiEndpoint.allFAQCategories(),
    null,
    {
      'Accept-Language': language,
    },
  );

  return categories
    .map(sanitizeCategory)
    .map(category => addAncestors(category));
};

const batchLoad = async (
  categories: $ReadOnlyArray<Args>,
  language: string,
) => {
  const promises = categories.map(() => listFAQ(language));

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

export default function createFAQLoader(language: string) {
  return new Dataloader(queries => batchLoad(queries, language));
}
