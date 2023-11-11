import { useDisclosure } from '@chakra-ui/react';
import { Regions } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import type { JobBasicType } from '@/components/listings/job/Createjob';
import { CreateJob } from '@/components/listings/job/Createjob';
import type {
  Ques,
  QuestionType,
} from '@/components/listings/job/questions/builder';
import { CreateGrants } from '@/components/listings/grants/CreateGrants';
import Template from '@/components/listings/templates/template';
import { Successjobs } from '@/components/modals/successjobs';
import ErrorSection from '@/components/shared/ErrorSection';
import type { MultiSelectOptions } from '@/constants';
import type { Job, References } from '@/interface/job';
import type { GrantsBasicType } from '@/interface/listings';
import FormLayout from '@/layouts/FormLayout';
import { userStore } from '@/store/user';
import { getJobDraftStatus } from '@/utils/job';
import { dayjs } from '@/utils/dayjs';
import { mergeSkills, splitSkills } from '@/utils/skills';

interface Props {
  job?: Job;
  isEditMode?: boolean;
  type: 'open' | 'permissioned';
}

function CreateListing({ job, isEditMode = false, type }: Props) {
  const router = useRouter();
  const { userInfo } = userStore();
  // Templates - 1
  // Basic Info - 2
  // Description - 3
  // payment form - 4
  const [steps, setSteps] = useState<number>(isEditMode ? 2 : 1);
  const [listingType, setListingType] = useState('BOUNTY');
  const [draftLoading, setDraftLoading] = useState<boolean>(false);
  const [jobRequirements, setJobRequirements] = useState<
    string | undefined
  >(isEditMode ? job?.requirements : undefined);
  const [editorData, setEditorData] = useState<string | undefined>(
    isEditMode ? job?.description : undefined
  );
  const [regions, setRegions] = useState<Regions>(
    isEditMode ? job?.region || Regions.GLOBAL : Regions.GLOBAL
  );
  const skillsInfo = isEditMode ? splitSkills(job?.skills || []) : undefined;
  const [mainSkills, setMainSkills] = useState<MultiSelectOptions[]>(
    isEditMode ? skillsInfo?.skills || [] : []
  );
  const [subSkill, setSubSkill] = useState<MultiSelectOptions[]>(
    isEditMode ? skillsInfo?.subskills || [] : []
  );
  const [slug, setSlug] = useState<string>('');

  const { isOpen, onOpen } = useDisclosure();

  const [questions, setQuestions] = useState<Ques[]>(
    isEditMode
      ? (job?.eligibility || [])?.map((e) => ({
          order: e.order,
          question: e.question,
          type: e.type as QuestionType,
          delete: true,
          label: e.question,
        }))
      : []
  );

  const [references, setReferences] = useState<References[]>(
    isEditMode
      ? (job?.references || [])?.map((e) => ({
          order: e.order,
          link: e.link,
        }))
      : []
  );

  // - Job
  const [jobbasic, setJobBasic] = useState<JobBasicType | undefined>({
    title: isEditMode ? job?.title || undefined : undefined,
    deadline:
      isEditMode && job?.deadline
        ? dayjs(job?.deadline).format('YYYY-MM-DDTHH:mm') || undefined
        : undefined,
    templateId: isEditMode ? job?.templateId || undefined : undefined,
    pocSocials: isEditMode ? job?.pocSocials || undefined : undefined,
    applicationType: isEditMode ? job?.applicationType || 'fixed' : 'fixed',
    timeToComplete: isEditMode
      ? job?.timeToComplete || undefined
      : undefined,
  });
  const [jobPayment, setJobPayment] = useState({
    rewardAmount: isEditMode ? job?.rewardAmount || 0 : 0,
    token: isEditMode ? job?.token : undefined,
    rewards: isEditMode ? job?.rewards || undefined : undefined,
  });
  // -- Grants
  const [grantBasic, setgrantsBasic] = useState<GrantsBasicType | undefined>();

  const [isListingPublishing, setIsListingPublishing] =
    useState<boolean>(false);

  const createAndPublishListing = async () => {
    setIsListingPublishing(true);
    try {
      const newJob: Job = {
        companyId: userInfo?.currentCompany?.id ?? '',
        pocId: userInfo?.id ?? '',
        skills: mergeSkills({ skills: mainSkills, subskills: subSkill }),
        ...jobbasic,
        deadline: jobbasic?.deadline
          ? new Date(jobbasic?.deadline).toISOString()
          : undefined,
        description: editorData || '',
        type,
        pocSocials: jobbasic?.pocSocials,
        region: regions,
        eligibility: (questions || []).map((q) => ({
          question: q.question,
          order: q.order,
          type: q.type,
        })),
        references: (references || []).map((r) => ({
          link: r.link,
          order: r.order,
        })),
        requirements: jobRequirements,
        ...jobPayment,
        isPublished: true,
      };
      const result = await axios.post('/api/jobs/create/', newJob);
      await axios.post('/api/email/manual/createJob', {
        id: result?.data?.id,
      });
      console.log(result?.data.id);
      setSlug(`/jobs/${result?.data?.slug}/`);
      onOpen();
      setIsListingPublishing(false);
    } catch (e) {
      setIsListingPublishing(false);
    }
  };

  const createDraft = async () => {
    setDraftLoading(true);
    let api = '/api/jobs/create/';
    if (isEditMode) {
      api = `/api/jobs/update/${job?.id}/`;
    }
    let draft: Job = {
      companyId: userInfo?.currentCompany?.id ?? '',
      pocId: userInfo?.id ?? '',
    };
    draft = {
      ...draft,
      skills: mergeSkills({ skills: mainSkills, subskills: subSkill }),
      ...jobbasic,
      deadline: jobbasic?.deadline
        ? new Date(jobbasic?.deadline).toISOString()
        : undefined,
      description: editorData || '',
      eligibility: (questions || []).map((q) => ({
        question: q.question,
        order: q.order,
        type: q.type,
      })),
      references: (references || []).map((r) => ({
        link: r.link,
        order: r.order,
      })),
      pocSocials: jobbasic?.pocSocials,
      region: regions,
      requirements: jobRequirements,
      ...jobPayment,
    };
    try {
      await axios.post(api, {
        ...draft,
        isPublished: isEditMode ? job?.isPublished : false,
      });
      // if (isEditMode) {
      //   await axios.post('/api/email/manual/jobUpdate', {
      //     id: job?.id,
      //   });
      // }
      router.push('/dashboard/jobs');
    } catch (e) {
      setDraftLoading(false);
    }
  };

  const newJob = job?.id === undefined;

  const jobDraftStatus = getJobDraftStatus(
    job?.status,
    job?.isPublished
  );

  const isNewOrDraft = jobDraftStatus === 'DRAFT' || newJob === true;

  return (
    <>
      {!userInfo?.id ||
      !(userInfo?.role === 'GOD' || !!userInfo?.currentCompanyId) ? (
        <ErrorSection
          title="Access is Forbidden!"
          message="Please contact support to access this section."
        />
      ) : (
        <FormLayout
          setStep={setSteps}
          currentStep={steps}
          stepList={
            listingType !== 'BOUNTY'
              ? [
                  {
                    label: 'Template',
                    number: 1,
                    mainHead: 'List your Opportunity',
                    description:
                      'To save time, check out our ready made templates below. If you already have a listing elsewhere, use "Start from Scratch" and copy/paste your text.',
                  },
                  {
                    label: 'Basics',
                    number: 2,
                    mainHead: 'Create a Listing',
                    description: `Now let's learn a bit more about the work you need completed`,
                  },
                  {
                    label: 'Description',
                    number: 3,
                    mainHead: 'Tell us some more',
                    description:
                      'Add more details about the opportunity, submission requirements, reward(s) details, and resources',
                  },
                  {
                    label: 'Reward',
                    number: 4,
                    mainHead: 'Add the reward amount',
                    description:
                      'Decide the compensation amount for your listing',
                  },
                ]
              : [
                  {
                    label: 'Template',
                    number: 1,
                    mainHead: 'List your Opportunity',
                    description:
                      'To save time, check out our ready made templates below. If you already have a listing elsewhere, use "Start from Scratch" and copy/paste your text.',
                  },
                  {
                    label: 'Basics',
                    number: 2,
                    mainHead: 'Create a Listing',
                    description: `Now let's learn a bit more about the work you need completed`,
                  },
                  {
                    label: 'Description',
                    number: 3,
                    mainHead: 'Tell us some more',
                    description:
                      'Add more details about the opportunity, submission requirements, reward(s) details, and resources',
                  },
                  {
                    label: 'Questions',
                    number: 4,
                    mainHead: 'Enter your questions',
                    description:
                      'What would you like to know about your applicants?',
                  },
                  {
                    label: 'Reward',
                    number: 5,
                    mainHead: 'Add the reward amount',
                    description:
                      'Decide the compensation amount for your listing',
                  },
                ]
          }
        >
          {isOpen && (
            <Successjobs slug={slug} isOpen={isOpen} onClose={() => {}} />
          )}
          {steps === 1 && (
            <Template
              setSteps={setSteps}
              setListingType={setListingType}
              setEditorData={setEditorData}
              setSubSkills={setSubSkill}
              setMainSkills={setMainSkills}
              setJobBasic={setJobBasic}
              type={type}
            />
          )}
          {steps > 1 && listingType === 'BOUNTY' && (
            <CreateJob
              type={type}
              regions={regions}
              setRegions={setRegions}
              setJobRequirements={setJobRequirements}
              jobRequirements={jobRequirements}
              createAndPublishListing={createAndPublishListing}
              isListingPublishing={isListingPublishing}
              jobPayment={jobPayment}
              setJobPayment={setJobPayment}
              questions={questions}
              setQuestions={setQuestions}
              references={references}
              setReferences={setReferences}
              draftLoading={draftLoading}
              createDraft={createDraft}
              jobbasic={jobbasic}
              setJobBasic={setJobBasic}
              onOpen={onOpen}
              setSubSkills={setSubSkill}
              subSkills={subSkill}
              setMainSkills={setMainSkills}
              mainSkills={mainSkills}
              editorData={editorData}
              setEditorData={setEditorData}
              setSteps={setSteps}
              steps={steps}
              isEditMode={isEditMode}
              isNewOrDraft={isNewOrDraft}
            />
          )}
          {steps > 1 && listingType === 'GRANT' && (
            <CreateGrants
              createDraft={createDraft}
              onOpen={onOpen}
              setSlug={setSlug}
              grantBasic={grantBasic}
              setGrantBasic={setgrantsBasic}
              setSubSkills={setSubSkill}
              subSkills={subSkill}
              setMainSkills={setMainSkills}
              mainSkills={mainSkills}
              editorData={editorData}
              setEditorData={setEditorData}
              setSteps={setSteps}
              steps={steps}
            />
          )}
          <Toaster />
        </FormLayout>
      )}
    </>
  );
}

export default CreateListing;
