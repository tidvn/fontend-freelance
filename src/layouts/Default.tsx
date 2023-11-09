import { useEffect, type ReactNode } from 'react';

import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { useSession } from 'next-auth/react';
import { userStore } from '@/store/user';

type IDefaultProps = {
  meta: ReactNode;
  children: ReactNode;
  className?: string;
};

const Default = (props: IDefaultProps) => {
  const { data: session, status }: any = useSession();
  const { userInfo, fetchData }: any = userStore();
  
  useEffect(() => {
    if (session?.accessToken) {   
      fetchData(session?.accessToken);
    }
  }, [session]);
  return (
    <div
      className={
        !props.className ? 'min-h-full' : `min-h-full ${props.className}`
      }
    >
      {props.meta}
      <Header />
      {props.children}
      <Footer />
    </div>
  );
};

export { Default };

function useSWR(arg0: string, fetcher: any): { data: any; error: any; isLoading: any; } {
  throw new Error('Function not implemented.');
}
