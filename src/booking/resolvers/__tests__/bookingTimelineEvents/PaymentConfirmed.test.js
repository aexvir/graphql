// @flow

import generatePaymentConfirmedEvent from '../../bookingTimeline/paymentConfirmed';
import { booking } from '../BookingTimeline.test';

describe('generatePaymentConfirmedEvent', () => {
  it('returns PaymentConfirmed event only when booking status is defined and not null', () => {
    expect(
      generatePaymentConfirmedEvent({
        ...booking,
        status: 'confirmed',
      }),
    ).toEqual({
      timestamp: new Date('2017-03-30T07:28:55.000Z'),
      type: 'PaymentConfirmedTimelineEvent',
    });
    expect(
      generatePaymentConfirmedEvent({
        ...booking,
        status: 'cancelled',
      }),
    ).toEqual({
      timestamp: new Date('2017-03-30T07:28:55.000Z'),
      type: 'PaymentConfirmedTimelineEvent',
    });
    expect(
      generatePaymentConfirmedEvent({
        ...booking,
        status: '',
      }),
    ).toBe(null);
  });
});
