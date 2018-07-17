// @flow

import idx from 'idx';
import type { DownloadETicketTimelineEvent as DownloadETicketType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';

export default function generateDownloadETicketEvent(
  booking: Booking,
): ?DownloadETicketType {
  const ticketUrl = idx(booking.assets, _ => _.ticketUrl) || null;
  return {
    timestamp: booking.created,
    type: 'DownloadETicketTimelineEvent',
    ticketUrl: ticketUrl,
  };
}
