// @flow

import parseAcceptLanguage from '../ParseAcceptLanguage';

describe('Parse Accept-Language', () => {
  it('should return default values', () => {
    const [lang, con] = parseAcceptLanguage();
    expect(lang).toBe('en');
    expect(con).toBe('US');
  });
  it('should return default values for invalid lang format', () => {
    const [lang, con] = parseAcceptLanguage('czech');
    expect(lang).toBe('en');
    expect(con).toBe('US');
  });
  it('should return default values for invalid lang format #2', () => {
    const [lang, con] = parseAcceptLanguage('cz+CZ');
    expect(lang).toBe('en');
    expect(con).toBe('US');
  });
  it('should return values for de_DE', () => {
    const [lang, con] = parseAcceptLanguage('de_DE');
    expect(lang).toBe('de');
    expect(con).toBe('DE');
  });
  it('should return values only for language', () => {
    const [lang, con] = parseAcceptLanguage('de');
    expect(lang).toBe('de');
    expect(con).toBe('US');
  });
  it('should return values for lovercase country de_de', () => {
    const [lang, con] = parseAcceptLanguage('de_de');
    expect(lang).toBe('de');
    expect(con).toBe('DE');
  });
  it('should return values for de-DE', () => {
    const [lang, con] = parseAcceptLanguage('de_DE');
    expect(lang).toBe('de');
    expect(con).toBe('DE');
  });
  it('should return values for de-DE,en;q=0.9,sl;q=0.8', () => {
    const [lang, con] = parseAcceptLanguage('de_DE,en;q=0.9,sl;q=0.8');
    expect(lang).toBe('de');
    expect(con).toBe('DE');
  });
});
