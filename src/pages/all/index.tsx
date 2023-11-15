import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { JobsCard, ListingSection } from '@/components/misc/listingsCard';
import EmptySection from '@/components/shared/EmptySection';
import Loading from '@/components/shared/Loading';
import type { Job } from '@/interface/job';
import Home from '@/layouts/Home';
import axios from '@/lib/axios';

interface Listings {
  jobs?: Job[];
}

function AllListingsPage() {
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [listings, setListings] = useState<Listings>({
    jobs: [],
  });

  const getListings = async () => {
    setIsListingsLoading(true);
    try {
      const listingsData = await axios.get('/api/listings', {
        params: {
          category: 'jobs',
          take: 100,
        },
      });
      setListings(listingsData.data);
      setIsListingsLoading(false);
    } catch (e) {
      setIsListingsLoading(false);
    }
  };

  useEffect(() => {
    if (!isListingsLoading) return;
    getListings();
  }, []);

  return (
    <Home type="home">
      <Box w={'100%'}>
        <ListingSection
          type="jobs"
          title="Freelance Gigs"
          sub="Bite sized tasks for freelancers"
          emoji="/assets/home/emojis/moneyman.png"
          all
        >
          {isListingsLoading && (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          )}
          {!isListingsLoading && !listings?.jobs?.length && (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="No jobs available!"
                message="Subscribe to notifications to get notified about new jobs."
              />
            </Flex>
          )}
          {!isListingsLoading &&
            listings?.jobs?.map((job) => {
              return (
                <JobsCard
                  slug={job?.slug}
                  rewardAmount={job?.rewardAmount}
                  key={job?.id}
                  companyName={job?.company?.name}
                  deadline={job?.deadline}
                  title={job?.title}
                  logo={job?.company?.logo}
                  token={job?.token}
                  type={job?.type}
                  applicationType={job.applicationType}
                />
              );
            })}
        </ListingSection>
      </Box>
    </Home>
  );
}

export default AllListingsPage;
