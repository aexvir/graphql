// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';
import { DateTime } from 'luxon';
import querystring from 'querystring';

import LocationGraphQLType from '../../../../location/types/outputs/Location';

export default new GraphQLObjectType({
  name: 'TransportationServiceRelevantLocations',
  fields: {
    location: {
      type: LocationGraphQLType,
    },
    whitelabelURL: {
      type: GraphQLString,
      resolve: ({
        date,
        location,
      }: {
        date: Date,
        location: Object,
      }): string => {
        const time = DateTime.fromJSDate(date).toFormat('HH:mm');
        const query = querystring.stringify({
          date: DateTime.fromJSDate(date).toFormat('yyyy-LL-dd'),
          pickup: location.locationId,
          utm_source: 'kiwi',
          utm_medium: 'startpart',
          utm_campaign: 'mobileappconfpage',
        });
        // querystring.stringify uses encodeURIComponent which turns HH:mm into HH%3Amm which rideways does not understand
        return `https://kiwi.rideways.com/?${query}&time=${time}`;
      },
    },
    date: {
      type: GraphQLDate,
    },
  },
});
