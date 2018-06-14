// @flow

import { GraphQLObjectType, GraphQLList } from 'graphql';

import CarRentalServiceRelevantCities, {
  type CarRentalServiceRelevantCitiesType,
} from './CarRentalServiceRelevantCities';
import { type GraphqlContextType } from '../../../../common/services/GraphqlContext';

export type CarRentalServiceType = {|
  +locationCodes: $ReadOnlyArray<string>,
  +pickup: Date,
  +dropoff: Date,
|};

export default new GraphQLObjectType({
  name: 'CarRentalService',
  fields: {
    relevantCities: {
      type: GraphQLList(CarRentalServiceRelevantCities),
      resolve: async (
        ancestor: CarRentalServiceType,
        args: {},
        context: GraphqlContextType,
      ): Promise<CarRentalServiceRelevantCitiesType[]> => {
        const locations = await Promise.all(
          ancestor.locationCodes.map(IATA =>
            context.dataLoader.location.loadById(IATA),
          ),
        );

        return locations.map(location => ({
          location,
          pickup: ancestor.pickup,
          dropoff: ancestor.dropoff,
        }));
      },
    },
  },
});
