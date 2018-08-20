// @flow

import DataLoader from 'dataloader';
import stringify from 'json-stable-stringify';

import { batchGetLocations, processResponse } from './Fetcher';

import type { Location } from '../Location';

/**
 * Always returns a single location.
 */
export default class LocationDataLoader {
  dataLoader: DataLoader<Object, Location[]>;

  constructor() {
    this.dataLoader = new DataLoader(
      (urlParameters: $ReadOnlyArray<Object>) => {
        return batchGetLocations(urlParameters);
      },
      {
        cacheKeyFn: key => stringify(key),
      },
    );
  }

  async loadById(id: string, locale?: string): Promise<Location> {
    const locations = await this.dataLoader.load({
      type: 'id',
      id,
      locale: typeof locale === 'string' ? locale.replace('_', '-') : locale,
    });
    return processResponse(locations)[0];
  }

  async loadMany(
    ids: $ReadOnlyArray<string>,
    locale?: string,
  ): Promise<Location[]> {
    const locations = await this.dataLoader.loadMany(
      ids.map(id => ({
        type: 'id',
        id,
        locale: typeof locale === 'string' ? locale.replace('_', '-') : locale,
      })),
    );

    return locations.map(item => processResponse(item)[0]);
  }

  async loadBySlug(slug: string, locale?: string): Promise<Location> {
    try {
      const locations = await this.dataLoader.load({
        type: 'slug',
        term: slug,
        locale: typeof locale === 'string' ? locale.replace('_', '-') : locale,
      });
      return processResponse(locations)[0];
    } catch (e) {
      throw new Error(`Location not found. Slug: ${slug}`);
    }
  }
}
