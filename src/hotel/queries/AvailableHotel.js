// @flow

import { GraphQLNonNull } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import GraphQLAvailableHotelSearchInput from '../types/inputs/AvailableHotelSearchInput';
import GraphQLHotelAvailability from '../types/outputs/HotelAvailability';

import type { GraphqlContextType } from '../../common/services/GraphqlContext';
import GraphQLAvailableHotelOptionsInput from '../types/inputs/AvailableHotelOptionsInput';
import { prepareAvailableHotelsQueryArgs } from '../services/ParametersFormatter';

export default {
  type: GraphQLHotelAvailability,
  description:
    "Search for single available hotel by its ID. It's necessary to send " +
    'checkin and checkout dates as well as rooms configuration to get ' +
    'availability info.',
  args: {
    search: {
      type: new GraphQLNonNull(GraphQLAvailableHotelSearchInput),
    },
    options: {
      type: GraphQLAvailableHotelOptionsInput,
    },
  },
  resolve: async (
    ancestor: mixed,
    args: Object,
    { dataLoader }: GraphqlContextType,
  ) => {
    const { hotelId } = args.search;
    const idObject = fromGlobalId(hotelId); // hotelId is opaque
    if (idObject.type !== 'hotel') {
      throw new Error(
        `Hotel ID mishmash. You cannot fetch hotel with ID '${hotelId}' ` +
          `because this ID is not ID of a hotel. Please use opaque ID of ` +
          `the hotel.`,
      );
    }

    const availableHotels = await dataLoader.hotel.availabilityByID.load(
      prepareAvailableHotelsQueryArgs(idObject.id, args),
    );

    return availableHotels.map(hotel => ({
      ...hotel,
      args: args.search, // pass search arguments down
    }))[0]; // fetch only the first one (should be the only one)
  },
};
