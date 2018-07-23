// @flow

import DataLoader from 'dataloader';

import { get } from '../../common/services/HttpRequest';
import sanitizeBaggageData from './BagApiSanitizer';
import type { BagArray } from '../../booking/Baggage';

const batchLoad = (
  accessToken: ?string,
): (($ReadOnlyArray<number>) => Promise<Array<BagArray>>) => {
  if (typeof accessToken !== 'string') {
    return () => Promise.reject(new Error('Undefined access token'));
  }

  return (ids: $ReadOnlyArray<number>) =>
    Promise.all(ids.map(id => load(id, accessToken || '')));
};

const load = async (
  bookingId: number,
  authToken: string,
): Promise<BagArray> => {
  const url = `https://booking-api.skypicker.com/mmb/v1/bookings/${bookingId}/bags`;
  const data = await get(url, undefined, {
    'KW-User-Token': authToken,
    authorization: '213321213',
  });

  return sanitizeBaggageData(data);
};

export default function createInstance(accessToken: ?string) {
  return new DataLoader(
    (ids: $ReadOnlyArray<number>) => batchLoad(accessToken)(ids),
    {
      cacheKeyFn: key => parseInt(key, 10),
    },
  );
}
