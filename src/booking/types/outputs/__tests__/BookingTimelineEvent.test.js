// @flow

import {
  BookedFlightTimelineEvent,
  BookingConfirmedTimelineEvent,
  PaymentConfirmedTimelineEvent,
  DownloadInvoiceTimelineEvent,
  DownloadETicketTimelineEvent,
  DownloadBoardingPassTimelineEvent,
  LeaveForAirportTimelineEvent,
  AirportArrivalTimelineEvent,
  BoardingTimelineEvent,
  DepartureTimelineEvent,
  ArrivalTimelineEvent,
  TransportFromAirportTimelineEvent,
} from '../BookingTimelineEvent';

[
  BookedFlightTimelineEvent,
  BookingConfirmedTimelineEvent,
  PaymentConfirmedTimelineEvent,
  DownloadInvoiceTimelineEvent,
  DownloadETicketTimelineEvent,
  DownloadBoardingPassTimelineEvent,
  LeaveForAirportTimelineEvent,
  AirportArrivalTimelineEvent,
  BoardingTimelineEvent,
  DepartureTimelineEvent,
  ArrivalTimelineEvent,
  TransportFromAirportTimelineEvent,
].forEach(TimelineEvent => {
  it(`${TimelineEvent.name} type should have valid fields`, () => {
    expect(TimelineEvent.getFields()).toMatchSnapshot();
  });
});
