// @flow

import MockDate from 'mockdate';

import { findUpcomingLeg } from '../AllBookingsFilters';
import { createLeg } from '../testUtils';

MockDate.set(1000);

describe('BookingInterface.upcomingLeg', () => {
  it('should return upcoming Leg', () => {
    const legs = [createLeg(1020), createLeg(1010), createLeg(1050)];
    // $FlowExpectedError: full booking not needed for this test
    expect(findUpcomingLeg(legs)).toHaveProperty(
      'arrival.when.utc',
      new Date(1010),
    );
  });

  it('should return nothing for past booking', () => {
    const legs = [createLeg(920), createLeg(910), createLeg(950)];
    // $FlowExpectedError: full booking not needed for this test
    expect(findUpcomingLeg(legs)).toBeFalsy();
  });
});
