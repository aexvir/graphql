// @flow

import Dataloader from 'dataloader';
import Config from '../../../config/application';
import { get } from '../../common/services/HttpRequest';
import type { FAQCategoryType } from '../types/outputs/FAQCategory';
import ISOLocalesToLanguage from '../../common/types/enums/ISOLocalesToLanguage';

type RawFAQArticleItem = {
  url: string,
  title: string,
  perex: string,
  upvotes: number,
  downvotes: number,
};

export type FAQArticleItem = RawFAQArticleItem & {
  id: string,
};

export type Args = {||};

const FAQ_MENU_CATEGORY = 'menu';

const listFAQ = async (
  language: $Values<typeof ISOLocalesToLanguage>,
): Promise<FAQCategoryType[]> => {
  const rootCategories = await get(
    Config.restApiEndpoint.allFAQCategories(),
    null,
    {
      'Accept-Language': language,
    },
  );
  const rootCategory = (rootCategories || []).find(
    c => c.title === FAQ_MENU_CATEGORY,
  );
  const rootCategoryId = rootCategory && rootCategory.tree_id;

  if (!rootCategoryId) {
    return [];
  }

  const categories = await get(
    Config.restApiEndpoint.allFAQCategories(rootCategoryId),
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
  language: $Values<typeof ISOLocalesToLanguage>,
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
  FAQs: category.articles ? category.articles.map(sanitizeArticle) : [],
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

const sanitizeArticle = (article: RawFAQArticleItem): FAQArticleItem => {
  // Currently "id" field itself is missing in "/categories/:id" endpoint, necessary to get out of an url
  let id = null;

  const matches = article.url && article.url.match(/(\d+)$/);
  if (matches && matches[0] && typeof matches[0] === 'string') {
    id = matches[0];
  }

  if (!id) {
    throw new Error('Error: id field not extracted from url');
  }

  return {
    id,
    ...article,
  };
};

export default function createFAQLoader(
  language: $Values<typeof ISOLocalesToLanguage>,
) {
  return new Dataloader(queries => batchLoad(queries, language));
}
