// @flow

import type { DepartureArrival } from '../Flight';

type RouteData = {|
  utc: ?number,
  local: ?number,
  code: ?string,
  cityName: ?string,
  cityId: ?string,
  terminal?: ?string,
  bid?: ?number,
|};

export function sanitizeRoute(data: RouteData): DepartureArrival {
  let whenObject = null;
  if (data.utc && data.local) {
    whenObject = {
      utc: new Date(data.utc * 1000),
      local: new Date(data.local * 1000),
    };
  }

  return {
    when: whenObject,
    where: {
      code: data.code || '',
      cityName: data.cityName || '',
      cityId: data.cityId || '',
      terminal: data.terminal,
    },
    bid: data.bid || null,
  };
}
