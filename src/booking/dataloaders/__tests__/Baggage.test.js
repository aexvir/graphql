// @flow

import { RestApiMock } from '../../../common/services/TestingTools';
import bags from './__datasets__/bags.json';
import createBaggageDataLoader from '../Baggage';

const bookingId = 3243242;
const BaggageDataLoader = createBaggageDataLoader('');

describe('BaggageDataLoader', () => {
  beforeEach(() => {
    RestApiMock.onGet(
      `https://booking-api.skypicker.com/mmb/v1/bookings/${bookingId}/bags`,
    ).replyWithData(bags);
  });

  it('returns baggage AND pending baggage', async () => {
    await expect(BaggageDataLoader.load(bookingId)).resolves.toMatchSnapshot();
  });
});
