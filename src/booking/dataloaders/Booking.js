// @flow

import DataLoader from 'dataloader';
import { get } from '../../common/services/HttpRequest';
import Config from '../../../config/application';
import { sanitizeDetail } from './ApiSanitizer';

import type { Booking } from '../Booking';
import type BookingsLoader from './Bookings';

/**
 * This data loader loads single booking based on it's ID. It does it by calling
 * the main "Bookings" data loader, extracting so called "simple token" and
 * returning back the data. This is necessary because "Bookings" data loader
 * does not return everything necessary. This workaround should nto be needed
 * with the new Mambo endpoints.
 */
export default function createInstance(
  accessToken: ?string,
  bookingsLoader: BookingsLoader,
) {
  return new DataLoader(
    (ids: $ReadOnlyArray<{id: number | string, brand: string}>) =>
      batchLoad(accessToken, bookingsLoader)(ids),
    {
      cacheKeyFn: key => parseInt(key, 10),
    },
  );
}

function batchLoad(
  accessToken: ?string,
  bookingsLoader: BookingsLoader,
): ($ReadOnlyArray<{id: number | string, brand: string}>) => Promise<Array<Object>> {
  if (typeof accessToken !== 'string') {
    return () => Promise.reject(new Error('Undefined access token'));
  }
  return ids => Promise.all(ids.map(({id, brand}) => fetch(parseInt(id), bookingsLoader, brand)));
}

async function fetch(bid, bookingsLoader, brand): Promise<Booking> {
  const { authToken } = await bookingsLoader.loadItem(bid, brand);
  const data = await get(Config.restApiEndpoint.singleBooking(bid, authToken));

  return sanitizeDetail(data);
}
