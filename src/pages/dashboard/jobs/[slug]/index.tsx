import type { GetServerSideProps } from "next";

// import Sidebar from "@/layouts/Sidebar";
import { BACKEND_URL } from "@/env";
import axios from "@/lib/axios";
import Sidebar from "@/layouts/Sidebar";

interface Props {
  slug: string;
}

function EditJob({ slug }: Props) {
  return (
    <Sidebar>
      <div>Job: {slug}</div>
    </Sidebar>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;

  let jobData;
  try {
    // const jobDetails = await fetchServer({
    //   method: "GET",
    //   endpoint: `/api/getjob?slug=${slug}`,
    // });
    // const jobDetails = await axios.get(`${BACKEND_URL}/api/getjob?slug=${slug}`) || null;

    // jobDetails = null;
    // jobData = jobDetails.data;
  } catch (e:any) {
    console.error(e.message);
    jobData = null;
  }

  return {
    props: {
      job: jobData,
    },
  };
};
export default EditJob;
