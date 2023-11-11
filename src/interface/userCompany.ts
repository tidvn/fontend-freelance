
import type { CompanyType } from '@/interface/company';
import type { User } from '@/interface/user';

interface UserCompany {
  userId?: string;
  companyId?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  user?: User;
  company?: CompanyType;
}
export type { UserCompany };
