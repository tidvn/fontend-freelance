import type { CompanyType } from '@/interface/company';
import type { UserCompany } from '@/interface/userCompany';

import type { PoW } from './pow';
import type { SubscribeWithUser } from './subscribes';

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
  currentEmployer?: string;
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
  userCompanies?: UserCompany[];
  PoW?: PoW[];
  private?: boolean;
  Subscribe?: SubscribeWithUser[];
}
export type { Notifications, User };
