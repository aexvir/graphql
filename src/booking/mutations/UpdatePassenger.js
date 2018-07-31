// @flow

import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import { patch } from '../../common/services/HttpRequest';
import GraphQLUpdatePassenger from '../types/outputs/UpdatePassenger';
import GraphQLPassengerInputType from '../types/inputs/PassengerInput';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';

const getPayload = passengers =>
  passengers.reduce((acc: Object, curr: PassengerInputType) => {
    let document = {
      document_number: curr.documentNumber,
    };
    if (curr.documentExpiry) {
      document = {
        ...document,
        document_expiry: curr.documentExpiry,
      };
    }
    return {
      ...acc,
      [curr.passengerId]: document,
    };
  }, {});

type PassengerInputType = {|
  +passengerId: number,
  +documentExpiry: Date | null,
  +documentNumber: string,
|};

type Args = {
  +id: string,
  +passengers: $ReadOnlyArray<PassengerInputType>,
  +simpleToken?: string,
};

type UpdatePassengerResponse = {|
  +success: boolean,
|};

export default {
  type: GraphQLUpdatePassenger,
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID),
      description: 'The global booking id',
    },
    simpleToken: {
      type: GraphQLString,
    },
    passengers: {
      type: GraphQLNonNull(
        GraphQLList(GraphQLNonNull(GraphQLPassengerInputType)),
      ),
    },
  },
  resolve: async (
    _: mixed,
    args: Args,
    context: GraphqlContextType,
  ): Promise<UpdatePassengerResponse> => {
    const { id: bookingId } = fromGlobalId(args.id);
    const payload = getPayload(args.passengers);

    if (!args.simpleToken && !context.apiToken) {
      throw new Error('You must be logged in to update passenger.');
    }

    const headers = {};
    if (context.apiToken) {
      headers['kw-user-token'] = context.apiToken;
    }
    if (args.simpleToken) {
      headers['kw-simple-token'] = args.simpleToken;
    }

    await patch(
      `https://booking-api.skypicker.com/mmb/v1/bookings/${bookingId}/passengers`,
      payload,
      headers,
    );

    return {
      success: true,
    };
  },
};
