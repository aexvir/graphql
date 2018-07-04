// @flow

import { sanitizeDetail, sanitizeListItem } from '../ApiSanitizer';
import bookingDetail from './__datasets__/booking.detail.json';
import bookingsItem from './__datasets__/bookings.item.json';
import bookingItemWithReturn from '../../datasets/booking-item-return-3222550.json';
import bookingItemMulticity from '../../datasets/booking-item-multicity-4903131.json';
import booking2707251 from '../../datasets/booking-2707251.json';

describe('Sanitize detail', () => {
  it('should work', async () => {
    expect(sanitizeDetail(bookingDetail)).toMatchSnapshot();
  });

  it('should sanitize boarding passes', () => {
    const sanitizedData = sanitizeDetail(booking2707251);
    const boardingPass = sanitizedData.assets.boardingPasses[0];

    expect(sanitizedData.assets.boardingPasses).toHaveLength(2);
    expect(boardingPass.boardingPassUrl).toBe('https://very.real/pass.pdf');
    expect(boardingPass.flightNumber).toBe('315289498');
    expect(boardingPass.availableAt).toBe('2017-09-02');
    expect(boardingPass.leg).toBeDefined();
  });
});

describe('Sanitize list item', () => {
  it('should work', async () => {
    expect(sanitizeListItem(bookingsItem)).toMatchSnapshot();
  });

  it('should work with return flight', () => {
    expect(sanitizeListItem(bookingItemWithReturn)).toMatchSnapshot();
  });

  it('should create trips from legs for multicity', () => {
    const sanitizedItem = sanitizeListItem(bookingItemMulticity);
    const expectedNoOfTrips = bookingItemMulticity.segments.length + 1;

    expect(sanitizedItem).toHaveProperty('trips');
    expect(sanitizedItem.trips).toHaveLength(expectedNoOfTrips);
    // $FlowExpectedError: it's array if above expectations passed
    sanitizedItem.trips.forEach(trip =>
      expect(trip).toEqual(
        expect.objectContaining({
          departure: expect.any(Object),
          arrival: expect.any(Object),
          legs: expect.any(Array),
        }),
      ),
    );
  });
});
