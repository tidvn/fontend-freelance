import { Box, Flex, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import Avatar from 'boring-avatars';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

import type { Job, Rewards } from '@/interface/job';
import type { SubmissionWithUser } from '@/interface/submission';
import { sortRank } from '@/utils/rank';

interface Props {
  job: Job;
}

function JobWinners({ job }: Props) {
  const [isJobLoading, setIsJobLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionWithUser[]>([]);

  const getSubmissions = async (id?: string) => {
    setIsJobLoading(true);
    try {
      const submissionsDetails = await axios.get(
        `/api/submission/${id || job?.id}/winners/`
      );
      const { data } = submissionsDetails;
      const winners = sortRank(
        data.map(
          (submission: SubmissionWithUser) => submission.winnerPosition || ''
        )
      );
      const sortedSubmissions = winners.map((position) =>
        data.find((d: SubmissionWithUser) => d.winnerPosition === position)
      );
      setSubmissions(sortedSubmissions);
      setIsJobLoading(false);
    } catch (e) {
      setIsJobLoading(false);
    }
  };

  useEffect(() => {
    getSubmissions();
  }, []);

  if (isJobLoading || !submissions.length) {
    return null;
  }
  console.log(
    'file: JobWinners.tsx:34 ~ JobWinners ~ submissions:',
    submissions
  );

  return (
    <Box maxW={'7xl'} mt={10} mx={'auto'}>
      <Text
        mb={4}
        mx={3}
        color="brand.slate.500"
        fontSize="xl"
        fontWeight={600}
      >
        🎉 Winners Announced
      </Text>
      <Box mx={3}>
        <Box
          w="full"
          px={10}
          py={6}
          color="white"
          bg="radial-gradient(circle, rgba(159,65,255,1) 25%, rgba(99,102,241,1) 100%);"
          rounded="md"
        >
          <Flex align="center" justify="center" wrap="wrap" gap={10}>
            {submissions.map((submission) => (
              <NextLink
                key={submission.id}
                href={`/listings/jobs/${job?.slug}/submission/${submission?.id}/`}
                passHref
              >
                <Flex
                  as="a"
                  pos="relative"
                  align="center"
                  justify="center"
                  direction={'column'}
                  cursor="pointer"
                >
                  <Text
                    pos="absolute"
                    top={-2}
                    px={1}
                    color="white"
                    fontSize="xs"
                    fontWeight={700}
                    textAlign="center"
                    textTransform="capitalize"
                    bg="brand.purple"
                    rounded={'full'}
                  >
                    {submission?.winnerPosition}
                  </Text>
                  {submission?.user?.photo ? (
                    <Image
                      boxSize="72px"
                      borderRadius="full"
                      alt={`${submission?.user?.firstname} ${submission?.user?.lastname}`}
                      src={submission?.user?.photo}
                    />
                  ) : (
                    <Avatar
                      name={`${submission?.user?.firstname} ${submission?.user?.lastname}`}
                      colors={['#92A1C6', '#F0AB3D', '#C271B4']}
                      size={72}
                      variant="marble"
                    />
                  )}
                  <Text
                    fontSize="sm"
                    fontWeight={600}
                    textAlign={'center'}
                  >{`${submission?.user?.firstname} ${submission?.user?.lastname}`}</Text>
                  <Text
                    fontSize="xs"
                    fontWeight={300}
                    textAlign="center"
                    opacity={0.6}
                  >
                    {job?.token}{' '}
                    {job?.rewards &&
                      job?.rewards[
                        submission?.winnerPosition as keyof Rewards
                      ]}
                  </Text>
                </Flex>
              </NextLink>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default JobWinners;
