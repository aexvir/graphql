// @flow

import DataLoader from 'dataloader';
import idx from 'idx';

import { post } from '../../common/services/HttpRequest';
import LocationDataLoader from '../../location/dataloaders/Location';

import type { DynamicPackage } from './DynamicPackageType';
import type {
  Flight as FlightApiResponse,
  Hotel as HotelApiResponse,
} from '../types/flow/ApiResponse';
import type { PhotoType } from '../../hotel/dataloaders/flow/PhotoType';

export type SearchParameters = {|
  fromAirport: string,
  toAirport: string,
  outboundFlights: string[],
  inboundFlights: string[],
  date: Date,
  returnDate: Date,
  passengers: { adults: number, infants: number },
  currency: ?string,
|};

export default class DynamicPackageDataLoader {
  dataLoader: DataLoader<Object, DynamicPackage[]>;
  locationDataLoader: LocationDataLoader;
  supportedMarkets: Set<string>;

  constructor(location: LocationDataLoader) {
    this.dataLoader = new DataLoader(
      async (
        params: $ReadOnlyArray<SearchParameters>,
      ): Promise<Array<DynamicPackage[]>> => await this.fetchPackages(params),
    );
    this.locationDataLoader = location;
    this.supportedMarkets = new Set(['ES', 'GB', 'IT', 'DE', 'FR', 'PT', 'IE']);
  }

  async load(params: SearchParameters): Promise<DynamicPackage[]> {
    return this.dataLoader.load(params);
  }

  async fetchPackages(
    params: $ReadOnlyArray<SearchParameters>,
  ): Promise<Array<DynamicPackage[]>> {
    return Promise.all(
      params.map(async searchParameters => {
        const response = await post(
          'http://packagesmetasearch.api.external.logitravel.com/availability/get/',
          await this.prepareParams(searchParameters),
        );

        return response.Hotels.map(hotel =>
          this.createPackage(response.Flight, hotel),
        );
      }),
    );
  }

  async prepareParams(params: SearchParameters) {
    const apiKey = await this.getApiKey(params.fromAirport);
    return {
      ApiKey: apiKey,
      Origin: params.fromAirport,
      Destination: {
        Airports: [params.toAirport],
      },
      Departure: params.date,
      Return: params.returnDate,
      SelectedTransport: [
        {
          Itinerary: 0,
          TransportNumbers: params.outboundFlights,
        },
        {
          Itinerary: 1,
          TransportNumbers: params.inboundFlights,
        },
      ],
      Travellers: {
        Seniors: 0,
        Adults: params.passengers.adults || 0,
        Children: params.passengers.infants || 0,
      },
      Language: 'en', // FIX: use language input
      Currency: params.currency || 'EUR',
      Ordering: {
        Value: 'Price',
        Type: 'Ascending',
      },
    };
  }

  createPackage(flightData: FlightApiResponse, hotelData: HotelApiResponse) {
    const id = hotelData.Code.toString(10);
    const flight = this.createFlight(flightData);
    const hotel = this.createHotel(hotelData);
    const whitelabelUrl = hotelData.AvailabilityDeepLink;
    return { id, flight, hotel, whitelabelUrl };
  }

  createHotel(
    data: HotelApiResponse,
  ): {|
    id: string,
    name: string,
    rating: number,
    review: { score: number },
    photos: PhotoType[],
    price: number,
    currencyCode: string,
    summary: string,
  |} {
    return {
      id: data.Code.toString(),
      review: {
        score: data.Rating / 10,
      },
      rating: data.Category,
      name: data.Name,
      price: data.Options[0].Boards[0].Price.Value,
      currencyCode: data.Options[0].Boards[0].Price.Currency,
      photos: [
        {
          id: `mainPhoto${data.Code}`,
          lowResolution: data.Image,
          highResolution: data.Image,
          thumbnail: data.Image,
        },
      ],
      summary: data.Description,
    };
  }

  createFlight(data: FlightApiResponse): {| airlines: string[] |} {
    const airlines = data.Options.reduce((all, option) => {
      option.Segments.forEach(s => all.push(s.MarketingCarrier));
      return all;
    }, []);

    return {
      airlines,
    };
  }

  async getApiKey(originAirport: string): Promise<?string> {
    const location = await this.locationDataLoader.loadById(originAirport);
    const countryCode = idx(location, _ => _.country.code);
    if (!countryCode) {
      throw new Error(`Cannot find country code for: ${originAirport}`);
    } else if (!this.supportedMarkets.has(countryCode)) {
      throw new Error(`Unsupported country code: ${countryCode}`);
    }
    return process.env[`LOGITRAVEL_API_KEY_${countryCode}`];
  }
}
