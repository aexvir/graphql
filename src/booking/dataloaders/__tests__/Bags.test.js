// @flow

import { RestApiMock } from '../../../common/services/TestingTools';
import bags from './__datasets__/bags.json';
import createBagsDataLoader from '../Bags';

const bookingId = 3243242;
const BagsDataLoader = createBagsDataLoader('');

describe('BagsDataLoader', () => {
  beforeEach(() => {
    RestApiMock.onGet(
      `https://booking-api.skypicker.com/mmb/v1/bookings/${bookingId}/bags`,
    ).replyWithData(bags);
  });

  it('returns baggage AND pending baggage', async () => {
    await expect(BagsDataLoader.load(bookingId)).resolves.toMatchSnapshot();
  });
});
