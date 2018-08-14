// @flow

import MockDate from 'mockdate';

import { filterOnlyBookings } from '../AllBookingsFilters';

beforeEach(() => MockDate.set(2));

const createBooking = milliseconds => ({
  arrival: {
    when: {
      utc: new Date(milliseconds),
    },
  },
});

const timeFrame = {
  PAST: 'past',
  FUTURE: 'future',
};

const past = createBooking(1);
const current = createBooking(2);
const future = createBooking(3);

it('returns only past bookings', () => {
  // $FlowExpectedError: we do not need all the booking properties to test this
  const filtered = filterOnlyBookings(timeFrame.PAST, [past, current, future]);

  expect(filtered).toEqual([past]);
});

it('returns only future bookings', () => {
  // $FlowExpectedError: we do not need all the booking properties to test this
  const filtered = filterOnlyBookings(timeFrame.FUTURE, [
    past,
    current,
    future,
  ]);

  expect(filtered).toEqual([current, future]);
});

it('is able to handle no past bookings', () => {
  // $FlowExpectedError: we do not need all the booking properties to test this
  const filtered = filterOnlyBookings(timeFrame.PAST, [future, future, future]);

  expect(filtered).toEqual([]);
});

it('is able to handle no future bookings', () => {
  // $FlowExpectedError: we do not need all the booking properties to test this
  const filtered = filterOnlyBookings(timeFrame.FUTURE, [past, past, past]);

  expect(filtered).toEqual([]);
});
