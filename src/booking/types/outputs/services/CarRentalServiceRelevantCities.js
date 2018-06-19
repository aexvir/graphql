// @flow

import { DateTime } from 'luxon';
import { GraphQLObjectType, GraphQLString } from 'graphql';
import querystring from 'querystring';

import Location from '../../../../location/types/outputs/Location';
import { type Location as LocationType } from '../../../../location/Location';
import { type GraphqlContextType } from '../../../../common/services/GraphqlContext';

export type CarRentalServiceRelevantCitiesType = {|
  +location: LocationType,
  +pickup: Date,
  +dropoff: Date,
|};

const SupportedLanguages = {
  en: true, // English
  ar: true, // Arabic
  br: true, // Brazilian Portuguese
  bg: true, // Bulgarian
  ca: true, // Catalan
  zs: true, // Chinese Simplified
  zh: true, // Chinese Traditional
  hr: true, // Croatian
  cs: true, // Czech
  da: true, // Danish
  nl: true, // Dutch
  ee: true, // Estonian
  ph: true, // Filipino
  fi: true, // Finnish
  fr: true, // French
  de: true, // German
  gr: true, // Greek
  he: true, // Hebrew
  hu: true, // Hungarian
  is: true, // Icelandic
  id: true, // Indonesian
  it: true, // Italian
  ja: true, // Japanese
  ko: true, // Korean
  lv: true, // Latvian
  lt: true, // Lithuanian
  my: true, // Malaysian
  no: true, // Norwegian
  pl: true, // Polish
  pt: true, // Portuguese
  ro: true, // Romanian
  ru: true, // Russian
  rs: true, // Serbian
  sk: true, // Slovak
  sl: true, // Slovenian
  es: true, // Spanish
  sv: true, // Swedish
  th: true, // Thai
  tr: true, // Turkish
  uk: true, // Ukrainian
  vi: true, // Vietnamese
};

export default new GraphQLObjectType({
  name: 'CarRentalServiceRelevantCities',
  fields: {
    whitelabelURL: {
      type: GraphQLString,
      resolve: (
        { location, pickup, dropoff }: CarRentalServiceRelevantCitiesType,
        args: {},
        context: GraphqlContextType,
      ): string => {
        let language = context.locale.language;
        if (SupportedLanguages[language] !== true) {
          language = 'en';
        }

        // https://github.com/moment/luxon/blob/master/docs/formatting.md#table-of-tokens
        const pick = DateTime.fromJSDate(pickup, { zone: 'utc' });
        const drop = DateTime.fromJSDate(dropoff, { zone: 'utc' });

        return (
          'https://cars.kiwi.com/SearchLoaderRC.do?' +
          querystring.stringify({
            preflang: language,
            affiliateCode: 'skypicker',
            driversAge: '21', // where to get this info??
            from: location.locationId,
            puDay: pick.toFormat('dd'), // pickup day (dd)
            puMonth: pick.toFormat('LL'), // pickup month (mm)
            puYear: pick.toFormat('yyyy'), // pickup year (yyyy)
            puHour: pick.toFormat('HH'), // pickup hour (hh)
            puMinute: pick.toFormat('mm'), // pickup minute (mm)
            doDay: drop.toFormat('dd'), // dropoff day (dd)
            doMonth: drop.toFormat('LL'), // dropoff month (mm)
            doYear: drop.toFormat('yyyy'), // dropoff year (yyyy)
            doHour: drop.toFormat('HH'), // dropoff hour (hh)
            doMinute: drop.toFormat('mm'), // dropoff minute (mm)
          })
        );
      },
    },

    location: {
      type: Location,
      resolve: ({ location }) => location,
    },
  },
});
