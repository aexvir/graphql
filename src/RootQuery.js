// @flow

import { GraphQLObjectType } from 'graphql';

import AllAvailableHotels from './hotel/queries/AllAvailableHotels';
import AllBookings from './booking/queries/AllBookings';
import AllDynamicPackages from './dynamicPackage/queries/AllDynamicPackages';
import AllFAQCategories from './FAQ/queries/AllFAQCategories';
import AllFAQs from './FAQ/queries/AllFAQs';
import AllFlights from './flight/queries/AllFlights';
import AllLocations from './location/queries/AllLocations';
import AllSubLocations from './location/queries/AllSubLocations';
import AvailableHotel from './hotel/queries/AvailableHotel';
import Booking from './booking/queries/Booking';
import Currencies from './currency/queries/Currencies';
import Currency from './currency/queries/Currency';
import CurrentUser from './identity/queries/CurrentUser';
import CustomerBookings from './booking/queries/CustomerBookings';
import FAQArticle from './FAQ/queries/FAQArticle';
import FAQCategory from './FAQ/queries/FAQCategory';
import GeoIP from './geoip/queries/geoIP';
import Hotel from './hotel/queries/Hotel';
import HotelCities from './hotel/queries/HotelCities';
import Location from './location/queries/Location';
import NearestBooking from './booking/queries/NearestBooking';
import BookingTimeline from './booking/queries/BookingTimeline';
import { nodeField } from './node/node';
import AirHelpPlusOffer from './bookingAncillaries/queries/AirHelpPlusOffer';
import SingleBooking from './booking/queries/SingleBooking';

export default new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Root Query',
  fields: {
    allAvailableHotels: AllAvailableHotels,
    allBookings: AllBookings,
    allDynamicPackages: AllDynamicPackages,
    allFAQCategories: AllFAQCategories,
    allFAQs: AllFAQs,
    allFlights: AllFlights,
    allLocations: AllLocations,
    allSubLocations: AllSubLocations,
    availableHotel: AvailableHotel,
    booking: Booking,
    currencies: Currencies,
    currency: Currency,
    currentUser: CurrentUser,
    customerBookings: CustomerBookings,
    FAQArticle: FAQArticle,
    FAQCategory: FAQCategory,
    geoIP: GeoIP,
    hotel: Hotel,
    hotelCities: HotelCities,
    location: Location,
    nearestBooking: NearestBooking,
    bookingTimeline: BookingTimeline,
    node: nodeField,
    airHelpPlusOffer: AirHelpPlusOffer,
    singleBooking: SingleBooking,
  },
});
