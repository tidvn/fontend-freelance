import { AddIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Text, VStack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import React, { useEffect, useState } from "react";

import type { JobBasicType } from "@/components/listings/job/Createjob";
import type { MultiSelectOptions } from "@/constants";
import { splitSkills } from "@/utils/skills";
import { getURL } from "@/utils/validUrl";
import { jobsTemplates } from "@/lib/jobTemplate";
interface Props {
  setSteps: Dispatch<SetStateAction<number>>;
  setListingType: Dispatch<SetStateAction<string>>;
  setEditorData: Dispatch<SetStateAction<string | undefined>>;
  setMainSkills: Dispatch<SetStateAction<MultiSelectOptions[]>>;
  setSubSkills: Dispatch<SetStateAction<MultiSelectOptions[]>>;
  setJobBasic: Dispatch<SetStateAction<JobBasicType | undefined>>;
  type: "open" | "permissioned";
}
const Template = ({
  setSteps,
  setListingType,
  setEditorData,
  setMainSkills,
  setSubSkills,
  setJobBasic,
  type,
}: Props) => {
  // const [jobsTemplates, setJobsTemplates] = useState([]);
  // const [isJobsTemplatesLoading, setIsJobsTemplatesLoading] = useState(false);

  // // const getJobTemplates = async () => {
  // //   setIsJobsTemplatesLoading(true);
  // //   try {
  // //     const templates: any = dataTemplate
  // //     console.log(dataTemplate)
  // //     setJobsTemplates(templates?.data || []);
  // //     setIsJobsTemplatesLoading(false);
  // //   } catch (e) {
  // //     setIsJobsTemplatesLoading(false);
  // //   }
  // // };

  // console
  // useEffect(() => {
  //   if (!isJobsTemplatesLoading) {
  //     getJobTemplates();
  //   }
  // }, []);

  const createTemplate = (templateId: string) => {
    const template: any = jobsTemplates.find((t: any) => {
      return t?.id === templateId;
    });
    setListingType("BOUNTY");
    setJobBasic({
      title: template?.title || undefined,
      templateId: template?.id || undefined,
    });
    setEditorData(template?.description || "");
    const skillsInfo = splitSkills(template?.skills || []);
    setMainSkills(skillsInfo?.skills || []);
    setSubSkills(skillsInfo?.subskills || []);
    setSteps(2);
  };

  return (
    <>
      <VStack align={"start"} gap={8} w="full">
        <VStack align="start" w={"full"}>
          <Flex align="center" justify="center" gap="2rem" w="full" mb="2rem">
            <Text color="gray.600" fontSize="1.3rem" fontWeight={600}>
              Job
            </Text>
            <hr
              style={{
                width: "100%",
                outline: "1px solid #CBD5E1",
                border: "none",
              }}
            />
          </Flex>
          <Flex wrap={"wrap"} gap={6}>
            <Box
              alignItems={"center"}
              justifyContent={"center"}
              flexDir={"column"}
              display={"flex"}
              w={"15rem"}
              h={"16rem"}
              bg={"white"}
              border={"1px solid #cbd5e1"}
              cursor={"pointer"}
              onClick={() => {
                setListingType("BOUNTY");
                setSteps(2);
              }}
            >
              <AddIcon color="gray.500" mb="1rem" />
              <Text color="gray.500" fontSize="1rem" fontWeight={500}>
                Start from Scratch
              </Text>
            </Box>
            {jobsTemplates.map((template: any) => {
              const companies: any = Array.from(
                new Set(template?.Jobs?.map((b: any) => b.company))
              );
              console.log(template);

              return (
                <Box key={template.id} w={"15rem"} h={"16rem"} bg={"white"}>
                  <Flex
                    align="center"
                    justify="center"
                    h="45%"
                    fontSize="3xl"
                    bg={template.color || "white"}
                  >
                    {template?.emoji}
                  </Flex>
                  <Flex
                    align="start"
                    justify={"space-between"}
                    direction={"column"}
                    h="55%"
                    px={4}
                    py={4}
                    bg="white"
                  >
                    <Box>
                      <Text color={"brand.slate.700"} fontWeight={500}>
                        {template?.templateTitle}
                      </Text>
                      {companies?.length > 0 ? (
                        <Flex align="center" justify={"start"} mt={1}>
                          <Flex align="center" justify={"start"} mr={6}>
                            {companies.length >= 1 && (
                              <Image
                                boxSize="24px"
                                border="1px solid white"
                                borderRadius="full"
                                alt={companies[0]?.name}
                                src={companies[0]?.logo}
                              />
                            )}
                            {companies.length >= 2 && (
                              <Image
                                boxSize="24px"
                                ml={-3}
                                border="1px solid white"
                                borderRadius="full"
                                alt={companies[1]?.name}
                                src={companies[1]?.logo}
                              />
                            )}
                            {companies.length >= 3 && (
                              <Image
                                boxSize="24px"
                                ml={-3}
                                border="1px solid white"
                                borderRadius="full"
                                alt={companies[2]?.name}
                                src={companies[2]?.logo}
                              />
                            )}
                          </Flex>
                          <Text
                            color="brand.slate.400"
                            fontSize="xs"
                            wordBreak={"break-word"}
                          >
                            Used by{" "}
                            {companies.length >= 1 && (
                              <Text as="span">{companies[0]?.name}</Text>
                            )}
                            {companies.length >= 2 && (
                              <Text as="span">
                                {companies.length > 2 ? "," : " &"}{" "}
                                {companies[1]?.name}
                              </Text>
                            )}
                            {companies.length >= 3 && (
                              <Text as="span"> & {companies[2]?.name}</Text>
                            )}
                          </Text>
                        </Flex>
                      ) : (
                        <Text color="brand.slate.400" fontSize="sm">
                          {template?.templateDescription ||
                            `Pre-fill info with "${template?.templateTitle}" template`}
                        </Text>
                      )}
                    </Box>
                    <Flex
                      align="center"
                      justify={"space-between"}
                      gap={4}
                      w="full"
                    >
                      <Button
                        w="full"
                        leftIcon={<ViewIcon />}
                        onClick={() => {
                          window.open(
                            `${getURL()}template/jobs/${template?.slug}`,
                            "_blank"
                          );
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        Preview
                      </Button>
                      <Button
                        w="full"
                        onClick={() => createTemplate(template?.id)}
                        size="sm"
                        variant="solid"
                      >
                        Use
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
          </Flex>
        </VStack>
      </VStack>
    </>
  );
};

export default Template;
