// @flow

import config from '../../../../config/application';
import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import AllBookingsDataset from '../../datasets/AllBookings.json';
import Booking2707251 from '../../datasets/booking-2707251.json';

beforeEach(() => {
  RestApiMock.onGet(config.restApiEndpoint.allBookings).replyWithData(
    AllBookingsDataset,
  );
  RestApiMock.onGet(
    'https://booking-api.skypicker.com/api/v0.1/users/self/bookings/2707251?simple_token=b206db64-718f-4608-babb-0b8abe6e1b9d',
  ).replyWithData(Booking2707251);
});

describe('single booking query with one way trip', () => {
  it('should return details just about one way trip', async () => {
    const query = `{
      booking(id: 2707251) {
        type
        oneWay {
          destinationImageUrl(dimensions: _1280x720)
          directAccessURL(deeplinkTo: REFUND)
          trip {
            departure {
              time
            }
            arrival {
              time
            }
            duration
            legs {
              duration
            }
          }
        }
        return {
          id
        }
        multicity {
          id
        }
      }  
    }`;
    expect(await graphql(query)).toMatchSnapshot();
  });
});
