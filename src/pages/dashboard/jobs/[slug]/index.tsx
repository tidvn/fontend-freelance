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

  let bountyData;
  try {
    // const bountyDetails = await fetchServer({
    //   method: "GET",
    //   endpoint: `/api/getjob?slug=${slug}`,
    // });
    // const bountyDetails = await axios.get(`${BACKEND_URL}/api/getjob?slug=${slug}`) || null;

    // bountyDetails = null;
    // bountyData = bountyDetails.data;
  } catch (e:any) {
    console.error(e.message);
    bountyData = null;
  }

  return {
    props: {
      bounty: bountyData,
    },
  };
};
export default EditJob;
