// @flow

import config from '../../../../config/application';
import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import booking from '../../datasets/booking-item-multicity-4903131.json';

beforeEach(() => {
  RestApiMock.onGet(config.restApiEndpoint.allBookings).replyWithData([
    booking,
  ]);
  RestApiMock.onGet(
    'https://booking-api.skypicker.com/api/v0.1/users/self/bookings/4903131?simple_token=random-token',
  ).replyWithData(booking);
});

describe('single booking query with multicity', () => {
  it('should return multicity details', async () => {
    const query = `{
      booking(id: 4903131) {
        type
        multicity {
          destinationImageUrl(dimensions: _610x251)
          directAccessURL(deeplinkTo: TRAVEL_DOCUMENTS)
          trips {
            departure {
              time
            }
            arrival {
              time
            }
            duration
            legs {
              departure {
                time
              }
              arrival {
                time
              }
              duration
            }
          }
        }
        oneWay {
          id
        }
        return {
          id
        }
      }
    }`;
    expect(await graphql(query)).toMatchSnapshot();
  });
});
