import { Box, HStack, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

import { jobSnackbarAtom } from "@/components/Header/JobSnackbar";
import JobWinners from "@/components/listings/job/JobWinners";
import { Comments } from "@/components/listings/listings/comments";
import DetailDescription from "@/components/listings/listings/details/detailDescriptionJob";
import DetailSideCard from "@/components/listings/listings/details/detailSideCardJob";
import ListingHeader from "@/components/listings/listings/ListingHeaderJob";
import ErrorSection from "@/components/shared/ErrorSection";
import type { Job } from "@/interface/job";
import { Default } from "@/layouts/Default";
import { getURL } from "@/utils/validUrl";
import useSWR from "swr";
import { useRouter } from "next/router";
import axios from "@/lib/axios";

function JobDetails() {
  const fetchJob = (url: string) => axios.get(url).then((res) => res.data);
  const router = useRouter();
  const { slug } = router.query;

  const [submissionNumber, setSubscribeNumber] = useState<number>(0);

  const { data: job } = useSWR(
    slug ? `/api/getjob?slug=${slug}` : "",
    fetchJob
  );
  const getSubscribesCount = async () => {
    try {
      const submissionCountDetails = await axios.get(
        `/api/getjob/count_subscribe ?jobid=${job?.id}`
      );
      setSubscribeNumber(submissionCountDetails?.data || 0);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    const fetchSubscribes = async () => {
      await getSubscribesCount();
      // if (job) {
      //   setJobSnackbar({
      //     submissionCount: submissionNumber,
      //     deadline: job?.deadline,
      //     rewardAmount: job?.rewardAmount,
      //     type: job?.type,
      //   });
      // }
    };
    fetchSubscribes();
  }, [submissionNumber]);

  return (
    <Default
      meta={
        <Head>
          <title>{`${job?.title || "Job"} | Superteam Earn`}</title>
          <meta
            property="og:title"
            content={`${job?.title || "Job"} | Superteam Earn`}
          />
          <meta
            property="og:image"
            content={`https://earn.superteam.fun/api/ognew/?title=${job?.title}&reward=${job?.rewardAmount}&token=${job?.token}&company=${job?.company?.name}&logo=${job?.company?.logo}`}
          />
          <meta
            name="twitter:title"
            content={`${job?.title || "Job"} | Superteam Earn`}
          />
          <meta
            name="twitter:image"
            content={`https://earn.superteam.fun/api/ognew/?title=${job?.title}&reward=${job?.rewardAmount}&token=${job?.token}&company=${job?.company?.name}&logo=${job?.company?.logo}`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Superteam Job" />
          <meta charSet="UTF-8" key="charset" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1"
            key="viewport"
          />
        </Head>
      }
    >
      <Box>
        <>
          {job === null && <ErrorSection />}
          {job !== null && !job?.id && (
            <ErrorSection message="Sorry! The job you are looking for is not available." />
          )}
          {job !== null && !!job?.id && (
            <>
              <ListingHeader
                type={job?.type}
                id={job?.id}
                status={job?.status}
                deadline={job?.deadline}
                title={job?.title ?? ""}
                company={job?.company}
                slug={job?.slug}
                region={job?.region || `GLOBAL`}
                isWinnersAnnounced={job?.isWinnersAnnounced}
                hackathonPrize={job?.hackathonprize}
                references={job?.references}
              />
              {job?.isWinnersAnnounced && <JobWinners job={job} />}
              <HStack
                align={["center", "center", "start", "start"]}
                justify={["center", "center", "space-between", "space-between"]}
                flexDir={["column-reverse", "column-reverse", "row", "row"]}
                gap={4}
                maxW={"7xl"}
                mb={10}
                mx={"auto"}
              >
                <VStack gap={8} w={["22rem", "22rem", "full", "full"]} mt={10}>
                  <DetailDescription
                    skills={job?.skills?.map((e:any) => e.skills) ?? []}
                    description={job?.description}
                  />
                  <Comments refId={job?.id ?? ""} refType="JOB" />
                </VStack>
                <DetailSideCard
                  jobtitle={job.title ?? ""}
                  id={job?.id || ""}
                  token={job?.token ?? ""}
                  eligibility={job?.eligibility}
                  type={job?.type}
                  endingTime={job?.deadline ?? ""}
                  prizeList={job?.rewards}
                  total={job?.rewardAmount || 0}
                  applicationLink={job?.applicationLink || ""}
                  requirements={job?.requirements}
                  isWinnersAnnounced={job?.isWinnersAnnounced}
                  pocSocials={job?.pocSocials}
                  hackathonPrize={job?.hackathonprize}
                  applicationType={job?.applicationType}
                  timeToComplete={job?.timeToComplete}
                />
              </HStack>
            </>
          )}
        </>
      </Box>
    </Default>
  );
}

export default JobDetails;

