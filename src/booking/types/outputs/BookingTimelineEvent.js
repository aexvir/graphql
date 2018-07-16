// @flow

import {
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInterfaceType,
} from 'graphql';

import { GraphQLDateTime } from 'graphql-iso-date';

import RouteStop from '../../../flight/types/outputs/RouteStop';
import Leg from '../../../flight/types/outputs/Leg';
import type { DepartureArrival, Airline } from '../../../flight/Flight';
import GraphQLAirline from '../../../flight/types/outputs/Airline';
import type {
  BookedFlightTimelineEvent as BookedFlightType,
  AirportArrivalTimelineEvent as AirportArrivalType,
  DepartureTimelineEvent as DepartureType,
  ArrivalTimelineEvent as ArrivalType,
} from '../../BookingTimeline';

import type { GraphqlContextType } from '../../../common/services/GraphqlContext';

const commonFields = {
  timestamp: {
    type: GraphQLDateTime,
    description: 'Time of appearance in the timeline.',
  },
};

const TimelineEvent = new GraphQLInterfaceType({
  name: 'TimelineEvent',
  fields: commonFields,
});

export default TimelineEvent;

export const BookedFlightTimelineEvent = new GraphQLObjectType({
  name: 'BookedFlightTimelineEvent',
  fields: {
    ...commonFields,
    location: {
      type: RouteStop,
      description: 'Location of arrival',
      resolve: ({ arrival }: BookedFlightType): DepartureArrival => arrival,
    },
  },
  isTypeOf: value => value.type === 'BookedFlightTimelineEvent',
  interfaces: [TimelineEvent],
});

export const BookingConfirmedTimelineEvent = new GraphQLObjectType({
  name: 'BookingConfirmedTimelineEvent',
  fields: commonFields,
  isTypeOf: value => value.type === 'BookingConfirmedTimelineEvent',
  interfaces: [TimelineEvent],
});

export const PaymentConfirmedTimelineEvent = new GraphQLObjectType({
  name: 'PaymentConfirmedTimelineEvent',
  fields: commonFields,
  isTypeOf: value => value.type === 'PaymentConfirmedTimelineEvent',
  interfaces: [TimelineEvent],
});

export const DownloadInvoiceTimelineEvent = new GraphQLObjectType({
  name: 'DownloadInvoiceTimelineEvent',
  fields: {
    ...commonFields,
    invoiceUrl: {
      type: GraphQLString,
      description: 'URL of the invoice',
    },
    numberPassengers: {
      type: GraphQLInt,
      description: 'Number of passengers',
    },
    legs: {
      type: new GraphQLList(Leg),
      description: 'Legs of the booking',
    },
  },
  isTypeOf: value => value.type === 'DownloadInvoiceTimelineEvent',
  interfaces: [TimelineEvent],
});

export const DownloadETicketTimelineEvent = new GraphQLObjectType({
  name: 'DownloadETicketTimelineEvent',
  fields: {
    ...commonFields,
    ticketUrl: {
      type: GraphQLString,
      description: 'URL of the eTicket',
    },
  },
  isTypeOf: value => value.type === 'DownloadETicketTimelineEvent',
  interfaces: [TimelineEvent],
});

export const DownloadBoardingPassTimelineEvent = new GraphQLObjectType({
  name: 'DownloadBoardingPassTimelineEvent',
  fields: {
    ...commonFields,
    leg: {
      type: Leg,
      description: 'Leg corresponding to the boarding pass',
    },
  },
  isTypeOf: value => value.type === 'DownloadBoardingPassTimelineEvent',
  interfaces: [TimelineEvent],
});

export const LeaveForAirportTimelineEvent = new GraphQLObjectType({
  name: 'LeaveForAirportTimelineEvent',
  fields: commonFields,
  isTypeOf: value => value.type === 'LeaveForAirportTimelineEvent',
  interfaces: [TimelineEvent],
});

export const AirportArrivalTimelineEvent = new GraphQLObjectType({
  name: 'AirportArrivalTimelineEvent',
  fields: {
    ...commonFields,
    location: {
      type: RouteStop,
      description: 'Location of departure',
      resolve: ({ departure }: AirportArrivalType): DepartureArrival =>
        departure,
    },
  },
  isTypeOf: value => value.type === 'AirportArrivalTimelineEvent',
  interfaces: [TimelineEvent],
});

export const BoardingTimelineEvent = new GraphQLObjectType({
  name: 'BoardingTimelineEvent',
  fields: {
    ...commonFields,
    terminal: {
      type: GraphQLString,
      description: 'Terminal at which boarding is done',
    },
  },
  isTypeOf: value => value.type === 'BoardingTimelineEvent',
  interfaces: [TimelineEvent],
});

export const DepartureTimelineEvent = new GraphQLObjectType({
  name: 'DepartureTimelineEvent',
  fields: {
    ...commonFields,
    location: {
      type: RouteStop,
      description: 'Location of arrival',
      resolve: ({ arrival }: DepartureType): DepartureArrival => arrival,
    },
    duration: {
      type: GraphQLInt,
      description: 'Flight duration in minutes.',
    },
    airline: {
      type: GraphQLAirline,
      description: 'Airline for the flight',
      resolve: async (
        { airlineCode }: DepartureType,
        args: Object,
        { dataLoader }: GraphqlContextType,
      ): Promise<?Airline> => dataLoader.airline.load(airlineCode),
    },
    flightNumber: {
      type: GraphQLInt,
      description: 'Flight number',
    },
  },
  isTypeOf: value => value.type === 'DepartureTimelineEvent',
  interfaces: [TimelineEvent],
});

export const ArrivalTimelineEvent = new GraphQLObjectType({
  name: 'ArrivalTimelineEvent',
  fields: {
    ...commonFields,
    location: {
      type: RouteStop,
      description: 'Location of arrival',
      resolve: ({ arrival }: ArrivalType): DepartureArrival => arrival,
    },
  },
  isTypeOf: value => value.type === 'ArrivalTimelineEvent',
  interfaces: [TimelineEvent],
});

export const TransportFromAirportTimelineEvent = new GraphQLObjectType({
  name: 'TransportFromAirportTimelineEvent',
  fields: commonFields,
  isTypeOf: value => value.type === 'TransportFromAirportTimelineEvent',
  interfaces: [TimelineEvent],
});

export const NoMoreEditsTimelineEvent = new GraphQLObjectType({
  name: 'NoMoreEditsTimelineEvent',
  fields: commonFields,
  isTypeOf: value => value.type === 'NoMoreEditsTimelineEvent',
  interfaces: [TimelineEvent],
});

export const EnterDetailsTimelineEvent = new GraphQLObjectType({
  name: 'EnterDetailsTimelineEvent',
  fields: commonFields,
  isTypeOf: value => value.type === 'EnterDetailsTimelineEvent',
  interfaces: [TimelineEvent],
});

export const NavigateToTerminalTimelineEvent = new GraphQLObjectType({
  name: 'NavigateToTerminalTimelineEvent',
  fields: commonFields,
  isTypeOf: value => value.type === 'NavigateToTerminalTimelineEvent',
  interfaces: [TimelineEvent],
});

export const TimeToCheckinTimelineEvent = new GraphQLObjectType({
  name: 'TimeToCheckinTimelineEvent',
  fields: commonFields,
  isTypeOf: value => value.type === 'TimeToCheckinTimelineEvent',
  interfaces: [TimelineEvent],
});

export const CheckinClosingTimelineEvent = new GraphQLObjectType({
  name: 'CheckinClosingTimelineEvent',
  fields: commonFields,
  isTypeOf: value => value.type === 'CheckinClosingTimelineEvent',
  interfaces: [TimelineEvent],
});
