// @flow

import idx from 'idx';

import type { ArrivalTimelineEvent as ArrivalType } from '../../BookingTimeline';
import type { Leg } from '../../../flight/Flight';

export default function generateArrivalEvent(leg: Leg): ?ArrivalType {
  const arrivalTime = idx(leg, _ => _.arrival.when.local);
  if (arrivalTime) {
    return {
      timestamp: arrivalTime,
      type: 'ArrivalTimelineEvent',
      arrival: leg.arrival,
    };
  }
  return null;
}
