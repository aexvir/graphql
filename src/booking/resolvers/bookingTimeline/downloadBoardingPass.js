// @flow

import idx from 'idx';
import { DateTime } from 'luxon';

import type { DownloadBoardingPassTimelineEvent as DownloadBoardingPassType } from '../../BookingTimeline';
import type { Leg } from '../../../flight/Flight';

export default function generateDownloadBoardingPassEvent(
  leg: Leg,
): ?DownloadBoardingPassType {
  const localDepartureTime = idx(leg, _ => _.departure.when.local);
  if (localDepartureTime) {
    const downloadBoardingPassTime = DateTime.fromJSDate(localDepartureTime, {
      zone: 'UTC',
    })
      .minus({
        minutes: 35,
      })
      .toJSDate();
    return {
      timestamp: downloadBoardingPassTime,
      type: 'DownloadBoardingPassTimelineEvent',
      leg,
    };
  }
  return null;
}
