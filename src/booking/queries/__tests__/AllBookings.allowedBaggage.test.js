// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import config from '../../../../config/application';
import AllBookingsDataset from '../../datasets/AllBookings.json';
import Booking2707224Dataset from '../../datasets/booking-2707224.json';
import Booking2707229Dataset from '../../datasets/booking-2707229.json';
import Booking2707251Dataset from '../../datasets/booking-2707251.json';

const { allBookings } = config.restApiEndpoint;

beforeEach(() => {
  RestApiMock.onGet(allBookings).replyWithData(AllBookingsDataset);
  RestApiMock.onGet(
    `${allBookings}/2707251\\?simple_token=[0-9a-f-]{36}`,
  ).replyWithData(Booking2707251Dataset);
  RestApiMock.onGet(
    `${allBookings}/2707229\\?simple_token=[0-9a-f-]{36}`,
  ).replyWithData(Booking2707229Dataset);
  RestApiMock.onGet(
    `${allBookings}/2707224\\?simple_token=[0-9a-f-]{36}`,
  ).replyWithData(Booking2707224Dataset);
});

it('should return baggage parameters', async () => {
  const baggageQuery = `{
      allBookings {
        edges {
          node {
            databaseId
            allowedBaggage {
              cabin { height, length, width, weight, note }
              checked { height, length, width, weight, note }
            }
          }
        }
      }
    }`;
  expect(await graphql(baggageQuery)).toMatchSnapshot();
});
