// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import config from '../../../../config/application';
import BookingTimeline from '../BookingTimeline';
import AllBookingsDataset from '../../datasets/AllBookings.json';
import Booking2707251 from '../../datasets/booking-2707251.json';

beforeEach(() => {
  RestApiMock.onGet(config.restApiEndpoint.allBookings).replyWithData(
    AllBookingsDataset,
  );
  RestApiMock.onGet(
    'https://booking-api.skypicker.com/api/v0.1/users/self/bookings/2707251?simple_token=b206db64-718f-4608-babb-0b8abe6e1b9d',
  ).replyWithData(Booking2707251);

  ['CDG', 'LGW'].forEach(iata => {
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
            gate
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
