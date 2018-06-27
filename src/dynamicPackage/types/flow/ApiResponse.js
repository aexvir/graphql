// @flow

export type Flight = {
  Options: Options[],
  Supplement: Supplement,
};

type Options = {
  Itinerary: number,
  FareId: number,
  OptionId: number,
  Carrier: string,
  Segments: Segments[],
};

type Segments = {
  Origin: string,
  Destination: string,
  Departure: string,
  Arrival: string,
  OperatingCarrier: string,
  MarketingCarrier: string,
  TransportNumber: string,
  CabinClass: string,
};

type Supplement = {
  Value: number,
  Currency: string,
};

type Board = {
  BoardType: number,
  Price: Price,
  OptionId: string,
  OptionKey: string,
  OptionType: string,
  DeepLink: string,
};

type Location = {
  Name: string,
  Latitude: number,
  Longitude: number,
};

type HotelOption = {
  Description: string,
  Boards: Board[],
};

type Price = {
  Value: number,
  Currency: string,
};

export type Hotel = {
  Code: number,
  Name: string,
  Location: Location,
  Image: string,
  Category: number,
  Rating: number,
  Description: string,
  Options: HotelOption[],
  AvailabilityDeepLink: string,
  HotelDeepLink: string,
};
