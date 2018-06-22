// @flow

import { toGlobalId } from 'graphql-relay';
import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import config from '../../../../config/application';
import articleMockData from '../../datasets/FAQArticle-44.json';

const goodId = '44';
const globalId = toGlobalId('FAQArticle', goodId);

beforeEach(() => {
  RestApiMock.onGet(config.restApiEndpoint.FAQArticle(goodId)).replyWithData(
    articleMockData,
  );
});

const commentMutation = `
  mutation($articleId: ID!, $type: FAQCommentType!, $comment: String!) {
    addFAQArticleComment(id: $articleId, type: $type, comment: $comment) {
      id
    }
  }
`;
describe('FAQArticleComment mutation', () => {
  it('should comment successfully with "other" type', async () => {
    RestApiMock.onPost(
      config.restApiEndpoint.FAQArticleComment(goodId),
    ).replyWithData({
      message: 'yummy indeed',
    });
    expect(
      await graphql(commentMutation, {
        articleId: globalId,
        comment: 'hola',
        type: 'OTHER',
      }),
    ).toMatchSnapshot();
  });
  it('should return WRONG comment type', async () => {
    expect(
      await graphql(commentMutation, {
        articleId: globalId,
        comment: 'hola',
        type: 'wrongType',
      }),
    ).toMatchSnapshot();
  });
});
