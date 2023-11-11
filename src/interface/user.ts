import type { CompanyType } from '@/interface/company';
import type { UserCompany } from '@/interface/userCompany';

import type { PoW } from './pow';
import type { SubmissionWithUser } from './submission';

interface Notifications {
  label: string;
  timestamp: number;
}

interface User {
  id?: number;
  publicKey?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  isVerified?: boolean;
  created_at?: string;
  updated_at?: string;
  role?: string;
  talent?: boolean;
  company?: boolean;
  isTalentFilled?: boolean;
  bio?: string;
  location?: string;
  photo?: string;
  experience?: string;
  cryptoExperience?: string;
  currentEmployer?: string;
  community?: string;
  interests?: string;
  skills?: string;
  subSkills?: string;
  workPrefernce?: string;
  discord?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  telegram?: string;
  pow?: string;
  notifications?: Notifications[] | null;
  totalEarned?: number;
  currentCompanyId?: string;
  currentCompany?: CompanyType;
  UserCompanies?: UserCompany[];
  PoW?: PoW[];
  private?: boolean;
  Submission?: SubmissionWithUser[];
}
export type { Notifications, User };
