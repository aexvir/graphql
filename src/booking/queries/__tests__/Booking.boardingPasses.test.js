// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import config from '../../../../config/application';
import AllBookingsDataset from '../../datasets/AllBookings.json';
import Booking2707229Dataset from '../../datasets/booking-2707229.json';
import Booking2707251Dataset from '../../datasets/booking-2707251.json';

const { allBookings } = config.restApiEndpoint;

beforeEach(() => {
  RestApiMock.onGet(config.restApiEndpoint.allBookings).replyWithData(
    AllBookingsDataset,
  );
  RestApiMock.onGet(
    `${allBookings}/2707251\\?simple_token=[0-9a-f-]{36}`,
  ).replyWithData(Booking2707251Dataset);
  RestApiMock.onGet(
    `${allBookings}/2707229\\?simple_token=[0-9a-f-]{36}`,
  ).replyWithData(Booking2707229Dataset);
});

it('should return boarding passes', async () => {
  const boardingPassQuery = `{
      booking(id: 2707251) {
        assets {
          boardingPasses {
            flightNumber
            boardingPassUrl
          }
        }
      }
    }`;
  expect(await graphql(boardingPassQuery)).toMatchSnapshot();
});
