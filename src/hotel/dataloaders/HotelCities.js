// @flow

import DataLoader from 'dataloader';
import Algolia from 'algoliasearch';
import idx from 'idx';
import stringify from 'json-stable-stringify';

import { supportedLangs } from '../services/AlgoliaHelper';

import type { HotelCity } from '../types/outputs/HotelCity';

type SearchInput =
  | {|
      type: 'prefix',
      prefix: string,
      language: string,
    |}
  | {| type: 'latLng', lat: number, lng: number |}
  | {| type: 'cityId', cityId: number |};

export default class LocationDataLoader {
  dataLoader: DataLoader<SearchInput, HotelCity[]>;

  constructor() {
    this.dataLoader = new DataLoader(this.batchLoadCities, {
      cacheKeyFn: key => stringify(key),
    });
  }

  async batchLoadCities(inputs: $ReadOnlyArray<SearchInput>) {
    const algolia = Algolia(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY,
    );
    const citiesIndex = algolia.initIndex('cities');

    const responses = await Promise.all(
      inputs.map(input => {
        if (input.type === 'prefix') {
          const nameAttribs = supportedLangs.map(lang => `name_${lang}`);
          return citiesIndex.search({
            query: input.prefix,
            restrictSearchableAttributes: ['name', ...nameAttribs],
          });
        }
        if (input.type === 'latLng') {
          return citiesIndex.search({
            aroundLatLng: `${input.lat}, ${input.lng}`,
          });
        }
        if (input.type === 'cityId') {
          return citiesIndex.search({
            query: input.cityId,
            restrictSearchableAttributes: ['city_id'],
          });
        }
      }),
    );

    // $FlowIssue: https://github.com/facebook/flow/issues/6151
    return responses.map(response => {
      const cities = idx(response, _ => _.hits) || [];
      return sanitizeHotelCities(cities);
    });
  }

  loadByPrefix(prefix: string, language: string): Promise<HotelCity[]> {
    return this.dataLoader.load({ type: 'prefix', prefix, language });
  }

  loadByLatLng(lat: number, lng: number): Promise<HotelCity[]> {
    return this.dataLoader.load({ type: 'latLng', lat, lng });
  }

  loadByCityId(cityId: number): Promise<HotelCity[]> {
    return this.dataLoader.load({ type: 'cityId', cityId });
  }
}

export function sanitizeHotelCities(cities: ValidResponseItem[]): HotelCity[] {
  return cities.map(city => ({
    id: String(city.city_id),
    name: city.name,
    location: {
      lat: Number(city.location.latitude),
      lng: Number(city.location.longitude),
    },
    numberOfHotels: city.nr_hotels,
  }));
}

type ValidResponseItem = {|
  translations: Array<{|
    language: string,
    name: string,
  |}>,
  location: {|
    latitude: string,
    longitude: string,
  |},
  name: string,
  country: string,
  nr_hotels: number,
  city_id: number,
|};
