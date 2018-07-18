// @flow

import DataLoader from 'dataloader';
import Config from '../../../config/application';

import { get } from '../../common/services/HttpRequest';

const batchLoad = (accessToken: ?string) => {
  if (typeof accessToken !== 'string') {
    return _ => Promise.reject(new Error('Undefined access token')); // eslint-disable-line
  }

  return (ids: $ReadOnlyArray<number>) =>
    Promise.all(ids.map(id => load(id, accessToken || '')));
};

const load = async (id: number, authToken: string) => {
  const data = await get(Config.restApiEndpoint.bags(id), undefined, {
    'KW-User-Token': authToken,
    authorization: '213321213',
  });

  const setPending = isPending => booking => ({
    ...booking,
    isPending,
  });

  return []
    .concat(data.baggage.map(setPending(false)))
    .concat(data.pending_baggage.map(setPending(true)))
    .map(baggage => ({
      ...baggage.bag,
      isPending: baggage.isPending,
    }));
};

export default function createInstance(accessToken: ?string) {
  return new DataLoader(
    (ids: $ReadOnlyArray<number>) => batchLoad(accessToken)(ids),
    {
      cacheKeyFn: key => parseInt(key, 10),
    },
  );
}
