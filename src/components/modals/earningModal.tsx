import {
  Box,
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}
export const EarningModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'sm'}>
        <ModalOverlay />
        <ModalContent h={'max'} p={5}>
          <Box
            alignItems={'center'}
            justifyContent={'center'}
            display={'flex'}
            w={'full'}
            h={36}
            bg={'#DCFFF2'}
            rounded={'lg'}
          >
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width="42" height="42" fill="url(#pattern0)" />
              <defs>
                <pattern
                  id="pattern0"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0_506_6770"
                    transform="scale(0.00625)"
                  />
                </pattern>
                <image
                  id="image0_506_6770"
                  width="160"
                  height="160"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </Box>
          <VStack align={'start'} gap={2} mt={5}>
            <Text
              color={'black'}
              fontFamily={'Domine'}
              fontSize={'2xl'}
              fontWeight={700}
              textAlign={'center'}
            >
              Get personalized earning opportunities in your inbox
            </Text>
            <Text
              color={'gray.500'}
              fontFamily={'Inter'}
              fontSize={'sm'}
              fontWeight={400}
              textAlign={'center'}
            >
              It takes less than a minute, but might lead to the job or
              project that changes your life.
            </Text>
            <Button
              w={'full'}
              color={'white'}
              bg={'#6562FF'}
              onClick={() => {
                router.push('/new');
              }}
            >
              Sign Up
            </Button>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
};
