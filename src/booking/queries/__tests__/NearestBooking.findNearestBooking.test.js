// @flow

import MockDate from 'mockdate';

import { findNearestBooking } from '../NearestBooking';
import { createLeg } from '../../services/testUtils';

MockDate.set(1000);

describe('findNearestBooking', () => {
  const bookings = [
    {
      legs: [createLeg(900), createLeg(1500), createLeg(1600)],
    },
    {
      legs: [createLeg(1150), createLeg(1200)],
    },
  ];
  const pastBookings = [
    {
      legs: [createLeg(100), createLeg(200), createLeg(900)],
    },
    {
      legs: [createLeg(500), createLeg(600)],
    },
  ];

  it('should find nearest booking', () => {
    // $FlowExpectedError: full booking not needed for this test
    const nearest = findNearestBooking(bookings);

    expect(nearest).toBe(bookings[0]);
  });

  it('should find nearest future booking', () => {
    // $FlowExpectedError: full booking not needed for this test
    const nearest = findNearestBooking(bookings, true);

    expect(nearest).toBe(bookings[1]);
  });

  it('should not find future booking in list of past bookings', () => {
    // $FlowExpectedError: full booking not needed for this test
    const nearest = findNearestBooking(pastBookings, true);

    expect(nearest).toBe(null);
  });

  it('should find nearest past booking', () => {
    // $FlowExpectedError: full booking not needed for this test
    const nearest = findNearestBooking(pastBookings);

    expect(nearest).toBe(pastBookings[0]);
  });
});
