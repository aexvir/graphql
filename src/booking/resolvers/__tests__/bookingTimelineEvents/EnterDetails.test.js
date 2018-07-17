// @flow

import generateEnterDetailsEvent from '../../bookingTimeline/enterDetails';
import { booking } from '../BookingTimeline.test';

describe('generateEnterDetailsEvent', () => {
  const dateNow = Date.now;

  beforeEach(() => {
    global.Date.now = jest.fn(() => 1482363367071);
  });

  afterEach(() => {
    global.Date.now = dateNow;
  });

  it('should return null if all passengers have filled in their document id', () => {
    expect(
      generateEnterDetailsEvent({
        ...booking,
        passengers: booking.passengers.map(passenger => ({
          ...passenger,
          travelDocument: {
            ...passenger.travelDocument,
            idNumber: 'someIdNumber',
          },
        })),
      }),
    ).toBe(null);
  });

  it('should return EnterDetails event if at least one of the passengers does not have their document id filled in', () => {
    expect(
      generateEnterDetailsEvent({
        ...booking,
        passengers: booking.passengers.map(
          (passenger, index) =>
            index === 0
              ? {
                  ...passenger,
                  travelDocument: {
                    ...passenger.travelDocument,
                    idNumber: '',
                  },
                }
              : passenger,
        ),
      }),
    ).toEqual({
      timestamp: new Date('2016-12-21T23:36:07.071Z'),
      type: 'EnterDetailsTimelineEvent',
    });
  });
});
