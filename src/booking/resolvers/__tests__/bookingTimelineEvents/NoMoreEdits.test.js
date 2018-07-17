// @flow

import generateNoMoreEditsEvent from '../../bookingTimeline/noMoreEdits';
import { booking } from '../BookingTimeline.test';

describe('generateNoMoreEditsEvent', () => {
  it('should return NoMoreEditsEvent if apiData.config.allowedToChange.flights is a number', () => {
    expect(generateNoMoreEditsEvent(booking)).toEqual({
      timestamp: new Date('2017-09-07T21:10:00.000Z'),
      type: 'NoMoreEditsTimelineEvent',
    });
  });
  it('should return NoMoreEditsEvent if apiData.config.allowedToChange.flights is null', () => {
    expect(
      generateNoMoreEditsEvent({
        ...booking,
        allowedToChangeFlights: null,
      }),
    ).toBe(null);
  });
});
