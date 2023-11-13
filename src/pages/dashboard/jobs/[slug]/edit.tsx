import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import CreateListing from "@/components/listings/job/Job";
import LoadingSection from "@/components/shared/LoadingSection";
import type { Job } from "@/interface/job";
import Sidebar from "@/layouts/Sidebar";
import { userStore } from "@/store/user";
import fetchClient from "@/lib/fetch-client";

interface Props {
  slug: string;
}

function EditJob({ slug }: Props) {
  const router = useRouter();
  const { userInfo } = userStore();
  const [isJobLoading, setIsJobLoading] = useState(true);
  const [job, setJob] = useState<Job | undefined>();

  const getJob = async () => {
    setIsJobLoading(true);
    try {
      const jobDetails = await fetchClient({
        method: "GET",
        endpoint: `/api/jobs?slug=${slug}`,
      });
      console.log(jobDetails)
      setJob(jobDetails.data.data[0]);

      setIsJobLoading(false);
      // if (jobDetails.data.companyId !== userInfo?.currentCompanyId) {
      //   // router.push("/dashboard/jobs");
      // } else {
      //   setJob(jobDetails.data);
      //   setIsJobLoading(false);
      // }
    } catch (e) {
      setIsJobLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.currentCompanyId) {
      getJob();
    }
  }, [userInfo?.currentCompanyId]);

  return (
    <Sidebar>
      {isJobLoading ? (
        <LoadingSection />
      ) : (
        <CreateListing
          job={job}
          isEditMode
          type={job?.type as "permissioned" | "open"}
        />
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

export default EditJob;
