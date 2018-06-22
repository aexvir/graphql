// @flow

import Dataloader from 'dataloader/index';
import stringify from 'json-stable-stringify';

import { get } from '../../common/services/HttpRequest';
import Config from '../../../config/application';

type NotFound = {|
  detail: string,
|};
type ValidResponse = {
  id: number,
  content: string,
  title: string,
  perex: string,
  upvotes: number,
  downvotes: number,
};
type APIResponse = NotFound | ValidResponse;

export type FAQArticleDetail = ValidResponse & {
  language: string,
};

export type Args = {|
  originalId: string,
|};

const FAQArticle = async (
  originalId: string,
  language: string,
): Promise<FAQArticleDetail> => {
  const url = Config.restApiEndpoint.FAQArticle(originalId);
  const article: APIResponse = await get(url, null, {
    'Accept-Language': language,
  });

  if (!article || article.detail) {
    throw new Error(`Article with id ${originalId} was not found.`);
  }

  return {
    ...article,
    language,
  };
};

const batchLoad = async (
  inputs: $ReadOnlyArray<Args>,
  language: string,
): Promise<Array<FAQArticleDetail>> => {
  const promises = inputs.map(({ originalId }: Args) =>
    FAQArticle(originalId, language),
  );

  return Promise.all(promises);
};

export default function createFAQLoader(language: string) {
  return new Dataloader(queries => batchLoad(queries, language), {
    cacheKeyFn: key => stringify(key),
  });
}
