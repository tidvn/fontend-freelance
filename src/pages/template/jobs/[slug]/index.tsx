import { HStack, VStack } from '@chakra-ui/react';
// import { Regions } from '@prisma/client';
import axios from 'axios';
import type { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

// import JobWinners from '@/components/listings/job/JobWinners';
import DetailDescription from '@/components/listings/listings/details/detailDescriptionJob';
import ListingHeader from '@/components/listings/listings/ListingHeaderJob';
import ErrorSection from '@/components/shared/ErrorSection';
import LoadingSection from '@/components/shared/LoadingSection';
import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';
import { jobsTemplates } from '@/lib/jobTemplate';

interface JobDetailsProps {
  slug: string;
}

function JobDetails({ slug }: JobDetailsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [job, setJob] = useState<any | null>(null);
  const getJob = async () => {
    setIsLoading(true);
    try {
      const jobDetails = jobsTemplates.find(job => job.slug === slug);
      setJob(jobDetails);

      
    } catch (e) {
      setError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) return;
    getJob();
  }, []);

  return (
    <Default
      meta={
        <Meta
          title={`${job?.title || 'Job'} | Superteam Earn`}
          description="Every Solana opportunity in one place!"
        />
      }
    >
      {isLoading && <LoadingSection />}
      {!isLoading && !!error && <ErrorSection />}
      {!isLoading && !error && !job?.id && (
        <ErrorSection message="Sorry! The job you are looking for is not available." />
      )}
      {!isLoading && !error && !!job?.id && (
        <>
          <ListingHeader
            type={job?.type}
            region={(job?.region) || `GLOBAL`}
            id={job?.id}
            status={job?.status}
            deadline={job?.deadline}
            title={job?.title ?? ''}
            company={job?.company}
            slug={job?.slug}
            isWinnersAnnounced={job?.isWinnersAnnounced}
            isTemplate={true}
            references={job?.references}
          />
          {/* {job?.isWinnersAnnounced && <JobWinners job={job} />} */}
          <HStack
            align={['center', 'center', 'start', 'start']}
            justify={['center', 'center', 'space-between', 'space-between']}
            flexDir={['column-reverse', 'column-reverse', 'row', 'row']}
            gap={4}
            maxW={'7xl'}
            mb={10}
            mx={'auto'}
          >
            <VStack gap={8} w={['22rem', '22rem', 'full', 'full']} mt={10}>
              <DetailDescription
                skills={job?.skills?.map((e: any) => e.skills) ?? []}
                description={job?.description}
              />
            </VStack>
          </HStack>
        </>
      )}
    </Default>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  return {
    props: { slug },
  };
};

export default JobDetails;
