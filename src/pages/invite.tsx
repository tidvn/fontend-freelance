import type { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

import InviteView from "@/components/Members/InviteView";
import ErrorSection from "@/components/shared/ErrorSection";
import LoadingSection from "@/components/shared/LoadingSection";
import { Default } from "@/layouts/Default";
import { Meta } from "@/layouts/Meta";
import fetchClient from "@/lib/fetch-client";

interface Props {
  invite: string;
}

function Invite({ invite }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<any>();

  const getInvite = async () => {
    setIsLoading(true);
    try {
      const result = await fetchClient({
        method: "GET",
        endpoint: `/api/invite/?id=${invite}`,
      });

      if (!result.data) {
        setIsError(true);
      } else {
        setInviteInfo(result.data);
      }
      setIsLoading(false);
    } catch (e) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (invite) {
      getInvite();
    } else {
      setIsError(true);
      setIsLoading(false);
    }
  }, [invite]);

  return (
    <Default
      meta={
        <Meta
          title="Accept Invite | Superteam Earn"
          description="Every Solana opportunity in one place!"
          canonical="/assets/logo/og.svg"
        />
      }
    >
      {isLoading && <LoadingSection />}
      {!isLoading && isError && (
        <ErrorSection
          title="Invalid Invite!"
          message="You invite is either invalid or expired. Please try again."
        />
      )}
      {!isLoading && !isError && <InviteView invite={inviteInfo} />}
    </Default>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  return {
    props: { invite: id || undefined },
  };
};

export default Invite;
