import CreateListing from '@/components/listings/job/Job';
import Sidebar from '@/layouts/Sidebar';

function CreateJob() {
  return (
    <Sidebar>
      <CreateListing type="open" />
    </Sidebar>
  );
}

export default CreateJob;
