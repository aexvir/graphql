// @flow

import { GraphQLObjectType, GraphQLList } from 'graphql';

import CarRentalServiceRelevantCities, {
  type CarRentalServiceRelevantCitiesType,
} from './CarRentalServiceRelevantCities';
import { type GraphqlContextType } from '../../../../common/services/GraphqlContext';

export type CarRentalServiceType = Map<
  string,
  {|
    +pickup: Date,
    +dropoff: Date,
  |},
>;

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
          Array.from(ancestor.keys()).map(IATA =>
            context.dataLoader.location.loadById(IATA),
          ),
        );

        return locations.map(location => {
          const ancestorValue = ancestor.get(location.locationId) || {
            pickup: new Date(),
            dropoff: new Date(),
          };

          return {
            location,
            pickup: ancestorValue.pickup,
            dropoff: ancestorValue.dropoff,
          };
        });
      },
    },
  },
});
