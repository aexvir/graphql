// @flow

import HotelServiceRelevantLocation from '../HotelServiceRelevantLocation';
import { evaluateResolver } from '../../../../../common/services/TestingTools';

const fields = HotelServiceRelevantLocation.getFields();

it('searches by lat and lng if load by prefix does not return results', async () => {
  const context = {
    dataLoader: {
      hotel: {
        cities: {
          loadByPrefix: async () => [],
          loadByLatLng: async () => ['lol'],
        },
      },
      location: {
        loadById: async () => ({
          location: {
            lat: 4,
            lng: 8,
          },
          city: {
            name: 'Oslo',
          },
        }),
      },
    },
    locale: {
      language: 'en',
    },
  };
  await expect(
    evaluateResolver(fields.hotelCity, 'OSL', {}, context),
  ).resolves.toEqual('lol');
});
