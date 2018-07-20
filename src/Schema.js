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
  NoMoreEditsTimelineEvent,
  EnterDetailsTimelineEvent,
  NavigateToTerminalTimelineEvent,
  TimeToCheckinTimelineEvent,
  CheckinClosingTimelineEvent,
} from './booking/types/outputs/BookingTimelineEvent';
import DocumentInterface from './documents/types/outputs/DocumentInterface';
import InsuranceTerms from './documents/types/outputs/InsuranceTerms';

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
    NoMoreEditsTimelineEvent,
    EnterDetailsTimelineEvent,
    NavigateToTerminalTimelineEvent,
    TimeToCheckinTimelineEvent,
    CheckinClosingTimelineEvent,
    TimelineEvent,
    InsuranceTerms,
    DocumentInterface,
  ],
});
