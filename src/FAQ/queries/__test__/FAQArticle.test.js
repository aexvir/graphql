// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import FAQArticle from '../../datasets/FAQArticle-39.json';

describe('FAQArticle', () => {
  beforeEach(() => {
    RestApiMock.onGet(
      'https://api.skypicker.com/knowledgebase/api/v1/articles/39',
    ).replyWithData(FAQArticle);
  });

  it('should return article detail', async () => {
    const id = 'RkFRQXJ0aWNsZTozOQ==';
    const query = `
      query FAQArticle($id: ID!) {
        FAQArticle(id: $id, language: en) {
          id
          originalId
          title
          perex
          content
        }
      }
    `;
    expect(await graphql(query, { id })).toMatchSnapshot();
  });

  it('should return wrong response', async () => {
    const id = '43453';
    const query = `
      query FAQArticle($id: ID!) {
        FAQArticle(id: $id, language: en) {
          id
          title
          perex
          content
        }
      }
    `;
    expect(await graphql(query, { id })).toMatchSnapshot();
  });
});
