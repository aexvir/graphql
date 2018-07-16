// @flow

import idx from 'idx';
import { DateTime } from 'luxon';
import type { NavigateToTerminalTimelineEvent as NavigateToTerminalType } from '../../BookingTimeline';
import type { Leg } from '../../../flight/Flight';

export default function generateNavigateToTerminalEvent(
  leg: Leg,
): ?NavigateToTerminalType {
  const localDepartureTime = idx(leg, _ => _.departure.when.local);

  if (localDepartureTime) {
    const timestamp = DateTime.fromJSDate(localDepartureTime, { zone: 'UTC' })
      .minus({ minutes: 80 })
      .toJSDate();
    return {
      timestamp,
      type: 'NavigateToTerminalTimelineEvent',
    };
  }
  return null;
}
