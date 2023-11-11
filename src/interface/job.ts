
import type { QuestionType } from '@/components/listings/job/questions/builder';
import type { CompanyType } from '@/interface/company';
import type { User } from '@/interface/user';

import type { Skills } from './skills';

interface Eligibility {
  order: number;
  question: string;
  type?: QuestionType;
}

interface References {
  order: number;
  link: string;
}

interface Rewards {
  first?: number;
  second?: number;
  third?: number;
  fourth?: number;
  fifth?: number;
}

type JobStatus = 'OPEN' | 'REVIEW' | 'CLOSED';

interface Job {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  requirements?: string;
  applicationLink?: string;
  skills?: Skills;
  deadline?: string;
  eligibility?: Eligibility[];
  references?: References[];
  status?: JobStatus;
  isActive?: boolean;
  isArchived?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  token?: string;
  rewardAmount?: number;
  rewards?: Rewards;
  companyId?: string;
  company?: CompanyType;
  pocSocials?: string;
  pocId?: string;
  poc?: User;
  source?: string;
  sourceDetails?: string;
  type?:  string;
  applicationType?: 'fixed' | 'rolling';
  totalWinnersSelected?: number;
  totalPaymentsMade?: number;
  isWinnersAnnounced?: boolean;
  templateId?: string;
  timeToComplete?: string;
  hackathonprize?: boolean;
}

interface JobWithSubmissions extends Job {
  _count?: {
    Submission?: number;
  };
}

export type {
  Job,
  JobStatus,
  JobWithSubmissions,
  Eligibility,
  References,
  Rewards,
};
