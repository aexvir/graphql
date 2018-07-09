// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import config from '../../../../config/application';
import BookingTimeline from '../BookingTimeline';
import AllBookingsDataset from '../../datasets/AllBookings.json';
import Booking2707251 from '../../datasets/booking-2707251.json';
import Booking2707224 from '../../datasets/booking-2707224.json';
import AirlinesDataset from '../../../flight/datasets/airlines.json';

const dateNow = Date.now;

beforeEach(() => {
  RestApiMock.onGet(config.restApiEndpoint.allBookings).replyWithData(
    AllBookingsDataset,
  );
  RestApiMock.onGet(config.restApiEndpoint.airlines).replyWithData(
    AirlinesDataset,
  );
  RestApiMock.onGet(
    'https://booking-api.skypicker.com/api/v0.1/users/self/bookings/2707251?simple_token=b206db64-718f-4608-babb-0b8abe6e1b9d',
  ).replyWithData(Booking2707251);
  RestApiMock.onGet(
    'https://booking-api.skypicker.com/api/v0.1/users/self/bookings/2707224?simple_token=c3f29dd0-18a7-4062-9162-b58f4022fc70',
  ).replyWithData(Booking2707224);

  ['CDG', 'LGW', 'PRG', 'KUF'].forEach(iata => {
    RestApiMock.onGet(
      config.restApiEndpoint.allLocations({
        type: 'id',
        id: iata,
        locale: 'en-US',
      }),
    ).replyWithData({
      locations: [
        {
          id: 'MOCKED',
          city: {
            name: 'Mocked City Name',
          },
        },
      ],
    });
  });

  global.Date.now = jest.fn(() => 1482363367071);
});

afterEach(() => {
  global.Date.now = dateNow;
});

describe('single booking timeline query', () => {
  it('should be of BookingTimeline type', () => {
    expect(BookingTimeline.type.toString()).toBe('BookingTimeline');
  });

  it('should not accept database id', async () => {
    const databaseIdQuery = `{
      bookingTimeline(id: 2707251) {
        __typename
      }
    }`;
    expect(await graphql(databaseIdQuery)).toMatchSnapshot();
  });

  it('should work with opaque Booking id', async () => {
    const query = `{
      bookingTimeline(id: "Qm9va2luZzoyNzA3MjUx") {
        events {
          __typename
            timestamp
          ... on DownloadInvoiceTimelineEvent{
            invoiceUrl
            numberPassengers
            legs {
              departure {
                airport {
                  city {
                    name
                  }
                }
              }
              arrival{
                airport {
                  city {
                    name
                  }
                }
              }
            }
          }
          ... on  DownloadETicketTimelineEvent {
            ticketUrl
          }
          ... on  AirportArrivalTimelineEvent {
            location {
              airport {
                city {
                  locationId
                  name
                  slug
                }
              }
            }
          }
          ... on BoardingTimelineEvent {
            terminal
          }
          ... on  DepartureTimelineEvent {
            location {
              airport {
                city {
                  name
                }
              }
            }
            duration
            airline {
              code
              name
            }
            flightNumber
          }
          ... on  ArrivalTimelineEvent {
            location {
              airport {
                city {
                  locationId
                  name
                  slug
                }
              }
            }
          }
        }
      }
    }`;
    expect(await graphql(query)).toMatchSnapshot();
  });

  it('should work with opaque Booking id (terminal included)', async () => {
    const query = `{
      bookingTimeline(id: "Qm9va2luZzoyNzA3MjI04o+OIAo=") {
        events {
          __typename
            timestamp
          ... on DownloadInvoiceTimelineEvent{
            invoiceUrl
            numberPassengers
            legs {
              departure {
                airport {
                  city {
                    name
                  }
                }
              }
              arrival{
                airport {
                  city {
                    name
                  }
                }
              }
            }
          }
          ... on  DownloadETicketTimelineEvent {
            ticketUrl
          }
          ... on  AirportArrivalTimelineEvent {
            location {
              airport {
                city {
                  locationId
                  name
                  slug
                }
              }
            }
          }
          ... on BoardingTimelineEvent {
            terminal
          }
          ... on  DepartureTimelineEvent {
            location {
              airport {
                city {
                  name
                }
              }
            }
            duration
            airline {
              code
              name
            }
            flightNumber
          }
          ... on  ArrivalTimelineEvent {
            location {
              airport {
                city {
                  locationId
                  name
                  slug
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
