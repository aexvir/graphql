// @flow

import generateNavigateToTerminalEvent from '../../bookingTimeline/navigateToTerminal';
import { leg } from '../BookingTimeline.test';

describe('generateNavigateToTerminal', () => {
  it('should return null if departure.local is null', () => {
    expect(
      generateNavigateToTerminalEvent({
        ...leg,
        departure: {
          ...leg.departure,
          when: null,
        },
      }),
    ).toBe(null);
  });
  it('should return the right event if departure.local is available', () => {
    expect(generateNavigateToTerminalEvent(leg)).toEqual({
      timestamp: new Date('2017-09-09T19:50:00.000Z'),
      type: 'NavigateToTerminalTimelineEvent',
    });
  });
});
