// @flow

export default (acceptLanguage: ?string) => {
  let [language, territory] = ['en', 'US'];
  // Valid acceptLanguage en_US || en-US || en-US,en;q=0.9,sl;q=0.8
  const localeRegex = /([a-z][a-z])[-_]([A-Z][A-Z])/;

  if (acceptLanguage && localeRegex.test(acceptLanguage)) {
    [, language, territory] = localeRegex.exec(acceptLanguage);
  }

  return [language, territory];
};
