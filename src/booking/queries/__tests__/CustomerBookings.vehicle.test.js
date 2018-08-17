// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import AllBookingsDataset from '../../datasets/AllBookings.json';
import Booking2707224 from '../../datasets/booking-2707224.json';

describe('CustomerBookings', () => {
  beforeEach(() => {
    RestApiMock.onGet(
      'https://booking-api.skypicker.com/api/v0.1/users/self/bookings',
    ).replyWithData([AllBookingsDataset[2]]);
    RestApiMock.onGet(
      'https://booking-api.skypicker.com/api/v0.1/users/self/bookings/2707224?simple_token=c3f29dd0-18a7-4062-9162-b58f4022fc70',
    ).replyWithData(Booking2707224);
  });

  it('should return vehicle info', async () => {
    const query = `{
      customerBookings(first: 1) {
        edges {
          node {
            databaseId
            ... on BookingOneWay {
              trip {
                legs {
                  type
                  vehicle {
                    model
                    manufacturer
                  }
                }
              }
            }
          }
        }
      }
    }`;
    expect(await graphql(query)).toMatchSnapshot();
  });
});
