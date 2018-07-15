// @flow

import fetch from 'node-fetch';

export default class BookingCom {
  authToken: string;
  supportedLangs: string[];

  constructor(authToken: string, supportedLangs: string[]) {
    this.authToken = authToken;
    this.supportedLangs = supportedLangs;
  }

  async fetchAllCities(): Promise<CityRaw[]> {
    const allCities = [];
    let cities = [];
    do {
      cities = await fetchCities(
        this.authToken,
        this.supportedLangs,
        allCities.length,
      );
      allCities.push(...cities);
      process.stdout.write('.');
    } while (cities.length > 0);
    process.stdout.write(`\n`); // new line after progress dots
    return allCities;
  }

  sortCities(cities: CityRaw[]): City[] {
    const sortedCities = cities
      .sort((c1, c2) => c2.nr_hotels - c1.nr_hotels)
      .map(c => {
        const { location, translations, ...props } = c;
        const _geoloc = {
          lat: Number(location.latitude),
          lng: Number(location.longitude),
        };
        const city = { ...props, location, _geoloc };
        this.supportedLangs.forEach(lang => {
          const translation = translations.find(t => t.language === lang);
          city[`name_${lang}`] = translation ? translation.name : null;
        });
        return city;
      });
    return sortedCities;
  }
}

async function fetchCities(
  authToken: string,
  supportedLangs: string[],
  offset = 0,
) {
  try {
    const langs = supportedLangs.join(',');
    const response = await fetch(
      `https://distribution-xml.booking.com/2.0/json/cities?languages=${langs}&rows=1000&offset=${offset}&extras=location`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
      },
    );
    const data = await response.json();
    return data.result;
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return [];
  }
}

type CityRaw = {|
  +country: string,
  +location: Location,
  +translations: Array<{|
    +language: string,
    +name: string,
  |}>,
  +name: string,
  +nr_hotels: number,
  +city_id: number,
|};

type City = {|
  +nr_hotels: number,
  +name: string,
  +city_id: number,
  +country: string,
  _geoloc: {
    +lat: number,
    +lng: number,
  },
  +location: Location,
|};

type Location = {|
  +longitude: string,
  +latitude: string,
|};
