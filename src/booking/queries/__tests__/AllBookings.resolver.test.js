// @flow

import AllBookings from '../AllBookings';
import { filterOnlyBookings } from '../../services/AllBookingsFilters';

jest.mock('../../services/AllBookingsFilters', () => ({
  filterOnlyBookings: jest.fn(() => []),
}));

afterEach(() => jest.resetAllMocks());

const context = {
  dataLoader: {
    bookings: {
      load: () => Promise.resolve(['ok']),
    },
  },
};

it('works with "only" argument', async () => {
  // $FlowExpectedError: we do not need the whole context for this test
  await AllBookings.resolve(null, { only: 'future' }, context);
  expect(filterOnlyBookings).toHaveBeenCalledWith('future', ['ok']);

  // $FlowExpectedError: we do not need the whole context for this test
  await AllBookings.resolve(null, { only: 'past' }, context);
  expect(filterOnlyBookings).toHaveBeenCalledWith('past', ['ok']);
});

it('works without "only" parameter', async () => {
  // $FlowExpectedError: we do not need the whole context for this test
  await AllBookings.resolve(null, {}, context);
  expect(filterOnlyBookings).not.toHaveBeenCalled();
});
