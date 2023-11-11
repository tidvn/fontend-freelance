import CreateListing from '@/components/listings/job/Job';
import Sidebar from '@/layouts/Sidebar';

function CreateProject() {
  return (
    <Sidebar>
      <CreateListing type="permissioned" />
    </Sidebar>
  );
}

export default CreateProject;
