// @flow

import createBagsDataLoader from '../Bags';

jest.mock('../../../common/services/JsonFetcher', () => ({
  fetchJson: () => {
    const fakeData = {
      baggage: [{ bag: { x: 'foo' } }, { bag: { x: 'bar' } }],
      pending_baggage: [{ bag: { x: 'baz' } }],
    };
    return Promise.resolve(fakeData);
  },
}));

const BagsDataLoader = createBagsDataLoader('');

it('returns baggage AND pending baggage', async () => {
  await expect(BagsDataLoader.load(3243242)).resolves.toMatchSnapshot();
});
