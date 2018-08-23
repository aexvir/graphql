// @flow

import { GraphQLObjectType } from 'graphql';
import idx from 'idx';
import { GraphQLDate } from 'graphql-iso-date';
import { DateTime } from 'luxon';

import Location from '../../../../location/types/outputs/Location';
import type { GraphqlContextType } from '../../../../common/services/GraphqlContext';
import HotelCityGraphqQLType from '../../../../hotel/types/outputs/HotelCity';

import type { RelevantLocationType } from '../../../resolvers/HotelServices';

const isPastDate = (date: Date): boolean =>
  DateTime.utc() > DateTime.fromJSDate(date);

export default new GraphQLObjectType({
  name: 'HotelServiceRelevantLocation',
  fields: {
    location: {
      type: Location,
      resolve: async (
        { code }: RelevantLocationType,
        _: mixed,
        { dataLoader }: GraphqlContextType,
      ) => {
        const location = await dataLoader.location.loadById(code);
        return location;
      },
    },
    hotelCity: {
      type: HotelCityGraphqQLType,
      resolve: async (
        { code }: RelevantLocationType,
        _: mixed,
        { dataLoader, locale }: GraphqlContextType,
      ) => {
        const location = await dataLoader.location.loadById(code);
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
    checkin: {
      type: GraphQLDate,
      resolve: ({ checkin }: RelevantLocationType): Date | null => {
        if (!checkin) {
          return null;
        }
        return isPastDate(checkin) ? DateTime.utc().toJSDate() : checkin; // It should be possible to open hotels even for past trips
      },
    },
    checkout: {
      type: GraphQLDate,
      resolve: ({ checkout }: RelevantLocationType): Date | null => {
        if (!checkout) {
          return null;
        }
        return isPastDate(checkout)
          ? DateTime.utc()
              .plus({ days: 1 })
              .toJSDate()
          : checkout;
      },
    },
  },
});
