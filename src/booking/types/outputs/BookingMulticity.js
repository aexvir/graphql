// @flow

import { GraphQLObjectType, GraphQLList } from 'graphql';

import BookingInterface, {
  commonFields,
  type BookingInterfaceData,
} from './BookingInterface';
import Trip from './Trip';
import RouteStop from '../../../flight/types/outputs/RouteStop';
import { nodeInterface } from '../../../node/node';
import type { TripData } from './Trip';
import type { DepartureArrival } from '../../../flight/Flight';
import { register } from '../../../node/typeStore';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';

type BookingMulticityData = BookingInterfaceData & {
  trips: TripData[],
};

const BookingMulticity = new GraphQLObjectType({
  name: 'BookingMulticity',
  interfaces: [BookingInterface, nodeInterface],
  fields: {
    ...commonFields,
    start: {
      type: RouteStop,
      description: 'Initial origin.',
      resolve: async (
        { id }: BookingMulticityData,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<DepartureArrival> => {
        const { departure } = await dataLoader.booking.load(id);
        return departure;
      },
    },
    end: {
      type: RouteStop,
      description: 'Final destination.',
      resolve: async (
        { id }: BookingMulticityData,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<DepartureArrival> => {
        const { arrival } = await dataLoader.booking.load(id);
        return arrival;
      },
    },
    trips: {
      type: new GraphQLList(Trip),
      description: 'List of trips in each multicity segment.',
      resolve: async (
        { id }: BookingMulticityData,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<?(TripData[])> => {
        const { trips } = await dataLoader.booking.load(id);
        return trips;
      },
    },
  },
});

register('BookingMulticity', BookingMulticity);

export default BookingMulticity;
