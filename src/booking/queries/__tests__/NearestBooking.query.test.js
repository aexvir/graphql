// @flow

import MockDate from 'mockdate';

import { graphql, RestApiMock } from '../../../common/services/TestingTools';

import config from '../../../../config/application';
import BookingItem2707224 from '../../datasets/booking-2707224.json';
import BookingItem2707229 from '../../datasets/booking-2707229.json';

const createFlight = milliseconds => ({
  arrival: {
    when: {
      utc: milliseconds / 1000,
      local: milliseconds / 1000 + 60 * 60,
    },
  },
  airline: {},
});

MockDate.set(1000);

beforeEach(() => {
  RestApiMock.onGet(config.restApiEndpoint.allBookings).replyWithData([
    {
      ...BookingItem2707224,
      flights: [createFlight(1150), createFlight(1600)],
    },
    {
      ...BookingItem2707229,
      status: 'CANCELLED',
      flights: [createFlight(900), createFlight(2000)],
    },
  ]);
});

it('should return nearest booking', async () => {
  expect(
    await graphql(`
      {
        nearestBooking {
          databaseId
        }
      }
    `),
  ).toEqual({
    data: {
      nearestBooking: {
        databaseId: 2707224,
      },
    },
  });
});


it('should take brand argument', async () => {
  expect(
    await graphql(`
      {
        nearestBooking(brand: "loremipsum") {
          databaseId
        }
      }
    `),
  ).toEqual({
    data: {
      nearestBooking: {
        databaseId: 2707224,
      },
    },
  });
});
