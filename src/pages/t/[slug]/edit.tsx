import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MediaPicker } from 'degen';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';

import { AddProject } from '@/components/Form/AddProject';
import { InputField } from '@/components/Form/InputField';
import { SelectBox } from '@/components/Form/SelectBox';
import { SocialInput } from '@/components/Form/SocialInput';
import { SkillSelect } from '@/components/misc/SkillSelect';
import { socials } from '@/components/Talent/YourLinks';
import type { MultiSelectOptions } from '@/constants';
import {
  CommunityList,
  CityList,
  IndustryList,
  web3Exp,
  workExp,
  workType,
} from '@/constants';
import type { PoW } from '@/interface/pow';
import type { SubSkillsType } from '@/interface/skills';
import { SkillList } from '@/interface/skills';
import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';
import { useSession } from 'next-auth/react';
import { userStore } from '@/store/user';
import { uploadToCloudinary } from '@/utils/upload';
import fetchClient from '@/lib/fetch-client';

type FormData = {
  photo?: string;
  firstname?: string;
  lastname?: string;
  interests?: { value: string }[];
  bio?: string;
  twitter?: string;
  discord?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  telegram?: string;
  community?: { label: string; value: string }[];
  experience?: string;
  location?: string;
  cryptoExperience?: string;
  workPrefernce?: string;
  currentEmployer?: string;
  pow?: string;
  skills?: any;
  private: boolean;
  PoW?: PoW[];
};

const socialLinkFields = [
  'twitter',
  'github',
  'linkedin',
  'website',
  'telegram',
];

const keysToOmit = [
  'id',
  'publicKey',
  'email',
  'created_at',
  'isVerified',
  'role',
  'totalEarned',
  'isTalentFilled',
  'superteamLevel',
  'notifications',
  'currentSponsorId',
  'UserSponsors',
  'currentSponsor',
  'poc',
  'Comment',
  'Submission',
  'Grants',
  'UserInvites',
  'SubscribeJob',
];

const parseSkillsAndSubskills = (skillsObject: any) => {
  const skills: MultiSelectOptions[] = [];
  const subSkills: MultiSelectOptions[] = [];

  skillsObject.forEach((skillItem: { skills: string; subskills: string[] }) => {
    skills.push({ value: skillItem.skills, label: skillItem.skills });
    skillItem.subskills.forEach((subSkill) => {
      subSkills.push({ value: subSkill, label: subSkill });
    });
  });

  return { skills, subSkills };
};

export default function EditProfilePage() {
  const userInfo :any = userStore();
  const { register, handleSubmit, setValue, watch } = useForm<FormData>();

  const [discordError, setDiscordError] = useState(false);
  const [socialError, setSocialError] = useState(false);
  const [isAnySocialUrlInvalid, setAnySocialUrlInvalid] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isPhotoLoading, setIsPhotoLoading] = useState(true);

  const router = useRouter();

  const [pow, setPow] = useState<PoW[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const editableFields = Object.keys(userInfo || {}) as (keyof FormData)[];

  const animatedComponents = makeAnimated();
  const [DropDownValues, setDropDownValues] = useState<{
    interests: string;
    community: { label: string; value: string }[];
  }>({
    interests: JSON.stringify(userInfo?.interests || []),
    community: userInfo?.community ? JSON.parse(userInfo.community) : [],
  });

  const [skills, setSkills] = useState<MultiSelectOptions[]>([]);
  const [subSkills, setSubSkills] = useState<MultiSelectOptions[]>([]);
  const toast = useToast();

  const privateValue = watch('private', userInfo?.private);

  const socialLinksValidityRef = useRef<{ [key: string]: boolean }>({});

  const handleUrlValidation = (isValid: boolean, field: keyof FormData) => {
    socialLinksValidityRef.current[field] = isValid;

    const allUrlsValid = socialLinkFields.every(
      (f) => socialLinksValidityRef.current[f as keyof FormData]
    );

    setAnySocialUrlInvalid(!allUrlsValid);
  };

  useEffect(() => {
    if (userInfo) {
      editableFields.forEach((field) => {
        setValue(field, userInfo[field]);
      });

      if (userInfo.interests) {
        const interestsArray = JSON.parse(userInfo.interests);
        const defaultInterests = interestsArray.map((value: string) =>
          IndustryList.find((option) => option.value === value)
        );
        setValue('interests', defaultInterests);
        setDropDownValues((prev) => ({
          ...prev,
          interests: defaultInterests,
        }));
      }

      if (userInfo?.community) {
        const communityArray: string[] = JSON.parse(userInfo.community);
        const communitySelectValues = communityArray.map((item) => ({
          label: item,
          value: item,
        }));
        setValue('community', communitySelectValues);
        setDropDownValues((prev) => ({
          ...prev,
          community: communitySelectValues,
        }));
      }

      if (userInfo.experience) {
        setValue('experience', userInfo.experience);
      }

      if (userInfo.location) {
        setValue('location', userInfo.location);
      }

      if (userInfo.private) {
        setValue('private', userInfo.private);
      }

      if (userInfo?.skills && Array.isArray(userInfo.skills)) {
        const { skills: parsedSkills, subSkills: parsedSubSkills } =
          parseSkillsAndSubskills(userInfo.skills);
        setSkills(parsedSkills);
        setSubSkills(parsedSubSkills);
      }

      if (userInfo?.photo) {
        setValue('photo', userInfo.photo);
        setPhotoUrl(userInfo.photo);
        setIsPhotoLoading(false);
      } else {
        setIsPhotoLoading(false);
      }
    }
  }, [userInfo, setValue]);

  useEffect(() => {
    const fetchPoW = async () => {
      // const response = await axios.get('/api/pow/get', {
      //   params: {
      //     userId: userInfo?.id,
      //   },
      // });
      const response = {} 
      setPow(response?.data);
    };

    if (userInfo?.id) {
      fetchPoW();
    }
  }, [userInfo?.id]);

  const onSubmit = async (data: FormData) => {
    try {
  

      if (!data.discord) {
        setDiscordError(true);
        toast({
          title: 'Discord Error.',
          description: 'Discord field is required.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      setDiscordError(false);

      const filledSocialLinksCount = socialLinkFields.filter(
        (field) => data[field as keyof FormData]
      ).length;

      setSocialError(filledSocialLinksCount < 1);

      if (filledSocialLinksCount < 1) {
        toast({
          title: 'Social Links Error.',
          description: 'At least one social link is required.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (isAnySocialUrlInvalid) {
        toast({
          title: 'Social URLs Error.',
          description: 'One or more social URLs are invalid.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const interestsJSON = JSON.stringify(
        (data.interests || []).map((interest) => interest.value)
      );

      const communityArray = (data.community || []).map((item) => item.value);
      const communityJSON = JSON.stringify(communityArray);

      const combinedSkills = skills.map((mainskill) => {
        const main = SkillList.find(
          (skill) => skill.mainskill === mainskill.value
        );
        const sub: SubSkillsType[] = [];

        subSkills.forEach((subskill) => {
          if (
            main &&
            main.subskills.includes(subskill.value as SubSkillsType)
          ) {
            sub.push(subskill.value as SubSkillsType);
          }
        });

        return {
          skills: main?.mainskill ?? '',
          subskills: sub ?? [],
        };
      });

      const updatedData = {
        ...data,
        interests: interestsJSON,
        community: communityJSON,
        skills: combinedSkills,
      };

      const finalUpdatedData = Object.keys(updatedData).reduce((acc, key) => {
        const fieldKey = key as keyof FormData;
        if (
          userInfo &&
          updatedData[fieldKey] !== userInfo[fieldKey] &&
          !keysToOmit.includes(key)
        ) {
          acc[fieldKey] = updatedData[fieldKey];
        }
        return acc;
      }, {} as Partial<FormData>);
      const response = await fetchClient({
        method:"POST",
        endpoint:"/api/user/edit",
        body: JSON.stringify({
          id: userInfo?.id,
          ...finalUpdatedData,
        })
      })
      

      // await axios.post('/api/pow/edit', {
      //   userId: userInfo?.id,
      //   pows: pow,
      // });

      // setUserInfo(response.data);
      // toast({
      //   title: 'Profile updated.',
      //   description: 'Your profile has been updated successfully!',
      //   status: 'success',
      //   duration: 3000,
      //   isClosable: true,
      // });
      setTimeout(() => {
        router.push(`/t/${userInfo?.username}`);
      }, 500);
    } catch (error: any) {
      toast({
        title: 'Failed to update profile.',
        description:
          'There might be a field with invalid input. Please rectify and then click on "Update"',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Default
        meta={
          <Meta
            title="Superteam Earn"
            description="Every Solana opportunity in one place!"
            canonical="/assets/logo/og.svg"
          />
        }
      >
        <Box bg="#fff">
          <Box w="90%" maxW="600px" mx="auto" p={5}>
            <Heading mt={3} mb={5}>
              Edit Profile
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <Text mt={12} mb={5} fontSize="xl">
                  Personal Info
                </Text>

                {/* eslint-disable no-nested-ternary */}

                {isPhotoLoading ? (
                  <></>
                ) : photoUrl ? (
                  <>
                    <FormLabel
                      mb={'0'}
                      pb={'0'}
                      color={'brand.slate.500'}
                      requiredIndicator={<></>}
                    >
                      Profile Picture
                    </FormLabel>
                    <MediaPicker
                      defaultValue={{ url: photoUrl, type: 'image' }}
                      onChange={async (e:any) => {
                        setUploading(true);
                        const a = await uploadToCloudinary(e);
                        setValue('photo', a);
                        setUploading(false);
                      }}
                      onReset={() => {
                        setValue('photo', '');
                        setUploading(false);
                      }}
                      compact
                      label="Choose or drag and drop media"
                    />
                  </>
                ) : (
                  <>
                    <FormLabel
                      mb={'0'}
                      pb={'0'}
                      color={'brand.slate.500'}
                      requiredIndicator={<></>}
                    >
                      Profile Picture
                    </FormLabel>
                    <MediaPicker
                      onChange={async (e:any) => {
                        setUploading(true);
                        const a = await uploadToCloudinary(e);
                        setValue('photo', a);
                        setUploading(false);
                      }}
                      onReset={() => {
                        setValue('photo', '');
                        setUploading(false);
                      }}
                      compact
                      label="Choose or drag and drop media"
                    />
                  </>
                )}
                

                <InputField
                  label="First Name"
                  placeholder="First Name"
                  name="firstname"
                  register={register}
                  isRequired
                />

                <InputField
                  label="Last Name"
                  placeholder="Last Name"
                  name="lastname"
                  register={register}
                  isRequired
                />

                <Box w={'full'} mb={'1.25rem'}>
                  <FormLabel color={'brand.slate.500'}>
                    Your One-Line Bio
                  </FormLabel>
                  <Textarea
                    borderColor="brand.slate.300"
                    _placeholder={{
                      color: 'brand.slate.300',
                    }}
                    focusBorderColor="brand.purple"
                    id={'bio'}
                    maxLength={180}
                    placeholder="Here is a sample placeholder"
                    {...register('bio', { required: true })}
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
                </Box>

                <Text mt={8} mb={5} fontSize="xl">
                  Socials
                </Text>

                {socials.map((sc, idx: number) => {
                  return (
                    <SocialInput
                      name={sc.label.toLowerCase()}
                      register={register}
                      {...sc}
                      key={`sc${idx}`}
                      discordError={
                        sc.label.toLowerCase() === 'discord'
                          ? discordError
                          : false
                      }
                      watch={watch}
                      onUrlValidation={(isValid) => {
                        handleUrlValidation(
                          isValid,
                          sc.label.toLowerCase() as keyof FormData
                        );
                      }}
                    />
                  );
                })}
                {socialError && (
                  <Text color="red">At least one social link is required!</Text>
                )}

                <Text mt={8} mb={5} fontSize="xl">
                  Work
                </Text>

                <Box w={'full'} mb={'1.25rem'}>
                  <FormLabel color={'brand.slate.500'}>
                    What areas of Web3 are you most interested in?
                  </FormLabel>
                  <ReactSelect
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={IndustryList as any}
                    value={DropDownValues.interests}
                    required
                    onChange={(selectedOptions: any) => {
                      const selectedInterests = selectedOptions
                        ? selectedOptions.map(
                            (elm: { label: string; value: string }) => elm
                          )
                        : [];
                      setDropDownValues({
                        ...DropDownValues,
                        interests: selectedInterests,
                      });
                      setValue('interests', selectedInterests);
                    }}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: 'brand.slate.500',
                        borderColor: 'brand.slate.300',
                      }),
                    }}
                  />
                </Box>

                

                <SelectBox
                  label="Work Experience"
                  watchValue={watch('experience')}
                  options={workExp}
                  id="experience"
                  placeholder="Pick Your Experience"
                  register={register}
                />

                <SelectBox
                  label="Location"
                  watchValue={watch('location')}
                  options={CityList}
                  id="location"
                  placeholder="Select Your City"
                  register={register}
                />

                

                <SelectBox
                  label="Work Preference"
                  watchValue={watch('workPrefernce')}
                  options={workType}
                  id="workPrefernce"
                  placeholder="Type of Work"
                  register={register}
                />

                <InputField
                  label="Current Employer"
                  placeholder="Employer"
                  name="currentEmployer"
                  register={register}
                  isRequired
                />

                <FormLabel color={'brand.slate.500'}>Proof of Work</FormLabel>
                <Box>
                  {pow.map((data, idx) => {
                    return (
                      <Flex
                        key={data.id}
                        align={'center'}
                        mt="2"
                        mb={'1.5'}
                        px={'1rem'}
                        py={'0.5rem'}
                        color={'brand.slate.500'}
                        border={'1px solid gray'}
                        borderColor="brand.slate.300"
                        rounded={'md'}
                      >
                        <Text w={'full'} color={'gray.800'} fontSize={'0.8rem'}>
                          {data.title}
                        </Text>
                        <Center columnGap={'0.8rem'}>
                          <EditIcon
                            onClick={() => {
                              setSelectedProject(idx);
                              onOpen();
                            }}
                            cursor={'pointer'}
                            fontSize={'0.8rem'}
                          />
                          <DeleteIcon
                            onClick={() => {
                              setPow((prevPow) =>
                                prevPow.filter((_ele, id) => idx !== id)
                              );
                            }}
                            cursor={'pointer'}
                            fontSize={'0.8rem'}
                          />
                        </Center>
                      </Flex>
                    );
                  })}
                </Box>
                <Button
                  w={'full'}
                  mb={8}
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    onOpen();
                  }}
                  variant="outline"
                >
                  Add Project
                </Button>

                <SkillSelect
                  skills={skills}
                  subSkills={subSkills}
                  setSkills={setSkills}
                  setSubSkills={setSubSkills}
                  skillLabel="Your Skills"
                  subSkillLabel="Sub Skills"
                />

                <Checkbox
                  mr={1}
                  mb={8}
                  color="brand.slate.500"
                  fontWeight={500}
                  colorScheme="purple"
                  isChecked={privateValue}
                  onChange={(e) => {
                    setValue('private', e.target.checked);
                  }}
                  size="md"
                >
                  Keep my info private
                </Checkbox>
                <br />

                <Button mb={12} isLoading={uploading} type="submit">
                  Update Profile
                </Button>
              </FormControl>
            </form>
          </Box>
        </Box>
        <AddProject
          key={`${pow.length}project`}
          {...{
            isOpen,
            onClose,
            pow,
            setPow,
            selectedProject,
            setSelectedProject,
          }}
        />
      </Default>
    </>
  );
}
