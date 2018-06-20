// @flow

import idx from 'idx';
import { DateTime } from 'luxon';

import type {
  BookingTimelineEvent,
  BookedFlightTimelineEvent as BookedFlightType,
  BookingConfirmedTimelineEvent as BookingConfirmedType,
  PaymentConfirmedTimelineEvent as PaymentConfirmedType,
  DownloadReceiptTimelineEvent as DownloadReceiptType,
  DownloadETicketTimelineEvent as DownloadETicketType,
  LeaveForAirportTimelineEvent as LeaveForAirportType,
  AirportArrivalTimelineEvent as AirportArrivalType,
  BoardingTimelineEvent as BoardingType,
  DepartureTimelineEvent as DepartureType,
  ArrivalTimelineEvent as ArrivalType,
  TransportFromAirportTimelineEvent as TransportFromAirportType,
} from '../BookingTimeline';
import type { Booking } from '../Booking';
import type { Leg } from '../../flight/Flight';

export default function generateEventsFrom(
  booking: Booking,
): $ReadOnlyArray<BookingTimelineEvent> {
  const events = [];

  const bookedFlightEvent = generateBookedFlightEvent(booking);
  const bookingConfirmedEvent = generateBookingConfirmedEvent(booking);
  const paymentConfirmedEvent = generatePaymentConfirmedEvent(booking);
  const downloadReceiptEvent = generateDownloadReceiptEvent(booking);
  const downloadETicketEvent = generateDownloadETicketEvent(booking);
  const leaveForAirportEvent = generateLeaveForAirportEvent(booking);
  const airportArrivalEvent = generateAirportArrivalEvent(booking);

  if (bookedFlightEvent) events.push(bookedFlightEvent);
  if (bookingConfirmedEvent) events.push(bookingConfirmedEvent);
  if (paymentConfirmedEvent) events.push(paymentConfirmedEvent);
  if (downloadReceiptEvent) events.push(downloadReceiptEvent);
  if (downloadETicketEvent) events.push(downloadETicketEvent);
  if (leaveForAirportEvent) events.push(leaveForAirportEvent);
  if (airportArrivalEvent) events.push(airportArrivalEvent);

  if (booking.legs) {
    booking.legs.forEach(leg => {
      const boardingEvent = generateBoardingEvent(leg);
      if (boardingEvent) events.push(boardingEvent);

      const departureEvent = generateDepartureEvent(leg);
      if (departureEvent) events.push(departureEvent);

      const arrivalEvent = generateArrivalEvent(leg);
      if (arrivalEvent) events.push(arrivalEvent);
    });
  }

  const transportFromAirportEvent = generateTransportFromAirportEvent(booking);
  if (transportFromAirportEvent) events.push(transportFromAirportEvent);

  return events;
}

export function generateBookedFlightEvent(booking: Booking): BookedFlightType {
  return {
    timestamp: booking.created,
    type: 'BookedFlightTimelineEvent',
    arrival: booking.arrival,
  };
}

export function generateBookingConfirmedEvent(
  booking: Booking,
): ?BookingConfirmedType {
  if (booking.status === 'confirmed') {
    return {
      timestamp: booking.created,
      type: 'BookingConfirmedTimelineEvent',
    };
  }
  return null;
}

export function generatePaymentConfirmedEvent(
  booking: Booking,
): ?PaymentConfirmedType {
  if (booking.status) {
    return {
      timestamp: booking.created,
      type: 'PaymentConfirmedTimelineEvent',
    };
  }
  return null;
}

export function generateDownloadReceiptEvent(
  booking: Booking,
): ?DownloadReceiptType {
  const invoiceUrl = idx(booking.assets, _ => _.invoiceUrl) || null;
  return {
    timestamp: booking.created,
    type: 'DownloadReceiptTimelineEvent',
    receiptUrl: invoiceUrl,
  };
}

export function generateDownloadETicketEvent(
  booking: Booking,
): ?DownloadETicketType {
  const ticketUrl = idx(booking.assets, _ => _.ticketUrl) || null;
  return {
    timestamp: booking.created,
    type: 'DownloadETicketTimelineEvent',
    ticketUrl: ticketUrl,
  };
}

export function generateLeaveForAirportEvent(
  booking: Booking,
): ?LeaveForAirportType {
  const localDepartureTime = idx(booking.departure, _ => _.when.local);
  if (localDepartureTime) {
    const leaveForAiportTime = DateTime.fromJSDate(localDepartureTime, {
      zone: 'UTC',
    })
      .minus({
        hours: 4,
      })
      .toJSDate();
    return {
      timestamp: leaveForAiportTime,
      type: 'LeaveForAirportTimelineEvent',
    };
  }
  return null;
}

export function generateAirportArrivalEvent(
  booking: Booking,
): ?AirportArrivalType {
  const localDepartureTime = idx(booking.departure, _ => _.when.local);
  if (localDepartureTime) {
    const AiportArrivalTime = DateTime.fromJSDate(localDepartureTime, {
      zone: 'UTC',
    })
      .minus({
        hours: 2,
      })
      .toJSDate();
    return {
      timestamp: AiportArrivalTime,
      type: 'AirportArrivalTimelineEvent',
      departure: booking.departure,
    };
  }
  return null;
}

export function generateBoardingEvent(leg: Leg): ?BoardingType {
  const localDepartureTime = idx(leg, _ => _.departure.when.local);
  if (localDepartureTime) {
    const BoardingTime = DateTime.fromJSDate(localDepartureTime, {
      zone: 'UTC',
    })
      .minus({
        minutes: 30,
      })
      .toJSDate();
    return {
      timestamp: BoardingTime,
      type: 'BoardingTimelineEvent',
      gate: 'gate number', // @TODO Gate Number does not seem available for now...
    };
  }
  return null;
}

export function generateDepartureEvent(leg: Leg): ?DepartureType {
  const departureTime = idx(leg, _ => _.departure.when.local);
  if (departureTime) {
    return {
      timestamp: departureTime,
      type: 'DepartureTimelineEvent',
      departure: leg.departure,
    };
  }
  return null;
}

export function generateArrivalEvent(leg: Leg): ?ArrivalType {
  const arrivalTime = idx(leg, _ => _.arrival.when.local);
  if (arrivalTime) {
    return {
      timestamp: arrivalTime,
      type: 'ArrivalTimelineEvent',
      arrival: leg.arrival,
    };
  }
  return null;
}

export function generateTransportFromAirportEvent(
  booking: Booking,
): ?TransportFromAirportType {
  const arrivalTime = idx(booking.arrival, _ => _.when.local);
  if (arrivalTime) {
    const transportFromAirportTime = DateTime.fromJSDate(arrivalTime, {
      zone: 'UTC',
    })
      .plus({ minutes: 15 })
      .toJSDate();
    return {
      timestamp: transportFromAirportTime,
      type: 'TransportFromAirportTimelineEvent',
    };
  }
  return null;
}
