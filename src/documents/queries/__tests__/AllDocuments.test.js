// @flow

import { graphql } from '../../../common/services/TestingTools';

describe('allDocuments query', () => {
  it('should return allDocuments documents', async () => {
    const allDocumentsQuery = `{
      allDocuments {
        edges {
          node{
            url
            __typename
          }
        }
      }
    }`;
    expect(await graphql(allDocumentsQuery)).toMatchSnapshot();
  });
});
