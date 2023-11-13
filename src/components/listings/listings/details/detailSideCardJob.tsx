/* eslint-disable no-nested-ternary */
import { ExternalLinkIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

import { VerticalStep } from '@/components/misc/steps';
import { SubscribeModal } from '@/components/modals/subscribeModalJob';
import WarningModal from '@/components/shared/WarningModal';
import { tokenList } from '@/constants/index';
import type { Eligibility, Rewards } from '@/interface/job';
import { userStore } from '@/store/user';
import { BACKEND_URL } from '@/env';
import fetchClient from '@/lib/fetch-client';
import axios from '@/lib/axios';

interface Props {
  id: string;
  applicationLink?: string;
  total?: number;
  prizeList?: Partial<Rewards>;
  onOpen?: () => void;
  endingTime?: string;
  subscribeisOpen?: boolean;
  subscribeonClose?: () => void;
  subscribeonOpen?: () => void;
  token?: string;
  questions?: string;
  eligibility?: Eligibility[];
  type?: string;
  jobtitle: string;
  requirements?: string;
  isWinnersAnnounced?: boolean;
  hackathonPrize?: boolean;
  pocSocials?: string;
  applicationType?: 'fixed' | 'rolling';
  timeToComplete?: string;
}
function DetailSideCard({
  id,
  total,
  prizeList,
  endingTime,
  token,
  eligibility,
  applicationLink,
  jobtitle,
  requirements,
  type,
  pocSocials,
  hackathonPrize,
  isWinnersAnnounced = false,
  applicationType,
  timeToComplete,
}: Props) {
  const { userInfo } = userStore();
  const [isSubscribeNumberLoading, setIsSubscribeNumberLoading] =
    useState(true);
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribeRange, setSubscribeRange] = useState('');
  const [isUserSubscribeLoading, setIsUserSubscribeLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: warningIsOpen,
    onOpen: warningOnOpen,
    onClose: warningOnClose,
  } = useDisclosure();
  const [triggerLogin, setTriggerLogin] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  let subscribeStatus = 0;
  if (Number(moment(endingTime).format('x')) < Date.now()) {
    subscribeStatus = 1;
  }
  if (isWinnersAnnounced) {
    subscribeStatus = 3;
  }

  const getUserSubscribe = async () => {
    setIsUserSubscribeLoading(true);
    try {
      const subscribeDetails = await fetchClient({
        method:"Get",
        endpoint:`/api/jobs/check_subscribe?jobId=${id}`
      })
      console.log(subscribeDetails)
      // const subscribeDetails = await axios.get(``, {
      //   params: {
      //     userId: userInfo?.id,
      //   },
      // });
      
      setIsSubmitted(subscribeDetails?.data);
      setIsUserSubscribeLoading(false);
    } catch (e) {
      setIsUserSubscribeLoading(false);
    }
  };

  const getSubscribesCount = async () => {
    setIsSubscribeNumberLoading(true);
    try {
      const subscribeCountDetails =  await axios.get(`/api/getjob/count_subscribe?jobId=${id}`
      );
      console.log()
      const count = subscribeCountDetails?.data || 0;
      setSubscribeNumber(count);
      if (count >= 0 && count <= 10) {
        setSubscribeRange('0-10');
      } else if (count > 10 && count <= 25) {
        setSubscribeRange('10-25');
      } else if (count > 25 && count <= 50) {
        setSubscribeRange('25-50');
      } else if (count > 50 && count <= 100) {
        setSubscribeRange('50-100');
      } else if (count > 100) {
        setSubscribeRange('100+');
      }
      setIsSubscribeNumberLoading(false);
    } catch (e) {
      setIsSubscribeNumberLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo?.id) return;
    getUserSubscribe();
  }, [userInfo?.id]);

  useEffect(() => {
    if (!isSubscribeNumberLoading) return;
    getSubscribesCount();
  }, []);

  const handleSubmit = () => {
    if (applicationLink) {
      window.open(applicationLink, '_blank');
      return;
    }
    if (!userInfo?.id) {
      setTriggerLogin(true);
    } else if (!userInfo?.isTalentFilled) {
      warningOnOpen();
    } else {
      onOpen();
    }
  };

  const countDownRenderer = ({
    days,
    hours,
    minutes,
    seconds,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    if (days > 0) {
      return <span>{`${days}d:${hours}h:${minutes}m`}</span>;
    }
    return <span>{`${hours}h:${minutes}m:${seconds}s`}</span>;
  };

  type PrizeKey = keyof Rewards;

  const prizeMapping = [
    { key: 'first' as PrizeKey, label: '1st', description: 'First Prize' },
    { key: 'second' as PrizeKey, label: '2nd', description: 'Second Prize' },
    { key: 'third' as PrizeKey, label: '3rd', description: 'Third Prize' },
    { key: 'fourth' as PrizeKey, label: '4th', description: 'Fourth Prize' },
    { key: 'fifth' as PrizeKey, label: '5th', description: 'Fifth Prize' },
  ];

  return (
    <>
      {isOpen && (
        <SubscribeModal
          id={id}
          type={type}
          eligibility={eligibility || []}
          onClose={onClose}
          isOpen={isOpen}
          subscribeNumber={subscribeNumber}
          setSubscribeNumber={setSubscribeNumber}
          setIsSubmitted={setIsSubmitted}
          jobtitle={jobtitle}
        />
      )}
      {warningIsOpen && (
        <WarningModal
          isOpen={warningIsOpen}
          onClose={warningOnClose}
          title={'Complete your profile'}
          bodyText={
            'Please complete your profile before submitting to a job.'
          }
          primaryCtaText={'Complete Profile'}
          primaryCtaLink={'/new/talent'}
        />
      )}
      
      <VStack gap={2} pt={10} marginInlineStart={'0 !important'}>
        <VStack
          justify={'center'}
          gap={0}
          minW={'22rem'}
          pb={5}
          bg={'#FFFFFF'}
          rounded={'xl'}
        >
          <HStack
            justify={'space-between'}
            w={'full'}
            h={16}
            px={'1.5rem'}
            borderBottom={'1px solid #E2E8EF'}
          >
            <Flex align="center">
              <Image
                w={7}
                h="auto"
                mr={2}
                alt={'green doller'}
                rounded={'full'}
                src={
                  tokenList.filter((e) => e?.tokenSymbol === token)[0]?.icon ??
                  '/assets/icons/green-doller.svg'
                }
              />
              <Text color="color.slate.800" fontSize={'2xl'} fontWeight={500}>
                {total?.toLocaleString() ?? 0}
                <Text
                  as="span"
                  ml={1}
                  color="brand.slate.400"
                  fontSize="lg"
                  fontWeight={400}
                >
                  {token}
                </Text>
              </Text>
            </Flex>
            {type === 'open' && (
              <Text color={'brand.slate.300'} fontSize={'lg'} fontWeight={400}>
                Total Prizes
              </Text>
            )}
          </HStack>
          {type === 'open' && (
            <VStack w={'full'} borderBottom={'1px solid #E2E8EF'}>
              <TableContainer w={'full'}>
                <Table mt={-8} variant={'unstyled'}>
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th></Th>
                      <Th> </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {prizeMapping.map(
                      (prize, index) =>
                        prizeList?.[prize.key] && (
                          <Tr key={index}>
                            <Td>
                              <Flex
                                align={'center'}
                                justify={'center'}
                                w={8}
                                h={8}
                                p={1.5}
                                fontSize={'0.7rem'}
                                bg={'#C6C6C62B'}
                                rounded={'full'}
                              >
                                {prize.label}
                              </Flex>
                            </Td>
                            <Td>
                              <Text
                                color={'#64758B'}
                                fontSize={'1.1rem'}
                                fontWeight={600}
                              >
                                {prizeList[prize.key]}
                                <Text
                                  as="span"
                                  ml={1}
                                  color="brand.slate.300"
                                  fontWeight={400}
                                >
                                  {token}
                                </Text>
                              </Text>
                            </Td>
                            <Td>
                              <Text color={'#CBD5E1'} fontWeight={500}>
                                {prize.description}
                              </Text>
                            </Td>
                          </Tr>
                        )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          )}
          <Flex justify={'space-between'} w={'full'} px={5}>
            <Flex align={'start'} justify={'center'} direction={'column'}>
              <Flex align={'center'} justify={'center'} gap={2}>
                <Image
                  w={'1.4rem'}
                  mt={-1}
                  alt={'suit case'}
                  src={'/assets/icons/purple-suitcase.svg'}
                />
                <Text color={'#000000'} fontSize="1.3rem" fontWeight={500}>
                  {isSubscribeNumberLoading
                    ? '...'
                    : type === 'open'
                    ? subscribeNumber.toLocaleString()
                    : subscribeRange}
                </Text>
              </Flex>
              <Text color={'#94A3B8'}>
                {type === 'open'
                  ? subscribeNumber === 1
                    ? 'Subscribe'
                    : 'Subscribes'
                  : subscribeNumber === 1
                  ? 'Application'
                  : 'Applications'}
              </Text>
            </Flex>

            <Flex
              align={'start'}
              justify={'center'}
              direction={'column'}
              py={3}
            >
              <Flex align={'start'} justify={'center'} gap={1}>
                <Image
                  w={'1.4rem'}
                  mt={1}
                  alt={'suit case'}
                  src={'/assets/icons/purple-timer.svg'}
                />
                <VStack align={'start'} gap={0}>
                  <Text color={'#000000'} fontSize="1.3rem" fontWeight={500}>
                    {applicationType === 'fixed' ? (
                      <Countdown
                        date={endingTime}
                        renderer={countDownRenderer}
                        zeroPadDays={1}
                      />
                    ) : (
                      'Rolling'
                    )}
                  </Text>
                  <Text color={'#94A3B8'}>
                    {applicationType === 'fixed' ? 'Remaining' : 'Deadline'}
                  </Text>
                </VStack>
              </Flex>
            </Flex>
          </Flex>

          <Box w="full" px={5}>
            {type === 'permissioned' && (
              <Flex align={'start'} direction={'column'} my={4}>
                <Text color={'#000000'} fontSize="1.3rem" fontWeight={500}>
                  {timeToComplete}
                </Text>
                <Text color={'#94A3B8'}>Time to Complete</Text>
              </Flex>
            )}
            {isSubmitted ? (
              <Button
                w="full"
                bg="green"
                pointerEvents={'none'}
                isDisabled={true}
                size="lg"
                variant="solid"
              >
                {type === 'permissioned'
                  ? 'Applied Successfully'
                  : 'Applied Successfully'}
              </Button>
            ) : (
              <Button
                w="full"
                _hover={{
                  bg: 'brand.purple',
                }}
                isDisabled={Date.now() > Number(moment(endingTime).format('x'))}
                isLoading={isUserSubscribeLoading}
                loadingText={'Checking Subscribe...'}
                onClick={() => handleSubmit()}
                size="lg"
                variant="solid"
              >
                {type === 'permissioned' ? 'Apply Now' : 'Apply Now'}
              </Button>
            )}
            {type === 'permissioned' && (
              <Flex gap="2" w="20rem" mt={4} p="3" bg={'#62F6FF10'}>
                <WarningIcon color="#1A7F86" />
                <Text color="#1A7F86" fontSize={'xs'} fontWeight={500}>
                  Don&apos;t start working just yet! Apply first, and then begin
                  working only once you&apos;ve been hired for the project.
                </Text>
              </Flex>
            )}
          </Box>
        </VStack>
        {!hackathonPrize && (
          <VStack
            align={'start'}
            justify={'center'}
            w={'22rem'}
            mt={4}
            p={6}
            bg={'#FFFFFF'}
            rounded={'xl'}
          >
            <Text h="100%" color={'#94A3B8'} fontSize="1rem" textAlign="center">
              TYPE
            </Text>
            <Text color={'#64768b'} fontSize="1.1rem" fontWeight={500}>
              {type === 'permissioned' ? 'Project' : 'Job'}
            </Text>
            <Text color={'#94A3B8'} fontSize="1rem" fontWeight={400}>
              {type === 'permissioned'
                ? "Don't start working just yet! Apply first, and then you'll be notified if you're selected to work on this job."
                : 'This is an open competition job! Anyone can start working and submit their work before the deadline!'}
            </Text>
          </VStack>
        )}
        {requirements && (
          <VStack
            align="start"
            w={'22rem'}
            mt={4}
            p={6}
            bg="white"
            rounded={'xl'}
          >
            <Text h="100%" color={'#94A3B8'} fontSize="1rem" textAlign="center">
              ELIGIBILITY
            </Text>
            <Text color={'gray.500'} fontSize={'md'} fontWeight={400}>
              {requirements}
            </Text>
          </VStack>
        )}
        {pocSocials && (
          <VStack
            align={'start'}
            justify={'center'}
            w={'22rem'}
            mt={4}
            p={6}
            bg={'#FFFFFF'}
            rounded={'xl'}
          >
            <Text h="100%" color={'#94A3B8'} fontSize="1rem" textAlign="center">
              CONTACT
            </Text>
            <Text>
              <Link
                color={'#64768b'}
                fontSize="1rem"
                fontWeight={500}
                href={pocSocials}
                isExternal
              >
                Reach out
                <ExternalLinkIcon color={'#64768b'} mb={1} as="span" mx={1} />
              </Link>
              <Text
                as="span"
                color={'#94A3B8'}
                fontSize="1rem"
                fontWeight={400}
              >
                if you have any questions about this listing
              </Text>
            </Text>
          </VStack>
        )}
        {type !== 'permissioned' && (
          <VStack
            align={'start'}
            justify={'center'}
            minW={'22rem'}
            mt={4}
            p={6}
            bg={'#FFFFFF'}
            rounded={'xl'}
          >
            <VerticalStep
              sublabel={'Give your best shot!'}
              currentStep={subscribeStatus + 1}
              thisStep={1}
              label={'Subscribes Open'}
            />

            <Divider
              h={10}
              border={'2px'}
              borderColor={'#6562FF'}
              transform={'translate(1rem)'}
              orientation="vertical"
            />
            <VerticalStep
              currentStep={subscribeStatus + 1}
              thisStep={2}
              label={'Subscribes Review'}
              sublabel={'Subscribes being assessed'}
            />
            <Divider
              h={10}
              border={'2px'}
              borderColor={'#CBD5E1'}
              transform={'translate(1rem)'}
              orientation="vertical"
            />
            <VerticalStep
              currentStep={subscribeStatus + 1}
              thisStep={3}
              sublabel={
                isWinnersAnnounced
                  ? 'Congratulations!'
                  : `Around ${moment(endingTime)
                      .add(8, 'd')
                      .format('Do MMM, YY')}`
              }
              label={'Announced'}
            />
          </VStack>
        )}
      </VStack>
    </>
  );
}

export default DetailSideCard;
