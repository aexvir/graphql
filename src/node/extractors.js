// @flow

import { fromGlobalId } from 'graphql-relay';

import { getType } from './typeStore';
import type { GraphqlContextType } from '../common/services/GraphqlContext';

export function loadType(globalId: string, ctx: GraphqlContextType) {
  const { type, id } = fromGlobalId(globalId);
  const brand = 'kiwicom';

  switch (type) {
    case 'CurrencyDetail':
      return ctx.dataLoader.currency.load(id);
    case 'BookingOneWay':
    case 'BookingReturn':
    case 'BookingMulticity':
      return ctx.dataLoader.booking.load({id, brand});
    default:
      return null;
  }
}

export function detectType(obj: any) {
  if (typeof obj.rate === 'number') {
    return getType('CurrencyDetail');
  }

  if (
    obj.type === 'BookingOneWay' ||
    obj.type === 'BookingReturn' ||
    obj.type === 'BookingMulticity'
  ) {
    return getType(obj.type);
  }

  return null;
}
