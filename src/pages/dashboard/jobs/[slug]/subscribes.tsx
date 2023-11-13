import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  InfoOutlineIcon,
  LinkIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import Avatar from "boring-avatars";
import type { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ErrorSection from "@/components/shared/ErrorSection";
import LoadingSection from "@/components/shared/LoadingSection";
import PublishResults from "@/components/subscribes/PublishResults";
import { tokenList } from "@/constants";
import type { Job, JobWithSubscribes, Rewards } from "@/interface/job";
import type { SubscribeWithUser } from "@/interface/subscribes";
import Sidebar from "@/layouts/Sidebar";
import { userStore } from "@/store/user";
import { getBgColor, getJobDraftStatus, getJobProgress } from "@/utils/job";

import { dayjs } from "@/utils/dayjs";
import { sortRank } from "@/utils/rank";
import { truncatePublicKey } from "@/utils/truncatePublicKey";
import fetchClient from "@/lib/fetch-client";
import { AiOutlineEdit, AiOutlineOrderedList } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";

interface Props {
  slug: string;
}

function JobSubscribes({ slug }: Props) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userInfo } = userStore();
  const [job, setJob] = useState<JobWithSubscribes | null>(null);
  const [totalSubscribes, setTotalSubscribes] = useState(0);

  const [subscribes, setSubscribes] = useState<SubscribeWithUser[]>([]);
  const [selectedSubscribe, setSelectedSubscribes] =
    useState<SubscribeWithUser>();
  const [isSelectingWinner, setIsSelectingWinner] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [rewards, setRewards] = useState<string[]>([]);
  const [isJobLoading, setIsJobLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const length = 15;

  const getSubscribes = async (job: JobWithSubscribes) => {
    setIsJobLoading(true);
    try {
      const subscribesDetails = job?.subscribes;

      setTotalSubscribes(subscribesDetails.length);
      // setTotalWinners(subscribesDetails.data.winnersSelected || 0);
      // setTotalPaymentsMade(subscribesDetails.data.paymentsMade || 0);

      setSubscribes(subscribesDetails);
      setSelectedSubscribes(subscribesDetails[0]);
      setIsJobLoading(false);
    } catch (e) {
      setIsJobLoading(false);
    }
  };

  const getJob = async () => {
    setIsJobLoading(true);
    try {
      const jobDetails = await fetchClient({
        method: "GET",
        endpoint: `/api/jobs?slug=${slug}`,
      });

      setJob(jobDetails.data.data[0]);

      getSubscribes(jobDetails.data.data[0]);
      const ranks = sortRank(Object.keys(jobDetails.data.rewards || {}));
      setRewards(ranks);
    } catch (e) {
      setIsJobLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.currentCompanyId) {
      getJob();
    }
  }, [userInfo?.currentCompanyId]);

  const jobStatus = getJobDraftStatus(job?.status, job?.isPublished);

  const jobProgress = getJobProgress(job);

  

  return (
    <Sidebar>
      {isJobLoading ? (
        <LoadingSection />
      ) : (
        <>
          {isOpen && (
            <PublishResults
                isOpen={isOpen}
                onClose={onClose}
                rewards={Object.keys(job?.rewards || {})}
                jobId={job?.id}
                isDeadlinePassed={dayjs().isAfter(job?.deadline)} totalWinners={0} totalPaymentsMade={0}              // hasWinnersAnnounced={job?.isChosensAnnounced}
            />
          )}
          <Box mb={4}>
            <Breadcrumb color="brand.slate.400">
              <BreadcrumbItem>
                <NextLink href="/dashboard/jobs" passHref>
                  <BreadcrumbLink color="brand.slate.400">
                    <Flex align="center">
                      <ChevronLeftIcon mr={1} w={6} h={6} />
                      Jobs
                    </Flex>
                  </BreadcrumbLink>
                </NextLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <Text color="brand.slate.400">Subscribes</Text>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>
          <Flex justify="start" gap={2} mb={4}>
            <Text color="brand.slate.500" fontSize="lg" fontWeight="700">
              {job?.title}
            </Text>
            <Tag
              color={"white"}
              bg={getBgColor(jobStatus)}
              size="sm"
              variant="solid"
            >
              {jobStatus}
            </Tag>
            <Tag
              color={"white"}
              bg={getBgColor(jobProgress)}
              size="sm"
              variant="solid"
            >
              {jobProgress}
            </Tag>
          </Flex>
          <Flex align="center" justify="space-between" mb={4}>
            <Text color="brand.slate.500">
              {totalSubscribes}{" "}
              <Text as="span" color="brand.slate.400">
                Subscribes
              </Text>
            </Text>
            
          </Flex>
          {!subscribes?.length ? (
            <ErrorSection
              title="No subscribes found!"
              message="View your job subscribes here once they are submitted"
            />
          ) : (
            <Flex align={"start"} bg="white">
              <Flex flex="1 1 auto" minW={{ base: "none", md: 96 }}>
                <Box
                  w="full"
                  bg="white"
                  border="1px solid"
                  borderColor={"blackAlpha.200"}
                  roundedLeft="xl"
                >
                  {subscribes && (
        <TableContainer mb={8}>
          <Table
            border="1px solid"
            borderColor={"blackAlpha.200"}
            variant="simple"
          >
            <Thead>
              <Tr bg="white">
                <Th
                  maxW={96}
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textTransform={"capitalize"}
                >
                  Name
                </Th>
                <Th
                  align="right"
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textAlign="right"
                  textTransform={"capitalize"}
                >
                  Email
                </Th>
                <Th
                  align="right"
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textAlign="right"
                  textTransform={"capitalize"}
                >
                  Phone Number
                </Th>
                <Th
                  align="center"
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textAlign="center"
                  textTransform={"capitalize"}
                >
                  Apply At ↓
                </Th>
                {/* <Th
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textTransform={"capitalize"}
                >
                  Prize
                </Th> */}
                {/* <Th
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textAlign="center"
                  textTransform={"capitalize"}
                >
                  Draft
                </Th>
                <Th
                  color="brand.slate.400"
                  fontSize="sm"
                  fontWeight={500}
                  textAlign="center"
                  textTransform={"capitalize"}
                >
                  Status
                </Th> */}
                <Th pl={0} />
                <Th pl={0} />
              </Tr>
            </Thead>
            <Tbody w="full">
              {subscribes.map((sub) => {
                // const deadlineFromNow = getDeadlineFromNow(
                //   currentJob?.deadline
                // );
                // const deadline = formatDeadline(currentJob?.deadline);
                // const jobStatus = getJobDraftStatus(
                //   currentJob?.status,
                //   currentJob?.isPublished
                // );
                // const jobProgress = getJobProgress(currentJob);
                return (
                  <Tr key={sub?.id} bg="white">
                    <Td
                      maxW={96}
                      color="brand.slate.700"
                      fontWeight={500}
                      whiteSpace="normal"
                      wordBreak={"break-word"}
                    >
                      <NextLink
                        target="_blank"
                        href={`/t/${sub?.user.username}`}
                        passHref
                      >
                        <Text as="a" _hover={{ textDecoration: "none" }}>
                        {sub?.user.firstname} {sub?.user.lastname }
                        </Text>
                      </NextLink>
                    </Td>
                    <Td align="right">
                      <Text textAlign={"right"}>
                      {sub?.email}
                      </Text>
                    </Td>
                    <Td align="right">
                      <Text textAlign={"right"}>
                      {sub?.phoneNumber}
                      </Text>
                    </Td>
                    <Td align="center">
                      <Flex align={"center"} justify="center">
                        <Tooltip
                          color="white"
                          bg="brand.purple"
                          label={`deadline`}
                          placement="bottom"
                        >
                          <Flex align="center">
                          {sub?.created_at }
                            <InfoOutlineIcon
                              ml={1}
                              w={3}
                              h={3}
                              color="brand.slate.400"
                            />
                          </Flex>
                        </Tooltip>
                      </Flex>
                    </Td>
                                        
                    <Td pl={0}>
                      <Button
                            w="full"
                            leftIcon={<AiOutlineOrderedList />}
                            onClick={onOpen}
                            size="sm"
                            variant="outline"
                          >
                            Chose Talent
                          </Button>                        
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}


                 
                </Box>
              </Flex>
            </Flex>
          )}
          <Flex align="center" justify="start" gap={4} mt={4}>
            <Button
              isDisabled={skip <= 0}
              leftIcon={<ChevronLeftIcon w={5} h={5} />}
              onClick={() =>
                skip >= length ? setSkip(skip - length) : setSkip(0)
              }
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <Text color="brand.slate.400" fontSize="sm">
              <Text as="span" fontWeight={700}>
                {skip + 1}
              </Text>{" "}
              -{" "}
              <Text as="span" fontWeight={700}>
                {Math.min(skip + length, totalSubscribes)}
              </Text>{" "}
              of{" "}
              <Text as="span" fontWeight={700}>
                {totalSubscribes}
              </Text>{" "}
              Subscribes
            </Text>
            <Button
              isDisabled={
                totalSubscribes < skip + length ||
                (skip > 0 && skip % length !== 0)
              }
              onClick={() => skip % length === 0 && setSkip(skip + length)}
              rightIcon={<ChevronRightIcon w={5} h={5} />}
              size="sm"
              variant="outline"
            >
              Next
            </Button>
          </Flex>
        </>
      )}
    </Sidebar>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  return {
    props: { slug },
  };
};

export default JobSubscribes;
