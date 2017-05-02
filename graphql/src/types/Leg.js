// @flow

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
} from 'graphql';
import { toGlobalId } from '../services/OpaqueIdentifier';
import GraphQLArrival from './Arrival';
import GraphQLDeparture from './Departure';

import type { ArrivalType, DepartureType, LegType } from '../Entities';

export default new GraphQLObjectType({
  name: 'Leg',
  description: 'Leg is the operation of an aircraft from one scheduled departure station to its next scheduled arrival station.',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ id }: LegType): string => toGlobalId('leg', id),
    },

    arrival: {
      type: new GraphQLNonNull(GraphQLArrival),
      resolve: ({ arrival }: LegType): ArrivalType => arrival,
    },

    departure: {
      type: new GraphQLNonNull(GraphQLDeparture),
      resolve: ({ departure }: LegType): DepartureType => departure,
    },

    recheckRequired: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ recheckRequired }): boolean => recheckRequired,
    },
  },
});
