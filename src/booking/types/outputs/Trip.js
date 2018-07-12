// @flow

import { GraphQLObjectType, GraphQLList, GraphQLInt } from 'graphql';
import Leg from '../../../flight/types/outputs/Leg';
import GraphQLRouteStop from '../../../flight/types/outputs/RouteStop';
import type { DepartureArrival, Leg as LegType } from '../../../flight/Flight';
import FlightDurationInMinutes from '../../../flight/resolvers/FlightDuration';

export type TripData = {
  departure: DepartureArrival,
  arrival: DepartureArrival,
  legs: LegType[],
  bid: number,
};

export default new GraphQLObjectType({
  name: 'Trip',
  description:
    'Single travel from origin to destination, with possible stopovers.',
  fields: {
    departure: {
      type: GraphQLRouteStop,
      resolve: ({ departure }: TripData): DepartureArrival => departure,
    },

    arrival: {
      type: GraphQLRouteStop,
      resolve: ({ arrival }: TripData): DepartureArrival => arrival,
    },

    duration: {
      type: GraphQLInt,
      description: 'Trip duration in minutes.',
      resolve: ({ departure, arrival }: TripData): ?number => {
        return FlightDurationInMinutes(departure, arrival);
      },
    },

    legs: {
      type: new GraphQLList(Leg),
      resolve: ({ legs }: TripData): LegType[] => legs,
    },
  },
});
