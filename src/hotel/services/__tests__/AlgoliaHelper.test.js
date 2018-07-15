// @flow

import { getHotelCitiesSearchableAttributes } from '../AlgoliaHelper';

describe('getHotelCitiesSearchableAttributes', () => {
  it('works with supported language', () => {
    const attibs = getHotelCitiesSearchableAttributes('fr');
    expect(attibs).toEqual(['name_fr', 'name_en']);
  });

  it('works with dashed locale', () => {
    const attibs = getHotelCitiesSearchableAttributes('cs-CZ');
    expect(attibs).toEqual(['name_cs', 'name_en']);
  });

  it('works with underscored locale', () => {
    const attibs = getHotelCitiesSearchableAttributes('cs_CZ');
    expect(attibs).toEqual(['name_cs', 'name_en']);
  });

  it('fallbacks to english on unsupported language', () => {
    const attibs = getHotelCitiesSearchableAttributes('xyz');
    expect(attibs).toEqual(['name_en']);
  });

  it('fallbacks to english on empty string', () => {
    const attibs = getHotelCitiesSearchableAttributes('');
    expect(attibs).toEqual(['name_en']);
  });
});
