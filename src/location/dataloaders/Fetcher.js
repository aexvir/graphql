// @flow

import { sanitizeApiResponse } from './Sanitizer';
import config from '../../../config/application';
import { get } from '../../common/services/HttpRequest';

import type { Location } from '../Location';

/**
 * It returns array of arrays of possible locations related to the keys.
 * First array contains arrays of requested keys.
 * The inner array contains all possible values for requested key.
 *
 * Example of the response (PRG, BRQ):
 *
 * [
 *   [{ PRG fields }, { Praha fields }]
 *   [{ BRQ fields }, { Brno fields }]
 * ]
 */
export async function batchGetLocations(
  urlParameters: $ReadOnlyArray<Object>,
): Promise<Array<Location[]>> {
  const responseArray = await Promise.all(
    urlParameters.map(parameters =>
      get(config.restApiEndpoint.allLocations(parameters)),
    ),
  );

  return responseArray.map(response => {
    return response.locations.map(
      (location): Location => sanitizeApiResponse(location),
    );
  });
}

export function processResponse(locations: Location[]) {
  if (!locations.length) {
    throw new Error(`Location has not been found.`);
  }

  return locations;
}
