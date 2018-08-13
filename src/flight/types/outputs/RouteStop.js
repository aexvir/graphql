// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import type { GraphQLResolveInfo } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import Location from '../../../location/types/outputs/Location';

import type { DepartureArrival } from '../../Flight';
import type { Location as LocationType } from '../../../location/Location';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';

export default new GraphQLObjectType({
  name: 'RouteStop',
  fields: {
    airport: {
      type: Location,
      resolve: (
        { where }: DepartureArrival,
        args: Object,
        { dataLoader, options, locale }: GraphqlContextType,
        { path }: GraphQLResolveInfo,
      ): Promise<LocationType> => {
        const queryOptions = options.getOptions(path) || {};
        const selectedLocale = queryOptions.locale || locale.format.dashed;
        return dataLoader.location.loadById(where.code, selectedLocale);
      },
    },

    time: {
      type: GraphQLDateTime,
      resolve: ({ when }: DepartureArrival): ?Date =>
        when == null ? null : when.utc, // intentional ==, can be null or undefined
    },

    localTime: {
      type: GraphQLDateTime,
      resolve: ({ when }: DepartureArrival): ?Date =>
        when == null ? null : when.local, // intentional ==, can be null or undefined
    },
    cityId: {
      type: GraphQLString,
      description: 'City id of the route stop',
      resolve: ({ where }: DepartureArrival): string => where.cityId,
    },

    terminal: {
      type: GraphQLString,
      description: 'Terminal of the route stop',
      resolve: async (
        parent: DepartureArrival,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<?string> => {
        const { bid, authToken } = parent;

        if (!bid || !authToken) {
          return null;
        }
        const booking = await dataLoader.singleBooking.load({
          id: bid,
          authToken,
        });

        const possibleFlights = booking.legs
          .map(leg => [leg.departure, leg.arrival])
          .reduce((arr, elem) => [...arr, ...elem]);

        const findMyFlight = possibleFlights.find(
          flight =>
            flight.when &&
            parent.when &&
            new Date(flight.when.local) - new Date(parent.when.local) === 0,
        );

        return findMyFlight ? findMyFlight.where.terminal : null;
      },
    },

    gate: {
      type: GraphQLString,
      description: 'Gate for the route stop',
      resolve: ({ where }: DepartureArrival): ?string => where.gate,
    },
  },
});
