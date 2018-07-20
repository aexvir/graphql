// @flow

import { graphql } from '../../../common/services/TestingTools';

describe('airHelpPlusOffer query', () => {
  it('should work', async () => {
    const resultsQuery = `{
      airHelpPlusOffer {
        isPossible
        pricePerPerson {
          amount
          currency
        }
      }
    }`;
    expect(await graphql(resultsQuery)).toMatchSnapshot();
  });
});
