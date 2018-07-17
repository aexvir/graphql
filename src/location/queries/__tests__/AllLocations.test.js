// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import config from '../../../../config/application';
import AllLocations from '../AllLocations';
import PragueDataset from '../../datasets/prague.json';

RestApiMock.onGet(
  config.restApiEndpoint.allLocations({ term: 'PRG', locale: 'en-US' }),
).replyWithData(PragueDataset);

describe('all locations query', () => {
  it('should be list of location types', () => {
    expect(AllLocations.type.toString()).toBe('LocationConnection');
  });

  it('should return locations', async () => {
    const query = `{
      allLocations(search: "PRG", first: 20) {
        edges {
          node {
            locationId
            name
            slug
            timezone
            location {
              lat
              lng
            }
            type
            city {
              locationId
            }
            subdivision {
              locationId
              name
              slug
            }
            country {
              locationId
              name
              slug
            }
            rank
            code
          }
        }
      }
    }`;
    expect(await graphql(query)).toMatchSnapshot();
  });
});
