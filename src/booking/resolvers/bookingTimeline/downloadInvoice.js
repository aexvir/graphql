// @flow

import idx from 'idx';
import type { DownloadInvoiceTimelineEvent as DownloadInvoiceType } from '../../BookingTimeline';
import type { Booking } from '../../Booking';

export default function generateDownloadInvoiceEvent(
  booking: Booking,
): ?DownloadInvoiceType {
  const invoiceUrl = idx(booking, _ => _.assets.invoiceUrl) || null;
  const numberPassengers = idx(booking, _ => _.passengers.length) || 0;
  return {
    timestamp: booking.created,
    type: 'DownloadInvoiceTimelineEvent',
    invoiceUrl: invoiceUrl,
    numberPassengers: numberPassengers,
    legs: booking.legs,
  };
}
