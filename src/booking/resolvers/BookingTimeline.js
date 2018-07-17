// @flow

import type { BookingTimelineEvent } from '../BookingTimeline';

import generateBookedFlightEvent from './bookingTimeline/bookedFlight';
import generateBookingConfirmedEvent from './bookingTimeline/bookingConfirmed';
import generatePaymentConfirmedEvent from './bookingTimeline/paymentConfirmed';
import generateDownloadInvoiceEvent from './bookingTimeline/downloadInvoice';
import generateDownloadETicketEvent from './bookingTimeline/downloadETicket';
import generateDownloadBoardingPassEvent from './bookingTimeline/downloadBoardingPass';
import generateLeaveForAirportEvent from './bookingTimeline/leaveForAirport';
import generateAirportArrivalEvent from './bookingTimeline/airportArrival';
import generateBoardingEvent from './bookingTimeline/boarding';
import generateDepartureEvent from './bookingTimeline/departure';
import generateArrivalEvent from './bookingTimeline/arrival';
import generateTransportFromAirportEvent from './bookingTimeline/transportFromAirport';
import generateNoMoreEditsEvent from './bookingTimeline/noMoreEdits';
import generateEnterDetailsEvent from './bookingTimeline/enterDetails';
import generateNavigateToTerminalEvent from './bookingTimeline/navigateToTerminal';
import generateTimeToCheckinEvent from './bookingTimeline/timeToCheckin';
import generateCheckinClosingEvent from './bookingTimeline/checkinClosing';

import type { Booking } from '../Booking';
import type { TripData } from '../types/outputs/Trip';

export default function generateEventsFrom(
  booking: Booking,
): $ReadOnlyArray<BookingTimelineEvent> {
  const events = [];

  const bookedFlightEvent = generateBookedFlightEvent(booking);
  if (bookedFlightEvent) {
    events.push(bookedFlightEvent);
  }

  const bookingConfirmedEvent = generateBookingConfirmedEvent(booking);
  if (bookingConfirmedEvent) {
    events.push(bookingConfirmedEvent);
  }

  const paymentConfirmedEvent = generatePaymentConfirmedEvent(booking);
  if (paymentConfirmedEvent) {
    events.push(paymentConfirmedEvent);
  }

  const downloadInvoiceEvent = generateDownloadInvoiceEvent(booking);
  if (downloadInvoiceEvent) {
    events.push(downloadInvoiceEvent);
  }

  const downloadETicketEvent = generateDownloadETicketEvent(booking);
  if (downloadETicketEvent) {
    events.push(downloadETicketEvent);
  }

  const enterDetailsEvent = generateEnterDetailsEvent(booking);
  if (enterDetailsEvent) {
    events.push(enterDetailsEvent);
  }

  const timeToCheckinEvent = generateTimeToCheckinEvent(booking);
  if (timeToCheckinEvent) {
    events.push(timeToCheckinEvent);
  }

  const checkinClosingEvent = generateCheckinClosingEvent(booking);
  if (checkinClosingEvent) {
    events.push(checkinClosingEvent);
  }

  const noMoreEditsEvent = generateNoMoreEditsEvent(booking);
  if (noMoreEditsEvent) {
    events.push(noMoreEditsEvent);
  }

  let tripEvents = [];
  switch (booking.type) {
    case 'BookingOneWay': {
      const { departure, arrival, legs } = booking;
      tripEvents = generateTripEvents({
        departure,
        arrival,
        legs,
        bid: booking.id,
      });
      break;
    }
    case 'BookingReturn': {
      const { outbound, inbound } = booking;
      tripEvents = [
        ...generateTripEvents(outbound),
        ...generateTripEvents(inbound),
      ];
      break;
    }
    case 'BookingMulticity': {
      const { trips } = booking;
      trips &&
        trips.forEach(trip => tripEvents.push(...generateTripEvents(trip)));
      break;
    }
  }
  events.push(...tripEvents);

  return events;
}

function generateTripEvents(trip: ?TripData): Array<any> {
  const tripEvents = [];
  if (!trip) {
    return [];
  }
  const leaveForAirportEvent = generateLeaveForAirportEvent(trip);
  if (leaveForAirportEvent) {
    tripEvents.push(leaveForAirportEvent);
  }

  const airportArrivalEvent = generateAirportArrivalEvent(trip);
  if (airportArrivalEvent) {
    tripEvents.push(airportArrivalEvent);
  }

  if (trip.legs) {
    trip.legs.forEach((leg, index) => {
      if (index !== 0) {
        const navigateToTerminalEvent = generateNavigateToTerminalEvent(leg);
        if (navigateToTerminalEvent) {
          tripEvents.push(navigateToTerminalEvent);
        }
      }

      const downloadBoardingPassEvent = generateDownloadBoardingPassEvent(leg);
      if (downloadBoardingPassEvent) {
        tripEvents.push(downloadBoardingPassEvent);
      }

      const boardingEvent = generateBoardingEvent(leg);
      if (boardingEvent) {
        tripEvents.push(boardingEvent);
      }

      const departureEvent = generateDepartureEvent(leg);
      if (departureEvent) {
        tripEvents.push(departureEvent);
      }

      const arrivalEvent = generateArrivalEvent(leg);
      if (arrivalEvent) {
        tripEvents.push(arrivalEvent);
      }
    });
  }
  const transportFromAirportEvent = generateTransportFromAirportEvent(trip);
  if (transportFromAirportEvent) {
    tripEvents.push(transportFromAirportEvent);
  }

  return tripEvents;
}
