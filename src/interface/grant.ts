import type { CompanyType } from '@/interface/company';
import type { User } from '@/interface/user';

import type { Skills } from './skills';

interface Grant {
  id: number;
  title: string;
  slug: string;
  logo?: string;
  description?: string;
  shortDescription?: string;
  skills?: Skills;
  token?: string;
  rewardAmount?: number;
  link?: string;
  source?: string;
  companyId?: string;
  company?: CompanyType;
  pocId?: string;
  poc?: User;
  isPublished?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  isArchived?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type { Grant };
