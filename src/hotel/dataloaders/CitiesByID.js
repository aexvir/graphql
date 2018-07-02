// @flow

import { get } from '../services/BookingComRequest';
import { queryWithParameters } from '../../../config/application';
import OptimisticDataloader from '../../common/services/OptimisticDataloader';

import type { City } from './flow/City';

/**
 * This data-loader loads all cities by their ID.
 *
 * @see https://distribution-xml.booking.com/2.0/json/cities?city_ids=-850553&extras=location
 */
export default new OptimisticDataloader(
  async (cityIds: $ReadOnlyArray<number>): Promise<Array<City | Error>> => {
    const response = await get(createUrl(cityIds));

    return cityIds.map(id => {
      const cityData = response.result.find(c => c.city_id === id);
      if (!cityData) {
        return new Error('Requested city does not exist.');
      }
      return sanitizeCity(cityData);
    });
  },
);

function createUrl(cityIds: $ReadOnlyArray<number>) {
  const params = {
    extras: 'location',
    city_ids: cityIds.join(','),
  };
  return queryWithParameters(
    'https://distribution-xml.booking.com/2.0/json/cities',
    params,
  );
}

function sanitizeCity(cityData): City {
  const { name, location } = cityData;
  return {
    id: cityData.city_id,
    name,
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
  };
}
