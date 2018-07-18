// @flow

import DataLoader from 'dataloader';
import stringify from 'json-stable-stringify';
import { get } from '../../common/services/HttpRequest';
import Config from '../../../config/application';
import { sanitizeDetail } from './ApiSanitizer';
import type { Booking } from '../Booking';

export type Args = {|
  +simpleToken: string,
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
  const promises = bookings.map(({ id, simpleToken }: Args) =>
    fetchFAQ(id, simpleToken),
  );
  const responses = await Promise.all(promises);
  return responses.map(result => sanitizeDetail(result));
}

async function fetchFAQ(bid: number, simpleToken: string): Promise<Booking> {
  return await get(Config.restApiEndpoint.singleBooking(bid, simpleToken));
}
