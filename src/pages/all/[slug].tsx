import { Box, Flex } from '@chakra-ui/react';
import type { NextPageContext } from 'next';
import { useEffect, useState } from 'react';

import {
  JobsCard,
  GrantsCard,
  ListingSection,
} from '@/components/misc/listingsCard';
import EmptySection from '@/components/shared/EmptySection';
import Loading from '@/components/shared/Loading';
import type { Job } from '@/interface/job';
import type { Grant } from '@/interface/grant';
import Home from '@/layouts/Home';
import axios from '@/lib/axios';

interface Listings {
  bounties?: Job[];
  grants?: Grant[];
}

function ListingCategoryPage({ slug }: { slug: string }) {
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [listings, setListings] = useState<Listings>({
    bounties: [],
    grants: [],
  });

  const getListings = async () => {
    setIsListingsLoading(true);
    const params =
      slug === 'Hyperdrive'
        ? { category: 'hyperdrive' }
        : { category: 'all', take: 100, filter: slug };
    try {
      const listingsData = await axios.get('/api/listings/', { params });
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
    <Home type="category">
      <Box w={'100%'}>
        <ListingSection
          type="jobs"
          title={`${slug} Gigs`}
          sub="Bite sized tasks for freelancers"
          emoji="/assets/home/emojis/moneyman.png"
          all
        >
          {isListingsLoading && (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          )}
          {!isListingsLoading && !listings?.bounties?.length && (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="No bounties available!"
                message="Subscribe to notifications to get notified about new bounties."
              />
            </Flex>
          )}
          {!isListingsLoading &&
            listings?.bounties?.map((job) => {
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
                  applicationType={job?.applicationType}
                />
              );
            })}
        </ListingSection>
        <ListingSection
          type="grants"
          title={`${slug} Grants`}
          sub="Equity-free funding opportunities for builders"
          emoji="/assets/home/emojis/grants.png"
          all
        >
          {isListingsLoading && (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          )}
          {!isListingsLoading && !listings?.grants?.length && (
            <Flex align="center" justify="center" mt={8}>
              <EmptySection
                title="No grants available!"
                message="Subscribe to notifications to get notified about new grants."
              />
            </Flex>
          )}
          {!isListingsLoading &&
            listings?.grants?.map((grant) => {
              return (
                <GrantsCard
                  companyName={grant?.company?.name}
                  logo={grant?.company?.logo}
                  key={grant?.id}
                  slug={grant.slug}
                  rewardAmount={grant?.rewardAmount}
                  title={grant?.title}
                  short_description={grant?.shortDescription}
                />
              );
            })}
        </ListingSection>
      </Box>
    </Home>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { slug } = context.query;

  const validCategories = ['Design', 'Content', 'Development', 'Hyperdrive'];

  if (!validCategories.includes(slug as string)) {
    return {
      notFound: true,
    };
  }

  return {
    props: { slug },
  };
}

export default ListingCategoryPage;
