import type { Regions } from '@prisma/client';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

import type { References } from '@/interface/job';

import type { MultiSelectOptions } from '../../../constants';
import Description from '../description';
import { CreatejobBasic } from './CreateJobBasic';
import { CreatejobPayment } from './CreateJobPayments';
import type { Ques } from './questions/builder';
import Builder from './questions/builder';

export interface JobBasicType {
  title?: string;
  deadline?: string;
  templateId?: string;
  pocSocials?: string;
  applicationType?: 'fixed' | 'rolling';
  timeToComplete?: string;
}
interface Props {
  steps: number;
  setSteps: Dispatch<SetStateAction<number>>;
  setEditorData: Dispatch<SetStateAction<string | undefined>>;
  editorData: string | undefined;
  mainSkills: MultiSelectOptions[];
  setMainSkills: Dispatch<SetStateAction<MultiSelectOptions[]>>;
  subSkills: MultiSelectOptions[];
  setSubSkills: Dispatch<SetStateAction<MultiSelectOptions[]>>;
  onOpen: () => void;
  jobbasic: JobBasicType | undefined;
  setJobBasic: Dispatch<SetStateAction<JobBasicType | undefined>>;
  createDraft: () => void;
  draftLoading: boolean;
  setQuestions: Dispatch<SetStateAction<Ques[]>>;
  questions: Ques[];
  references: References[];
  setReferences: Dispatch<SetStateAction<References[]>>;
  createAndPublishListing: () => void;
  isListingPublishing: boolean;
  jobPayment: any;
  setJobPayment: Dispatch<SetStateAction<any | undefined>>;
  isEditMode: boolean;
  setJobRequirements?: Dispatch<SetStateAction<any | undefined>>;
  jobRequirements?: string | undefined;
  regions: Regions;
  setRegions: Dispatch<SetStateAction<Regions>>;
  type: 'open' | 'permissioned';
  isNewOrDraft?: boolean;
}
export const CreateJob = ({
  steps,
  editorData,
  setEditorData,
  setSteps,
  mainSkills,
  setMainSkills,
  setSubSkills,
  subSkills,
  onOpen,
  jobbasic,
  setJobBasic,
  draftLoading,
  createDraft,
  questions,
  setQuestions,
  createAndPublishListing,
  isListingPublishing,
  jobPayment,
  setJobPayment,
  isEditMode,
  jobRequirements,
  setJobRequirements,
  regions,
  setRegions,
  type,
  references,
  setReferences,
  isNewOrDraft,
}: Props) => {
  // handles the info from basic form

  return (
    <>
      {steps === 2 && (
        <CreatejobBasic
          regions={regions}
          setRegions={setRegions}
          isEditMode={isEditMode}
          draftLoading={draftLoading}
          createDraft={createDraft}
          skills={mainSkills}
          subSkills={subSkills}
          setSubSkills={setSubSkills}
          setSkills={setMainSkills}
          jobBasic={jobbasic}
          setSteps={setSteps}
          setjobBasic={setJobBasic}
          type={type}
          isNewOrDraft={isNewOrDraft}
        />
      )}
      {steps === 3 && (
        <Description
          type={type}
          setJobRequirements={setJobRequirements}
          jobRequirements={jobRequirements}
          isEditMode={isEditMode}
          createDraft={createDraft}
          editorData={editorData}
          setSteps={setSteps}
          setEditorData={setEditorData}
          draftLoading={draftLoading}
          references={references}
          setReferences={setReferences}
          isNewOrDraft={isNewOrDraft}
        />
      )}
      {steps === 4 && (
        <Builder
          isEditMode={isEditMode}
          setSteps={setSteps}
          draftLoading={draftLoading}
          createDraft={createDraft}
          setQuestions={setQuestions}
          questions={questions}
          isNewOrDraft={isNewOrDraft}
        />
      )}

      {steps === 5 && (
        <CreatejobPayment
          isEditMode={isEditMode}
          createAndPublishListing={createAndPublishListing}
          isListingPublishing={isListingPublishing}
          jobPayment={jobPayment}
          setJobPayment={setJobPayment}
          questions={questions}
          draftLoading={draftLoading}
          createDraft={createDraft}
          onOpen={onOpen}
          subSkills={subSkills}
          mainSkills={mainSkills}
          jobBasic={jobbasic}
          editorData={editorData}
          isNewOrDraft={isNewOrDraft}
        />
      )}
    </>
  );
};
