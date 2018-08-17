// @flow

import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { fromGlobalId } from 'graphql-relay';
import idx from 'idx';

import { post } from '../../common/services/HttpRequest';
import GraphQLBooking from '../types/outputs/Booking';
import GraphQLPassengerInsuranceInputType from '../types/inputs/PassengerInsuranceInput';
import type { InsurancePrice, Passenger, Booking } from '../Booking';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';

type InsuranceInputType = 'TRAVEL_PLUS' | 'TRAVEL_BASIC' | 'NONE';
type InsuranceType = 'travel_plus' | 'travel_basic' | 'none';

type PassengerInputType = {|
  +passengerId: number,
  +insuranceType: InsuranceInputType,
|};

type Change = {|
  +passengerId: number,
  +from: InsuranceType,
  +to: InsuranceType,
|};

type Args = {
  +id: string,
  +passengers: $ReadOnlyArray<PassengerInputType>,
  +simpleToken: string,
};

export default {
  type: GraphQLBooking,
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID),
      description: 'The global booking id',
    },
    simpleToken: {
      type: GraphQLNonNull(GraphQLString),
    },
    passengers: {
      type: GraphQLNonNull(
        GraphQLList(GraphQLNonNull(GraphQLPassengerInsuranceInputType)),
      ),
    },
  },
  resolve: async (
    _: mixed,
    { passengers, id, simpleToken }: Args,
    { dataLoader, apiToken }: GraphqlContextType,
  ): Promise<Booking> => {
    if (!simpleToken && !apiToken) {
      throw new Error('You must be logged in to update passenger.');
    }
    const { id: bookingId, type } = fromGlobalId(id);

    if (
      !['BookingOneWay', 'BookingReturn', 'BookingMulticity'].includes(type)
    ) {
      throw new Error(
        `Booking ID mishmash. You cannot query Booking with ID ` +
          `'${bookingId}' because this ID is not ID of the Booking. ` +
          `Please use opaque ID of the Booking.`,
      );
    }

    const headers = {};
    let booking;
    if (apiToken) {
      headers['kw-user-token'] = apiToken;
    }
    if (simpleToken) {
      headers['kw-simple-token'] = simpleToken;
    }

    if (simpleToken) {
      booking = await dataLoader.singleBooking.load({
        id: parseInt(bookingId),
        authToken: simpleToken,
      });
    } else {
      booking = await dataLoader.booking.load(bookingId);
    }

    const insurancePrices = booking.insurancePrices;

    const currentPassengers = booking.passengers;

    const currency = getCurrency(insurancePrices);

    const changes = compareChanges(currentPassengers, passengers);

    const amount = computeAmount(changes, insurancePrices);

    if (amount > 0) {
      throw new Error('Impossible to refund a positive amount.');
    }

    const insurances = getInsurancesPayload(changes);

    if (insurances.length === 0) {
      throw new Error('Impossible to refund when no changes occurred.');
    }

    const payload = {
      insurances,
      price: {
        amount,
        base: amount,
        currency,
      },
      use_credits: false,
    };

    await post(
      `https://booking-api.skypicker.com/mmb/v1/bookings/${bookingId}/insurances`,
      payload,
      headers,
    );

    let updatedBooking;
    if (simpleToken) {
      updatedBooking = await dataLoader.singleBooking.load({
        id: parseInt(bookingId),
        authToken: simpleToken,
      });
    } else {
      updatedBooking = await dataLoader.booking.load(bookingId);
    }

    return updatedBooking;
  },
};

export function getCurrency(insurancePrices: InsurancePrice[]) {
  const currencies = new Set();
  insurancePrices.forEach(insurancePrice => {
    const currency = idx(insurancePrice, _ => _.price.currency);
    if (currency) {
      currencies.add(currency);
    }
  });
  if (currencies.size !== 1) {
    throw new Error(
      'Impossible to compute the price with different currencies.',
    );
  }
  return currencies.values().next().value;
}

export function compareChanges(
  currentPassengers: $ReadOnlyArray<Passenger>,
  newPassengers: $ReadOnlyArray<PassengerInputType>,
): Change[] {
  return (
    newPassengers &&
    newPassengers.map(newPassenger => {
      const passengerId = newPassenger.passengerId;
      const currentPassenger = currentPassengers.find(
        passenger => passenger.id === passengerId,
      );
      if (!currentPassenger) {
        throw new Error('Passenger could not be found');
      }
      const from = currentPassenger.insuranceType;
      const to = newPassenger.insuranceType.toLowerCase();
      if (
        (from === 'travel_plus' ||
          from === 'travel_basic' ||
          from === 'none') &&
        (to === 'travel_plus' || to === 'travel_basic' || to === 'none')
      ) {
        return {
          passengerId,
          from,
          to,
        };
      }
      throw new Error("Passenger's insurance could not be found");
    })
  );
}

export function computeAmount(
  changes: Change[],
  insurancePrices: InsurancePrice[],
) {
  const prices = {};
  insurancePrices.forEach(insurancePrice => {
    prices[insurancePrice.type] = insurancePrice.price;
  });
  if (!changes) {
    return 0;
  }
  return changes
    .map(change => ({
      from: prices[change.from],
      to: prices[change.to],
    }))
    .reduce((acc, curr) => {
      const fromAmount = idx(curr, _ => _.from.amount) || 0;
      const toAmount = idx(curr, _ => _.to.amount) || 0;
      return acc + toAmount - fromAmount;
    }, 0);
}

export function getInsurancesPayload(
  changes: Change[],
): Array<{| passenger_id: number, insurance_type: InsuranceType |}> {
  return changes.filter(change => change.from !== change.to).map(change => ({
    passenger_id: change.passengerId,
    insurance_type: change.to,
  }));
}
