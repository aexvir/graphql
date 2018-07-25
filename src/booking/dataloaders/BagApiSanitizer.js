// @flow

import type { BaggageCategory } from '../Baggage';
import type { BookingBaggageData } from '../types/outputs/BookingBaggage';

type BaggageDataItem = {
  bag: $ReadOnly<{|
    height: number,
    length: number,
    weight: number,
    width: number,
    note?: string,
    category: BaggageCategory,
  |}>,
  +booking_id: number,
  +flight_id: number,
  +passenger_id: number,
  +index: number,
  +price: number,
  +currency: string,
};

type BaggageData = {|
  baggage: [BaggageDataItem],
  pending_baggage: [BaggageDataItem],
|};

const baggageByCategory = (
  baggages: Map<BaggageCategory, BookingBaggageData>,
  baggage: BaggageDataItem,
) => {
  const category = baggage.bag.category;
  const prevBaggage = baggages.get(category);

  if (prevBaggage) {
    return baggages.set(category, {
      ...prevBaggage,
      quantity: prevBaggage.quantity + 1,
      passengers: [...prevBaggage.passengers, baggage.passenger_id],
    });
  }

  return baggages.set(category, {
    quantity: 1,
    passengers: [baggage.passenger_id],
    bag: baggage.bag,
    bookingId: baggage.booking_id,
  });
};

const sanitizeBaggageData = (
  data: BaggageData,
): $ReadOnlyArray<BookingBaggageData> => {
  const bags = [].concat(data.baggage).concat(data.pending_baggage);

  if (!bags.length) {
    return [];
  }

  const sampleLegId = bags[0].flight_id;
  const baggage = bags
    .filter(baggage => baggage.flight_id === sampleLegId)
    .reduce(baggageByCategory, new Map())
    .values();

  return Array.from(baggage);
};

export default sanitizeBaggageData;
