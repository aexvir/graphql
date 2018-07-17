// @flow

import generateBoardingEvent from '../../bookingTimeline/boarding';
import { leg } from '../BookingTimeline.test';

describe('generateBoardingEvent', () => {
  it('returns Boarding event', () => {
    expect(generateBoardingEvent(leg)).toEqual({
      timestamp: new Date('2017-09-09T20:40:00.000Z'),
      type: 'BoardingTimelineEvent',
      terminal: 'E',
    });
  });
  it('returns null if departure.when.local is not set', () => {
    expect(
      generateBoardingEvent({
        ...leg,
        departure: { ...leg.departure, when: null },
      }),
    ).toBe(null);
  });
});
