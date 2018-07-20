// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';

beforeEach(() => {
  RestApiMock.onPatch(
    'https://booking-api.skypicker.com/mmb/v1/bookings/123456/passengers',
  ).replyWithData({});
});

const queryParams = {
  id: 'Qm9va2luZ1JldHVybjoxMjM0NTY=',
  passengers: [
    {
      passengerId: 123,
      documentExpiry: '2020-02-20',
      documentNumber: '123321',
    },
  ],
};

describe('UpdatePassenger', () => {
  it('should work', async () => {
    expect(
      await graphql(
        `
          mutation($id: ID!, $passengers: [PassengerInput!]!) {
            updatePassenger(id: $id, passengers: $passengers) {
              success
            }
          }
        `,
        queryParams,
      ),
    ).toEqual({ data: { updatePassenger: { success: true } } });
  });
});
