// @flow

import { graphql } from '../../../common/services/TestingTools';

describe('insuranceTerms query', () => {
  it('should return insuranceTerms documents', async () => {
    const insuranceTermsQuery = `{
      allDocuments {
        edges {
          node{
            ...on InsuranceTerms {
              url
              __typename
            }
          }
        }
      }
    }`;
    expect(await graphql(insuranceTermsQuery)).toMatchSnapshot();
  });
});

describe('insuranceTerms query with cs locale', () => {
  it('should return insuranceTerms documents for cs locale', async () => {
    const insuranceTermsQuery = `{
      allDocuments {
        edges {
          node{
            ...on InsuranceTerms {
              url
              __typename
            }
          }
        }
      }
    }`;
    expect(await graphql(insuranceTermsQuery, {}, 'cs_CS')).toMatchSnapshot();
  });
});
