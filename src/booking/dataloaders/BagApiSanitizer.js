// @flow

import type { BagArray } from '../../booking/Baggage';

type BaggageDataItem = {
  bag: Object,
};

type BaggageData = {|
  baggage: [BaggageDataItem],
  pending_baggage: [BaggageDataItem],
|};

const setPending = (isPending: boolean) => (baggage: BaggageDataItem) => ({
  ...baggage,
  isPending,
});

const sanitizeBaggageData = (data: BaggageData): BagArray =>
  []
    .concat(data.baggage.map(setPending(false)))
    .concat(data.pending_baggage.map(setPending(true)))
    .map(baggage => ({
      ...baggage.bag,
      isPending: baggage.isPending,
    }));

export default sanitizeBaggageData;
