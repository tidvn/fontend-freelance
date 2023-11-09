/* eslint-disable no-nested-ternary */
import { Flex } from '@chakra-ui/react';
import dayjs from 'dayjs';

import { JobsCard } from '@/components/misc/listingsCard';
import EmptySection from '@/components/shared/EmptySection';
import Loading from '@/components/shared/Loading';
import type { Job } from '@/interface/job';

interface TabProps {
  id: string;
  title: string;
  content: JSX.Element;
}

interface JobTabsProps {
  isListingsLoading: boolean;
  jobs: { jobs: Job[] };
  take?: number;
}

export const JobTabs = ({
  isListingsLoading,
  jobs,
  take = 10,
}: JobTabsProps) => {
  const tabs: TabProps[] = [
    {
      id: 'tab1',
      title: 'OPEN',
      content: (
        <Flex direction={'column'} rowGap={1}>
          {isListingsLoading ? (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          ) : jobs?.jobs?.filter(
              (job) =>
                job.status === 'OPEN' && !dayjs().isAfter(job.deadline)
            ).length ? (
            jobs.jobs
              .filter(
                (job) =>
                  job.status === 'OPEN' && !dayjs().isAfter(job.deadline)
              )
              .slice(0, take)
              .map((job) => (
                <JobsCard
                  slug={job.slug}
                  rewardAmount={job?.rewardAmount}
                  key={job?.id}
                  sponsorName={job?.sponsor?.name}
                  deadline={job?.deadline}
                  title={job?.title}
                  logo={job?.sponsor?.logo}
                  token={job?.token}
                  type={job?.type}
                  applicationType={job.applicationType}
                />
              ))
          ) : (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="No jobs available!"
                message="Subscribe to notifications to get notified about new jobs."
              />
            </Flex>
          )}
        </Flex>
      ),
    },
    {
      id: 'tab2',
      title: 'IN REVIEW',
      content: (
        <Flex direction={'column'} rowGap={'1'}>
          {isListingsLoading ? (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          ) : jobs?.jobs?.filter(
              (job) =>
                !job.isWinnersAnnounced &&
                dayjs().isAfter(job.deadline) &&
                job.status === 'OPEN'
            ).length ? (
            jobs.jobs
              .filter(
                (job) =>
                  !job.isWinnersAnnounced &&
                  dayjs().isAfter(job.deadline) &&
                  job.status === 'OPEN'
              )
              .slice(0, 10)
              .map((job) => (
                <JobsCard
                  slug={job.slug}
                  rewardAmount={job?.rewardAmount}
                  key={job?.id}
                  sponsorName={job?.sponsor?.name}
                  deadline={job?.deadline}
                  title={job?.title}
                  logo={job?.sponsor?.logo}
                  token={job?.token}
                  type={job?.type}
                  applicationType={job.applicationType}
                />
              ))
          ) : (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="No jobs in review!"
                message="Subscribe to notifications to get notified about updates."
              />
            </Flex>
          )}
        </Flex>
      ),
    },
    {
      id: 'tab3',
      title: 'COMPLETED',
      content: (
        <Flex direction={'column'} rowGap={'1'}>
          {isListingsLoading ? (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          ) : jobs?.jobs?.filter(
              (job) =>
                job.status === 'CLOSED' ||
                (job.isWinnersAnnounced && job.status === 'OPEN')
            ).length ? (
            jobs.jobs
              .filter(
                (job) =>
                  job.status === 'CLOSED' ||
                  (job.isWinnersAnnounced && job.status === 'OPEN')
              )
              .slice(0, 10)
              .map((job) => (
                <JobsCard
                  slug={job.slug}
                  rewardAmount={job?.rewardAmount}
                  key={job?.id}
                  sponsorName={job?.sponsor?.name}
                  deadline={job?.deadline}
                  title={job?.title}
                  logo={job?.sponsor?.logo}
                  token={job?.token}
                  type={job?.type}
                  applicationType={job.applicationType}
                />
              ))
          ) : (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="No jobs announced!"
                message="Subscribe to notifications to get notified about announcements."
              />
            </Flex>
          )}
        </Flex>
      ),
    },
  ];
  return tabs;
};
