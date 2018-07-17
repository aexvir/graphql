// @flow

import idx from 'idx';

import type { LocationArea, Location } from '../Location';

export function sanitizeApiResponse(location: Object): Location {
  return {
    locationId: location.id,
    name: location.name,
    slug: location.slug,
    timezone: location.timezone,
    location: {
      lat: idx(location, _ => _.location.lat) || 0, // this is wrong - cannot change it to 0 and assume that "0" lat doesn't exist
      lng: idx(location, _ => _.location.lon) || 0, // this is wrong - cannot change it to 0 and assume that "0" lng doesn't exist
    },
    type: location.type, // continent, region, city, station, airport
    city: sanitizeLocationArea(location.city),
    subdivision: sanitizeLocationArea(location.subdivision),
    country:
      location.type === 'airport'
        ? sanitizeLocationArea(location.city.country)
        : sanitizeLocationArea(location.country),
    isActive: location.active,
    stationsCount: location.stations,
    airportsCount: location.airports,
    alternativeNames: location.alternative_names,
    autonomousTerritory: sanitizeLocationArea(location.autonomous_territory),
    rank: Number(location.rank),
    code: location.code,
  };
}

function sanitizeLocationArea(area: null | Object): ?LocationArea {
  return area
    ? {
        locationId: area.id,
        name: area.name,
        slug: area.slug,
        code: area.code,
      }
    : null;
}
