// @flow

import generateLeaveForAirportEvent from '../../bookingTimeline/leaveForAirport';
import { booking } from '../BookingTimeline.test';

describe('generateLeaveForAirportEvent', () => {
  it('returns LeaveForAirport event if departure.when.local is set', () => {
    expect(generateLeaveForAirportEvent(booking)).toEqual({
      timestamp: new Date('2017-09-09T17:10:00.000Z'),
      type: 'LeaveForAirportTimelineEvent',
    });
  });
});
