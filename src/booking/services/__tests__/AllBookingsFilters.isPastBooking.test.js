// @flow

import MockDate from 'mockdate';

import { isPastBooking } from '../AllBookingsFilters';

beforeEach(() => MockDate.set(2));

afterEach(() => MockDate.reset());

const createBookingStub = milliseconds => ({
  arrival: {
    when: {
      utc: new Date(milliseconds),
    },
  },
});

it('returns true for past bookings', () => {
  // $FlowExpectedError: we do not need all the booking properties to test this
  expect(isPastBooking(createBookingStub(1))).toBe(true);
});

it('returns false for present bookings', () => {
  // $FlowExpectedError: we do not need all the booking properties to test this
  expect(isPastBooking(createBookingStub(2))).toBe(false);
});

it('returns false for future bookings', () => {
  // $FlowExpectedError: we do not need all the booking properties to test this
  expect(isPastBooking(createBookingStub(3))).toBe(false);
});
