// @flow

export const supportedLangs = [
  'ar',
  'bg',
  'ca',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'et',
  'fi',
  'fr',
  'he',
  'hr',
  'hu',
  'id',
  'is',
  'it',
  'ja',
  'ko',
  'lt',
  'lv',
  'ms',
  'nl',
  'no',
  'pl',
  'pt',
  'ro',
  'ru',
  'sk',
  'sl',
  'sr',
  'sv',
  'th',
  'tl',
  'tr',
  'uk',
  'vi',
  'zh',
];

export function getHotelCitiesSearchableAttributes(language: string): string[] {
  const langs = new Set(supportedLangs);
  const lang = language.substr(0, 2);
  if (!langs.has(lang) || lang === 'en') {
    return ['name_en'];
  }
  return [`name_${lang}`, 'name_en'];
}
