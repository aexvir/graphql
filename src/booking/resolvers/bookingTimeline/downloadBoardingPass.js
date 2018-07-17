// @flow

import idx from 'idx';
import type { DownloadBoardingPassTimelineEvent as DownloadBoardingPassType } from '../../BookingTimeline';
import type { Leg } from '../../../flight/Flight';

export default function generateDownloadBoardingPassEvent(
  leg: Leg,
): ?DownloadBoardingPassType {
  const localDepartureTime = idx(leg, _ => _.departure.when.local);
  if (localDepartureTime) {
    return {
      timestamp: localDepartureTime,
      type: 'DownloadBoardingPassTimelineEvent',
      leg,
    };
  }
  return null;
}
