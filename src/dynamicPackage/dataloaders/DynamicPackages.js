// @flow

import DataLoader from 'dataloader';

import { post } from '../../common/services/HttpRequest';

import type { DynamicPackage } from './DynamicPackageType';
import type {
  Flight as FlightApiResponse,
  Hotel as HotelApiResponse,
} from '../types/flow/ApiResponse';
import type { Price } from '../../common/types/Price';
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

export default new DataLoader(
  async (
    params: $ReadOnlyArray<SearchParameters>,
  ): Promise<Array<DynamicPackage[]>> => await fetchPackages(params),
);

async function fetchPackages(
  params: $ReadOnlyArray<SearchParameters>,
): Promise<Array<DynamicPackage[]>> {
  return Promise.all(
    params.map(async searchParameters => {
      const response = await post(
        'http://packagesmetasearch.api.external.logitravel.com/availability/get/',
        prepareParams(searchParameters),
      );

      return response.Hotels.map(hotel =>
        createPackage(response.Flight, hotel),
      );
    }),
  );
}

function prepareParams(params: SearchParameters) {
  return {
    ApiKey: process.env.LOGITRAVEL_API_KEY,
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

function createPackage(
  flightData: FlightApiResponse,
  hotelData: HotelApiResponse,
) {
  const id = hotelData.Code.toString(10);
  const flight = createFlight(flightData);
  const hotel = createHotel(hotelData);
  const whitelabelUrl = hotelData.DeepLink;
  return { id, flight, hotel, whitelabelUrl };
}

function createHotel(
  data: HotelApiResponse,
): {|
  id: string,
  name: string,
  rating: number,
  review: { score: number },
  photos: PhotoType[],
  price: number,
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

function createFlight(
  data: FlightApiResponse,
): {| price: Price, airlines: string[] |} {
  const airlines = data.Options.reduce((all, option) => {
    option.Segments.forEach(s => all.push(s.MarketingCarrier));
    return all;
  }, []);

  return {
    airlines,
    price: {
      amount: data.Supplement.Value,
      currency: data.Supplement.Currency,
    },
  };
}
