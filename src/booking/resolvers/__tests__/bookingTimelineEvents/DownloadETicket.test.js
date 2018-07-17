// @flow

import generateDownloadETicketEvent from '../../bookingTimeline/downloadETicket';
import { booking } from '../BookingTimeline.test';

describe('generateDownloadETicketEvent', () => {
  it('returns DownloadETicket event', () => {
    expect(
      generateDownloadETicketEvent({
        ...booking,
        assets: {
          ...booking.assets,
          ticketUrl: '',
        },
      }),
    ).toEqual({
      timestamp: new Date('2017-03-30T07:28:55.000Z'),
      type: 'DownloadETicketTimelineEvent',
      ticketUrl: null,
    });
    expect(
      generateDownloadETicketEvent({
        ...booking,
        assets: {
          ...booking.assets,
          ticketUrl: 'http://somecoolurl',
        },
      }),
    ).toEqual({
      timestamp: new Date('2017-03-30T07:28:55.000Z'),
      type: 'DownloadETicketTimelineEvent',
      ticketUrl: 'http://somecoolurl',
    });
  });
});
