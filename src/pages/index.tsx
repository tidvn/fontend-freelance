/* eslint-disable no-nested-ternary */
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  Image,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import type { NextPage } from "next";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { JobTabs } from "@/components/listings/job/Tabs";
import { GrantsCard, ListingSection } from "@/components/misc/listingsCard";
import EmptySection from "@/components/shared/EmptySection";
import Loading from "@/components/shared/Loading";
import type { Job } from "@/interface/job";
import type { Grant } from "@/interface/grant";
import Home from "@/layouts/Home";
import axios from "@/lib/axios";
const debounce = require("lodash.debounce");

interface Listings {
  jobs?: Job[];
}

const HomePage: NextPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSetSearchText = useRef(debounce(setSearchText, 300)).current;

  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [jobs, setJobs] = useState<{ jobs: Job[] }>({
    jobs: [],
  });
  const getListings = async (searchText: string) => {
    setIsListingsLoading(true);
    try {
      const jobData = await axios.get(
        `/api/listings?take=10&searchText=${searchText}`
      );
      setJobs(jobData.data);
      setIsListingsLoading(false);
    } catch (e) {
      console.log(e);

      setIsListingsLoading(false);
    }
  };

  useEffect(() => {
    console.log('ok')
    // if (!isListingsLoading) return;
    getListings(searchText);
  }, [searchText]);

  const tabs = JobTabs({ isListingsLoading, jobs });

  const [activeTab, setActiveTab] = useState<string>(tabs[0]!.id);
console.log(jobs)
  return (
    <Home type="home">
      <FormControl>
        <Input
          variant={"solid"}
          borderWidth={1}
          color={"gray.800"}
          _placeholder={{
            color: "gray.400",
          }}
          id={"inputSearch"}
          type={"text"}
          required
          placeholder={"Search something"}
          aria-label={"Search here"}
          // value={searchText}
          onChange={(e) => debouncedSetSearchText(e.target.value)}
        />
      </FormControl>
      <Box w={"100%"}>
        <Box my={10}>
          <HStack
            align="center"
            justify="space-between"
            mb={4}
            pb={3}
            borderBottom="2px solid"
            borderBottomColor="#E2E8F0"
          >
            <Flex align={"center"}>
              <Image
                display={{ md: "block", base: "none" }}
                w={"1.4375rem"}
                h={"1.4375rem"}
                mr={"0.75rem"}
                alt="emoji"
                src={"/assets/home/emojis/moneyman.png"}
              />
              <Text
                pr={2}
                color={"#334155"}
                fontSize={["13", "14", "16", "16"]}
                fontWeight={"600"}
              >
                Freelance Gigs
              </Text>
              <Text
                display={["none", "none", "block", "block"]}
                mx={3}
                color={"brand.slate.300"}
                fontSize={"xxs"}
              >
                |
              </Text>

              {tabs.map((tab, index) => (
                <Box
                  key={index}
                  as="span"
                  pos="relative"
                  alignItems="center"
                  display="inline-flex"
                  p={2}
                  color="#475668"
                  fontSize={["x-small", "11", "14", "14"]}
                  cursor="pointer"
                  css={
                    tab.id === activeTab
                      ? css`
                          &::after {
                            content: "";
                            position: absolute;
                            right: 0;
                            bottom: -13px;
                            left: 0;
                            height: 2px;
                            background-color: #6366f1;
                          }
                        `
                      : null
                  }
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.title}
                </Box>
              ))}
            </Flex>
            <Flex>
              <Link href={"/all"}>
                <Button
                  px={2}
                  py={1}
                  color="brand.slate.400"
                  fontSize={["x-small", "sm", "sm", "sm"]}
                  size={{ base: "x-small", md: "sm" }}
                  variant={"ghost"}
                >
                  View All
                </Button>
              </Link>
            </Flex>
          </HStack>

          {tabs.map((tab) => tab.id === activeTab && tab.content)}
          <Link href={"/all"}>
            <Button
              w="100%"
              my={8}
              py={5}
              color="brand.slate.400"
              borderColor="brand.slate.300"
              rightIcon={<ArrowForwardIcon />}
              size="sm"
              variant="outline"
            >
              View All
            </Button>
          </Link>
        </Box>

        {/* <ListingSection
          type="grants"
          title="Grants"
          sub="Equity-free funding opportunities for builders"
          emoji="/assets/home/emojis/grants.png"
        >
          {isListingsLoading && (
            <Flex align="center" justify="center" direction="column" minH={52}>
              <Loading />
            </Flex>
          )}
          {!isListingsLoading && true && (
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
        </ListingSection> */}
      </Box>
    </Home>
  );
};

export default HomePage;
