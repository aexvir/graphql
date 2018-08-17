// @flow

import { GraphQLObjectType } from 'graphql';
import idx from 'idx';

import Location from '../../../../location/types/outputs/Location';
import type { GraphqlContextType } from '../../../../common/services/GraphqlContext';
import HotelCityGraphqQLType from '../../../../hotel/types/outputs/HotelCity';

export default new GraphQLObjectType({
  name: 'HotelServiceRelevantLocation',
  fields: {
    location: {
      type: Location,
      resolve: async (
        ancestor: string,
        _: mixed,
        { dataLoader }: GraphqlContextType,
      ) => {
        const location = await dataLoader.location.loadById(ancestor);
        return location;
      },
    },
    hotelCity: {
      type: HotelCityGraphqQLType,
      resolve: async (
        ancestor: string,
        _: mixed,
        { dataLoader, locale }: GraphqlContextType,
      ) => {
        const location = await dataLoader.location.loadById(ancestor);
        let hotelCities = [];
        const cityName = idx(location, _ => _.city.name);

        if (cityName) {
          hotelCities = await dataLoader.hotel.cities.loadByPrefix(
            cityName,
            locale.language,
          );
        }

        const lat = idx(location, _ => _.location.lat);
        const lng = idx(location, _ => _.location.lng);
        if (hotelCities.length === 0 && lat != null && lng != null) {
          /**
           * If we don't find any city quering by name, let's fall back to the coordinates of the airport
           * Note that this is most likely not going to be the destination city
           */
          hotelCities = await dataLoader.hotel.cities.loadByLatLng(lat, lng);
        }

        return hotelCities[0];
      },
    },
  },
});
