// @flow

import DataLoader from 'dataloader';
import stringify from 'json-stable-stringify';
import { get } from '../../common/services/HttpRequest';
import { sanitizeDetail } from './ApiSanitizer';
import { queryWithParameters } from '../../../config/application';
import type { BookingInterfaceData } from '../types/outputs/BookingInterface';

export type Args = {|
  +authToken: string,
  +id: number,
|};

export default function createSingleBookingLoader() {
  return new DataLoader(
    (bookings: $ReadOnlyArray<Args>) => batchLoad(bookings),
    {
      cacheKeyFn: key => stringify(key),
    },
  );
}

async function batchLoad(
  bookings: $ReadOnlyArray<Args>,
): Promise<Array<Object>> {
  const promises = bookings.map(({ id, authToken }: Args) =>
    fetch(id, authToken),
  );
  const responses = await Promise.all(promises);
  return responses.map(result => sanitizeDetail(result));
}

async function fetch(
  bid: number,
  authToken: string,
): Promise<BookingInterfaceData> {
  return await get(
    queryWithParameters(
      `https://booking-api.skypicker.com/api/v0.1/users/self/bookings/${bid}`,
      { simple_token: authToken },
    ),
  );
}
