// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import Booking2707229 from '../../datasets/booking-2707229.json';

beforeEach(() => {
  RestApiMock.onGet(
    'https://booking-api.skypicker.com/api/v0.1/users/self/bookings/2707229\\?simple_token=[0-9a-f-]{36}',
  ).replyWithData(Booking2707229);
});

it('should return gate', async () => {
  const query = `
    query($id: Int!, $authToken: String!) {
      singleBooking(id: $id, authToken: $authToken) {
        ... on BookingOneWay {
          trip {
            departure {
              gate
            }
          }
        }
      }
    }
    `;
  expect(
    await graphql(query, {
      id: 2707229,
      authToken: 'b834267c-def7-4dc8-1661-a5283d25d5e9',
    }),
  ).toEqual({
    data: { singleBooking: { trip: { departure: { gate: '4B' } } } },
  });
});
