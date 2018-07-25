// @flow

import DataLoader from 'dataloader';

import { get } from '../../common/services/HttpRequest';
import sanitizeBaggageData from './BagApiSanitizer';
import type { BookingBaggageData } from '../types/outputs/BookingBaggage';

const batchLoad = (accessToken: ?string, ids: $ReadOnlyArray<number>) => {
  const promises = ids.map(id => {
    if (typeof accessToken !== 'string') {
      throw new Error('Undefined access token');
    }

    return load(id, accessToken || '');
  });

  return Promise.all(promises);
};

const load = async (
  bookingId: number,
  authToken: string,
): Promise<$ReadOnlyArray<BookingBaggageData>> => {
  const url = `https://booking-api.skypicker.com/mmb/v1/bookings/${bookingId}/bags`;
  const data = await get(url, undefined, {
    'KW-User-Token': authToken,
    authorization: '213321213',
  });

  return sanitizeBaggageData(data);
};

export default function createInstance(accessToken: ?string) {
  return new DataLoader(
    (ids: $ReadOnlyArray<number>) => batchLoad(accessToken, ids),
    {
      cacheKeyFn: key => parseInt(key, 10),
    },
  );
}
