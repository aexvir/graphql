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
import type { DepartureArrival } from '../../../flight/Flight';
import type {
  BookedFlightTimelineEvent as BookedFlightType,
  AirportArrivalTimelineEvent as AirportArrivalType,
  DepartureTimelineEvent as DepartureType,
  ArrivalTimelineEvent as ArrivalType,
} from '../../BookingTimeline';

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
  fields: commonFields,
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
    gate: {
      type: GraphQLString,
      description: 'Gate at which boarding is done',
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
