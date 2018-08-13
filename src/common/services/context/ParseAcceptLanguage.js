// @flow

export default (acceptLanguage: ?string) => {
  let [language, territory] = ['en', 'US'];
  // Valid acceptLanguage en || en_us || en_US || en-US || en-US,en;q=0.9,sl;q=0.8
  const localeRegex = /^([a-z]{2})(?:[-_]([A-Za-z]{2}))?(,|;|$)/;

  if (acceptLanguage && localeRegex.test(acceptLanguage)) {
    [, language, territory = 'US'] = localeRegex.exec(acceptLanguage);
  }

  return [language, territory.toUpperCase()];
};
