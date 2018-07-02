// @flow

import idx from 'idx';
import stringify from 'json-stable-stringify';

import { get } from '../services/BookingComRequest';
import { queryWithParameters } from '../../../config/application';
import OptimisticDataloader from '../../common/services/OptimisticDataloader';
import sanitizePhotos from './PhotoSanitizer';
import sanitizeHotelRooms from './HotelRoomsSanitizer';
import { localeToBookingComLanguage } from '../../common/types/enums/LocaleValues';

import type { HotelExtendedType } from './flow/HotelExtendedType';
import type { HotelFacilityType } from './flow/HotelFacilityType';
import type { HotelByIDType } from './flow/HotelById';

/**
 * This data-loader loads all hotels by their ID.
 *
 * @see https://distribution-xml.booking.com/2.0/json/hotels?hotel_ids=25215&extras=hotel_info,hotel_photos,hotel_description,hotel_facilities,payment_details,room_info,room_photos,room_description,room_facilities
 */
export default function createHotelByIdLoader(locale: string) {
  return new OptimisticDataloader(
    async (
      keys: $ReadOnlyArray<HotelByIDType>,
    ): Promise<Array<HotelExtendedType | Error>> => {
      const hotelIds = keys.map(key => key.hotelId);

      const language =
        localeToBookingComLanguage(locale) || idx(keys, _ => _[0].language);
      const response = await get(createUrl(hotelIds, language));

      const hotels = hotelIds.map(id => {
        const hotelData = response.result.find(h => h.hotel_id == id);

        if (!hotelData) {
          return new Error('Requested hotel does not exist.');
        }
        return sanitizeHotel(hotelData, language);
      });

      return hotels;
    },
    { cacheKeyFn: key => stringify(key) },
  );
}

function createUrl(hotelIds: $ReadOnlyArray<number>, language: ?string) {
  const params = {
    extras:
      'hotel_info,hotel_photos,hotel_description,hotel_facilities,payment_details,room_info,room_photos,room_description,room_facilities',
    hotel_ids: hotelIds.join(','),
    language,
  };

  return queryWithParameters(
    'https://distribution-xml.booking.com/2.0/json/hotels',
    params,
  );
}

function sanitizeHotel(hotelData, language: ?string): HotelExtendedType {
  const { hotel_data: hotel, hotel_id, room_data: rooms } = hotelData;
  return {
    id: hotel_id,
    name: hotel.name,
    rating: Math.round(hotel.class),
    review: {
      // there is no "review_score_word" in the output JSON
      score: hotel.review_score,
      count: hotel.number_of_reviews,
    },
    currencyCode: hotel.currencycode,
    price: null, // it doesn't make sense to provide price in this case
    whitelabelUrl: hotel.url, // it's not whitelabel (?)
    cityName: hotel.city,
    cityId: hotel.city_id,
    address: {
      street: hotel.address,
      city: hotel.city,
      zip: hotel.zip,
    },
    summary: hotel.hotel_description,
    facilities: sanitizeHotelFacilities(hotel.hotel_facilities),
    photos: sanitizePhotos(hotel.hotel_photos),
    location: {
      longitude: hotel.location.longitude,
      latitude: hotel.location.latitude,
    },
    rooms: sanitizeHotelRooms(rooms, hotel_id),
    args: {
      language,
    },
  };
}

function sanitizeHotelFacilities(facilities): HotelFacilityType[] {
  if (!Array.isArray(facilities)) {
    return [];
  }
  return facilities.map(facility => ({
    id: facility.hotel_facility_type_id,
    name: facility.name,
  }));
}
