// @flow

import type { Price } from '../common/types/Price';

export type AdditionalBaggageInfo = {|
  price: Price,
  quantity: number,
|};

export type AllowedBaggage = {|
  additionalBaggage: Array<AdditionalBaggageInfo>,
  cabin: Array<Baggage>,
  checked: Array<Baggage>,
|};

export type BaggageCategory = 'hold_bag' | 'personal_item' | 'cabin_bag';

export type Baggage = {
  height: ?number,
  length: ?number,
  width: ?number,
  weight: ?number,
  note: ?string,
  dimensionSum?: number,
  category?: BaggageCategory,
  isPending?: boolean,
};

export type BagArray = $ReadOnlyArray<Baggage>;
