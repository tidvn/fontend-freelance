import type { Job, JobWithSubscribes } from '@/interface/job';
import { dayjs } from '@/utils/dayjs';

export const getDeadlineFromNow = (deadline: string | undefined) =>
  deadline ? dayjs(deadline).fromNow() : '-';

export const formatDeadline = (deadline: string | undefined) =>
  deadline ? dayjs(deadline).format('MMM D, YYYY HH:mm') : '-';

export const isDeadlineOver = (deadline: string | undefined) =>
  deadline ? dayjs().isAfter(dayjs(deadline)) : false;

export const getJobDraftStatus = (
  status: string | undefined,
  isPublished: boolean | undefined
) => {
  if (status !== 'OPEN') return 'CLOSED';
  if (isPublished) return 'PUBLISHED';
  return 'DRAFT';
};

export const getJobProgress = (
  job: Job | JobWithSubscribes | null
) => {
  if (!job) return '-';
  const rewardsLength = Object.keys(job?.rewards || {})?.length || 0;
  const jobStatus = getJobDraftStatus(
    job?.status,
    job?.isPublished
  );
  if (jobStatus !== 'PUBLISHED') return '';
  const hasDeadlinePassed = isDeadlineOver(job?.deadline || '');
  if (!hasDeadlinePassed) return 'IN PROGRESS';
  if (job?.isWinnersAnnounced && job?.totalPaymentsMade === rewardsLength)
    return 'COMPLETED';
  if (job?.isWinnersAnnounced && job?.totalPaymentsMade !== rewardsLength)
    return 'ANNOUNCED - PAYMENTS PENDING';
  if (
    !job?.isWinnersAnnounced &&
    job?.totalWinnersSelected === rewardsLength &&
    job?.totalPaymentsMade === rewardsLength
  )
    return 'PAYMENTS COMPLETED';
  if (
    !job?.isWinnersAnnounced &&
    job?.totalWinnersSelected === rewardsLength
  )
    return 'WINNERS SELECTED';
  return 'IN REVIEW';
};

export const getBgColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
    case 'COMPLETED':
      return 'green';
    case 'ANNOUNCED - PAYMENTS PENDING':
      return 'green.400';
    case 'PAYMENTS COMPLETED':
      return 'green.500';
    case 'WINNERS SELECTED':
      return 'green.300';
    case 'DRAFT':
      return 'orange';
    case 'IN REVIEW':
      return 'brand.purple';
    default:
      return 'gray';
  }
};
