// @flow

import { toGlobalId } from 'graphql-relay';
import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import config from '../../../../config/application';
import Location from '../Location';
import PragueDataset from '../../datasets/prague.json';
import PragueCzDataset from '../../datasets/prague-cs-CZ.json';
import UnknownDataset from '../../datasets/unknown.json';
import RegensburgRailway from '../../datasets/regensburg-railway.json';

RestApiMock.onGet(
  config.restApiEndpoint.allLocations({
    type: 'id',
    id: 'PRG',
    locale: 'en-US',
  }),
).replyWithData(PragueDataset);

RestApiMock.onGet(
  config.restApiEndpoint.allLocations({
    type: 'id',
    id: 'PRG',
    locale: 'cs-CZ',
  }),
).replyWithData(PragueCzDataset);

RestApiMock.onGet(
  config.restApiEndpoint.allLocations({
    type: 'id',
    id: 'unknown_id',
    locale: 'en-US',
  }),
).replyWithData(UnknownDataset);

RestApiMock.onGet(
  config.restApiEndpoint.allLocations({
    type: 'id',
    id: 'PPP',
    locale: 'en-US',
  }),
).replyWithData(UnknownDataset);

RestApiMock.onGet(
  config.restApiEndpoint.allLocations({
    type: 'id',
    id: 'ZPM',
    locale: 'en-US',
  }),
).replyWithData(RegensburgRailway);

describe('location query', () => {
  it('should of type location', () => {
    expect(Location.type.toString()).toBe('Location');
  });

  it('should return location', async () => {
    const query = `{
      location(id: "PRG") {
        locationId
        name
        slug
      }
    }`;
    expect(await graphql(query)).toMatchSnapshot();
  });

  it('should return location in Czech', async () => {
    const query = `{
      location(id: "PRG", locale: cs_CZ) {
        locationId
        name
        slug
      }
    }`;
    expect(await graphql(query)).toMatchSnapshot();
  });

  it('should return error on unknown location', async () => {
    const query = `{
      location(id: "unknown_id") {
        locationId
        name
        slug
      }
    }`;
    expect(await graphql(query)).toMatchSnapshot();
  });
});

describe('location query with opaque ID', () => {
  it('should return location', async () => {
    const id = toGlobalId('location', 'PRG');
    const query = `
      query Location($id: String!){
        location(id: $id) {
          locationId
          name
          slug
        }
      }`;
    expect(await graphql(query, { id })).toMatchSnapshot();
  });

  it('should return location in Czech', async () => {
    const id = toGlobalId('location', 'PRG');
    const query = `
      query Location($id: String!, $locale: Locale!){
        location(id: $id, locale: $locale) {
          locationId
          name
          slug
        }
      }`;
    expect(await graphql(query, { id, locale: 'cs_CZ' })).toMatchSnapshot();
  });

  it('should return error on unknown location', async () => {
    const id = toGlobalId('location', 'PPP');
    const query = `
      query Location($id: String!){
        location(id: $id) {
          locationId
          name
          slug
        }
      }`;
    expect(await graphql(query, { id })).toMatchSnapshot();
  });

  it('should return error on invalid type', async () => {
    const id = toGlobalId('hotel', '123');
    const query = `
      query Location($id: String!){
        location(id: $id) {
          locationId
          name
          slug
        }
      }`;
    expect(await graphql(query, { id })).toMatchSnapshot();
  });

  it('should return country for type station', async () => {
    const query = `
    query Location($id: String!) {
      location(id: $id) {
        name
        type
        country {
          name
          code
        }
      }
    }
    `;
    const response = await graphql(query, { id: 'ZPM ' });
    expect(response.data.location.country.name).toEqual('Germany');
  });
});
