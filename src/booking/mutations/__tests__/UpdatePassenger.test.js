// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import * as Http from '../../../common/services/HttpRequest';

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

  it('should getPayload correctly when called with expiryDate', async () => {
    const spy = jest.spyOn(Http, 'patch');
    await graphql(
      `
        mutation($id: ID!, $passengers: [PassengerInput!]!) {
          updatePassenger(id: $id, passengers: $passengers) {
            success
          }
        }
      `,
      queryParams,
    );
    expect(spy).toHaveBeenCalledWith(
      'https://booking-api.skypicker.com/mmb/v1/bookings/123456/passengers',
      {
        '123': {
          document_expiry: new Date('2020-02-20'),
          document_number: '123321',
        },
      },
      { 'kw-user-token': 'test_token' },
    );
  });

  it('should getPayload correctly when called with expiryDate null', async () => {
    const spy = jest.spyOn(Http, 'patch');
    await graphql(
      `
        mutation($id: ID!, $passengers: [PassengerInput!]!) {
          updatePassenger(id: $id, passengers: $passengers) {
            success
          }
        }
      `,
      {
        id: 'Qm9va2luZ1JldHVybjoxMjM0NTY=',
        passengers: [
          {
            passengerId: 123,
            documentExpiry: null,
            documentNumber: '123321',
          },
        ],
      },
    );
    expect(spy).toHaveBeenCalledWith(
      'https://booking-api.skypicker.com/mmb/v1/bookings/123456/passengers',
      {
        '123': {
          document_number: '123321',
        },
      },
      { 'kw-user-token': 'test_token' },
    );
  });
});
