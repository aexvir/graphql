// @flow

import _ from 'lodash';
import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import type { GraphQLResolveInfo } from 'graphql';

import { globalIdField } from '../services/OpaqueIdentifier';
import GraphQLRouteStop from './RouteStop';
import GraphQLLeg from './Leg';
import GraphQLAirline from './Airline';
import GraphQLPrice from './Price';
import FlightDurationInMinutes from '../resolvers/FlightDuration';
import { buildBookingUrl } from '../queries/flight/BookingUrlBuilder';

import type { GraphqlContextType } from '../services/GraphqlContext';
import type { Price } from '../types/Price';
import type { DepartureArrival, Flight, Leg, Airline } from '../types/Flight';

export default new GraphQLObjectType({
  name: 'Flight',
  fields: {
    id: globalIdField(),

    airlines: {
      type: new GraphQLList(GraphQLAirline),
      description: 'List of all Airlines involved.',
      resolve: async (
        { airlines }: Flight,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<Array<?Airline>> =>
        _.uniq(airlines).map(airlineCode =>
          dataLoader.airline.load(airlineCode),
        ),
    },

    departure: {
      type: GraphQLRouteStop,
      resolve: ({ departure }: Flight): DepartureArrival => departure,
    },

    arrival: {
      type: GraphQLRouteStop,
      resolve: ({ arrival }: Flight): DepartureArrival => arrival,
    },

    duration: {
      type: GraphQLInt,
      description: 'Flight duration in minutes.',
      resolve: ({ departure, arrival }: Flight): ?number =>
        FlightDurationInMinutes(departure, arrival),
    },

    legs: {
      type: new GraphQLList(GraphQLLeg),
      description: 'Flight segments, e.g. stopover, change of aircraft, etc.',
      resolve: ({ legs }: Flight): Array<Leg> => legs,
    },

    price: {
      type: GraphQLPrice,
      description: 'Total flight price.',
      resolve: ({ price }: Flight): Price => price,
    },

    bookingUrl: {
      type: GraphQLString,
      description: 'URL to the Kiwi.com for booking the flight.',
      resolve: async (
        { passengers, price, bookingToken }: Flight,
        args: Object,
        { dataLoader, options }: GraphqlContextType,
        { path }: GraphQLResolveInfo,
      ): Promise<string> => {
        const queryOptions = options.getOptions(path);
        const locale = queryOptions ? queryOptions.locale : null;
        return await buildBookingUrl(
          passengers,
          price,
          bookingToken,
          locale,
          dataLoader.rates,
        );
      },
    },
  },
});
