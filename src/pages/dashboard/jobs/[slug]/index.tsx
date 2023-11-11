import type { GetServerSideProps } from 'next';

import Sidebar from '@/layouts/Sidebar';

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
  return {
    props: { slug },
  };
};

export default EditJob;
