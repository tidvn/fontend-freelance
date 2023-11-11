import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { MediaPicker } from 'degen';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';
import { userStore } from '@/store/user';

import { IndustryList } from '@/constants';
import type { CompanyType } from '@/interface/company';
import { uploadToCloudinary } from '@/utils/upload';
import fetchClient from '@/lib/fetch-client';

const CreateCompany = () => {
  const router = useRouter();
  const animatedComponents = makeAnimated();
  const { userInfo } = userStore();
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    getValues,
  } = useForm();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [industries, setIndustries] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const createNewCompany = async (company: CompanyType) => {
    if (getValues('bio').length > 180) {
      setErrorMessage('Company short bio length exceeded the limit');
      return;
    }
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await fetchClient({
        method:"POST",
        endpoint: "/api/company/create",
        body: JSON.stringify({
          ...company,
          userId: userInfo?.id,
        })
      })
      if (response.status != 200){
        throw new Error(response?.data?.message);
      }
      setIsLoading(false);
      toast.success('Company created!');
      router.push('/dashboard/jobs');
    } catch (e: any) {
      setErrorMessage(e?.data?.message || e.message); 
      setIsLoading(false);
      setHasError(true);
    }
  };
  return (
    <Default
      meta={
        <Meta
          title="Create Company | FreLan"
          description="Every Solana opportunity in one place!"
          canonical="/assets/logo/og.svg"
        />
      }
    >
      {!userInfo ? (
        <>
          <Box
            alignItems={'center'}
            justifyContent={'center'}
            display={'flex'}
            w={'full'}
            minH={'100vh'}
          >
            <Text color={'gray.600'} fontSize={'xl'} fontWeight={500}>
              Please sign In first!
            </Text>
          </Box>
        </>
      ) : (
        <VStack w="full" pt={8} pb={24}>
          <VStack>
            <Heading
              color={'gray.700'}
              fontFamily={'Inter'}
              fontSize={'24px'}
              fontWeight={700}
            >
              Welcome to FreLan
            </Heading>
            <Text
              color={'gray.400'}
              fontFamily={'Inter'}
              fontSize={'20px'}
              fontWeight={500}
            >
              {"Let's start with some basic information about your company"}
            </Text>
          </VStack>
          <VStack w={'2xl'} pt={10}>
            <form
              onSubmit={handleSubmit(async (e) => {
                createNewCompany({
                  bio: e.bio,
                  industry: industries ?? '',
                  name: e.companyname,
                  slug: e.slug,
                  logo: imageUrl ?? '',
                  twitter: e.twitterHandle ?? '',
                  url: e.companyurl ?? '',
                });
              })}
              style={{ width: '100%' }}
            >
              <HStack justify={'space-between'} w={'full'}>
                <FormControl isRequired>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'companyname'}
                  >
                    Company Name
                  </FormLabel>
                  <Input
                    w={'18rem'}
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    focusBorderColor="brand.purple"
                    id="companyname"
                    placeholder="Stark Industries"
                    {...register('companyname')}
                  />
                  <FormErrorMessage>
                    {errors.companyname ? (
                      <>{errors.companyname.message}</>
                    ) : (
                      <></>
                    )}
                  </FormErrorMessage>
                </FormControl>
                <FormControl w={'18rem'} isRequired>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'slug'}
                  >
                    Company Slug
                  </FormLabel>
                  <Input
                    w={'18rem'}
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    focusBorderColor="brand.purple"
                    id="slug"
                    placeholder="starkindustries"
                    {...register('slug')}
                  />
                  <FormErrorMessage>
                    {errors.slug ? <>{errors.slug.message}</> : <></>}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack justify={'space-between'} w={'full'} my={6}>
                <FormControl w={'18rem'}>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'companyname'}
                  >
                    Website
                  </FormLabel>
                  <Input
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    focusBorderColor="brand.purple"
                    id="companyurl"
                    placeholder="https://starkindustries.com"
                    {...register('companyurl')}
                  />
                  <FormErrorMessage>
                    {errors.companyurl ? (
                      <>{errors.companyurl.message}</>
                    ) : (
                      <></>
                    )}
                  </FormErrorMessage>
                </FormControl>
                <FormControl w={'18rem'}>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'twitterHandle'}
                  >
                    Company Twitter
                  </FormLabel>
                  <Input
                    w={'18rem'}
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    id="twitterHandle"
                    placeholder="@StarkIndustries"
                    {...register('twitterHandle')}
                  />
                  <FormErrorMessage>
                    {errors.twitterHandle ? (
                      <>{errors.twitterHandle.message}</>
                    ) : (
                      <></>
                    )}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <VStack align={'start'} gap={2} my={3}>
                <Heading
                  color={'brand.slate.500'}
                  fontSize={'15px'}
                  fontWeight={600}
                >
                  Company Logo{' '}
                  <span
                    style={{
                      color: 'red',
                    }}
                  >
                    *
                  </span>
                </Heading>
                <HStack gap={5}>
                  <MediaPicker
                    onChange={async (e:any) => {
                      const a = await uploadToCloudinary(e);
                      setImageUrl(a);
                    }}
                    compact
                    label="Choose or Drag & Drop Media"
                  />
                </HStack>
              </VStack>

              <HStack justify={'space-between'} w={'full'} mt={6}>
                <FormControl w={'full'} isRequired>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'industry'}
                  >
                    Industry
                  </FormLabel>

                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={IndustryList}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: 'brand.slate.500',
                        borderColor: 'brand.slate.300',
                      }),
                    }}
                    onChange={(e) =>
                      setIndustries(e.map((i: any) => i.value).join(', '))
                    }
                  />
                  <FormErrorMessage>
                    {errors.industry ? <>{errors.industry.message}</> : <></>}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <Box my={6}>
                <FormControl isRequired>
                  <FormLabel
                    color={'brand.slate.500'}
                    fontSize={'15px'}
                    fontWeight={600}
                    htmlFor={'bio'}
                  >
                    Company Short Bio
                  </FormLabel>
                  <Input
                    w={'full'}
                    borderColor={'brand.slate.300'}
                    _placeholder={{ color: 'brand.slate.300' }}
                    focusBorderColor="brand.purple"
                    id="bio"
                    maxLength={180}
                    {...register('bio')}
                    placeholder="What does your company do?"
                  />
                  <Text
                    color={
                      (watch('bio')?.length || 0) > 160
                        ? 'red'
                        : 'brand.slate.400'
                    }
                    fontSize={'xs'}
                    textAlign="right"
                  >
                    {180 - (watch('bio')?.length || 0)} characters left
                  </Text>
                  <FormErrorMessage>
                    {errors.bio ? <>{errors.bio.message}</> : <></>}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <Toaster />
              <Box mt={8}>
                {hasError && (
                  <Text align="center" mb={4} color="red">
                    {errorMessage ||
                      'Sorry! An error occurred while creating your company!'}
                    <br />                  </Text>
                )}
                <Button
                  w="full"
                  isDisabled={imageUrl === ''}
                  isLoading={!!isLoading}
                  loadingText="Creating..."
                  size="lg"
                  type="submit"
                  variant="solid"
                >
                  Create Company
                </Button>
              </Box>
            </form>
          </VStack>
        </VStack>
      )}
    </Default>
  );
};

export default CreateCompany;
