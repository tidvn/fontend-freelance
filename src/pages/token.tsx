
import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';
import CallToActionWithVideo from '../components/Landing/Hero'

export default function Home() {

  return (
    <>
      <Default
        meta={
          <Meta title="NFT" description="" />
        }
      >
        <CallToActionWithVideo/>
        
      </Default>
    </>
  );
}