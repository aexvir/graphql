// @flow

import idx from 'idx';
import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLString,
} from 'graphql';
import { globalIdField } from '../../../common/services/OpaqueIdentifier';

import GraphQLRouteStop from './RouteStop';
import GraphQLAirline from './Airline';
import GraphQLOperatingAirline from './OperatingAirline';
import GraphQLVehicle from './Vehicle';
import FlightDurationInMinutes from '../../resolvers/FlightDuration';

import { GraphQLCoveredBy, CoveredBy } from '../enums/CoveredBy';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';
import type { DepartureArrival, Leg, VehicleType } from '../../Flight';
import BoardingPass from '../../../booking/types/outputs/BoardingPass';

const VehicleTypes = new GraphQLEnumType({
  name: 'VehicleType',
  values: {
    BUS: { value: 'bus' },
    TRAIN: { value: 'train' },
    AIRCRAFT: { value: 'aircraft' },
  },
});

export default new GraphQLObjectType({
  name: 'Leg',
  description:
    'Leg is the operation of an aircraft from one scheduled departure station to its next scheduled arrival station.',
  fields: () => ({
    // using a thunk here to avoid cryptic errors caused by circular dependency
    id: globalIdField(),

    airline: {
      type: GraphQLAirline,
      resolve: async (
        { airlineCode }: Leg,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ) => dataLoader.airline.load(airlineCode),
    },

    operatingAirline: {
      type: GraphQLOperatingAirline,
      resolve: ({ operatingAirline }: Leg) => operatingAirline,
    },

    arrival: {
      type: GraphQLRouteStop,
      resolve: ({ arrival }: Leg): DepartureArrival => arrival,
    },

    departure: {
      type: GraphQLRouteStop,
      resolve: ({ departure }: Leg): DepartureArrival => departure,
    },

    duration: {
      type: GraphQLInt,
      description: 'Leg duration in minutes.',
      resolve: ({ departure, arrival }: Leg): ?number =>
        FlightDurationInMinutes(departure, arrival),
    },

    flightNumber: {
      type: GraphQLInt,
      resolve: ({ flightNo }: Leg): number => flightNo,
    },

    pnr: {
      type: GraphQLString,
      description: 'Reservation number related to the leg.',
      resolve: ({ pnr }: Leg): string => pnr,
    },

    recheckRequired: {
      type: GraphQLBoolean,
      resolve: ({ recheckRequired }): boolean => recheckRequired,
    },

    isReturn: {
      type: GraphQLBoolean,
      description: 'Determines whether Leg is related to return flight.',
      resolve: ({ isReturn }): boolean => isReturn,
    },

    vehicle: {
      type: GraphQLVehicle,
      resolve: async (
        originalLeg: Leg,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ) => {
        if (originalLeg.vehicle) {
          return originalLeg.vehicle;
        }

        const leg = await loadLeg(dataLoader, originalLeg);

        return leg ? leg.vehicle : null;
      },
    },

    type: {
      type: VehicleTypes,
      resolve: async (
        originalLeg: Leg,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<?VehicleType> => {
        if (originalLeg.vehicleType) {
          return originalLeg.vehicleType;
        }

        const leg = await loadLeg(dataLoader, originalLeg);

        return leg ? leg.vehicleType : null;
      },
    },

    guarantee: {
      type: GraphQLCoveredBy,
      description: 'Information about who covers the transfer',
      resolve: ({ guarantee }: Leg) =>
        guarantee ? CoveredBy.KIWICOM : CoveredBy.CARRIER,
    },

    boardingPass: {
      type: BoardingPass,
      description: 'Boarding pass for this leg',
      resolve: async (
        { id, bookingId, authToken }: Leg,
        _,
        { dataLoader }: GraphqlContextType,
      ) => {
        if (!bookingId || !authToken) {
          return null;
        }
        const booking = await dataLoader.singleBooking.load({
          id: bookingId,
          authToken,
        });
        const boardingPasses = idx(booking, _ => _.assets.boardingPasses) || [];
        const boardingPass =
          boardingPasses.find(
            boardingPass => boardingPass.flightNumber === id,
          ) || null;

        return boardingPass;
      },
    },
  }),
});

const loadLeg = async (dataLoader, { bookingId, authToken, id }) => {
  if (bookingId && authToken) {
    // needs to be fetched for booking loaded via "dataLoader.bookings.load"
    const booking = await dataLoader.singleBooking.load({
      id: bookingId,
      authToken,
    });

    if (booking && Array.isArray(booking.legs)) {
      return booking.legs.find(leg => leg.id === id);
    }
  }

  return null;
};
