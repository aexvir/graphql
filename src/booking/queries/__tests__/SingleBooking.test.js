// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import Booking from '../Booking';
import Booking2707251 from '../../datasets/booking-2707251.json';

describe('singleBooking query', () => {
  it('should be of Booking type', () => {
    expect(Booking.type.toString()).toBe('Booking');
  });

  it('should return valid fields', async () => {
    RestApiMock.onGet(
      'https://booking-api.skypicker.com/api/v0.1/users/self/bookings/2707251\\?simple_token=[0-9a-f-]{36}',
    ).replyWithData(Booking2707251);

    const query = `
    query($id: Int!, $authToken: String!) {
      singleBooking(id: $id, authToken: $authToken) {
        id
        price{
          amount
          currency
        }
        bookingDate
        destinationImageUrl
        directAccessURL
        passengerCount
        passengers {
          nationality
        }
        bookingDate
        assets{
          ticketUrl
        }
      }
    }`;
    expect(
      await graphql(query, {
        id: 2707251,
        authToken: 'b834267c-def7-4dc8-1661-a5283d25d5e9',
      }),
    ).toMatchSnapshot();
  });
});
