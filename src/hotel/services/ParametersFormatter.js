// @flow

import * as R from 'ramda';
import { DateTime } from 'luxon';
import { fromGlobalId } from 'graphql-relay';
import idx from 'idx';

import type { SearchParameters } from '../dataloaders/flow/SearchParameters';
import type { HotelFacilities } from './../dataloaders/flow/HotelFacilities';
import type { RoomsConfiguration } from '../dataloaders/flow/RoomsConfiguration';

export const processInputArguments = (args: Object) => {
  const { search: searchArgs, filter: filterArgs, options } = args;

  const searchParams: Object = {
    checkin: searchArgs.checkin,
    checkout: searchArgs.checkout,
    currency: options && options.currency,
    roomsConfiguration: searchArgs.roomsConfiguration,
    language: searchArgs.language,
    ...(filterArgs && {
      stars: filterArgs.starsRating,
      minPrice: filterArgs.minPrice,
      maxPrice: filterArgs.maxPrice,
      hotelFacilities: filterArgs.hotelFacilities,
      minScore: filterArgs.minScore,
      freeCancellation: filterArgs.freeCancellation,
    }),
  };

  const minScore = idx(filterArgs, _ => _.minScore);
  if (minScore && (minScore < 1 || minScore > 10)) {
    throw new Error("Filter 'minScore' must be between 1 and 10.");
  }

  const cityId = searchArgs.cityId;
  if (cityId) {
    const idObject = fromGlobalId(cityId); // id is opaque
    if (idObject.type !== 'hotelCity') {
      throw new Error(
        `Hotel city ID mishmash. You cannot search hotels with city ID ` +
          `'${cityId}' because this ID is not ID of the hotel city. ` +
          `Please use opaque ID.`,
      );
    }
    searchParams.cityId = idObject.id;
  } else {
    searchParams.latitude = searchArgs.latitude;
    searchParams.longitude = searchArgs.longitude;
  }
  searchParams.rows = args.first;
  searchParams.offset = args.offset;
  return searchParams;
};

export function prepareRequestParameters(searchParameters: SearchParameters) {
  const parameters = {};

  if (searchParameters.hotelId) {
    // search by hotel ID
    parameters.hotel_ids = searchParameters.hotelId;
  } else if (searchParameters.cityId) {
    // search by city ID
    parameters.city_ids = searchParameters.cityId;
  } else if (searchParameters.latitude) {
    // search by lng/lat/rad
    parameters.radius = '50'; // not configurable yet (but required)
    parameters.latitude = searchParameters.latitude;
    parameters.longitude = searchParameters.longitude;
  }

  parameters.checkin = DateTime.fromJSDate(searchParameters.checkin, {
    zone: 'UTC',
  }).toISODate();
  parameters.checkout = DateTime.fromJSDate(searchParameters.checkout, {
    zone: 'UTC',
  }).toISODate();

  parameters.stars =
    searchParameters.stars && processHotelStars(searchParameters.stars);

  parameters.currency = searchParameters.currency;
  parameters.min_price = searchParameters.minPrice;
  parameters.max_price = searchParameters.maxPrice;
  parameters.rows = searchParameters.rows;

  if (searchParameters.offset) {
    parameters.offset = searchParameters.offset;
  }
  if (searchParameters.hotelFacilities) {
    parameters.hotel_facilities = sanitizeHotelFacilities(
      searchParameters.hotelFacilities,
    );
  }
  parameters.min_review_score = searchParameters.minScore;
  if (searchParameters.freeCancellation) {
    parameters.filter = 'free_cancellation';
  }
  if (searchParameters.language) {
    parameters.language = searchParameters.language;
  }
  return parameters;
}

export function prepareRoomsRequestParameters(
  roomsConfiguration: RoomsConfiguration,
) {
  return Object.assign(
    {},
    ...formatRoomsConfigurationForAPI(roomsConfiguration).map(
      (configuration, index) => ({
        [`room${index + 1}`]: configuration,
      }),
    ),
  );
}

export function processHotelStars(stars: number[]): string {
  return stars
    .filter((element, index, array) => {
      const unique = array.indexOf(element) === index;
      if (unique) {
        // allowed interval is <0;5> where "0" indicates "not a hotel" (?)
        return 0 <= element === element <= 5;
      }
      return false;
    })
    .join(',');
}

/**
 * Returns array with rooms configuration:
 *
 * ['A,A,4,6', 'A,2']
 */
export function formatRoomsConfigurationForAPI(
  roomsConfiguration: RoomsConfiguration,
): string[] {
  return roomsConfiguration.map(roomConfiguration => {
    const children = roomConfiguration.children || []; // children are optional
    return new Array(roomConfiguration.adultsCount)
      .fill('A')
      .concat(
        children.map(({ age }) => {
          if (age >= 0 && age <= 17) {
            return age;
          }
          return 'A';
        }),
      )
      .join(',');
  });
}

export function prepareAvailableHotelsQueryArgs(hotelId: string, args: Object) {
  const queryArgs: Object = {
    hotelId,
    checkin: args.search.checkin,
    checkout: args.search.checkout,
    roomsConfiguration: args.search.roomsConfiguration,
  };
  const currency = idx(args, _ => _.options.currency);
  const language = idx(args, _ => _.search.language);

  if (language) {
    queryArgs.language = language;
  }
  if (currency) {
    queryArgs.currency = currency;
  }

  return queryArgs;
}

const facilitiesList = {
  airportShuttle: 'airport_shuttle',
  familyRooms: 'family_rooms',
  facilitiesForDisabled: 'facilities_for_disabled',
  fitnessCenter: 'fitness_room',
  parking: 'private_parking',
  freeParking: 'free_parking',
  valetParking: 'valet_parking',
  indoorPool: 'swimmingpool_indoor',
  petsAllowed: 'pets_allowed',
  spa: 'spa_wellness_centre',
  wifi: 'free_wifi_internet_access_included',
};

function sanitizeHotelFacilities(params: HotelFacilities): string | null {
  const hotelFacilities = [];
  Object.keys(facilitiesList).forEach(key => {
    if (params[key]) {
      hotelFacilities.push(facilitiesList[key]);
    }
  });
  return R.uniq(hotelFacilities).join(',') || null;
}
