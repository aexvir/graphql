// @flow

import { GraphQLSchema } from 'graphql';
import RootQuery from './RootQuery';
import RootMutation from './RootMutation';
import TimelineEvent, {
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
} from './booking/types/outputs/BookingTimelineEvent';

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
  types: [
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
    TimelineEvent,
  ],
});
