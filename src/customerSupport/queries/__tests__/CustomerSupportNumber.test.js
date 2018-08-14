// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import CSNumberEnabledDataset from '../../datasets/csNumberEnabled.json';

RestApiMock.onGet(
  'https://booking-api.skypicker.com/api/v0.1/configs/kiwicom',
).replyWithData(CSNumberEnabledDataset);

describe('customerSupportNumber query', () => {
  it('should return the customer support number for the locale in the context', async () => {
    const customerSupportNumberQuery = `{
      customerSupportNumber {
        localeTerritory
        number
      }
    }`;
    expect(await graphql(customerSupportNumberQuery)).toMatchInlineSnapshot(`
Object {
  "data": Object {
    "customerSupportNumber": Object {
      "localeTerritory": "westeros",
      "number": "123 666666",
    },
  },
}
`);
  });
});
