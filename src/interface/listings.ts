import type { SkillsProp } from '@/interface/skills';

import type { CompanyType } from './company';
import type { Talent } from './talent';
import type { Listingtype, Prize, Source, CompanyStatus } from './types';

type PrizeListType = {
  [key in Prize]: string;
};
export const PrizeListMap = {
  first: 'First prize',
  second: 'Second prize',
  third: 'Third prize',
  fourth: 'Fourth prize',
  fifth: 'Fifth prize',
};

interface Questions {
  id: string;
  jobsId: string;
  questions: string;
}

interface Listings {
  id?: string;
  title: string;
  description: string;
  skills: string;
  subSkills: string;
  deadline: string;
  source: Source;
  amount: string;
  token: string;
  companyStatus: CompanyStatus;
  active: boolean;
  privateBool: boolean;
  featured: boolean;
  prizeList: Partial<PrizeListType>; // change to enum and string
  bugJob: boolean;
  orgId: string;
  showTop: boolean;
  eligibility: string;
  status: JobStatus;
  slug: string;
  winner?: Winner[];
  submission?: SubmissionType[];
  subscribe?: SubscribeType[];
  Questions?: Questions;
  company?: CompanyType;
  rewards?: Partial<PrizeListType>;
}

type JobStatus = 'open' | 'review' | 'close';
interface Winner {
  id: string;
  email: string;
  name: string;
  publickey: string;
  jobsId: string;
  prize: Prize;
}

interface GrantsBasicType {
  title: string;
  contact: string;
  link: string;
}
interface GrantsType {
  id: string;
  title: string;
  link: string;
  description: string;
  skills: string;
  subSkills: String;
  source: Source;
  contact: string;
  token: string;
  active: boolean;
  orgId: string;
  maxSalary: number;
  minSalary: number;
}
type Experience =
  | '0 Yrs: Fresher/Graduate '
  | '0-1 Yrs: Some Experience Required'
  | '1-5 Yrs: Early Career Professional'
  | '5-10 Yrs: Mid Career Professional'
  | '10 Yrs+: Senior Professional';

interface DraftType {
  id?: string;
  companyId?: string;
  type?: Listingtype;
  skills?: SkillsProp[];
  basic?: string;
  payments?: string;
  question?: string;
}
interface SubmissionType {
  id: string;
  image: string;
  likes: string;
  link: string;
  talent: string;
  questions: string;
  jobsId: string;
  Talent?: Talent;
}

interface SubscribeType {
  id?: string;
  talentId: string;
  jobsId: string;
  Talent?: Talent;
}

export type {
  Listings,
  DraftType,
  Experience,
  GrantsBasicType,
  GrantsType,
  PrizeListType,
  SubmissionType,
  SubscribeType,
  Winner,
};
