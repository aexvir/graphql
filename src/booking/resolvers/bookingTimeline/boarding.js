// @flow

import idx from 'idx';
import { DateTime } from 'luxon';

import type { BoardingTimelineEvent as BoardingType } from '../../BookingTimeline';
import type { Leg } from '../../../flight/Flight';

export default function generateBoardingEvent(leg: Leg): ?BoardingType {
  const localDepartureTime = idx(leg, _ => _.departure.when.local);
  const terminal = idx(leg, _ => _.departure.where.terminal);
  if (localDepartureTime) {
    const BoardingTime = DateTime.fromJSDate(localDepartureTime, {
      zone: 'UTC',
    })
      .minus({
        minutes: 30,
      })
      .toJSDate();
    return {
      timestamp: BoardingTime,
      type: 'BoardingTimelineEvent',
      terminal: terminal,
    };
  }
  return null;
}
