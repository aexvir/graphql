// @flow

import { graphql } from '../../../common/services/TestingTools';

describe('airHelpPlusOffer query', () => {
  it('should work', async () => {
    const resultsQuery = `{
      airHelpPlusOffer(bookingId: "abc123") {
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
