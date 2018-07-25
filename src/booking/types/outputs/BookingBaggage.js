// @flow

import { GraphQLObjectType, GraphQLInt, GraphQLList } from 'graphql';

import Passenger from './Passenger';
import Baggage from './Baggage';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';
import type { Baggage as BaggageType } from '../../Baggage';

export type BookingBaggageData = $ReadOnly<{|
  quantity: number,
  bookingId: number,
  passengers: $ReadOnlyArray<number>,
  bag: $ReadOnly<BaggageType>,
|}>;

export default new GraphQLObjectType({
  name: 'BookingBaggage',
  fields: {
    quantity: {
      type: GraphQLInt,
    },
    passengers: {
      type: new GraphQLList(Passenger),
      resolve: async (
        { bookingId },
        args: Object,
        { dataLoader }: GraphqlContextType,
      ) => {
        const { passengers } = await dataLoader.booking.load(bookingId);
        return passengers;
      },
    },
    bag: {
      type: Baggage,
    },
  },
});
