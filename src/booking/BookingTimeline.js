// @flow

import type { DepartureArrival, Leg as LegType } from '../flight/Flight';

export type BookingTimelineEvent =
  | BookedFlightTimelineEvent
  | BookingConfirmedTimelineEvent
  | PaymentConfirmedTimelineEvent
  | DownloadInvoiceTimelineEvent
  | DownloadETicketTimelineEvent
  | DownloadBoardingPassTimelineEvent
  | LeaveForAirportTimelineEvent
  | AirportArrivalTimelineEvent
  | BoardingTimelineEvent
  | DepartureTimelineEvent
  | ArrivalTimelineEvent
  | TransportFromAirportTimelineEvent
  | NoMoreEditsTimelineEvent;

export type BookingTimelineData = {|
  events: $ReadOnlyArray<BookingTimelineEvent>,
|};

export type BookedFlightTimelineEvent = {|
  +timestamp: Date,
  +type: 'BookedFlightTimelineEvent',
  +arrival: DepartureArrival,
|};

export type BookingConfirmedTimelineEvent = {|
  +timestamp: Date,
  +type: 'BookingConfirmedTimelineEvent',
|};

export type PaymentConfirmedTimelineEvent = {|
  +timestamp: Date,
  +type: 'PaymentConfirmedTimelineEvent',
|};

export type DownloadInvoiceTimelineEvent = {|
  +timestamp: Date,
  +type: 'DownloadInvoiceTimelineEvent',
  +invoiceUrl: ?string,
  +numberPassengers: number,
  +legs: LegType[],
|};

export type DownloadETicketTimelineEvent = {|
  +timestamp: Date,
  +type: 'DownloadETicketTimelineEvent',
  +ticketUrl: ?string,
|};

export type DownloadBoardingPassTimelineEvent = {|
  +timestamp: Date,
  +type: 'DownloadBoardingPassTimelineEvent',
  +leg: LegType,
|};

export type LeaveForAirportTimelineEvent = {|
  +timestamp: Date,
  +type: 'LeaveForAirportTimelineEvent',
|};

export type AirportArrivalTimelineEvent = {|
  +timestamp: Date,
  +type: 'AirportArrivalTimelineEvent',
  +departure: DepartureArrival,
|};

export type BoardingTimelineEvent = {|
  +timestamp: Date,
  +type: 'BoardingTimelineEvent',
  +gate: ?string,
|};

export type DepartureTimelineEvent = {|
  +timestamp: Date,
  +type: 'DepartureTimelineEvent',
  +arrival: DepartureArrival,
  +duration: ?number,
  +airlineCode: string,
  +flightNumber: number,
|};

export type ArrivalTimelineEvent = {|
  +timestamp: Date,
  +type: 'ArrivalTimelineEvent',
  +arrival: DepartureArrival,
|};

export type TransportFromAirportTimelineEvent = {|
  +timestamp: Date,
  +type: 'TransportFromAirportTimelineEvent',
|};

export type NoMoreEditsTimelineEvent = {|
  +timestamp: Date,
  +type: 'NoMoreEditsTimelineEvent',
|};
