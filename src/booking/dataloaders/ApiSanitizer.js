// @flow

import idx from 'idx';

import { sanitizeRoute } from '../../flight/dataloaders/RouteSanitizer';
import type {
  BookingsItem,
  Booking,
  BookingType,
  BoardingPass,
} from '../Booking';
import type { Leg } from '../../flight/Flight';
import type { TripData } from '../types/outputs/Trip';
import type { InboundOutboundData } from '../types/outputs/BookingReturn';

/**
 * Implementation details (weirdnesses) explained:
 *
 * arrival: computed from the last flight leg because API returns "0" for times
 * departure: computed from the first flight leg because API returns "0" for times
 */
export function sanitizeListItem(apiData: Object): BookingsItem {
  const bid = parseInt(apiData.bid);

  const legs = apiData.flights.map((flight): Leg => ({
    id: flight.id,
    bookingId: bid,
    recheckRequired: flight.bags_recheck_required,
    isReturn: flight.return === 1,
    flightNo: flight.flight_no,
    boardingPassAvailableAt: idx(flight, _ => _.ticket_available_at),
    departure: sanitizeRoute({
      utc: idx(flight.departure, _ => _.when.utc),
      local: idx(flight.departure, _ => _.when.local),
      code: idx(flight.departure, _ => _.where.code),
      cityName: idx(flight.departure, _ => _.where.name),
      cityId: idx(flight.departure, _ => _.where.city_id),
      terminal: idx(flight.departure, _ => _.where.terminal),
    }),
    arrival: sanitizeRoute({
      utc: idx(flight.arrival, _ => _.when.utc),
      local: idx(flight.arrival, _ => _.when.local),
      code: idx(flight.arrival, _ => _.where.code),
      cityName: idx(flight.arrival, _ => _.where.name),
      cityId: idx(flight.arrival, _ => _.where.city_id),
      terminal: idx(flight.arrival, _ => _.where.terminal),
    }),
    airlineCode: flight.airline.iata,
    vehicleType: idx(flight, _ => _.vehicle.type),
    guarantee: flight.guarantee,
    vehicle: flight.vehicle,
    operatingAirline: flight.operating_airline,
    pnr: flight.reservation_number,
  }));
  const lastLeg = legs[legs.length - 1];
  const firstLeg = legs[0];
  const type = detectType(apiData);
  let additionalFields = {};

  if (type === 'BookingReturn') {
    additionalFields = splitLegs(legs);
  } else if (type === 'BookingMulticity') {
    additionalFields.trips = createTrips(apiData.segments, legs);
  }

  return {
    id: bid,
    departure: firstLeg.departure,
    arrival: lastLeg.arrival,
    legs,
    price: {
      amount: apiData.original_price,
      currency: apiData.original_currency,
    },
    created: new Date(apiData.created * 1000),
    authToken: apiData.auth_token,
    status: apiData.status,
    type,
    passengerCount: apiData.passengers.length,
    passengers: sanitizePassengers(apiData.passengers, apiData.travel_info),
    ...additionalFields,
  };
}

export function sanitizeDetail(apiData: Object): Booking {
  const common = sanitizeListItem(apiData);

  const allowedToChangeFlights = idx(
    apiData,
    _ => _.config.allowed_to_change.flights,
  );

  return {
    ...common,
    allowedBaggage: {
      additionalBaggage: parseAdditionalBaggage(
        apiData.additional_bags_prices,
        apiData.currency,
      ),
      cabin: [
        {
          height: apiData.bag_params.hand_height,
          length: apiData.bag_params.hand_length,
          width: apiData.bag_params.hand_width,
          weight: apiData.bag_params.hand_weight,
          note:
            apiData.bag_params.hand_note === ''
              ? null
              : apiData.bag_params.hand_note,
        },
        {
          height: apiData.bag_params.hand2_height,
          length: apiData.bag_params.hand2_length,
          width: apiData.bag_params.hand2_width,
          weight: apiData.bag_params.hand2_weight,
          note:
            apiData.bag_params.hand2_note === ''
              ? null
              : apiData.bag_params.hand2_note,
        },
      ],
      checked: [
        {
          height: apiData.bag_params.hold_height,
          length: apiData.bag_params.hold_length,
          width: apiData.bag_params.hold_width,
          weight: apiData.bag_params.hold_weight,
          note: apiData.bag_params.note === '' ? null : apiData.bag_params.note,
        },
      ],
    },
    assets: {
      ticketUrl: idx(apiData, _ => _.assets.eticket),
      invoiceUrl: idx(apiData, _ => _.assets.invoice),
      boardingPasses: sanitizeBoardingPasses(
        idx(apiData, _ => _.assets.boarding_passes),
        common.legs,
      ),
      legs: common.legs,
    },
    bookedServices: sanitizeAdditionalBookings(
      apiData.additional_bookings.details,
    ),
    contactDetails: sanitizeContactDetails(apiData.contact),
    allowedToChangeFlights,
  };
}

function sanitizeBoardingPasses(
  boardingPasses: ?{ [string]: Object },
  legs: Leg[],
): BoardingPass[] {
  if (!boardingPasses) {
    return [];
  }

  return Object.entries(boardingPasses).map(([key, value]) => {
    const leg = legs.find(leg => leg.id === key);
    return {
      boardingPassUrl: value,
      flightNumber: key,
      availableAt: idx(leg, _ => _.boardingPassAvailableAt),
      leg,
    };
  });
}

function sanitizeContactDetails(contactDetails: Object) {
  return {
    phone: contactDetails.phone,
    email: contactDetails.email,
  };
}

function sanitizePassengers(passengers: Object[], travelInfo: Object) {
  return passengers.map(passenger => ({
    id: passenger.id,
    firstname: passenger.firstname,
    lastname: passenger.lastname,
    insuranceType: passenger.insurance_type,
    title: passenger.title,
    birthday: passenger.birthday,
    nationality: passenger.nationality,
    travelDocument: {
      idNumber: passenger.travel_document.cardno,
      expiration: passenger.travel_document.expiration,
    },
    travelInfo: sanitizeVisaStatus(travelInfo, passenger.id),
  }));
}

function sanitizeVisaStatus(travelInfo: Object, passengerId: number) {
  const outData = [];

  // TravelInfo object contains keys which are passenger ids
  // Return only data for the current passenger
  if (travelInfo != null && travelInfo.hasOwnProperty(passengerId.toString())) {
    const passengerTravelInfo = travelInfo[passengerId];
    Object.keys(passengerTravelInfo).forEach(item => {
      outData.push({ visa: passengerTravelInfo[item].visa });
    });
  }

  return outData;
}

function sanitizeAdditionalBookings(additionalBookings: Array<Object>) {
  return additionalBookings.map(item => ({
    category: item.category,
    status: item.final_status,
  }));
}

function createTrips(segments: string[], legs: Leg[]): TripData[] {
  const trips = [];

  const lastIndex = segments.reduce((lastIndex: number, segment: string) => {
    const indexOfNewSegment = parseInt(segment);
    const trip = legs.slice(lastIndex, indexOfNewSegment);
    trips.push(trip);

    return indexOfNewSegment;
  }, 0);
  trips.push(legs.slice(lastIndex));

  return trips.filter(trip => trip.length > 0).map(trip => ({
    departure: trip[0].departure,
    arrival: trip[trip.length - 1].arrival,
    legs: trip,
  }));
}

function splitLegs(legs: Leg[]): InboundOutboundData {
  const inboundLegs = [];
  const outboundLegs = [];

  legs.forEach(leg => {
    if (leg.isReturn) {
      inboundLegs.push(leg);
      return;
    }

    outboundLegs.push(leg);
  });

  if (!inboundLegs.length || !outboundLegs.length) {
    throw new Error('Unexpected - these are not Legs with return trip.');
  }

  return {
    inbound: {
      departure: inboundLegs[0].departure,
      arrival: inboundLegs[inboundLegs.length - 1].arrival,
      legs: inboundLegs,
    },
    outbound: {
      departure: outboundLegs[0].departure,
      arrival: outboundLegs[outboundLegs.length - 1].arrival,
      legs: outboundLegs,
    },
  };
}

function parseAdditionalBaggage(
  additionalBagsPrices: Object,
  currency: string,
) {
  const additionalBaggage = [];
  for (const quantity in additionalBagsPrices) {
    additionalBaggage.push({
      price: {
        amount: additionalBagsPrices[quantity],
        currency: currency,
      },
      quantity: Number(quantity),
    });
  }
  return additionalBaggage;
}

function detectType(apiData): BookingType {
  if (Array.isArray(apiData.flights)) {
    const returnFlight = apiData.flights.find(flight => flight.return === 1);

    if (returnFlight) {
      return 'BookingReturn';
    }
  }

  if (Array.isArray(apiData.segments) && apiData.segments.length) {
    return 'BookingMulticity';
  }

  return 'BookingOneWay';
}
