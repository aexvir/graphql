// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import config from '../../../../config/application';
import AllBookingsDataset from '../../datasets/AllBookings.json';

beforeEach(() => {
  RestApiMock.onGet(config.restApiEndpoint.allBookings).replyWithData(
    AllBookingsDataset,
  );

  [
    'CDG',
    'PRG',
    'LGW',
    'STN',
    'KBP',
    'DXB',
    'KUF',
    'VIE',
    'PEK',
    'HKG',
  ].forEach(iata => {
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

describe('flights query with legs', () => {
  it('should return valid array of flight legs', async () => {
    const legsQuery = `{
      allBookings {
        edges {
          node {
            legs {
              id
              recheckRequired
              arrival {
                airport {
                  city { name }, locationId
                }
                time, localTime
              }
              departure {
                airport {
                  city { name }, locationId
                }
                time, localTime
              }
              guarantee
            }
          }
        }
      }
    }`;
    expect(await graphql(legsQuery)).toMatchSnapshot();
  });
});
